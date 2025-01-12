// url params
var urlparams_pcsc;
var urlparams_log;
var urlparams_socket;
var urlparams_pa;
var urlparams_csca;
var urlparams_dsc;
var urlparams_ca;
var urlparams_apdu;
var urlparams_ta;
var urlparams_dv;
var urlparams_is;
var urlparams_isk;
var urlparams_signature;
var urlparams_dg3;
var urlparams_autoRead;
var urlparams_verifyFp;
// passive auth
var doPassiveAuthentication = false;
var enablePaCheckbox;
var cscaListOfFiles = null;
var dsListOfFiles = null;
var cscaByteArray;
var dsByteArray;
var cscaFileBrowser;
var dsFileBrowser;
// Auto Read
var doAutoRead = false;
var enableAutoReadCheckbox;
// Active Auth
var doActiveAuthentication = false;
var enableAaCheckbox;
var isAaEcdsaPending = false;
// chip auth
var doChipAuthentication = false;
var enableCaCheckbox;
var doCaMseAt = false;
var isCaDone = false;
// terminal auth
var doTerminalAuthentication = false;
var enableTaCheckbox;
var dvListOfFiles = null;
var isListOfFiles = null;
var iskListOfFiles = null;
var dvByteArray; // DV certificate as byte array
var isByteArray; // IS certificate as byte array
var iskByteArray; // IS private key as byte array
var dvFileBrowser;
var isFileBrowser;
var iskFileBrowser;
var taFailCount = 2;
// misc
var openPaceVer = "";
var authType = "";
var aid = 0;
var docType = ""
var isSmActive = false;
var evt = {type: '', name: '', hash: 0, ok_evt: '', ko_evt: ''};
device = null; // webusb or websocket device handler

isScannerAvailable = 0;
isClReaderAvailable = 0;
performAuth = 0;

var Module = null;
var scriptElement = null;

// stress test
enableStressTest = false;
isFinalCheckPointReached = false;
stressTestLoopCount = 0;
let timerId;

function initApp() {
    console.clear();

    // Fetch library version
    let decoder = new TextDecoder('iso-8859-1');
    openPaceVer = decoder.decode(openPace.getOpenpaceVersion());
    gui.displayVer(appName, appVer, openPaceVer, buildNum);
    gui.update(guiEvents.GUI_CLEAR_ON_RUN);
    gui.update(guiEvents.GUI_RUN_DISABLE);

    pwdTypeSelected = gui.getPwdType();
    authTypeSelected = gui.getAuthType();
    doAutoRead = enableAutoReadCheckbox.checked;
    doPassiveAuthentication = enablePaCheckbox.checked;
    doActiveAuthentication = enableAaCheckbox.checked;
    doChipAuthentication = enableCaCheckbox.checked;
    doTerminalAuthentication = enableTaCheckbox.checked;

    if (cscaListOfFiles != null)
        cscaByteArray = util.fileSelectionHandler(cscaListOfFiles);
    if (dsListOfFiles != null)
        dsByteArray = util.fileSelectionHandler(dsListOfFiles);
    if (dvListOfFiles != null)
        dvByteArray = util.fileSelectionHandler(dvListOfFiles);
    if (isListOfFiles != null)
        isByteArray = util.fileSelectionHandler(isListOfFiles);
    if (iskListOfFiles != null)
        iskByteArray = util.fileSelectionHandler(iskListOfFiles);

    if (isClReaderAvailable == 1 && isScannerAvailable == 1) {
        if (pwdTypeSelected == MRZ) { serDev.readMrz(); }
        else { usbDev.open(); }
    } else if (isClReaderAvailable == 0 && isScannerAvailable == 1)
        serDev.readMrz();
    else if (isClReaderAvailable == 1 && isScannerAvailable == 0)
        usbDev.open();
    else
        console.log("Check if devices are connected");
}

function deInitApp() {

    // variable clean up
    aid = 0;
    authType = null;
    isAuthStarted = 0;
    isSmActive = false;
    doCaMseAt = false;
    isCaDone = false;
    taFailCount = 2;
    isAaEcdsaPending = false;
    datagroup.cleanup();

    if (urlparams_pcsc != '1') {
        // close the CCID device.
        if (isCardPresent == webapp_config.TRUE)
            usbDev.close();
    }

    // cleanup openPACE webassembly.
    openPace.cleanup().then(result => {
        if (doAutoRead == true)
            doContinuousReadMode(true);
        else {
            gui.update(guiEvents.GUI_RUN_ENABLE);
        }
    }).catch(error => {
        console.error('Reload error:', error);
    });
}

function getUrlParams() {
    // Retrieve URL parameters
    url = window.location.toLocaleString();
    console.log(url);
    const urlParams = new URL(url).searchParams;
    urlparams_pcsc = urlParams.get('pcsc');
    urlparams_log = urlParams.get('log');
    urlparams_socket = urlParams.get('socket');
    urlparams_apdu = urlParams.get('apdu');
    urlparams_pa = urlParams.get('pa');
    urlparams_csca = urlParams.get('csca');
    urlparams_dsc = urlParams.get('dsc');
    urlparams_aa = urlParams.get('aa');
    urlparams_ca = urlParams.get('ca');
    urlparams_ta = urlParams.get('ta');
    urlparams_dv = urlParams.get('dv');
    urlparams_is = urlParams.get('is');
    urlparams_isk = urlParams.get('isk');
    urlparams_signature = urlParams.get('signature');
    urlparams_dg3 = urlParams.get('dg3');
    urlparams_autoRead = urlParams.get('autoread');
    urlparams_verifyFp = urlParams.get('verifyfp');

    if (urlparams_pcsc != '1') {
        urlparams_pcsc = '1';
    }
}

async function getScannerDetails() {
    console_ely.logFuncName(this.getScannerDetails.name);
    var result = await serDev.clearInputStream();
    if(result == "success") {
        result = await serDev.getVer();
        resetConfig();
        if (isClReaderAvailable == 1 || isScannerAvailable == 1) {
            gui.update(guiEvents.GUI_RUN);
        }
        if((result == "success") || (result == "pre-existing")) {
            if (doAutoRead == true) {
                gui.update(guiEvents.GUI_RUN_DISABLE);
                ReactivateContinuousReadMode();
            } else {
                doContinuousReadMode(false);
                gui.update(guiEvents.GUI_RUN_ENABLE);
            }
        }
    }
}

async function doContinuousReadMode(isEnabled) {
    console_ely.logFuncName(this.doContinuousReadMode.name);
    const result = await serDev.enableContinuousReadMode(isEnabled);
    if(result == "success") {
        if(isEnabled)
            initApp();
    } else {
        if (result == "abort")
            gui.update(guiEvents.GUI_RUN_ENABLE);
        else
            console_ely.log("Error: Failed to active continuous read mode", 4);
    }
}

async function undoContinuousReadMode() {
    console_ely.logFuncName(this.undoContinuousReadMode.name);
    const result = await serDev.enableContinuousReadMode(false);
    if(result == "success") {
        console_ely.log("Successfully deactivated continuous read mode");
    } else {
        console_ely.log("Error: Failed to deactivate continuous read mode", 4);
    }
}

