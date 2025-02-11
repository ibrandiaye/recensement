const mainEvents = {
    EVENT_INIT: 'init',
    INIT_SCARD_READER: 'initScardReader',
    GET_READER_LIST: 'getReaderList',
    GET_SCARD_VERSION: 'getScardVersion',
    CARD_CONNECT: 'cardConnect',
    CARD_DISCONNECT: 'cardDisconnect',
    IS_CARD_PRESENT: 'isCardPresent',
    IS_CARD_SUPPORT_PACE: 'isCardSupportPace',
    EVENT_GET_EF_CARD_ACCESS: 'performEfCardAccess',
    SELECT_AID: 'selectAid',
    EVENT_ESTABLISH_ACCESS_CONTROL: 'establishAccessControl',
    EVENT_PERFORM_PACE_AUTHENTICATION: 'performPaceAuthentication',
    EVENT_PERFORM_BAC_AUTHENTICATION: 'performBacAuthentication',
    EVENT_CHIP_AUTHENTICATION_USING_MSE_AT: 'chipAuthenticationUsingMseAt',
    EVENT_CHIP_AUTHENTICATION_USING_MSE_KAT: 'chipAuthenticationUsingMseKat',
    EVENT_ACTIVE_AUTHENTICATION: 'activeAuthentication',
    EVENT_PASSIVE_AUTHENTICATION: 'passiveAuthentication',
    EVENT_GET_EF_CVCA: 'getEfCvca',
    EVENT_VERIFY_CVCA_LINK: 'verifyEfCvca',
    EVENT_VERIFY_DV: 'verifyDv',
    EVENT_VERIFY_IS: 'verifyIs',
    EVENT_PERFORM_TA_EXTERNAL_AUTH: 'performTaExternalAuth',
    EVENT_GET_DGx: 'getDg', // dummy
    EVENT_GET_DG1: 'getDg1',
    EVENT_GET_DG2: 'getDg2',
    EVENT_GET_DG3: 'getDg3',
    EVENT_GET_DG4: 'getDg4',
    EVENT_GET_DG5: 'getDg5',
    EVENT_GET_DG6: 'getDg6',
    EVENT_GET_DG7: 'getDg7',
    EVENT_GET_DG11: 'getDg11',
    EVENT_GET_DG12: 'getDg12',
    EVENT_GET_DG13: 'getDg13',
    EVENT_GET_DG14: 'getDg14',
    EVENT_GET_DG15: 'getDg15',
    EVENT_GET_EF_CARD_SECURITY: 'getEfCardSecurity',
    EVENT_GET_EF_ATR: 'getEfAtr',
    EVENT_GET_EF_COM: 'getEfCom',
    EVENT_GET_EF_SOD: 'getEfSod',
    EVENT_CLEANUP: 'cleanup'
};

let evt = { type: '', name: '', hash: 0, ok_evt: '', ko_evt: '' };
let responseStatusOk = null;
let isAuthStarted = false;

/**
 * 
 */