async function ReactivateContinuousReadMode() {
    console_ely.logFuncName(this.ReactivateContinuousReadMode.name);
    var result = await serDev.enableContinuousReadMode(false);
    if(result == "success") {
        if (doAutoRead == true)
            doContinuousReadMode(true);
    } else
        console_ely.log("Error: Failed to deactive continuous read mode", 4);
}

/* Button initialisation during page refresh or button click */
window.onload = _ => {

    getUrlParams();

    // Instantiate gui object
    gui = new Gui();
    gui.update (guiEvents.GUI_CLEAR);
    gui.initAuthControls();

    // Handle connect button
    document.querySelector("#connect").onclick = function () {
        if ($(this).attr('disabled') == 'disabled') {
            return;
        }

        initVars();

        var buttonValue = $(this).text();
        if (buttonValue == webapp_config.CONNECT) {
            console_ely = new Log();
            util = new Util();
            usbDev = new UsbDevice();
            serDev = new SerialDevice();
            websock = new WebSocketEly();
            webusb = new WebUsbEly();
            ccid = new Ccid();
            openPace = new OpenPace();
            pace = new PaceAuthentication();
            datagroup = new DataGroup();
            bioMini = new BioMini();

            util.reloadOpenPaceModule();
            // Enable StressTest
            //enableStressTest = true;

            // connect disable
            gui.update(guiEvents.GUI_CONNECT_DISABLE);

            // Check devices and initialize GUI
            usbDev.isUsbAvailable().then(() => {
                serDev.isScannerAvailable().then(() => {
                    if (awaitedForScanner == false) { getScannerDetails(); }
                     else {
                        if (isClReaderAvailable == 1 || isScannerAvailable == 1)
                            gui.update(guiEvents.GUI_RUN);
                    }
                });
            }).catch(error => {
                currentEvent = events.EVENT_FINAL;
                console_ely.log(error);
            });
        } else if (buttonValue == webapp_config.RUN) {
            initApp();
        }
    }

    gui.addEventListeners();
}
window.onunload = _ => {
    if(doAutoRead)
        undoContinuousReadMode()
};

// events for state machine
const events = {
    EVENT_PERFORM_SCARD_ESTABLISHCONTEXT: 'scardEstablishContext', // perform SCardEstablishContext
    EVENT_PERFORM_SCARD_LISTREADERS: 'scardListReaders', // perform SCardListReaders
    EVENT_PERFORM_SCARD_GETSLOTSTATUS: 'scardGetSlotStatus', // perform SCardGetSlotStatus
    EVENT_PERFORM_SCARD_CONNECT: 'scardConnect', // perform SCardConnect
    EVENT_PERFORM_SCARD_DISCONNECT: 'scardDisconnect', // perform SCardDisconnect
    EVENT_PERFORM_SCARD_RELEASECONTEXT: 'scardReleaseContext', //  perform SCardEstablishContext
    EVENT_PERFORM_SCARD_GETVERSION: 'scardReaderVersion', // perform scardreader fw version
    EVENT_GET_SLOT_STATUS: 'getSlotStatus', // get slot status
    EVENT_ICC_POWER_ON: 'iccPowerOn', // icc power-on
    EVENT_GET_ATR: 'getAtr', // get ATR
    EVENT_SELECT_AID: 'selectAid', // select aid
    EVENT_GET_CHALLENGE: 'getChallenge', // get challenge
    EVENT_SELECT_EF_CARD_ACCESS: 'selectEfCardAccess', // select ef.cardaccess
    EVENT_READ_EF_CARD_ACCESS: 'readEfCardAccess', // read ef.cardaccess
    EVENT_EXT_AUTHENTICATE: 'externalAuth', // external authenticate
    EVENT_INT_AUTHENTICATE: 'internalAuth', // internal authenticate
    EVENT_MSE_AT: 'mseAt', // MSE.AT command
    EVENT_GA_ENC_NONCE: 'generalAuthEncNonce', // encrypt nonce
    EVENT_GA_MAP_NONCE: 'generalAuthMapNonce', // map nonce
    EVENT_GA_PERFORM_KEY_AGREEMENT: 'generalAuthPerformAgreement', // perform key agreement
    EVENT_MUTUAL_AUTHENTICATION: 'mutualAuth', // mutual authenticate
    EVENT_PERFORM_PACE_CAM: 'performPaceCam', // perform PACE-CAM
    EVENT_SELECT_EF_CARD_SECURITY: 'selectEfCardSecurity', // select EF.CardSecurity
    EVENT_SELECT_EF_COM: 'selectEfCom', // select EF.COM
    EVENT_SELECT_EF_SOD: 'selectEfSod', // select EF.SOD
    EVENT_SELECT_EF_CVCA: 'selectEfCvca', // select EF.CVCA
    EVENT_SELECT_DG1: 'selectDg1', // select dg1
    EVENT_SELECT_DG2: 'selectDg2', // select dg2
    EVENT_SELECT_DG3: 'selectDg3', // select dg3
    EVENT_SELECT_DG4: 'selectDg4', // select dg4
    EVENT_SELECT_DG5: 'selectDg5', // select dg5
    EVENT_SELECT_DG6: 'selectDg6', // select dg6
    EVENT_SELECT_DG7: 'selectDg7', // select dg7
    EVENT_SELECT_DG14: 'selectDg14', // select dg14
    EVENT_SELECT_DG15: 'selectDg15', // select dg15
    EVENT_READ_EF_CARD_SECURITY: 'readEfCardSecurity', // read EF.CardSecurity
    EVENT_READ_EF_COM: 'readEfCom', // read EF.COM
    EVENT_READ_EF_SOD: 'readEfSod', // read EF.SOD
    EVENT_READ_DG1: 'readDg1', // read dg1
    EVENT_READ_DG2: 'readDg2', // read dg2
    EVENT_READ_DG3: 'readDg3', // read dg3
    EVENT_READ_DG4: 'readDg4', // read dg4
    EVENT_READ_DG5: 'readDg5', // read dg5
    EVENT_READ_DG6: 'readDg6', // read dg6
    EVENT_READ_DG7: 'readDg7', // read dg7
    EVENT_READ_DG14: 'readDg14', // read dg14
    EVENT_READ_DG15: 'readDg15', // read dg15
    EVENT_READ_EF_CVCA: 'readEfCvca', // read EF.CVCA
    EVENT_MSE_KAT: 'mseKat', // perform MSE.KAT
    EVENT_GA_CHIP_AUTHENTICATION: 'generalAuthCa', // CA General Auth
    EVENT_MSE_SET_DV: 'mseSetDv', // perform MSE.SET-DV
    EVENT_VERIFY_DV_CERTIFICATE: 'verifyDvCertificate', // TA verify DV Certificate
    EVENT_MSE_SET_IS: 'mseSetIs', // perform MSE.SET-IS
    EVENT_VERIFY_IS_CERTIFICATE: 'verifyIsCertificate', // TA verify IS Certificate
    EVENT_TA_MSE_AT: 'taMseAt', // perform TA-MSE.AT
    EVENT_TA_GET_CHALLENGE: 'taGetChallenge', // perform TA Get Challenge
    EVENT_TA_EXTERNAL_AUTHENTICATION: 'performTaExternalAuth', // perform TA External Auth
    EVENT_CLEANUP: 'cleanup', // cleanup before exit
    EVENT_FINAL: 'final' // final
}

// Configuration variables
const webapp_config = {
    ENABLED: 'enabled', // Debugging mode
    DISABLED: 'disabled', // User mode
    UNKNOWN: 'unknown', // Unknown value
    JP2: 'JP2', // JP2
    JPG: 'JPG', // JPG
    PNG: 'PNG', // PNG
    WSQ: 'WSQ', // WSQ
    RUN: 'Recuperer Info',
    CONNECT: 'Connect',
    NULL: '',
    TRUE: 'true',
    FALSE: 'false'
}

const file_type = {
    DV_CERTIFICATE: 1,
    IS_CERTIFICATE: 2
}

function webapp_const() {
    ENDPOINT_IN = 1;
    ENDPOINT_OUT = 1;
    ENDPOINT_INTERRUPT = 2; // Interrupt-IN Endpoint
    CCID_HDR_LEN = 10; // CCID header length
    MRZ = 0x01;
    CAN = 0x02;
    PIN = 0x03;
    BAC_BAP = 0x04;
    AUTO = 0;
    PACE = 2;
    AUTH_PACE = "PACE";
    AUTH_BAC = "BAC";
    AUTH_BAP = "BAP";
    AUTH_BAP_EU = "BAP_EU";
}

// Initialize variables while clicking connect button.
function initVars() {

    isLogEnabled = webapp_config.ENABLED;
    isDetailedLogEnabled = (urlparams_log === 'basic') ? webapp_config.DISABLED : webapp_config.ENABLED;
    authTypeSelected = 0; // auth type selected in GUI
    pwdTypeSelected = 0; // pwd type selecte in GUI
    readerName = null;
    currentEvent = events.EVENT_GET_ATR;
    stackEvent = [];
    isCardPresent = webapp_config.FALSE;

    secret = null; // PIN/CAN value
    isAuthStarted = 0;
    extAuthSize = 0;

    startTime = null;
    endTime = null;

    webapp_const();
}

const aidSelectionSequence = [
    [CMD_SELECT_BAP_EU, "BAP", "IDL_EU"],
    [CMD_SELECT_BAP, "BAP", "IDL"],
    [CMD_SELECT_ICAO, "ICAO", "MRTD"],
    [null, "", ""]
];

function resetConfig() {
    gui.initAuthConfig(isScannerAvailable, isClReaderAvailable);
    performAuth = (isClReaderAvailable) ? 1 : 0;
}

/*
 * UsbDevice class provides api interface to connect to reader,
 * Send request to device and Read response: from device.
 */
class UsbDevice {

    async open() {
        if (urlparams_pcsc == '1') {
            websock.open(usbDev);
            usbDev.performAuth();
        }
        else {
            webusb.open(usbDev);
        }
        resetConfig();
        if (isScannerAvailable == 1) {
            gui.update(guiEvents.GUI_RUN);
        }
    }

    async isUsbAvailable() {
        if (urlparams_pcsc == '1') {
            // TODO: Set based on WebSocket connection
            isClReaderAvailable = 1;
        } else {
            webusb.isAvailable();
        }
    }

    // Closes the device and de-initializes the objects.
    close() {
        if (urlparams_pcsc == '1') {
            // dummy
        } else {
            webusb.close();
        }
    }

    /*
     * performAuth() is invoked whenever run button is clicked.
     * It performs: eMRTD authentication, reads DGs and then displays DG infos.
     */
    performAuth() {
        if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ((urlparams_pcsc == '1') ?
            usbDev.init(events.EVENT_PERFORM_SCARD_ESTABLISHCONTEXT) :
            usbDev.init(events.EVENT_GET_SLOT_STATUS));
    }

    /*
     * This method is the triggering point to invoke the eventHandler().
     * eventHandler() sends requests to the device (webusb or websocket) based on the value of 'currentEvent'
     * Once the response data is available, either webusb.listenData() or websock.readIncomingMessage() is called by the system.
     * They simply pre-process response and invoke the responseHandler().
     * The responseHandler() checks the return status word based on the currentEvent and will push it to the next event, if needed.
     * [TODO]: the events can be moved to a state machine
     */
    init(evt) {

        console_ely.log("init event: " + evt);
        currentEvent = evt;

        secret = null; // initialize the secret value
        if (currentEvent != events.EVENT_FINAL) {
            var secretPin = document.getElementById("pinpad").value;
            console_ely.log("Secret pin entered by user: " + secretPin + ", type: " + pwdTypeSelected);
            if (secretPin || (pwdTypeSelected == MRZ)) {
                secret = secretPin;
                usbDev.eventHandler();
            } else {
                alert("Kindly confirm the secret and then click run button to perform PACE.");
                gui.update(guiEvents.GUI_CLEAR);
                gui.update(guiEvents.GUI_RUN);
                gui.update(guiEvents.GUI_RUN_ENABLE);
                currentEvent = events.EVENT_FINAL;
            }
        }
    }

    /*
     * Set the event to currentEvent
     */
    setEvent(evt) {
        currentEvent = evt;
    }

    /*
     * Push the currentEvent to stack
     */
    pushEvent() {
        console_ely.logFuncName(this.pushEvent.name);
        console.log(stackEvent);
        if (currentEvent != events.EVENT_GET_RESPONSE)
            stackEvent.push(currentEvent);
        console_ely.log("Pushed event: " + currentEvent);
    }

    /*
     * Pop the event from stack
     */
    popEvent() {
        console_ely.logFuncName(this.popEvent.name);
        console.log(stackEvent);
        let event = stackEvent.pop()
        console_ely.log("Popped event: " + event);
        if (event != null)
            setEvent(event);
    }

    /*
     * Sends the command to the device
     */
    send(cmd) {
        (urlparams_pcsc == '1') ?
            websock.send(cmd) :
            webusb.send(cmd);
    }

    async performPa() {
        this.appendDetails("Passive authentication", 2);
        const result = await datagroup.performPa();
        doPassiveAuthentication = false;
        gui.modifyStatusImage((result == "success") ? "tick.png" : "cross.png");
        this.setEvent(((doActiveAuthentication) ? events.EVENT_SELECT_DG15 :
            ((doChipAuthentication) ? events.EVENT_SELECT_DG14 : events.EVENT_SELECT_DG1)));
        this.eventHandler();
    }

    performAa() {
        if (!isAaEcdsaPending) {
            var status = datagroup.getAaEcdsaStatus();
            if (status == 0) {
                if (datagroup.doActiveAuth() < 1) { this.appendDetails("Active authentication", 4); }
                else { this.appendDetails("Active authentication", 5); }
                gui.appendStatusTextTag("RSA", "success");
            } else if (status == 1) {
                isAaEcdsaPending = true;
            } else {
                console_ely.log("Failed to get AA ECDSA Status", 4);
            }
        } else {
            if (datagroup.doActiveAuth() < 1) { this.appendDetails("Active authentication", 4); }
            else { this.appendDetails("Active authentication", 5); }
            gui.appendStatusTextTag("ECDSA", "success");
        }
    }

    async getTaCerts() {
        this.appendDetails("Terminal authentication", 2);
        const result = await datagroup.getTaCerts();
        this.taStartTime = new Date().getTime();
        if (result == "success") {
            this.setEvent (events.EVENT_SELECT_EF_CVCA);
        } else {
            gui.modifyStatusImage("cross.png");
            this.setEvent (events.EVENT_CLEANUP);
        }
        this.eventHandler();
    }