class WebappEvents {
    #paceDocument = false;
    #extAuthSize = 0;
    #taFailCount = 2;
    #currentEvent;
    #appletType;
    #doCaMseAt = false
    #stackEvent = [];
    #secret = null; // PIN/CAN value
    scardResponse;
    #aid;
    setAid(aid) {
        this.#aid = aid;
    }
    async #loadOpenPaceModule() {
        return new Promise((resolve, reject) => {
            scriptElement = document.createElement('script');
            scriptElement.src = 'js/eactest.js';
            scriptElement.onload = () => {
                createModule().then(module => {
                    Module = module;
                    console.log('Script loaded successfully.');
                    resolve("success");
                });
            };
            document.body.appendChild(scriptElement);
        });
    }

    async #unloadOpenPaceModule() {
        return new Promise((resolve) => {
            if (scriptElement instanceof Node && scriptElement.parentNode === document.body) {
                document.body.removeChild(scriptElement);
                scriptElement = null;
                Module = null;
            } else {
                console.log('No script to unload');
            }
            resolve("success");
        });
    }

    async #reloadOpenPaceModule() {
        const result = await this.#unloadOpenPaceModule();
        if (result === "success")
            return await this.#loadOpenPaceModule();
        else {
            console.log("Error: Unloading script failed");
            return "failed";
        }
    }

    constructor() {
        this.pwdType = 0;
        this.authType;
        this.device = new Device(this);
        this.emrtd = new Emrtd(this, this.device);
        this.pace = new PaceAuthentication(this.emrtd, this.device);
        this.tStart = null;
        this.tEnd = null;
        this.webSocketObj = null;
        this.isCaDone = false;
        this.isAaEcdsaPending = false;
        this.#loadOpenPaceModule();
    }

    CMD_SELECT_EF_ATR = new Uint8Array([0x00, 0xA4, 0x02, 0x0C, 0x02, 0x2F, 0x01]);
    CMD_SELECT_BAP_EU = new Uint8Array([0x0C, 0xA4, 0x04, 0x0C, 0x0B, 0xA0, 0x00, 0x00, 0x04, 0x56, 0x45, 0x44, 0x4C, 0x2D, 0x30, 0x31]);
    CMD_SELECT_BAP = new Uint8Array([0x0C, 0xA4, 0x04, 0x0C, 0x07, 0xA0, 0x00, 0x00, 0x02, 0x48, 0x02, 0x00]);
    CMD_SELECT_ICAO = new Uint8Array([0x0C, 0xa4, 0x04, 0x0C, 0x07, 0xA0, 0x00, 0x00, 0x02, 0x47, 0x10, 0x01]);
    CMD_SELECT_EF_COM = new Uint8Array([0x0C, 0xA4, 0x02, 0x0C, 0x02, 0x01, 0x1E]);
    CMD_SELECT_IDL_EF_COM = new Uint8Array([0x0C, 0xA4, 0x02, 0x0C, 0x02, 0x00, 0x1E]);
    CMD_SELECT_EF_CARD_ACCESS = new Uint8Array([0x00, 0xA4, 0x02, 0x0C, 0x02, 0x01, 0x1C]);
    CMD_SELECT_EF_CARD_SECURITY = new Uint8Array([0x0C, 0xA4, 0x02, 0x0C, 0x02, 0x01, 0x1D]);
    CMD_SELECT_EF_SOD = new Uint8Array([0x0C, 0xA4, 0x02, 0x0C, 0x02, 0x01, 0x1D]);

    aidSelectionSequence = [
        [this.CMD_SELECT_BAP_EU, "BAP", "IDL_EU"],
        [this.CMD_SELECT_BAP, "BAP", "IDL"],
        [this.CMD_SELECT_ICAO, "ICAO", "MRTD"],
        [null, "", ""]
    ];

    #events = {
        // SCard events
        EVENT_PERFORM_SCARD_ESTABLISHCONTEXT: 'scardEstablishContext', // perform SCardEstablishContext
        EVENT_PERFORM_SCARD_LISTREADERS: 'scardListReaders',// perform SCardListReaders
        EVENT_PERFORM_SCARD_GETSLOTSTATUS: 'scardGetSlotStatus', // perform SCardGetSlotStatus
        EVENT_PERFORM_SCARD_CONNECT: 'scardConnect', // perform SCardConnect
        EVENT_PERFORM_SCARD_DISCONNECT: 'scardDisconnect', // perform SCardDisconnect
        EVENT_PERFORM_SCARD_RELEASECONTEXT: 'scardReleaseContext', //  perform SCardEstablishContext

        // Reader and card events
        EVENT_PERFORM_SCARD_GETVERSION: 'scardReaderVersion', // perform scard reader fw version
        EVENT_GET_SLOT_STATUS: 'getSlotStatus', // get slot status
        EVENT_ICC_POWER_ON: 'iccPowerOn-hidden', // icc power-on
        EVENT_GET_ATR: 'getAtr-hidden', // get ATR

        // EF.ATR events
        EVENT_SELECT_EF_ATR: 'selectEfAtr-hidden', // select ef.Atr
        EVENT_READ_EF_ATR: 'readEfAtr', // read ef.Atr

        // EF.COM events
        EVENT_SELECT_EF_COM: 'selectEfCom-hidden', // select EF.COM
        EVENT_READ_EF_COM: 'readEfCom', // read EF.COM

        // PACE events
        EVENT_SELECT_EF_CARD_ACCESS: 'selectEfCardAccess-hidden', // select ef.cardaccess
        EVENT_READ_EF_CARD_ACCESS: 'readEfCardAccess-hidden', // read ef.cardaccess
        EVENT_MSE_AT: 'mseAt-hidden', // MSE.AT command
        EVENT_GA_ENC_NONCE: 'genAuthEncNonce-hidden', // encrypt nonce
        EVENT_GA_MAP_NONCE: 'genAuthMapNonce-hidden', // map nonce
        EVENT_GA_PERFORM_KEY_AGREEMENT: 'genAuthPerformKeyAgreement-hidden', // perform key agreement
        EVENT_MUTUAL_AUTHENTICATION: 'mutAuth-hidden', // mutual authenticate
        EVENT_SELECT_EF_CARD_SECURITY: 'selectEfCardSecurity-hidden', // select EF.CardSecurity
        EVENT_READ_EF_CARD_SECURITY: 'readEfCardSecurity', // read EF.CardSecurity
        EVENT_PERFORM_PACE_CAM: 'performPaceCam', // perform PACE-CAM

        EVENT_SELECT_AID: 'selectAid-hidden', // select aid

        // BAC events
        EVENT_GET_CHALLENGE: 'getChallenge-hidden', // get challenge
        EVENT_EXT_AUTHENTICATE: 'extAuth-hidden', // external authenticate

        // PA events
        EVENT_SELECT_EF_SOD: 'selectEfSod-hidden', // select EF.SOD
        EVENT_READ_EF_SOD: 'readEfSod', // read EF.SOD

        // AA events
        EVENT_INT_AUTHENTICATE: 'intAuth', // internal authenticate

        // CA events
        EVENT_CA_MSE_KAT: 'mseKat', // perform MSE.KAT
        EVENT_CA_GA: 'genAuthCa-hidden', // CA General Auth

        // TA events
        EVENT_SELECT_EF_CVCA: 'selectEfCvca-hidden', // select EF.CVCA
        EVENT_READ_EF_CVCA: 'readEfCvca-hidden', // read EF.CVCA
        EVENT_MSE_SET_CVCA_LINK: 'performMseSetCvcaLink-hidden',
        EVENT_VERIFY_CVCA_LINK_CERTIFICATE: 'verifyCvcaLinkCert',
        EVENT_MSE_SET_DV: 'mseSetDv-hidden', // perform MSE.SET-DV
        EVENT_VERIFY_DV_CERTIFICATE: 'verifyDvCert', // TA verify DV Certificate
        EVENT_MSE_SET_IS: 'mseSetIs-hidden', // perform MSE.SET-IS
        EVENT_VERIFY_IS_CERTIFICATE: 'verifyIsCert', // TA verify IS Certificate
        EVENT_TA_MSE_AT: 'taMseAt-hidden', // perform TA-MSE.AT
        EVENT_TA_GET_CHALLENGE: 'taGetChallenge-hidden', // get TA challenge
        EVENT_TA_EXTERNAL_AUTHENTICATION: 'performTaExtAuth', // perform TA External Auth

        // DG events
        EVENT_SELECT_DG1: 'selectDg1-hidden', // select dg1
        EVENT_READ_DG1: 'readDg1', // read dg1
        EVENT_SELECT_DG2: 'selectDg2-hidden', // select dg2
        EVENT_READ_DG2: 'readDg2', // read dg2
        EVENT_SELECT_DG3: 'selectDg3-hidden', // select dg3
        EVENT_READ_DG3: 'readDg3', // read dg3
        EVENT_SELECT_DG4: 'selectDg4-hidden', // select dg4
        EVENT_READ_DG4: 'readDg4', // read dg4
        EVENT_SELECT_DG5: 'selectDg5-hidden', // select dg5
        EVENT_READ_DG5: 'readDg5', // read dg5
        EVENT_SELECT_DG6: 'selectDg6-hidden', // select dg6
        EVENT_READ_DG6: 'readDg6', // read dg6
        EVENT_SELECT_DG7: 'selectDg7-hidden', // select dg7
        EVENT_READ_DG7: 'readDg7', // read dg7
        EVENT_SELECT_DG11: 'selectDg11-hidden', // select dg11
        EVENT_READ_DG11: 'readDg11', // read dg12
        EVENT_SELECT_DG12: 'selectDg12-hidden', // select dg12
        EVENT_READ_DG12: 'readDg12', // read dg12
        EVENT_SELECT_DG13: 'selectDg13-hidden', // select dg13
        EVENT_READ_DG13: 'readDg13', // read dg13
        EVENT_SELECT_DG14: 'selectDg14-hidden', // select dg14
        EVENT_READ_DG14: 'readDg14', // read dg14
        EVENT_SELECT_DG15: 'selectDg15-hidden', // select dg5
        EVENT_READ_DG15: 'readDg15', // read dg15

        // Deinit events
        EVENT_CLEANUP: 'cleanup', // cleanup before exit
        EVENT_FINAL: 'final' // final
    };

    setOfMainEventsMapping = {
        [mainEvents.INIT_SCARD_READER]: [
            ((urlparams_pcsc == '1') ? this.#events.EVENT_PERFORM_SCARD_ESTABLISHCONTEXT : this.#events.EVENT_GET_SLOT_STATUS),
            this.#events.EVENT_PERFORM_SCARD_ESTABLISHCONTEXT,
        ],
        [mainEvents.GET_READER_LIST]: [
            this.#events.EVENT_PERFORM_SCARD_LISTREADERS,
            this.#events.EVENT_PERFORM_SCARD_LISTREADERS,
        ],
        [mainEvents.GET_SCARD_VERSION]: [
            this.#events.EVENT_PERFORM_SCARD_GETVERSION,
            this.#events.EVENT_PERFORM_SCARD_GETVERSION,
        ],
        [mainEvents.IS_CARD_PRESENT]: [
            this.#events.EVENT_PERFORM_SCARD_GETSLOTSTATUS,
            this.#events.EVENT_PERFORM_SCARD_GETSLOTSTATUS,
        ],
        [mainEvents.IS_CARD_SUPPORT_PACE]: [
            this.#events.EVENT_SELECT_EF_CARD_ACCESS,
            this.#events.EVENT_SELECT_EF_CARD_ACCESS,
        ],
        [mainEvents.CARD_CONNECT]: [
            this.#events.EVENT_PERFORM_SCARD_CONNECT,
            this.#events.EVENT_PERFORM_SCARD_CONNECT,
        ],
        [mainEvents.CARD_DISCONNECT]: [
            this.#events.EVENT_PERFORM_SCARD_DISCONNECT,
            this.#events.EVENT_PERFORM_SCARD_DISCONNECT,
        ],
        [mainEvents.SELECT_AID]: [
            this.#events.EVENT_SELECT_AID,
            this.#events.EVENT_SELECT_AID,
        ],
        [mainEvents.EVENT_GET_EF_CARD_ACCESS]: [
            this.#events.EVENT_SELECT_EF_CARD_ACCESS,
            this.#events.EVENT_READ_EF_CARD_ACCESS,
        ],
        [mainEvents.EVENT_PERFORM_PACE_AUTHENTICATION]: [
            this.#events.EVENT_SELECT_EF_CARD_ACCESS,
            this.#events.EVENT_MUTUAL_AUTHENTICATION,
        ],
        [mainEvents.EVENT_PERFORM_BAC_AUTHENTICATION]: [
            this.#events.EVENT_GET_CHALLENGE,
            this.#events.EVENT_EXT_AUTHENTICATE,
        ],
        [mainEvents.EVENT_PASSIVE_AUTHENTICATION]: [
            this.#events.EVENT_SELECT_EF_SOD,
            this.#events.EVENT_READ_EF_SOD,
        ],
        [mainEvents.EVENT_ACTIVE_AUTHENTICATION]: [
            this.#events.EVENT_INT_AUTHENTICATE,
            this.#events.EVENT_INT_AUTHENTICATE
        ],
        [mainEvents.EVENT_CHIP_AUTHENTICATION_USING_MSE_AT]: [
            this.#events.EVENT_MSE_AT,
            this.#events.EVENT_CA_GA
        ],
        [mainEvents.EVENT_CHIP_AUTHENTICATION_USING_MSE_KAT]: [
            this.#events.EVENT_CA_MSE_KAT,
            this.#events.EVENT_CA_MSE_KAT
        ],
        [mainEvents.EVENT_GET_EF_CVCA]: [
            this.#events.EVENT_SELECT_EF_CVCA,
            this.#events.EVENT_READ_EF_CVCA
        ],
        [mainEvents.EVENT_VERIFY_CVCA_LINK]: [
            this.#events.EVENT_MSE_SET_CVCA_LINK,
            this.#events.EVENT_VERIFY_CVCA_LINK_CERTIFICATE
        ],
        [mainEvents.EVENT_VERIFY_DV]: [
            this.#events.EVENT_MSE_SET_DV,
            this.#events.EVENT_VERIFY_DV_CERTIFICATE
        ],
        [mainEvents.EVENT_VERIFY_IS]: [
            this.#events.EVENT_MSE_SET_IS,
            this.#events.EVENT_VERIFY_IS_CERTIFICATE
        ],
        [mainEvents.EVENT_PERFORM_TA_EXTERNAL_AUTH]: [
            this.#events.EVENT_TA_MSE_AT,
            this.#events.EVENT_TA_EXTERNAL_AUTHENTICATION
        ],
        [mainEvents.EVENT_GET_DG1]: [
            this.#events.EVENT_SELECT_DG1,
            this.#events.EVENT_READ_DG1,
        ],
        [mainEvents.EVENT_GET_DG2]: [
            this.#events.EVENT_SELECT_DG2,
            this.#events.EVENT_READ_DG2,
        ],
        [mainEvents.EVENT_GET_DG3]: [
            this.#events.EVENT_SELECT_DG3,
            this.#events.EVENT_READ_DG3,
        ],
        [mainEvents.EVENT_GET_DG4]: [
            this.#events.EVENT_SELECT_DG4,
            this.#events.EVENT_READ_DG4,
        ],
        [mainEvents.EVENT_GET_DG5]: [
            this.#events.EVENT_SELECT_DG5,
            this.#events.EVENT_READ_DG5,
        ],
        [mainEvents.EVENT_GET_DG6]: [
            this.#events.EVENT_SELECT_DG6,
            this.#events.EVENT_READ_DG6,
        ],
        [mainEvents.EVENT_GET_DG7]: [
            this.#events.EVENT_SELECT_DG7,
            this.#events.EVENT_READ_DG7,
        ],
        [mainEvents.EVENT_GET_DG11]: [
            this.#events.EVENT_SELECT_DG11,
            this.#events.EVENT_READ_DG11,
        ],
        [mainEvents.EVENT_GET_DG12]: [
            this.#events.EVENT_SELECT_DG12,
            this.#events.EVENT_READ_DG12,
        ],
        [mainEvents.EVENT_GET_DG13]: [
            this.#events.EVENT_SELECT_DG13,
            this.#events.EVENT_READ_DG13,
        ],
        [mainEvents.EVENT_GET_DG14]: [
            this.#events.EVENT_SELECT_DG14,
            this.#events.EVENT_READ_DG14,
        ],
        [mainEvents.EVENT_GET_DG15]: [
            this.#events.EVENT_SELECT_DG15,
            this.#events.EVENT_READ_DG15,
        ],
        [mainEvents.EVENT_CLEANUP]: [
            this.#events.EVENT_CLEANUP,
            this.#events.EVENT_FINAL
        ],
        [mainEvents.EVENT_GET_EF_CARD_SECURITY]: [
            this.#events.EVENT_SELECT_EF_CARD_SECURITY,
            this.#events.EVENT_READ_EF_CARD_SECURITY
        ],
        [mainEvents.EVENT_GET_EF_ATR]: [
            this.#events.EVENT_SELECT_EF_ATR,
            this.#events.EVENT_READ_EF_ATR
        ],
        [mainEvents.EVENT_GET_EF_COM]: [
            this.#events.EVENT_SELECT_EF_COM,
            this.#events.EVENT_READ_EF_COM
        ],
        [mainEvents.EVENT_GET_EF_SOD]: [
            this.#events.EVENT_SELECT_EF_SOD,
            this.#events.EVENT_READ_EF_SOD
        ],
    };

    #eventStatus = {
        Start: "Start event reached",
        Progress: "Sub event in progress",
        End: "End event reached",
        Error: "Error event reached"
    };

    /**
     *
     */
    getEventStatus(evt) {
        console_ely.logFuncName(this.getEventStatus.name);
        let status;

        if (this.startEvent == this.endEvent) {
            if (this.singleSubEvent == true) {
                console_ely.log(`Start event: ${this.startEvent}`);
                this.singleSubEvent = false;
                return this.#eventStatus.Start;
            } else {
                console_ely.log(`End event: ${this.endEvent}`);
                return this.#eventStatus.End;
            }
        }
        if (evt == this.startEvent) {
            console_ely.log(`Start event: ${this.startEvent}`);
            status = this.#eventStatus.Start;
        } else if ((evt != this.endEvent) && (this.previousEvent == this.endEvent)) {
            //|| ((this.startEvent == this.#events.EVENT_CLEANUP) && evt == this.endEvent)) {
            console_ely.log(`End event: ${this.endEvent}`);
            status = this.#eventStatus.End;
        } else if (evt == mainEvents.EVENT_CLEANUP) {
            console_ely.log(`Error event: ${evt}`);
            status = this.#eventStatus.Error;
        } else
            status = this.#eventStatus.Progress;

        this.previousEvent = evt;
        return status;
    }

    /**
     *
     */
    getEventDetails(event) {
        console_ely.logFuncName(this.getEventDetails.name);
        this.mainEvent = event;
        if (this.setOfMainEventsMapping[this.mainEvent]) {
            const subArray = this.setOfMainEventsMapping[this.mainEvent];
            if (subArray.length > 0) {
                this.startEvent = subArray[0];
                this.endEvent = subArray[subArray.length - 1];
                this.#currentEvent = this.startEvent;
                this.previousMainEvent = this.mainEvent;
                console_ely.log(`${this.mainEvent} : { start: ${this.startEvent}, end: ${this.endEvent} }`);
                return true;
            } else {
                console_ely.log(`Error: Sub array for ${this.mainEvent} is empty`);
                return false;
            }
        } else {
            console_ely.log("Error: Invalid main event");
            return false;
        }
    }

    /**
     *
     */
    async start(event) {
        console_ely.logFuncName(this.start.name);
        try {
            this.eventInProgress = false;
            this.eventErrorOccurred = false;
            this.eventResolved = null;
            this.singleSubEvent = true;
            let response = webApi.resetResponse();

            const result = this.getEventDetails(event);

            if (result === true) {
                const eventCycleResult = await this.eventCycle();
                console_ely.log(eventCycleResult);
                response.status = (eventCycleResult == "eventCycle resolved with error") ? "failed" : "success";
                console_ely.log(`response.status: ${response.status}`);
            } else {
                response.status = "failed";
                response.error = "Invalid event details";
                // return JSON.stringify({ status: false, error: "Invalid event details" });
            }
            return response;

        } catch (error) {
            console.error("Error: ", error);
            return { status: false, error };
        }
    }

    /**
     * 
     */
    eventCycle() {
        console_ely.logFuncName(this.eventCycle.name);
        this.eventHandler();
        // Check current value of eventInProgress
        if (this.eventInProgress === false) {
            return Promise.resolve("eventInProgress false");
        }
        // Otherwise, wait for eventInProgress to change
        return new Promise((resolve, reject) => {
            this.eventResolved = resolve;
        });
    }

    /**
     * 
     */
    progress(event) {
        console_ely.logFuncName(this.progress.name);
        let result = true;
        let status = this.getEventStatus(event);
        if (status == this.#eventStatus.Start) {
            this.eventInProgress = true;
            this.debug = [];
        } else if (status != this.#eventStatus.Progress) {
            this.eventInProgress = false;
            result = false;
            if (status == this.#eventStatus.Error) {
                this.eventErrorOccurred = true;
                this.eventResolved("eventCycle resolved with error");
            } else
                this.eventResolved("eventCycle resolved");
        }
        return result;
    }

    /* internal for debugging */
    /*async testInit(mainEvent) { 
        console_ely.logFuncName(this.testInit.name);
        this.mainEvent = null;
        this.startEvent = null;
        this.endEvent = null;
        this.previousEvent = null;
        this.previousMainEvent = null;
        try {
            var response = await this.start(mainEvent);
            console.log(mainEvent + " response is " + JSON.stringify(response));
        } catch (error) {
            console.error("Error in init:", error);
        }
    }*/

    /* internal for debugging */
    /*async testSetMainEvents() {
        const listOfMainEvents = [mainEvents.INIT_SCARD_READER, mainEvents.CARD_CONNECT, mainEvents.EVENT_PERFORM_PACE_AUTHENTICATION, mainEvents.EVENT_GET_DG1, mainEvents.EVENT_GET_DG3, mainEvents.EVENT_CLEANUP];
        const results = [];

        for (mainEvent in listOfMainEvents) {
            try {
                const result = await this.start(mainEvent);
                results.push(result);
            } catch (error) {
                console.error("Error: ", error);
                results.push({ status: false, error });
            }
        }
    
        return results;
    }*/

    /**
     * Set the event to currentEvent
     */
    setEvent(evt) {
        this.#currentEvent = evt;
    }

    /**
     * Push the currentEvent to stack
     */
    pushEvent() {
        console_ely.logFuncName(this.pushEvent.name);
        console.log(this.#stackEvent);
        if (this.#currentEvent != this.#events.EVENT_GET_RESPONSE)
            this.#stackEvent.push(this.#currentEvent);
        console_ely.log(`Pushed event: ${this.#currentEvent}`);
    }

    /**
     * Pop the event from stack
     */
    popEvent() {
        console_ely.logFuncName(this.popEvent.name);
        console.log(this.#stackEvent);
        const event = this.stackEvent.pop()
        console_ely.log(`Popped event: ${event}`);
        if (event != null)
            setEvent(event);
    }

    /**
     * Analyzes the current event and sends command to the device.
     */
    eventHandler() {
        console_ely.log(`Request event: ${this.#currentEvent}`);
        this.tStart = new Date().getTime();
        if (this.progress(this.#currentEvent) == false)
            return;
        switch (this.#currentEvent) {
            case this.#events.EVENT_PERFORM_SCARD_ESTABLISHCONTEXT:
                this.device.scardEstablishContext();
                break;
            case this.#events.EVENT_PERFORM_SCARD_LISTREADERS:
                this.device.getListOfReaders();
                break;
            case this.#events.EVENT_PERFORM_SCARD_GETSLOTSTATUS:
                this.device.getSlotStatus();
                break;
            case this.#events.EVENT_PERFORM_SCARD_CONNECT:
                this.device.scardConnect();
                break;
            case this.#events.EVENT_PERFORM_SCARD_DISCONNECT:
                this.device.scardDisconnect();
                break;
            case this.#events.EVENT_PERFORM_SCARD_GETVERSION:
                this.device.getScardReaderVersion()
                break;
            case this.#events.EVENT_PERFORM_SCARD_RELEASECONTEXT:
                this.device.scardReleaseContext();
                break;
            case this.#events.EVENT_GET_SLOT_STATUS:
                isAuthStarted = true;
                this.device.getSlotStatus();
                break;
            case this.#events.EVENT_ICC_POWER_ON:
                this.device.scardConnect();
                break;
            case this.#events.EVENT_SELECT_EF_ATR:
                this.emrtd.selectBinary(this.CMD_SELECT_EF_ATR);
                break;
            case this.#events.EVENT_SELECT_AID:
                const [cmd, description] = this.aidSelectionSequence[this.#aid];
                this.setEvent(this.#events.EVENT_SELECT_AID);
                this.emrtd.selectBinary(cmd);
                break;
            case this.#events.EVENT_GET_CHALLENGE:
                this.emrtd.initBac();
                this.emrtd.getChallenge();
                break;
            case this.#events.EVENT_EXT_AUTHENTICATE:
                const extAuthData = this.emrtd.getExternalAuthenticateData(this.#extAuthSize);
                this.pace.externalAuthenticate(extAuthData, this.#extAuthSize);
                break;
            case this.#events.EVENT_INT_AUTHENTICATE:
                this.emrtd.performIntAuth();
                break;
            case this.#events.EVENT_SELECT_EF_CARD_ACCESS:
                this.emrtd.selectBinary(this.CMD_SELECT_EF_CARD_ACCESS);
                break;
            case this.#events.EVENT_READ_EF_CARD_ACCESS:
                this.emrtd.readEfCardAccess();
                break;
            case this.#events.EVENT_MSE_AT:
                if (this.pace.mseAt(this.pwdType) == false)
                    this.setEvent(this.#events.EVENT_CLEANUP); // todo: We can't set state in event_handler
                break;
            case this.#events.EVENT_CA_MSE_KAT:
                this.emrtd.doCaMseKat()
                break;
            case this.#events.EVENT_CA_GA:
                this.emrtd.doCaGeneralAuth();
                break;
            case this.#events.EVENT_GA_ENC_NONCE:
                this.pace.generalAuthenticateEncNonce();
                break;
            case this.#events.EVENT_GA_MAP_NONCE:
                this.pace.generalAuthenticateMapNonce();
                break;
            case this.#events.EVENT_GA_PERFORM_KEY_AGREEMENT:
                this.pace.performKeyAgreement();
                break;
            case this.#events.EVENT_MUTUAL_AUTHENTICATION:
                this.pace.mutualAuthenticate();
                break;
            case this.#events.EVENT_SELECT_EF_CARD_SECURITY:
                this.emrtd.selectBinary(this.CMD_SELECT_EF_CARD_SECURITY);
                break;
            case this.#events.EVENT_SELECT_EF_COM:
                this.emrtd.selectBinary((this.#appletType != "ICAO") ? this.CMD_SELECT_IDL_EF_COM : this.CMD_SELECT_EF_COM);
                break;
            case this.#events.EVENT_SELECT_EF_SOD:
                this.emrtd.selectBinary(this.CMD_SELECT_EF_SOD);
                break;
            case this.#events.EVENT_SELECT_EF_CVCA:
                this.emrtd.selectEfCvca();
                break;
            case this.#events.EVENT_SELECT_DG1:
                this.emrtd.selectDg(1);
                break;
            case this.#events.EVENT_SELECT_DG2:
                this.emrtd.selectDg(2);
                break;
            case this.#events.EVENT_SELECT_DG3:
                this.emrtd.selectDg(3);
                break;
            case this.#events.EVENT_SELECT_DG4:
                this.emrtd.selectDg(4);
                break;
            case this.#events.EVENT_SELECT_DG5:
                this.emrtd.selectDg(5);
                break;
            case this.#events.EVENT_SELECT_DG6:
                this.emrtd.selectDg(6);
                break;
            case this.#events.EVENT_SELECT_DG7:
                this.emrtd.selectDg(7);
                break;
            case this.#events.EVENT_SELECT_DG11:
                this.emrtd.selectDg(11);
                break;
            case this.#events.EVENT_SELECT_DG12:
                this.emrtd.selectDg(12);
                break;
            case this.#events.EVENT_SELECT_DG13:
                this.emrtd.selectDg(13);
                break;
            case this.#events.EVENT_SELECT_DG14:
                this.emrtd.selectDg(14);
                break;
            case this.#events.EVENT_SELECT_DG15:
                this.emrtd.selectDg(15);
                break;
            case this.#events.EVENT_READ_EF_ATR:
            case this.#events.EVENT_READ_EF_CARD_SECURITY:
            case this.#events.EVENT_READ_EF_COM:
            case this.#events.EVENT_READ_EF_SOD:
            case this.#events.EVENT_READ_EF_CVCA:
            case this.#events.EVENT_READ_DG1:
            case this.#events.EVENT_READ_DG3:
            case this.#events.EVENT_READ_DG4:
            case this.#events.EVENT_READ_DG5:
            case this.#events.EVENT_READ_DG6:
            case this.#events.EVENT_READ_DG7:
            case this.#events.EVENT_READ_DG11:
            case this.#events.EVENT_READ_DG12:
            case this.#events.EVENT_READ_DG13:
            case this.#events.EVENT_READ_DG14:
            case this.#events.EVENT_READ_DG15:
                this.emrtd.readBinary();
                break;
            case this.#events.EVENT_READ_DG2:
                if ((chainParameter > 0) && (chainParameter != 2)) { // todo: Do we need to care about these in this file ? Why don't we consider the same for other DG reading
                    let chainingCmd = new Uint8Array; // todo: What is the use of this ?
                    this.device.sendApdu(chainingCmd);
                } else {
                    this.emrtd.readBinary();
                }
                break;
            case this.#events.EVENT_MSE_SET_CVCA_LINK:
                this.emrtd.performTaSetMse(file_type.CVCA_LINK_CERTIFICATE);
                break;
            case this.#events.EVENT_VERIFY_CVCA_LINK_CERTIFICATE:
                this.emrtd.doTaVerifyCert(file_type.CVCA_LINK_CERTIFICATE);
                break;
            case this.#events.EVENT_MSE_SET_DV:
                this.emrtd.performTaSetMse(file_type.DV_CERTIFICATE);
                break;
            case this.#events.EVENT_VERIFY_DV_CERTIFICATE:
                this.emrtd.doTaVerifyCert(file_type.DV_CERTIFICATE);
                break;
            case this.#events.EVENT_MSE_SET_IS:
                this.emrtd.performTaSetMse(file_type.IS_CERTIFICATE);
                break;
            case this.#events.EVENT_VERIFY_IS_CERTIFICATE:
                this.emrtd.doTaVerifyCert(file_type.IS_CERTIFICATE);
                break;
            case this.#events.EVENT_TA_MSE_AT:
                this.emrtd.doTaMseAt();
                break;
            case this.#events.EVENT_TA_GET_CHALLENGE:
                this.emrtd.getChallenge();
                break;
            case this.#events.EVENT_TA_EXTERNAL_AUTHENTICATION:
                this.emrtd.taExtAuth();
                break;
            case this.#events.EVENT_GET_RESPONSE:
                this.emrtd.getResponse();
                break;
            case this.#events.EVENT_GET_ATR:
                this.device.scardConnect();
                break;
            case this.#events.EVENT_CLEANUP:
                console_ely.log("Event cleanup");
                this.setEvent((urlparams_pcsc == '1') ?
                    this.#events.EVENT_PERFORM_SCARD_DISCONNECT :
                    this.#events.EVENT_FINAL);
                this.eventHandler();
                break;
            case this.#events.EVENT_FINAL:
                console_ely.log("Event final");
                // Resolve to exit the event cycle
                this.eventResolved("eventCycle resolved");
                this.#taFailCount = 2;
                this.#doCaMseAt = false;
                // stress test
                if (enableStressTest) {
                    if (!this.isCaDone && isFinalCheckPointReached) {
                        util.startDelayedFunction();
                        isFinalCheckPointReached = false;
                    } else {
                        clearTimeout(timerId);
                        console.log(`stressTestLoopCount: ${stressTestLoopCount}`);
                    }
                }
                break;
            default:
                console.log(`Unknown event: ${this.#currentEvent}`);
        }
        return;
    }

    scardResponseHandler(response) {
        let triggerResponseHandler = 0;
        let responseEvent = this.#currentEvent;
        switch (this.#currentEvent) {
            case this.#events.EVENT_PERFORM_SCARD_ESTABLISHCONTEXT:
            case this.#events.EVENT_PERFORM_SCARD_LISTREADERS:
            case this.#events.EVENT_PERFORM_SCARD_GETSLOTSTATUS:
            case this.#events.EVENT_PERFORM_SCARD_CONNECT:
            case this.#events.EVENT_PERFORM_SCARD_GETVERSION:
            case this.#events.EVENT_PERFORM_SCARD_DISCONNECT:
                this.setEvent(this.#events.EVENT_PERFORM_SCARD_RELEASECONTEXT);
                break;
            case this.#events.EVENT_PERFORM_SCARD_RELEASECONTEXT:
                this.setEvent(this.#events.EVENT_FINAL);
                break;
            default:
                triggerResponseHandler = 1;
                break;
        }
        this.tEnd = new Date().getTime();
        this.scardResponse = this.device.scardGetParsedResponse(response);
        if (triggerResponseHandler === 0) {
            this.updateDebugArray(responseEvent, this.device.scardGetCommand(), this.scardResponse.Status, this.tEnd - this.tStart);
            this.eventHandler();
        } else {
            this.responseHandler(this.scardResponse.data, this.scardResponse.data.length);
        }
    }

    getEventMap(type, name, dg_num, ok_evt, ko_evt, step = 'default') {
        return { type, name, dg_num, ok_evt, ko_evt, step };
    }

    genericResponseHandler(event, responseStatusOk) {
        switch (event) {
            case this.#events.EVENT_SELECT_EF_ATR:
                evt = this.getEventMap('Select', 'EF.ATR', 0, this.#events.EVENT_READ_EF_ATR, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_SELECT_EF_CARD_SECURITY:
                evt = this.getEventMap('Select', 'EF.CardSecurity', 0, this.#events.EVENT_READ_EF_CARD_SECURITY, this.#events.EVENT_SELECT_AID);
                break;
            case this.#events.EVENT_SELECT_EF_COM:
                var next = ((doPassiveAuthentication) ? this.#events.EVENT_SELECT_EF_SOD :
                    (doActiveAuthentication) ? ((this.#appletType != "ICAO") ? this.#events.EVENT_SELECT_DG13 : this.#events.EVENT_SELECT_DG15) :
                        ((doChipAuthentication) ? this.#events.EVENT_SELECT_DG14 : this.#events.EVENT_SELECT_DG1));
                evt = this.getEventMap('Select', 'EF.COM', 0, this.#events.EVENT_READ_EF_COM, next);
                break;
            case this.#events.EVENT_SELECT_EF_SOD:
                evt = this.getEventMap('Select', 'EF.SOD', 0, this.#events.EVENT_READ_EF_SOD, this.#events.EVENT_READ_EF_SOD);
                break;
            case this.#events.EVENT_SELECT_EF_CVCA:
                evt = this.getEventMap('Select', 'EF.CVCA', 0, this.#events.EVENT_READ_EF_CVCA, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_SELECT_DG1:
                evt = this.getEventMap('Select', 'DG1', 0, this.#events.EVENT_READ_DG1, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_SELECT_DG2:
                evt = this.getEventMap('Select', 'DG2', 0, this.#events.EVENT_READ_DG2, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_SELECT_DG3:
                evt = this.getEventMap('Select', 'DG3', 0, this.#events.EVENT_READ_DG3, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_SELECT_DG4:
                evt = this.getEventMap('Select', 'DG4', 0, this.#events.EVENT_READ_DG4, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_SELECT_DG5:
                evt = this.getEventMap('Select', 'DG5', 0, this.#events.EVENT_READ_DG5, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_SELECT_DG6:
                evt = this.getEventMap('Select', 'DG6', 0, this.#events.EVENT_READ_DG6,
                    ((this.#appletType != "ICAO") ? this.#events.EVENT_SELECT_DG4 : this.#events.EVENT_CLEANUP));
                break;
            case this.#events.EVENT_SELECT_DG7:
                evt = this.getEventMap('Select', 'DG7', 0, this.#events.EVENT_READ_DG7, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_SELECT_DG11:
                evt = this.getEventMap('Select', 'DG11', 0, this.#events.EVENT_READ_DG11, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_SELECT_DG12:
                evt = this.getEventMap('Select', 'DG12', 0, this.#events.EVENT_READ_DG12, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_SELECT_DG13:
                evt = this.getEventMap('Select', 'DG13', 0, this.#events.EVENT_READ_DG13, this.#events.EVENT_SELECT_DG1);
                break;
            case this.#events.EVENT_SELECT_DG14:
                evt = this.getEventMap('Select', 'DG14', 0, this.#events.EVENT_READ_DG14, this.#events.EVENT_SELECT_DG1);
                break;
            case this.#events.EVENT_SELECT_DG15:
                evt = this.getEventMap('Select', 'DG15', 0, this.#events.EVENT_READ_DG15,
                    ((doChipAuthentication) ? this.#events.EVENT_SELECT_DG14 : this.#events.EVENT_SELECT_DG1));
                break;
            case this.#events.EVENT_READ_EF_ATR:
                evt = this.getEventMap('Read', 'EF.ATR', 0, this.#events.EVENT_SELECT_EF_CARD_ACCESS, this.#events.EVENT_SELECT_EF_CARD_ACCESS);
                break;
            case this.#events.EVENT_READ_EF_CARD_SECURITY:
                evt = this.getEventMap('Read', 'EF.CardSecurity', 0, this.#events.EVENT_SELECT_AID, this.#events.EVENT_SELECT_AID);
                break;
            case this.#events.EVENT_READ_EF_COM:
                var next = ((doPassiveAuthentication) ? this.#events.EVENT_SELECT_EF_SOD :
                    (doActiveAuthentication) ? ((this.#appletType != "ICAO") ? this.#events.EVENT_SELECT_DG13 : this.#events.EVENT_SELECT_DG15) :
                        ((doChipAuthentication) ? this.#events.EVENT_SELECT_DG14 : this.#events.EVENT_SELECT_DG1));
                evt = this.getEventMap('Read', 'EF.COM', 0, next, next, 'hidden');
                break;
            case this.#events.EVENT_READ_EF_SOD:
                var next = ((doActiveAuthentication) ? ((this.#appletType != "ICAO") ? this.#events.EVENT_SELECT_DG13 : this.#events.EVENT_SELECT_DG15) :
                    ((doChipAuthentication) ? this.#events.EVENT_SELECT_DG14 : this.#events.EVENT_SELECT_DG1));
                evt = this.getEventMap('Read', 'EF.SOD', 0, next, next);
                break;
            case this.#events.EVENT_READ_EF_CVCA:
                evt = this.getEventMap('Read', 'EF.CVCA', 0, this.#events.EVENT_MSE_SET_DV, this.#events.EVENT_CLEANUP, 'hidden');
                break;
            case this.#events.EVENT_READ_DG1:
                evt = this.getEventMap('Read', 'DG1', 1, this.#events.EVENT_CLEANUP, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_READ_DG2:
                evt = this.getEventMap('Read', 'DG2', 2, this.#events.EVENT_CLEANUP, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_READ_DG3:
                evt = this.getEventMap('Read', 'DG3', 3, this.#events.EVENT_CLEANUP, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_READ_DG4:
                evt = this.getEventMap('Read', 'DG4', 4, this.#events.EVENT_CLEANUP, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_READ_DG5:
                evt = this.getEventMap('Read', 'DG5', 5, this.#events.EVENT_CLEANUP, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_READ_DG6:
                evt = this.getEventMap('Read', 'DG6', 6, this.#events.EVENT_CLEANUP, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_READ_DG7:
                evt = this.getEventMap('Read', 'DG7', 7, this.#events.EVENT_CLEANUP, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_READ_DG11:
                evt = this.getEventMap('Read', 'DG11', 11, this.#events.EVENT_CLEANUP, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_READ_DG12:
                evt = this.getEventMap('Read', 'DG12', 12, this.#events.EVENT_CLEANUP, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_READ_DG13:
                evt = this.getEventMap('Read', 'DG13', 13,
                    ((doActiveAuthentication && (this.#appletType != "ICAO")) ? this.#events.EVENT_INT_AUTHENTICATE : this.#events.EVENT_SELECT_DG1),
                    ((doChipAuthentication) ? this.#events.EVENT_SELECT_DG14 : this.#events.EVENT_SELECT_DG1));
                break;
            case this.#events.EVENT_READ_DG14:
                evt = this.getEventMap('Read', 'DG14', 14, this.#events.EVENT_SELECT_DG1, this.#events.EVENT_CLEANUP);
                break;
            case this.#events.EVENT_READ_DG15:
                evt = this.getEventMap('Read', 'DG15', 15,
                    ((doActiveAuthentication && (this.#appletType != "ICAO")) ? this.#events.EVENT_INT_AUTHENTICATE : this.#events.EVENT_SELECT_DG1),
                    ((doChipAuthentication) ? this.#events.EVENT_SELECT_DG14 : this.#events.EVENT_SELECT_DG1));
                break;
            case this.#events.EVENT_MSE_SET_CVCA_LINK:
                evt = this.getEventMap('MSE Set', 'CVCA Link', 0, this.#events.EVENT_VERIFY_CVCA_LINK_CERTIFICATE, this.#events.EVENT_CLEANUP, 'hidden');
                break;
            case this.#events.EVENT_VERIFY_CVCA_LINK_CERTIFICATE:
                evt = this.getEventMap('Verify', 'CVCA Link', 0, this.#events.EVENT_MSE_SET_DV, this.#events.EVENT_CLEANUP, 'intermediate');
                break;
            case this.#events.EVENT_MSE_SET_DV:
                evt = this.getEventMap('MSE Set', 'DV', 0, this.#events.EVENT_VERIFY_DV_CERTIFICATE, this.#events.EVENT_CLEANUP, 'hidden');
                break;
            case this.#events.EVENT_VERIFY_DV_CERTIFICATE:
                evt = this.getEventMap('Verify', 'DV', 0, this.#events.EVENT_MSE_SET_IS, this.#events.EVENT_CLEANUP, 'intermediate');
                break;
            case this.#events.EVENT_MSE_SET_IS:
                evt = this.getEventMap('MSE Set', 'IS', 0, this.#events.EVENT_VERIFY_IS_CERTIFICATE, this.#events.EVENT_CLEANUP, 'hidden');
                break;
            case this.#events.EVENT_VERIFY_IS_CERTIFICATE:
                evt = this.getEventMap('Verify', 'IS', 0, this.#events.EVENT_TA_MSE_AT, this.#events.EVENT_CLEANUP, 'intermediate');
                break;
            case this.#events.EVENT_TA_MSE_AT:
                evt = this.getEventMap('TA', 'MSE.AT', 0, this.#events.EVENT_TA_GET_CHALLENGE, this.#events.EVENT_CLEANUP, 'intermediate');
                break;
            case this.#events.EVENT_TA_GET_CHALLENGE:
                evt = this.getEventMap('TA', 'Get signed data', 0, this.#events.EVENT_TA_EXTERNAL_AUTHENTICATION, this.#events.EVENT_CLEANUP, 'hidden');
                break;
        }
        if (evt.type == 'Select') {
            if (responseStatusOk) {
                console_ely.log(`${evt.type} ${evt.name} success`, 5);
                this.setEvent(evt.ok_evt);
            } else {
                if (event == this.#events.EVENT_SELECT_EF_CARD_SECURITY && this.pace.isPaceCam) {
                    console_ely.log("WARNING: PACE-CAM verification failed. Proceeding to read DGs\n");
                }
                this.setEvent(evt.ko_evt);
            }
        }
        else if (responseStatusOk) {
            if ((evt.type != 'Read') || this.emrtd.isReadComplete()) {
                /*if (evt.step == 'intermediate') {
                    // gui.appendStatusTextTag(evt.type + " " + evt.name + " OK", 'success');
                } else if (evt.step != 'hidden') {
                    // this.appendDetails((evt.type + " " + evt.name), 5);
                    if ((evt.type == 'Read') && datagroup.isReadComplete()) {
                        // gui.appendStatusTextTag(totalSize + " Bytes", 'success');
                        if (totalSize > 1024) {
                            //var time = (this.endTime - this.startTime);
                            //gui.appendStatusTextTag(((totalSize * 8) / time).toFixed(2) + " kbps", 'success');
                        }
                    }
                }*/

                if (event == this.#events.EVENT_READ_EF_ATR) {
                    this.emrtd.storeEfAtr();
                    //evt.step = 'hidden';
                }
                else if (event == this.#events.EVENT_READ_EF_CARD_SECURITY) {
                    this.emrtd.storeEfCardSecurity();
                }
                else if ((event == this.#events.EVENT_READ_DG2) || (event == this.#events.EVENT_READ_DG4) || (event == this.#events.EVENT_READ_DG6)) {
                    let images = this.getDgImage();
                    // stress test
                    //isFinalCheckPointReached = true;
                    if ((event == this.#events.EVENT_READ_DG6) && (images && images[0].type == IMGTYPE.UNKNOWN) && (this.#appletType != "ICAO")) {
                        evt.ok_evt = this.#events.EVENT_SELECT_DG4;
                    }
                }
                else if ((event == this.#events.EVENT_READ_DG5) || (event == this.#events.EVENT_READ_DG7)) {
                    gui.display(gui.id.signatureImg, this.getDgImage());
                }
                else if (event == this.#events.EVENT_TA_GET_CHALLENGE) {
                    this.emrtd.getTaSignedData();
                }
                this.setEvent(evt.ok_evt);
            }
        }
        else {
            this.setEvent(evt.ko_evt);
        }

        return "done";
    }

    /**
     * responseHandler() parses the response to complete emrtd authentication and reads DG data.
     */
    responseHandler(u8Data, length) {
        console_ely.log(`Response event: ${this.#currentEvent}`);
        let responseEvent = this.#currentEvent;
        responseStatusOk = this.emrtd.preProcessResponse(u8Data, length);
        switch (this.#currentEvent) {
            case this.#events.EVENT_GET_SLOT_STATUS:
                result = this.device.parseGetSlotStatus(u8Data, length);
                if (result.status == "success" && result.data == "Card absent")
                    gui.update(GUI.CARD_ABSENT);
                break;
            case this.#events.EVENT_ICC_POWER_ON:
                var atrData = this.device.parseAtrData(u8Data);
                gui.update(GUI.ATR, atrData);
                this.setEvent(this.#events.EVENT_SELECT_EF_ATR);
                break;
            case this.#events.EVENT_SELECT_AID:
                if (responseStatusOk) {
                    this.setEvent((this.getSmStatus() == true) ? this.#events.EVENT_SELECT_EF_COM : this.#events.EVENT_GET_CHALLENGE);
                } else {
                    this.setEvent(this.#events.EVENT_CLEANUP);
                }
                break;
            case this.#events.EVENT_GET_CHALLENGE:
                if (responseStatusOk) {
                    var position = ((urlparams_pcsc == '1') ? 0 : CCID_HDR_LEN);
                    var size = length - (position + 2); // 2 for status word
                    var challenge = new Uint8Array(size);
                    util.memcpy(challenge, u8Data, size, 0, position);
                    console_ely.log(`challenge: ${util.toHexString(challenge)}\nMRZ: ${util.toHexString(this.#secret)}\nauthType: ${this.authType}`);
                    this.#extAuthSize = this.emrtd.getBacChallenge(challenge, size, util.strToByteArray(this.#secret), this.#secret.length, this.authType); // todo: prepare for ext auth
                    if (this.#extAuthSize == -1) {
                        responseStatusOk = false;
                        this.setEvent(this.#events.EVENT_CLEANUP);
                    }
                    else this.setEvent(this.#events.EVENT_EXT_AUTHENTICATE);
                } else {
                    this.setEvent(this.#events.EVENT_CLEANUP);
                }
                break;
            case this.#events.EVENT_EXT_AUTHENTICATE:
                if (responseStatusOk) {
                    this.setSmStatus(true); // Mark start of secure messaging
                    var position = ((urlparams_pcsc == '1') ? 0 : CCID_HDR_LEN);
                    var i = 0;
                    var size = length - (position + 2); // 2 for status word
                    var authData = new Uint8Array(size);
                    util.memcpy(authData, u8Data, size, 0, position);
                    this.emrtd.decryptCryptogram(authData, size);
                    this.setEvent(this.#events.EVENT_SELECT_EF_SOD);
                } else {
                    console.log("Error: this.#events.EVENT_CLEANUP");
                    this.setEvent(this.#events.EVENT_CLEANUP);
                }
                break;
            case this.#events.EVENT_INT_AUTHENTICATE:
                if (responseStatusOk) {
                    this.setEvent((this.isAaEcdsaPending || doChipAuthentication) ? this.#events.EVENT_SELECT_DG14 : this.#events.EVENT_SELECT_DG1);
                } else {
                    this.setEvent((doChipAuthentication) ? this.#events.EVENT_SELECT_DG14 : this.#events.EVENT_SELECT_DG1);
                }
                break;
            case this.#events.EVENT_SELECT_EF_CARD_ACCESS:
                if (responseStatusOk) {
                    this.setEvent((this.authType == ACCESS_TYPE.BAC_BAP) ?
                        this.#events.EVENT_SELECT_AID :
                        this.#events.EVENT_READ_EF_CARD_ACCESS);
                } else {
                    this.setEvent(this.#events.EVENT_SELECT_AID);
                }
                break;
            case this.#events.EVENT_READ_EF_CARD_ACCESS:
                if (responseStatusOk) {
                    console_ely.log("Read EF.CardAccess success", 5);
                    if (this.pace.parseEfCardAccess(u8Data, length) == true) {
                        this.#paceDocument = true;
                        this.emrtd.setApduFormat(gui.getApduType());
                        this.setEvent(this.#events.EVENT_MSE_AT);
                    } else {
                        this.setEvent(this.#events.EVENT_CLEANUP);
                    }
                } else {
                    console_ely.log("Read EF.CardAccess failed", 4);
                    this.setEvent(this.#events.EVENT_CLEANUP);
                }
                break;
            case this.#events.EVENT_MSE_AT:
                this.setEvent(this.#doCaMseAt ? this.#events.EVENT_CA_GA : this.#events.EVENT_GA_ENC_NONCE);
                break;
            case this.#events.EVENT_CA_MSE_KAT:
            case this.#events.EVENT_CA_GA:
                if (responseStatusOk) {
                    if (this.emrtd.setCaSsc() == 1) {
                        this.isCaDone = true;
                    }
                }
                this.setEvent(this.#events.EVENT_SELECT_DG1);
                break;
            case this.#events.EVENT_GA_ENC_NONCE:
                if (this.pace.performGaEncryptNonce(u8Data, length, this.#secret) == true)
                    this.setEvent(this.#events.EVENT_GA_MAP_NONCE);
                else {
                    this.setEvent(this.#events.EVENT_CLEANUP);
                }
                break;
            case this.#events.EVENT_GA_MAP_NONCE:
                if (this.pace.performGaMapNonce(u8Data, length) == true) {
                    this.setEvent(this.#events.EVENT_GA_PERFORM_KEY_AGREEMENT);
                } else {
                    this.setEvent(this.#events.EVENT_CLEANUP);
                }
                break;
            case this.#events.EVENT_GA_PERFORM_KEY_AGREEMENT:
                if (this.pace.performGaKeyAgreement(u8Data, length) == true) {
                    this.setEvent(this.#events.EVENT_MUTUAL_AUTHENTICATION);
                } else {
                    this.setEvent(this.#events.EVENT_CLEANUP);
                }
                break;
            case this.#events.EVENT_MUTUAL_AUTHENTICATION:
                if (responseStatusOk) {
                    this.setSmStatus(true); // Mark start of secure messaging
                    this.pace.parseMutualAuthenticate(u8Data, length);
                    this.setEvent(this.#events.EVENT_SELECT_AID);
                } else {
                    this.setEvent(this.#events.EVENT_CLEANUP);
                }
                break;
            case this.#events.EVENT_SELECT_EF_ATR:
            case this.#events.EVENT_READ_EF_ATR:
            case this.#events.EVENT_SELECT_EF_CARD_SECURITY:
            case this.#events.EVENT_READ_EF_CARD_SECURITY:
            case this.#events.EVENT_SELECT_EF_COM:
            case this.#events.EVENT_READ_EF_COM:
            case this.#events.EVENT_SELECT_EF_SOD:
            case this.#events.EVENT_READ_EF_SOD:
            case this.#events.EVENT_SELECT_DG1:
            case this.#events.EVENT_READ_DG1:
            case this.#events.EVENT_SELECT_DG2:
            case this.#events.EVENT_READ_DG2:
            case this.#events.EVENT_SELECT_DG3:
            case this.#events.EVENT_READ_DG3:
            case this.#events.EVENT_SELECT_DG4:
            case this.#events.EVENT_READ_DG4:
            case this.#events.EVENT_SELECT_DG5:
            case this.#events.EVENT_READ_DG5:
            case this.#events.EVENT_SELECT_DG6:
            case this.#events.EVENT_READ_DG6:
            case this.#events.EVENT_SELECT_DG7:
            case this.#events.EVENT_READ_DG7:
            case this.#events.EVENT_SELECT_DG11:
            case this.#events.EVENT_READ_DG11:
            case this.#events.EVENT_SELECT_DG12:
            case this.#events.EVENT_READ_DG12:
            case this.#events.EVENT_SELECT_DG13:
            case this.#events.EVENT_READ_DG13:
            case this.#events.EVENT_SELECT_DG14:
            case this.#events.EVENT_READ_DG14:
            case this.#events.EVENT_SELECT_DG15:
            case this.#events.EVENT_READ_DG15:
            case this.#events.EVENT_SELECT_EF_CVCA:
            case this.#events.EVENT_READ_EF_CVCA:
            case this.#events.EVENT_MSE_SET_DV:
            case this.#events.EVENT_VERIFY_CVCA_LINK_CERTIFICATE:
            case this.#events.EVENT_MSE_SET_CVCA_LINK:
            case this.#events.EVENT_VERIFY_DV_CERTIFICATE:
            case this.#events.EVENT_MSE_SET_IS:
            case this.#events.EVENT_VERIFY_IS_CERTIFICATE:
            case this.#events.EVENT_TA_MSE_AT:
            case this.#events.EVENT_TA_GET_CHALLENGE:
                if ("pending" == this.genericResponseHandler(this.#currentEvent, responseStatusOk)) {
                    return;
                }
                break;
            case this.#events.EVENT_TA_EXTERNAL_AUTHENTICATION:
                if (responseStatusOk) {
                    this.setEvent(this.#events.EVENT_SELECT_DG3);
                } else {
                    this.#taFailCount--;
                    if (this.#taFailCount < 1) {
                        this.setEvent(this.#events.EVENT_CLEANUP);
                    } else {
                        console_ely.log("Retrying TA", 4);
                        this.setEvent(this.#events.EVENT_MSE_SET_DV);
                    }
                }
                break;
            case this.#events.EVENT_GET_RESPONSE:
                this.emrtd.storeDataIfAny();
                break;
            case this.#events.EVENT_GET_ATR:
                var atrData = this.device.parseAtrData(u8Data);
                gui.update(GUI.ATR, atrData);
                this.setEvent((this.authType == ACCESS_TYPE.BAC_BAP) ?
                    this.#events.EVENT_SELECT_AID :
                    this.#events.EVENT_SELECT_EF_CARD_ACCESS);
                break;
            default:
                this.setEvent(this.#events.EVENT_FINAL);
        }

        this.tEnd = new Date().getTime();
        this.updateDebugArray(responseEvent, this.device.scardGetCommand(), Array.from(u8Data).map(byte => byte.toString(16).padStart(2, '0').toUpperCase()).join(''), this.tEnd - this.tStart);
        this.eventHandler();
    }

    updateDebugArray(event, cApdu, rApdu, timeTaken) {
        // Create a new object with event and status
        const newEntry = {
            stage: event,
            command: cApdu,
            response: rApdu,
            time_taken: timeTaken,
            status: ((rApdu.slice(-4) == "9000") || (rApdu == "success")) ? "OK" : "KO"
        };

        this.debug.push(newEntry);
    }

    /**
     * get Active auth Signed data
     */
    async #getAaSignedData() {
        console_ely.logFuncName(this.#getAaSignedData.name);
        let response = webApi.resetResponse();

        return this.start(mainEvents.EVENT_ACTIVE_AUTHENTICATION).then((result) => {
            response.status = result.status;
            response.data = this.getLastResponseData();
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    async getAaKeyType(publicKeyData) {
        console_ely.logFuncName(this.getAaKeyType.name);
        let keyType;
        let response = webApi.resetResponse();
        // Check if card supports ECDSA or RSA
        keyType = this.emrtd.getAaKeyType(publicKeyData);
        if (keyType == 0) {
            response.status = "RSA";
        } else if (keyType == 1) {
            response.status = "ECDSA";
            this.isAaEcdsaPending = true;
        } else {
            response.status = "failed";
            response.error = "Failed to get AA key type";
        }
        response.debug.push({
            stage: "aaKeyType-info",
            status: response.status
        });
        return Promise.resolve(response);
    }

    /**
     * Perform Active Authentication
     */
    async performActiveAuthentication(keyType, publicKeyData, dg14Data) {
        console_ely.logFuncName(this.performActiveAuthentication.name);
        let response = webApi.resetResponse();
        let result;
        let aaSignedData = null;

        // get Active auth signed data
        result = await this.#getAaSignedData();
        if (result.status == "success") { aaSignedData = result.data; }
        else {
            response.status = "failed";
            response.error = "Failed to get AA signed data";
            return Promise.resolve(response);
        }

        if (keyType == "RSA") {
            // dg14Data not required for AA with RSA 
            result = this.emrtd.doActiveAuth(keyType, publicKeyData, aaSignedData);
        } else {
            result = this.emrtd.doActiveAuth(keyType, publicKeyData, aaSignedData, dg14Data);
        }

        response.status = (result == 1) ? "success" : "failed";
        return Promise.resolve(response);
    }

    /**
     * Does card support Chip auth MSE AT
     */
    isCaSupportMseAt() {
        return this.#doCaMseAt;
    }

    /**
     * Perform Chip Authentication.
     */
    async performChipAuthentication(dg14Data) {
        console_ely.logFuncName(this.performChipAuthentication.name);
        let response = webApi.resetResponse();
        let result;
        let mainEvent = null;
        result = this.emrtd.performCa(dg14Data);
        if (result > 0) {

            const caAlgorithmId = this.emrtd.getCaAlgorithmId();
            console.log("CA algorithm-id: ", caAlgorithmId);
            if (caAlgorithmId == 0) {
                mainEvent = mainEvents.EVENT_CHIP_AUTHENTICATION_USING_MSE_KAT;
            } else {
                this.#doCaMseAt = true;
                mainEvent = mainEvents.EVENT_CHIP_AUTHENTICATION_USING_MSE_AT;
            }

            return this.start(mainEvent).then((result) => {
                response.status = (this.isCaDone == true) ? "success" : "failed";
                return response;
            }).catch(error => {
                response.status = "failed";
                response.error = error;
                return response;
            });
        }
        response.status = "failed";
        response.error = "Invalid CA algorithm-id";
        return response;
    }

    async setTaCertificates(cvcaLinkData, dvData, isData, isPrivKeyData) {
        console_ely.logFuncName(this.setTaCertificates.name);
        this.emrtd.setTaCertificates(cvcaLinkData, dvData, isData, isPrivKeyData);
    }

    async verifyCvcaLink() {
        console_ely.logFuncName(this.verifyCvcaLink.name);
        let response = webApi.resetResponse();

        return this.start(mainEvents.EVENT_VERIFY_CVCA_LINK).then((result) => {
            response.status = (responseStatusOk == true) ? "success" : "failed";
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    async verifyDvCert() {
        console_ely.logFuncName(this.verifyDvCert.name);
        let response = webApi.resetResponse();

        return this.start(mainEvents.EVENT_VERIFY_DV).then((result) => {
            response.status = (responseStatusOk == true) ? "success" : "failed";
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    async verifyIsCert() {
        console_ely.logFuncName(this.verifyIsCert.name);
        let response = webApi.resetResponse();

        return this.start(mainEvents.EVENT_VERIFY_IS).then((result) => {
            response.status = (responseStatusOk == true) ? "success" : "failed";
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    async PerformTerminalAuthentication() {
        console_ely.logFuncName(this.PerformTerminalAuthentication.name);
        let response = webApi.resetResponse();

        return this.start(mainEvents.EVENT_PERFORM_TA_EXTERNAL_AUTH).then((result) => {
            response.status = (responseStatusOk == true) ? "success" : "failed";
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    init() {
        return this.emrtd.init();
    }

    ConfigureDetailedLogging(value) {
        return this.emrtd.ConfigureDetailedLogging(value);
    }

    getApiForReadDg(dgNum) {
        return mainEvents.EVENT_GET_DGx + dgNum;
    }

    getEfComData() {
        return this.emrtd.getEfComData();
    }

    getDg1Mrz() {
        return this.emrtd.getDg1Mrz();
    }

    getDgImage() {
        return this.emrtd.getDgImage();
    }

    getDgImages() {
        return this.emrtd.getDgImages();
    }

    isPaceCam() {
        return this.pace.isPaceCam;
    }

    getEfCardAccessData() {
        return this.pace.efCardAccessData;
    }

    buildGa(cla, tag, CmdData) {
        return this.pace.buildGa(cla, tag, CmdData)
    }

    getApduData() {
        return this.pace.apduData;
    }

    getOpenpaceVersion() {
        return this.emrtd.getOpenpaceVersion();
    }

    doPaceCam(efCardSecurity) {
        const aicData = this.pace.getAicData();
        return this.emrtd.doPaceCam(aicData, efCardSecurity);
    }

    setApduFormat(apduType) {
        return this.emrtd.setApduFormat(apduType);
    }

    doPassiveAuthentication(efSodData, cscaCertData, dsCertData) {
        return this.emrtd.doPassiveAuthentication(efSodData, cscaCertData, dsCertData);
    }

    verifyHash(dgNum) {
        return this.emrtd.verifyHash(dgNum);
    }

    getApduData() {
        return this.pace.apduData;
    }

    getEfCardSecurity() {
        return this.emrtd.getEfCardSecurity();
    }

    getLastStatusWord() {
        return this.emrtd.getLastStatusWord();
    }

    setPwd(pwd) {
        this.#secret = pwd;
    }

    setPwdType(pwdType) {
        this.pwdType = pwdType;
    }

    setSmStatus(status) {
        this.emrtd.setSmStatus(status);
    }

    getSmStatus() {
        return this.emrtd.getSmStatus();
    }

    getLastResponseData() {
        return this.emrtd.getLastResponseData();
    }

    getIsPaceDocument() {
        return this.#paceDocument;
    }

    setAppletType(appletType) {
        this.#appletType = appletType;
    }

    getAppletType() {
        return this.#appletType;
    }

    getImageDetails(data) {
        return this.emrtd.getImageDetails(data);
    }

    parseIdlMrz(mrzData, idlType) {
        return this.emrtd.parseIdlMrz(mrzData, idlType);
    }

    parseEmrtdDg11(dg11Data) {
        return this.emrtd.parseEmrtdDgx("11", dg11Data);
    }

    parseEmrtdDg12(dg12Data) {
        return this.emrtd.parseEmrtdDgx("12", dg12Data);
    }

    parseEmrtdDg13(dg13Data) {
        return this.emrtd.parseEmrtdDgx("13", dg13Data);
    }

    wrapTlv(tag, payLoad) {
        return this.emrtd.wrapTlv(tag, payLoad);
    }

    unwrapTlv(expectedTags, wrappedData, length, skip = false) {
        return this.emrtd.unwrapTlv(expectedTags, wrappedData, length, skip = false);
    }

    unwrapTlvs(expectedTags, wrappedData, skip = false) {
        return this.emrtd.unwrapTlvs(expectedTags, wrappedData, skip);
    }

    cleanup() {
        isAuthStarted = false;
        this.#secret = 0;
        this.#paceDocument = false;
        this.isAaEcdsaPending = false;
        this.isCaDone = false;
        this.emrtd.cleanup();
        return this.#reloadOpenPaceModule();
    }
}