    getTimeToUpdate(time = -1) {
        if (time == -1) {
            this.endTime = new Date().getTime();
            time = this.endTime - this.startTime;
        }
        return time;
    }
    appendDetails(name, log_style, time = -1) {
        if (log_style == 4) {
            console_ely.log(name + " failed", log_style);
            var image = "cross.png";
        } else if (log_style == 5) {
            console_ely.log(name + " success", log_style);
            var image = "tick.png";
        } else {
            var image = "loading.gif"
        }
        time = this.getTimeToUpdate(time);
        if (log_style != 2) {
            console_ely.log(name + " time: " + time + " ms", log_style);
        }
        gui.appendInspectionDetails (image, name, time);
    }
    modifyStatus(image) {
        gui.modifyStatusImage(image);
        gui.modifyStatusTime(this.getTimeToUpdate());
    }

    /*
     * Test function to retrieve BioMini scanner details.
     * - Needs Xperix webagent to be running.
     * - Needs ID BOX device with fingerprint sensor.
     */
    async getBioScannerDetails() {
        console_ely.logFuncName(this.getBioScannerDetails.name);
        try {
            var result = await bioMini.initBioScanner();
            console_ely.log("Init Bio Scanner ", result);
            if (result == "success") {
                result = await bioMini.getScannerDetails();
                if (result == "success"){
                    console_ely.log("Scanner details retrieved successfully.");
                    console_ely.log("Bio scanner device info:");
                    console_ely.log("Bio scanner type:", bioScannerType);
                    console_ely.log("Bio scanner name:", bioScannerName);
                } else
                    console_ely.log("Error: Failed to retrieve scanner details, ", result);
            } else {
                console_ely.log("Error: Failed to init BioMini scanner, ", result);
                console_ely.log("Error: Failed to retrieve scanner details.");
            }
        } catch (error) {
            console_ely.log("Error: getBioScannerDetails ", error);
        }
    }

    /*
     * Display and verify fingerprint using Xperix scanner.
     * - Needs Xperix webagent to be running.
     * - Needs ID BOX device with fingerprint sensor.
     */
    async displayFp() {
        // Get FP images in a templates
        var images = datagroup.getDgImages();
        if (images.length > 0) {
            var listOfWsqData = await gui.retrieveAndDecodeFpData(images);
            // display FP image
            gui.display(gui.id.fingerprintImg, images);
            if (listOfWsqData.length > 0) {
                await gui.waitForFingerprintImageToLoad();
                if((urlparams_verifyFp == '1') && (listOfWsqData.length > 0)) {
                    alert("Click OK to verify fingerprint.");
                    var status = await gui.scanAndVerifyFingerprint(listOfWsqData);
                    (status == true) ? this.appendDetails("Fingerpint verification", 5) : this.appendDetails("Fingerpint verification", 4);
                    await gui.deinitBioMiniScanner();
                }
            }
        } else {
            console_ely.log("Fingerprint image(s) not found in DG3", 4);
            gui.update(guiEvents.GUI_FINGERPRINT_ERROR);
        }
        // stress test
        //isFinalCheckPointReached = true;

        this.setEvent(events.EVENT_CLEANUP);
        this.eventHandler();
    }

    /*
     * Analyzes the current event and sends command to the device.
     */
    eventHandler() {
        console_ely.log("Request event: " + currentEvent);
        switch (currentEvent) {
            case events.EVENT_PERFORM_SCARD_ESTABLISHCONTEXT:
                websock.scardEstablishContext();
                break;
            case events.EVENT_PERFORM_SCARD_LISTREADERS:
                websock.scardListReaders();
                break;
            case events.EVENT_PERFORM_SCARD_GETSLOTSTATUS:
                websock.scardGetSlotStatus();
                break;
            case events.EVENT_PERFORM_SCARD_CONNECT:
                websock.scardConnect();
                break;
            case events.EVENT_PERFORM_SCARD_DISCONNECT:
                websock.scardDisconnect();
                break;
            case events.EVENT_PERFORM_SCARD_GETVERSION:
                websock.scardGetFwVersion();
                break;
            case events.EVENT_PERFORM_SCARD_RELEASECONTEXT:
                websock.scardReleaseContext();
                break;
            case events.EVENT_GET_SLOT_STATUS:
                isAuthStarted = 1;
                ccid.getSlotStatus();
                break;
            case events.EVENT_ICC_POWER_ON:
                ccid.iccPowerOn();
                break;
            case events.EVENT_SELECT_AID:
                if (aid == 0) { this.startTime = new Date().getTime(); this.appendDetails("Select AID", 2); }
                const [cmd, description] = aidSelectionSequence[aid];
                this.setEvent(events.EVENT_SELECT_AID);
                datagroup.selectBinary(cmd);
                break;
            case events.EVENT_GET_CHALLENGE:
                this.startTime = new Date().getTime();
                openPace.initBac();
                datagroup.getChallenge();
                break;
            case events.EVENT_EXT_AUTHENTICATE:
                var extAuthData = openPace.getExternalAuthenticateData(extAuthSize);
                pace.externalAuthenticate(extAuthData, extAuthSize);
                break;
            case events.EVENT_INT_AUTHENTICATE:
                datagroup.performIntAuth();
                break;
            case events.EVENT_SELECT_EF_CARD_ACCESS:
                this.startTime = new Date().getTime();
                datagroup.selectBinary(CMD_SELECT_EF_CARD_ACCESS);
                break;
            case events.EVENT_READ_EF_CARD_ACCESS:
                datagroup.readEfCardAccess();
                break;
            case events.EVENT_MSE_AT:
                if (pace.mseAt() == false)
                    this.setEvent(events.EVENT_CLEANUP); // todo: We can't set state in event_handler
                break;
            case events.EVENT_MSE_KAT:
                datagroup.doMseKat()
                break;
            case events.EVENT_GA_CHIP_AUTHENTICATION:
                datagroup.doCaGeneralAuth();
                break;
            case events.EVENT_GA_ENC_NONCE:
                pace.generalAuthenticateEncNonce();
                break;
            case events.EVENT_GA_MAP_NONCE:
                pace.generalAuthenticateMapNonce();
                break;
            case events.EVENT_GA_PERFORM_KEY_AGREEMENT:
                pace.performKeyAgreement();
                break;
            case events.EVENT_MUTUAL_AUTHENTICATION:
                pace.mutualAuthenticate();
                break;
            case events.EVENT_SELECT_EF_COM:
                datagroup.selectBinary(CMD_SELECT_EF_COM);
                break;
            case events.EVENT_SELECT_EF_SOD:
                datagroup.selectBinary(CMD_SELECT_EF_SOD);
                break;
            case events.EVENT_SELECT_EF_CVCA:
                datagroup.selectEfCvca();
                break;
            case events.EVENT_SELECT_DG1:
                datagroup.selectDg(1);
                break;
            case events.EVENT_SELECT_DG2:
                datagroup.selectDg(2);
                break;
            case events.EVENT_SELECT_DG3:
                datagroup.selectDg(3);
                break;
            case events.EVENT_SELECT_DG4:
                datagroup.selectDg(4);
                break;
            case events.EVENT_SELECT_DG5:
                datagroup.selectDg(5);
                break;
            case events.EVENT_SELECT_DG6:
                datagroup.selectDg(6);
                break;
            case events.EVENT_SELECT_DG7:
                datagroup.selectDg(7);
                break;
            case events.EVENT_SELECT_DG14:
                datagroup.selectDg(14);
                break;
            case events.EVENT_SELECT_DG15:
                datagroup.selectDg(15);
                break;
            case events.EVENT_READ_EF_CARD_SECURITY:
            case events.EVENT_READ_EF_COM:
            case events.EVENT_READ_EF_SOD:
            case events.EVENT_READ_EF_CVCA:
            case events.EVENT_READ_DG1:
            case events.EVENT_READ_DG3:
            case events.EVENT_READ_DG4:
            case events.EVENT_READ_DG5:
            case events.EVENT_READ_DG6:
            case events.EVENT_READ_DG7:
            case events.EVENT_READ_DG14:
            case events.EVENT_READ_DG15:
                datagroup.readBinary();
                break;
            case events.EVENT_READ_DG2:
                if ((chainParameter > 0) && (chainParameter != 2)) { // todo: Do we need to care about these in this file ? Why don't we consider the same for other DG reading
                    var chainingCmd = new Uint8Array; // todo: What is the use of this ?
                    datagroup.sendApdu(chainingCmd);
                } else {
                    datagroup.readBinary();
                }
                break;
            case events.EVENT_MSE_SET_DV:
                datagroup.performSetMse(file_type.DV_CERTIFICATE);
                break;
            case events.EVENT_VERIFY_DV_CERTIFICATE:
                datagroup.doTaVerifyCert(file_type.DV_CERTIFICATE);
                break;
            case events.EVENT_MSE_SET_IS:
                datagroup.performSetMse(file_type.IS_CERTIFICATE);
                break;
            case events.EVENT_VERIFY_IS_CERTIFICATE:
                datagroup.doTaVerifyCert(file_type.IS_CERTIFICATE);
                break;
            case events.EVENT_TA_MSE_AT:
                datagroup.doTaMseAt();
                break;
            case events.EVENT_TA_GET_CHALLENGE:
                datagroup.getChallenge();
                break;
            case events.EVENT_TA_EXTERNAL_AUTHENTICATION:
                datagroup.taExtAuth();
                break;
            case events.EVENT_GET_RESPONSE:
                datagroup.getResponse();
                break;
            case events.EVENT_GET_ATR:
                ccid.iccPowerOn();
                break;
            case events.EVENT_CLEANUP:
                console_ely.log("Event cleanup");
                this.setEvent((urlparams_pcsc == '1') ?
                    events.EVENT_PERFORM_SCARD_DISCONNECT :
                    events.EVENT_FINAL);
                this.eventHandler();
                break;
            case events.EVENT_FINAL:
                console_ely.log("Event final");
                deInitApp();

                // stress test
                if (enableStressTest == true) {
                    if((isCaDone == false) && (isFinalCheckPointReached == true)) {
                        util.startDelayedFunction();
                        isFinalCheckPointReached = false;
                    } else {
                        clearTimeout(timerId);
                        console.log("stressTestLoopCount: " + stressTestLoopCount);
                    }
                }
                break;
            default:
                console.log("Unknown event: " + currentEvent);
        }
        return;
    }

    getEventMap(type, name, dg_num, ok_evt, ko_evt, step='default') {
        return {type: type, name: name, dg_num: dg_num, ok_evt: ok_evt, ko_evt: ko_evt, step: step};
    }

    genericResponseHandler(event, responseStatusOk) {
        switch (event) {
            case events.EVENT_SELECT_EF_CARD_SECURITY:
                evt = this.getEventMap('Select', 'EF.CardSecurity', 0, events.EVENT_READ_EF_CARD_SECURITY, events.EVENT_SELECT_AID);
                break;
            case events.EVENT_SELECT_EF_COM:
                evt = this.getEventMap('Select', 'EF.COM', 0, events.EVENT_READ_EF_COM, events.EVENT_SELECT_EF_SOD);
                break;
            case events.EVENT_SELECT_EF_SOD:
                evt = this.getEventMap('Select', 'EF.SOD', 0, events.EVENT_READ_EF_SOD,
                    ((doActiveAuthentication) ? events.EVENT_SELECT_DG15 : ((doChipAuthentication) ? events.EVENT_SELECT_DG14 : events.EVENT_SELECT_DG1)));
                break;
            case events.EVENT_SELECT_EF_CVCA:
                evt = this.getEventMap('Select', 'EF.CVCA', 0, events.EVENT_READ_EF_CVCA, events.EVENT_CLEANUP);
                break;
            case events.EVENT_SELECT_DG1:
                evt = this.getEventMap('Select', 'DG1', 0, events.EVENT_READ_DG1, events.EVENT_CLEANUP);
                break;
            case events.EVENT_SELECT_DG2:
                evt = this.getEventMap('Select', 'DG2', 0, events.EVENT_READ_DG2, events.EVENT_CLEANUP);
                break;
            case events.EVENT_SELECT_DG3:
                evt = this.getEventMap('Select', 'DG3', 0, events.EVENT_READ_DG3, events.EVENT_CLEANUP);
                break;
            case events.EVENT_SELECT_DG4:
                evt = this.getEventMap('Select', 'DG4', 0, events.EVENT_READ_DG4,
                    ((authType == AUTH_BAP) ? events.EVENT_SELECT_DG6 : events.EVENT_CLEANUP));
                break;
            case events.EVENT_SELECT_DG5:
                evt = this.getEventMap('Select', 'DG5', 0, events.EVENT_READ_DG5, events.EVENT_CLEANUP);
                break;
            case events.EVENT_SELECT_DG6:
                evt = this.getEventMap('Select', 'DG6', 0, events.EVENT_READ_DG6, events.EVENT_CLEANUP);
                break;
            case events.EVENT_SELECT_DG7:
                evt = this.getEventMap('Select', 'DG7', 0, events.EVENT_READ_DG7, events.EVENT_CLEANUP);
                break;
            case events.EVENT_SELECT_DG14:
                evt = this.getEventMap('Select', 'DG14', 0, events.EVENT_READ_DG14, events.EVENT_SELECT_DG1);
                break;
            case events.EVENT_SELECT_DG15:
                evt = this.getEventMap('Select', 'DG15', 0, events.EVENT_READ_DG15,
                    ((doChipAuthentication) ? events.EVENT_SELECT_DG14 : events.EVENT_SELECT_DG1));
                break;

            case events.EVENT_READ_EF_CARD_SECURITY:
                evt = this.getEventMap('Read', 'EF.CardSecurity', 0, events.EVENT_SELECT_AID, events.EVENT_SELECT_AID);
                break;
            case events.EVENT_READ_EF_COM:
                evt = this.getEventMap('Read', 'EF.COM', 0, events.EVENT_SELECT_EF_SOD, events.EVENT_SELECT_EF_SOD, 'hidden');
                break;
            case events.EVENT_READ_EF_SOD:
                evt = this.getEventMap('Read', 'EF.SOD', 0,
                    ((doActiveAuthentication) ? events.EVENT_SELECT_DG15 : ((doChipAuthentication) ? events.EVENT_SELECT_DG14 : events.EVENT_SELECT_DG1)),
                    ((doActiveAuthentication) ? events.EVENT_SELECT_DG15 : ((doChipAuthentication) ? events.EVENT_SELECT_DG14 : events.EVENT_SELECT_DG1)));
                break;
            case events.EVENT_READ_EF_CVCA:
                evt = this.getEventMap('Read', 'EF.CVCA', 0, events.EVENT_MSE_SET_DV, events.EVENT_CLEANUP, 'hidden');
                break;
            case events.EVENT_READ_DG1:
                evt = this.getEventMap('Read', 'DG1', 1,
                    ((authType == AUTH_BAP) ? events.EVENT_SELECT_DG4 : events.EVENT_SELECT_DG2),
                    ((authType == AUTH_BAP) ? events.EVENT_SELECT_DG4 : events.EVENT_SELECT_DG2));
                break;
            case events.EVENT_READ_DG2:
                evt = this.getEventMap('Read', 'DG2', 2, events.EVENT_CLEANUP, events.EVENT_CLEANUP);
                break;
            case events.EVENT_READ_DG3:
                evt = this.getEventMap('Read', 'DG3', 3, events.EVENT_CLEANUP, events.EVENT_CLEANUP);
                break;
            case events.EVENT_READ_DG4:
                evt = this.getEventMap('Read', 'DG4', 4, events.EVENT_CLEANUP, events.EVENT_CLEANUP);
                break;
            case events.EVENT_READ_DG5:
                evt = this.getEventMap('Read', 'DG5', 5, events.EVENT_CLEANUP, events.EVENT_CLEANUP);
                break;
            case events.EVENT_READ_DG6:
                evt = this.getEventMap('Read', 'DG6', 6, events.EVENT_CLEANUP, events.EVENT_CLEANUP);
                break;
            case events.EVENT_READ_DG7:
                evt = this.getEventMap('Read', 'DG7', 7, events.EVENT_CLEANUP, events.EVENT_CLEANUP);
                break;
            case events.EVENT_READ_DG14:
                evt = this.getEventMap('Read', 'DG14', 14, events.EVENT_CLEANUP, events.EVENT_SELECT_DG1);
                break;
            case events.EVENT_READ_DG15:
                evt = this.getEventMap('Read', 'DG15', 15,
                    ((doActiveAuthentication) ? events.EVENT_INT_AUTHENTICATE : events.EVENT_SELECT_DG1),
                    ((doChipAuthentication) ? events.EVENT_SELECT_DG14 : events.EVENT_SELECT_DG1));
                break;
            case events.EVENT_MSE_SET_DV:
                evt = this.getEventMap('MSE Set', 'DV', 0, events.EVENT_VERIFY_DV_CERTIFICATE, events.EVENT_CLEANUP, 'hidden');
                break;
            case events.EVENT_VERIFY_DV_CERTIFICATE:
                evt = this.getEventMap('Verify', 'DV', 0, events.EVENT_MSE_SET_IS, events.EVENT_CLEANUP, 'intermediate');
                break;
            case events.EVENT_MSE_SET_IS:
                evt = this.getEventMap('MSE Set', 'IS', 0, events.EVENT_VERIFY_IS_CERTIFICATE, events.EVENT_CLEANUP, 'hidden');
                break;
            case events.EVENT_VERIFY_IS_CERTIFICATE:
                evt = this.getEventMap('Verify', 'IS', 0, events.EVENT_TA_MSE_AT, events.EVENT_CLEANUP, 'intermediate');
                break;
            case events.EVENT_TA_MSE_AT:
                evt = this.getEventMap('TA', 'MSE.AT', 0, events.EVENT_TA_GET_CHALLENGE, events.EVENT_CLEANUP, 'intermediate');
                break;
            case events.EVENT_TA_GET_CHALLENGE:
                evt = this.getEventMap('TA', 'Get signed data', 0, events.EVENT_TA_EXTERNAL_AUTHENTICATION, events.EVENT_CLEANUP, 'hidden');
                break;
        }
        if (evt.type == 'Select') {
            if (responseStatusOk) {
                console_ely.log(evt.type + " " + evt.name + " success", 5);
                if ((evt.ok_evt == events.EVENT_READ_DG2) || (evt.ok_evt == events.EVENT_READ_DG4) || (evt.ok_evt == events.EVENT_READ_DG6)) {
                    gui.update(guiEvents.GUI_PORTRAIT_LOAD);
                }
                else if ((evt.ok_evt == events.EVENT_READ_DG5) || (evt.ok_evt == events.EVENT_READ_DG7)) {
                    gui.update(guiEvents.GUI_SIGNATURE_LOAD);
                }
                else if (evt.ok_evt == events.EVENT_READ_DG3) {
                    gui.update(guiEvents.GUI_FINGERPRINT_LOAD);
                }
                this.setEvent(evt.ok_evt);
                this.startTime = new Date().getTime();
            } else {
                if (event != events.EVENT_SELECT_EF_COM) {
                    if (event != events.EVENT_SELECT_EF_SOD && !doPassiveAuthentication)
                        this.appendDetails((evt.type + " " + evt.name), 4);
                }
                if (event == events.EVENT_SELECT_EF_CARD_SECURITY && pace.isPaceCamPending) {
                    console_ely.log("WARNING: PACE-CAM verification failed. Proceeding to read DGs\n");
                }
                if (authType != AUTH_BAP) {
                    if (isCaDone && doTerminalAuthentication) { this.getTaCerts(); return "pending"; }
                    else if (urlparams_dg3 == '1') { evt.ok_evt = events.EVENT_SELECT_DG3; }
                }
                if (event == events.EVENT_SELECT_DG3) {
                    gui.update(guiEvents.GUI_FINGERPRINT_ERROR);
                }
                this.setEvent(evt.ko_evt);
            }
        }
        else {
            if (responseStatusOk) {
                if ((evt.type != 'Read') || datagroup.isReadComplete()) {
                    if (evt.step == 'intermediate') {
                        gui.appendStatusTextTag(evt.type + " " + evt.name + " OK", 'success');
                    } else if (evt.step != 'hidden') {
                        this.appendDetails((evt.type + " " + evt.name), 5);
                        if ((evt.type == 'Read') && datagroup.isReadComplete()) {
                            gui.appendStatusTextTag(totalSize + " Bytes", 'success');
                            if (totalSize > 1024) {
                                var time = (this.endTime - this.startTime);
                                gui.appendStatusTextTag(((totalSize * 8) / time).toFixed(2) + " kbps", 'success');
                            }
                        }
                    }

                    if (doPassiveAuthentication == true) {
                        if (event == events.EVENT_READ_EF_SOD) { this.performPa(); return "pending"; }
                        if (evt.dg_num > 0) { datagroup.verifyHash(evt.dg_num); }
                    }

                    if (event == events.EVENT_READ_EF_CARD_SECURITY) {
                        if (pace.isPaceCamPending) { pace.doPaceCam(decryptDataBuffer); }
                    }
                    else if (event == events.EVENT_READ_DG1) {
                        if (authType == AUTH_BAP) {
                            gui.display(gui.id.dg1Idl, decryptDataBuffer, docType);
                        } else {
                            gui.display(gui.id.dg1Mrz, datagroup.getDg1Mrz(), null);
                        }
                    }
                    else if ((event == events.EVENT_READ_DG2) || (event == events.EVENT_READ_DG4) || (event == events.EVENT_READ_DG6)) {
                        var images;
                        gui.display(gui.id.portraitImg, images = datagroup.getDgImage());
                        // stress test
                        //isFinalCheckPointReached = true;
                        if ((event == events.EVENT_READ_DG4) && (images && images[0].type == webapp_config.UNKNOWN) && (authType == AUTH_BAP)) {
                            evt.ok_evt = events.EVENT_SELECT_DG6;
                        }
                        else if (urlparams_signature == '1') {
                            evt.ok_evt = ((authType == AUTH_BAP) ? events.EVENT_SELECT_DG5 : events.EVENT_SELECT_DG7);
                        }
                        else if (isCaDone && doTerminalAuthentication) { this.getTaCerts(); return "pending"; }
                        else if (urlparams_dg3 == '1') { evt.ok_evt = events.EVENT_SELECT_DG3; }
                    }
                    else if (event == events.EVENT_READ_DG3) {
                        this.displayFp();
                        return "pending";
                    }
                    else if ((event == events.EVENT_READ_DG5) || (event == events.EVENT_READ_DG7)) {
                        gui.display(gui.id.signatureImg, datagroup.getDgImage());
                        if (isCaDone && doTerminalAuthentication) { this.getTaCerts(); return "pending"; }
                        else if (urlparams_dg3 == '1') { evt.ok_evt = events.EVENT_SELECT_DG3; }
                    }
                    else if (event == events.EVENT_READ_DG14) {
                        datagroup.getDg14Data();
                        if (isAaEcdsaPending == true) {
                            this.performAa();
                        }
                        if (doChipAuthentication == true) {
                            var pubKeyLen = datagroup.performCa();
                            if (pubKeyLen > 0) {
                                var CaAlgorithmId = openPace.getCaAlgorithmId();
                                console.log("CA algorithm-id: ", CaAlgorithmId);
                                if (CaAlgorithmId == 0) { evt.ok_evt = events.EVENT_MSE_KAT; }
                                else { doCaMseAt = true; evt.ok_evt = events.EVENT_MSE_AT; }
                            } else {
                                this.appendDetails("Chip authentication", 4);
                                this.setEvent(evt.ko_evt);
                                return "done";
                            }
                        }
                    }
                    else if (event == events.EVENT_READ_DG15) {
                        datagroup.getDg15Data();
                    }
                    else if (event == events.EVENT_TA_GET_CHALLENGE) {
                        datagroup.getTaSignedData();
                    }
                    this.setEvent(evt.ok_evt);
                }
            }
            else {
                if ((evt.step == 'intermediate') || (evt.step == 'hidden')) {
                    gui.appendStatusTextTag(evt.type + " " + evt.name + " KO", 'fail');
                    gui.modifyStatusImage("cross.png");
                } else if (evt.step != 'hidden') {
                    this.appendDetails((evt.type + " " + evt.name), 4);
                } else if (event == events.EVENT_READ_DG3) {
                    gui.update(guiEvents.GUI_FINGERPRINT_ERROR);
                }
                this.setEvent(evt.ko_evt);
            }
        }

        if (!responseStatusOk) {
            if (doPassiveAuthentication == true && (event == events.EVENT_SELECT_EF_SOD || event == events.EVENT_READ_EF_SOD)) {
                this.appendDetails("Passive authentication", 4);
                doPassiveAuthentication = false;
            }
            if (doActiveAuthentication == true && (event == events.EVENT_SELECT_DG15 || event == events.EVENT_READ_DG15)) {
                this.appendDetails("Active authentication", 4);
                doActiveAuthentication = false;
            }
            if (doChipAuthentication == true && (event == events.EVENT_SELECT_DG14 || event == events.EVENT_READ_DG14)) {
                this.appendDetails("Chip authentication", 4);
                doChipAuthentication = false;
            }
        }

        return "done";
    }

    /*
     * responsehandler() parses the response to complete emrtd authentication and reads DG data.
     */
    responseHandler(u8Data, length) {
        console_ely.log("Response event: " + currentEvent);
        var responseStatusOk = datagroup.preProcessResponse(u8Data, length)
        switch (currentEvent) {
            case events.EVENT_GET_SLOT_STATUS:
                ccid.parseGetSlotStatusResponse(u8Data, length);
                break;
            case events.EVENT_ICC_POWER_ON:
                ccid.parseAtrResponse(u8Data);
                this.setEvent((authTypeSelected == BAC_BAP) ?
                    events.EVENT_SELECT_AID :
                    events.EVENT_SELECT_EF_CARD_ACCESS);
                break;
            case events.EVENT_SELECT_AID:
                this.endTime = new Date().getTime();
                if (responseStatusOk) {
                    authType = aidSelectionSequence[aid][1];
                    docType = aidSelectionSequence[aid][2];
                    gui.appendStatusTextTag(docType, 'success');
                    gui.modifyStatusImage('tick.png');
                    this.setEvent((isSmActive == true) ? events.EVENT_SELECT_EF_COM : events.EVENT_GET_CHALLENGE);
                } else {
                    aid++;
                    const [cmd, description] = aidSelectionSequence[aid];
                    if (cmd == null) {
                        console_ely.log("ERROR: Card does not support PACE, BAP or BAC", 4);
                        gui.appendStatusTextTag('Unknown', 'fail');
                        gui.modifyStatusImage('cross.png');
                        this.setEvent(events.EVENT_CLEANUP);
                    } else {
                        this.setEvent(events.EVENT_SELECT_AID);
                    }
                }
                gui.modifyStatusTime(this.endTime - this.startTime);
                break;
            case events.EVENT_GET_CHALLENGE:
                if (responseStatusOk) {
                    var i = 0;
                    var position = ((urlparams_pcsc == '1') ? 0 : CCID_HDR_LEN);
                    var size = length - (position + 2); // 2 for status word
                    var challenge = new Uint8Array(size);
                    util.memcpy(challenge, u8Data, size, 0, position);
                    secret = sessionStorage.getItem('mrz');
                    console_ely.log("challenge: " + util.toHexString(challenge) + "\nMRZ: " + util.toHexString(secret) + "\nauthType: " + authType);
                    extAuthSize = openPace.getChallenge(challenge, size, util.strToByteArray(secret), secret.length, authType); // todo: prepare for ext auth
                    this.setEvent(events.EVENT_EXT_AUTHENTICATE);
                } else {
                    this.setEvent(events.EVENT_CLEANUP);
                }
                break;
            case events.EVENT_EXT_AUTHENTICATE:
                if (responseStatusOk) {
                    isSmActive = true; // Mark start of secure messaging
                    var position = ((urlparams_pcsc == '1') ? 0 : CCID_HDR_LEN);
                    i = 0, size = length - (position + 2); // 2 for status word
                    var authData = new Uint8Array(size);
                    util.memcpy(authData, u8Data, size, 0, position);
                    openPace.decryptCryptogram(authData, size);
                    this.appendDetails(((authType == AUTH_BAP) ? "BAP" : "BAC"), 5);
                    this.setEvent(events.EVENT_SELECT_EF_SOD);
                } else {
                    this.appendDetails("BAP/BAC", 4);
                    this.setEvent(events.EVENT_CLEANUP);
                }
                break;
            case events.EVENT_INT_AUTHENTICATE:
                if (responseStatusOk) {
                    datagroup.getAaSignedData();
                    this.performAa();
                    this.setEvent((isAaEcdsaPending || doChipAuthentication) ? events.EVENT_SELECT_DG14 : events.EVENT_SELECT_DG1);
                } else {
                    this.appendDetails("Active authentication", 4);
                    this.setEvent((doChipAuthentication) ? events.EVENT_SELECT_DG14 : events.EVENT_SELECT_DG1);
                }
                break;
            case events.EVENT_SELECT_EF_CARD_ACCESS:
                if (responseStatusOk) {
                    this.setEvent((authTypeSelected == BAC_BAP) ?
                        events.EVENT_SELECT_AID :
                        events.EVENT_READ_EF_CARD_ACCESS);
                } else {
                    authType = BAC_BAP;
                    this.setEvent(events.EVENT_SELECT_AID);
                }
                break;
            case events.EVENT_READ_EF_CARD_ACCESS:
                if (responseStatusOk) {
                    console_ely.log("Read EF.CardAccess success", 5);
                    if (pace.parseEfCardAccess(u8Data, length) == true) {
                        this.appendDetails("PACE", 2);
                        this.setEvent(events.EVENT_MSE_AT);
                    } else {
                        this.setEvent(events.EVENT_CLEANUP);
                    }
                } else {
                    console_ely.log("Read EF.CardAccess failed", 4);
                    this.setEvent(events.EVENT_CLEANUP);
                }
                break;
            case events.EVENT_MSE_AT:
                this.setEvent((doCaMseAt != true) ? events.EVENT_GA_ENC_NONCE : events.EVENT_GA_CHIP_AUTHENTICATION);
                break;
            case events.EVENT_MSE_KAT:
            case events.EVENT_GA_CHIP_AUTHENTICATION:
                if (responseStatusOk) {
                    if(openPace.setCaSsc() == 1) {
                        this.appendDetails("Chip authentication", 5);
                        isCaDone = true;
                    }
                } else {
                    this.appendDetails("Chip authentication", 4);
                }
                gui.appendStatusTextTag ((doCaMseAt) ? "MSE AT" : "MSE KAT", "success")
                this.setEvent(events.EVENT_SELECT_DG1);
                break;
            case events.EVENT_GA_ENC_NONCE:
                if (pace.performGaEncryptNonce(u8Data, length) == true)
                    this.setEvent(events.EVENT_GA_MAP_NONCE);
                else {
                    this.modifyStatus("cross.png");
                    this.setEvent(events.EVENT_CLEANUP);
                }
                break;
            case events.EVENT_GA_MAP_NONCE:
                if (pace.performGaMapNonce(u8Data, length) == true) {
                    this.setEvent(events.EVENT_GA_PERFORM_KEY_AGREEMENT);
                } else {
                    this.modifyStatus("cross.png");
                    this.setEvent(events.EVENT_CLEANUP);
                }
                break;
            case events.EVENT_GA_PERFORM_KEY_AGREEMENT:
                if (pace.performGaKeyAgreement(u8Data, length) == true) {
                    this.setEvent(events.EVENT_MUTUAL_AUTHENTICATION);
                } else {
                    this.modifyStatus("cross.png");
                    this.setEvent(events.EVENT_CLEANUP);
                }
                break;
            case events.EVENT_MUTUAL_AUTHENTICATION:
                if (responseStatusOk) {
                    isSmActive = true; // Mark start of secure messaging
                    this.modifyStatus("tick.png");
                    pace.parseMutualAuthenticate(u8Data, length);
                    if (pace.isPaceCamPending) {
                        console_ely.log("PACE-CAM marked pending", 5);
                        this.setEvent(events.EVENT_SELECT_EF_CARD_SECURITY);
                        datagroup.selectBinary(CMD_SELECT_EF_CARD_SECURITY);
                    }
                    else {
                        this.setEvent(events.EVENT_SELECT_AID);
                    }
                } else {
                    this.modifyStatus("cross.png");
                    this.setEvent(events.EVENT_CLEANUP);
                }
                break;
            case events.EVENT_SELECT_EF_CARD_SECURITY:
            case events.EVENT_READ_EF_CARD_SECURITY:
            case events.EVENT_SELECT_EF_COM:
            case events.EVENT_READ_EF_COM:
            case events.EVENT_SELECT_EF_SOD:
            case events.EVENT_READ_EF_SOD:
            case events.EVENT_SELECT_DG1:
            case events.EVENT_READ_DG1:
            case events.EVENT_SELECT_DG2:
            case events.EVENT_READ_DG2:
            case events.EVENT_SELECT_DG3:
            case events.EVENT_READ_DG3:
            case events.EVENT_SELECT_DG4:
            case events.EVENT_READ_DG4:
            case events.EVENT_SELECT_DG5:
            case events.EVENT_READ_DG5:
            case events.EVENT_SELECT_DG6:
            case events.EVENT_READ_DG6:
            case events.EVENT_SELECT_DG7:
            case events.EVENT_READ_DG7:
            case events.EVENT_SELECT_DG14:
            case events.EVENT_READ_DG14:
            case events.EVENT_SELECT_DG15:
            case events.EVENT_READ_DG15:
            case events.EVENT_SELECT_EF_CVCA:
            case events.EVENT_READ_EF_CVCA:
            case events.EVENT_MSE_SET_DV:
            case events.EVENT_VERIFY_DV_CERTIFICATE:
            case events.EVENT_MSE_SET_IS:
            case events.EVENT_VERIFY_IS_CERTIFICATE:
            case events.EVENT_TA_MSE_AT:
            case events.EVENT_TA_GET_CHALLENGE:
                if ("pending" == this.genericResponseHandler(currentEvent, responseStatusOk)) {
                    return;
                }
                break;
            case events.EVENT_TA_EXTERNAL_AUTHENTICATION:
                this.taEndTime = new Date().getTime();
                if (responseStatusOk) {
                    gui.modifyStatusImage("tick.png");
                    this.setEvent(events.EVENT_SELECT_DG3);
                } else {
                    taFailCount--;
                    if (taFailCount < 1) {
                        gui.modifyStatusImage("cross.png");
                        this.setEvent(events.EVENT_CLEANUP);
                    } else {
                        console_ely.log("Retrying TA", 4);
                        this.setEvent(events.EVENT_MSE_SET_DV);
                    }
                }
                gui.modifyStatusTime(this.taEndTime - this.taStartTime);
                break;
            case events.EVENT_GET_RESPONSE:
                datagroup.storeDataIfAny();
                break;
            case events.EVENT_GET_ATR:
                ccid.parseAtrResponse(u8Data);
                this.setEvent((authTypeSelected == BAC_BAP) ?
                    events.EVENT_SELECT_AID :
                    events.EVENT_SELECT_EF_CARD_ACCESS);
                break;
            default:
                this.setEvent(events.EVENT_FINAL);
        }
        this.eventHandler();
    }
}
