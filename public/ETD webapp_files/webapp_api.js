let AppletType = {
    ICAO: { name: "ICAO", AID: 2 },
    IDL_EU: { name: "IDL EU", AID: 0 },
    IDL: { name: "IDL", AID: 1 },
};

let AuthType = {
    PACE: "PACE",
    BAC: "BAC",
    BAP: "BAP",
    BAP_EU: "BAP EU"
};

class EmrtdApi {
    webEvents = new WebappEvents();
    device = this.webEvents.device;

    accessType;
    isMrzScannerAvailable = false;
    isClReaderAvailable = false;
    #isPaceSupported = false;
    #dg14Data = null;
    #verifyHash = false;

    #appletType;
    /**
     * Resets the response object by clearing all its properties to their initial state.
     */
    resetResponse() {
        return {
            status: "",
            debug: [],
            data: {}
        };
    }

    /**
     * Initializes the scanner by checking if a scanner is present.
     * 
     * @returns {Promise<object>} - A promise that resolves to the response object containing the scanner's status.
     * If the scanner check fails, the response object will contain an error message.
     */
    async initMrzScanner() {
        console_ely.log(this.initMrzScanner.name);
        let response = this.resetResponse();

        return this.device.isMrzScannerAvailable().then(result => {
            response.status = result;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    /**
     * Retrieves the scanner version, if available, and updates the response object accordingly.
     *
     * @returns {Promise<object>} - A promise that resolves to the response object containing the scanner version's status and data.
     * The response status will be "failed" if the scanner is not available, "pre-existing" if no update is needed, or the actual version status if retrieved successfully.
     */
    async getMrzScannerVersion() {
        console_ely.log(this.getMrzScannerVersion.name);
        let response = this.resetResponse();

        const result = await this.device.clearScannerInputStream();
        if (result == "success") {
            return this.device.getMrzScannerVersion().then((result) => {
                response.status = result.status;
                response.data = result.data;
                response.debug = this.device.getMrzScannerDebugData();
                return response;
            }).catch(error => {
                response.status = "failed";
                response.error = error;
                return response;
            });
        }
    }

    async getMrzScannerDetails(refresh) {
        console_ely.log(this.getMrzScannerDetails.name);
        let result = this.resetResponse();

        if (refresh || !this.isMrzScannerAvailable) {
            result = await webApi.initMrzScanner();
            if (result.status != "success") {
                console.log("Error: Failed to init MRZ scanner");
                return result;
            }
        }
        this.isMrzScannerAvailable = false;
        result = await this.getMrzScannerVersion();
        if (result.status == "success") {
            this.isMrzScannerAvailable = true;
            result.data = ({version: result.data, mode: this.device.getMrzScannerMode()});
            if (this.device.getMrzScannerMode() == "HID")
                await this.deactivateAutoReadMode();
        }
        console.log(result);
        return result;
    }

    /**
     * Reads MRZ data from the scanner and processes it.
     *
     * @returns {Promise<object>} - A promise that resolves to the response object containing the status and processed MRZ data.
     * If the MRZ data retrieval fails, the response object will contain an error message with a "failed" status.
     */
    async readMrz() {
        console_ely.log(this.readMrz.name);
        let response = this.resetResponse();

        return this.device.getMrzData().then((result) => {
            response.status = result.status;
            response.data = result.data;
            response.debug = this.device.getMrzScannerDebugData();
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    /**
     * Initialize smartcard reader parameters
     */
    async initScard() {
        console.log(this.initScard.name);
        let response = this.resetResponse();

        return this.webEvents.start(mainEvents.INIT_SCARD_READER).then((result) => {
            response.status = result.status;
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    /**
     * Get the list of readers connected
     */
    async getReaderList() {
        console.log(this.getReaderList.name);
        let response = this.resetResponse();

        return this.webEvents.start(mainEvents.GET_READER_LIST).then((result) => {
            response.status = result.status;
            response.data = this.webEvents.scardResponse.data;
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    /**
     * Get smartcard reader version
     */
    async getScardVersion() {
        console.log(this.getScardVersion.name);
        let response = this.resetResponse();

        return this.webEvents.start(mainEvents.GET_SCARD_VERSION).then((result) => {
            response.status = result.status;
            response.data = this.webEvents.scardResponse.data;
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    async getScardReaderDetails(refresh) {
        console_ely.logFuncName(this.getScardReaderDetails.name);
        let result = this.resetResponse();

        if (refresh || !this.isClReaderAvailable) {
            result = await this.initScard();
            if (result.status != "success") {
                console.log("Error: Failed to init Scard reader");
                return result;
            }
        }

        let readerName = null;
        let readerVersion = null;
        this.isClReaderAvailable = false;
        result = await this.getReaderList();
        if (result.status == "success") {
            result = await this.selectElyctisReader(result.data);
            console.log("result: ", result);
            if (result.status == "success") {
                this.isClReaderAvailable = true;
                readerName = result.data;
                result = await this.isCardPresent();
                console.log("result: ", result);
                if (result.status == "success") {
                    if (result.data?.endsWith("present")) {
                        result = await this.getScardVersion();
                        if (result.status == "success") {
                            readerVersion = result.data;
                        }
                    }
                }
            }
        }
        result.data = {
            name: readerName,
            version: readerVersion
        }
        return result;
    }

    /**
     * Connect to the Smartcard
     */
    async scardConnect() {
        console.log(this.scardConnect.name);
        let response = this.resetResponse();

        return this.webEvents.start(mainEvents.CARD_CONNECT).then((result) => {
            response.status = result.status;
            response.data = this.webEvents.scardResponse.data;
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    /**
     * Disconnect from the Smartcard
     */
    async scardDisconnect() {
        console.log(this.scardDisconnect.name);
        let response = this.resetResponse();

        return this.webEvents.start(mainEvents.CARD_DISCONNECT).then((result) => {
            response.status = result.status;
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    /**
     * Connect to the Smartcard
     */
    async scardConnectWithReset() {
        result = await this.scardConnect();
        do {
            if (result.status != "success") {
                break;
            }
            result = await this.scardDisconnect();
            if (result.status != "success") {
                break;
            }
            result = await this.scardConnect();
            if (result.status != "success") {
                break;
            }

        } while (false);

        return result;
    }

    /**
     * Get the current smartcard presence status
     */
    async isCardPresent() {
        console.log(this.isCardPresent.name);
        let response = this.resetResponse();

        return this.webEvents.start(mainEvents.IS_CARD_PRESENT).then((result) => {
            console_ely.log(`result.status: ${result.status}`);
            response.status = result.status;
            response.data = this.webEvents.scardResponse.data;
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    /**
     * Wait for smartcard arrival
     */
    async waitForCardArrival() {
        console.log(this.waitForCardArrival.name);
        let response = this.resetResponse();
        let retryCount = 0;

        do {
            const result = await this.isCardPresent();
            if (result.data === "Card present") {
                response.status = result.status;
                return response;
            }
            retryCount++;

            // Check if retry count exceeds 2
            if (retryCount >= 2) {
                response.status = "failed";
                return response;
            }

            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for 1 seconds before checking again

        } while (true);
    }

    /**
     * Deinit the smartcard parameters for cleanup
     * (NOTE: this is not required as the EVENT_CLEANUP done will disconnect & release the scard context)
     */
    async deinitScard() {
        console.log(this.deinitScard.name);
        let response = this.resetResponse();
        return this.webEvents.start(mainEvents.EVENT_CLEANUP).then((result) => {
            response.status = result.status;
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    init() {
        console.log(this.init.name);
        return this.webEvents.init();
    }

    ConfigureDetailedLogging(value) {
        value = (value === true) ? 1 : 0;
        return this.webEvents.ConfigureDetailedLogging(value);
    }

    /*
     * Establish Access Control (PACE / BAC / BAP)
     */
    async establishAccessControl(pwdType, pwd) {
        console.log(this.establishAccessControl.name);
        this.webEvents.authType = ACCESS_TYPE.AUTO;
        let result = await this.isCardSupportPace();
        this.#isPaceSupported = (result.status == "success");
        if (result.status == "success")
            return await this.establishPACE(pwdType, pwd);

        return this.establishBAC(pwd);
    }

    /*
     * Establish BAC / BAP
     */
    async establishBAC(pwd) {
        console.log(this.establishBAC.name);
        let response = this.resetResponse();

        this.webEvents.authType = ACCESS_TYPE.BAC_BAP;
        let result = await this.identifyAppletType();
        this.#appletType = result.data;
        let debugStatus = result.debug;
        this.webEvents.setAppletType(this.#appletType);
        this.accessType = this.identifyAccessType(this.#appletType);
        this.webEvents.setPwd(pwd);
        return this.webEvents.start(mainEvents.EVENT_PERFORM_BAC_AUTHENTICATION).then((result) => {
            response.status = (responseStatusOk == true) ? "success" : "failed";
            response.debug = debugStatus.concat(this.webEvents.debug);
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    /*
     * Establish PACE
     */
    async establishPACE(pwdType, pwd) {
        try {
            console.log(this.establishPACE.name);
            let response = this.resetResponse();
            let debugStatus;

            if (this.#isPaceSupported == false) {
                response = await this.isCardSupportPace();
                if (response.status != "success")
                    return response;
                else
                    this.#isPaceSupported = true;
            }
            this.webEvents.authType = ACCESS_TYPE.PACE;


            response = this.resetResponse();
            this.webEvents.setPwd(pwd);
            this.webEvents.setPwdType(pwdType);
            let result = await this.webEvents.start(mainEvents.EVENT_PERFORM_PACE_AUTHENTICATION);
            response.status = ((result.status == 'success') && (this.webEvents.getLastStatusWord() == 0x90_00)) ?
                result.status : 'failed';
            debugStatus = this.webEvents.debug;

            // Check if PACE-CAM is pending
            if (this.webEvents.isPaceCam()) {
                result = await this.performPaceCam();
                debugStatus = debugStatus.concat(result.debug);
            }

            if (response.status == "success") {
                result = await this.identifyAppletType();
                this.#appletType = result.data;
                response.debug = debugStatus.concat(result.debug);
                this.accessType = this.identifyAccessType(this.#appletType);
                this.webEvents.setAppletType(this.#appletType);
            } else {
                response.debug = this.webEvents.debug;
            }

            return response;
        } catch (error) {
            return {
                status: "failed",
                error
            };
        }
    }

    /*
     * Perform PACE-CAM
     */
    async performPaceCam() {
        console.log(this.performPaceCam.name);
        let tStart = new Date().getTime();
        let res = await this.readEfCardSecurity();
        if (res.status == "success") {
            res.status = this.webEvents.doPaceCam(res.data) == 1 ? "OK" : "KO";
        }
        let tEnd = new Date().getTime();
        res.debug?.push({
            stage: 'PACE CAM',
            command: '',
            response: '',
            tTaken: (tEnd - tStart),
            status: res.status
        });
        return res;
    }

    /*
     * Read EF.ATR
     */
    readEfAtr() {
        console.log(this.readEfAtr.name);
        let response = this.resetResponse();

        return this.webEvents.start(mainEvents.EVENT_GET_EF_ATR).then((result) => {
            if (responseStatusOk == true) {
                response.status = "success";
                response.data = efAtrData;
            } else
                response.status = "failed";

            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    /*
     * Read EF.CardAccess
     */
    readEfCardAccess() {
        console.log(this.readEfCardAccess.name);
        let response = this.resetResponse();

        return this.webEvents.start(mainEvents.EVENT_GET_EF_CARD_ACCESS).then((result) => {
            response.status = result.status;
            response.data = pace.efCardAccessData;
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            response.debug = this.webEvents.debug;
            return response;
        });
    }

    /*
     * Read EF.CardSecurity
     */
    readEfCardSecurity() {
        console.log(this.readEfCardSecurity.name);
        let response = this.resetResponse();

        return this.webEvents.start(mainEvents.EVENT_GET_EF_CARD_SECURITY).then((result) => {
            response.status = result.status;
            response.data = this.webEvents.getEfCardSecurity();
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    /*
     * Read EF.COM
     */
    readEfCom() {
        console.log(this.readEfCom.name);
        let response = this.resetResponse();

        return this.webEvents.start(mainEvents.EVENT_GET_EF_COM).then((result) => {
            response.status = result.status;
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    /*
     * Read EF.SOD
     */
    readEfSod() {
        console.log(this.readEfSod.name);
        let response = this.resetResponse();

        return this.webEvents.start(mainEvents.EVENT_GET_EF_SOD).then((result) => {
            response.status = result.status;
            response.data = (TEST_EF_SOD_DATA) ? testEfSodData
                                               :  this.webEvents.getLastResponseData();
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    /*
     * Read DGx
     */
    async readDG(dgNum) {
        evt = this.webEvents.getApiForReadDg(dgNum)
        console.log(evt);
        let response = this.resetResponse();
        try {
            let status;
            let result = await this.webEvents.start(evt);
            response.status = result.status;
            if (result.status == "success") {
                response.data = this.webEvents.getLastResponseData();
                response.debug = this.webEvents.debug;
                if (this.#verifyHash && (dgNum > 0)) {
                    status = (0 == this.webEvents.verifyHash(dgNum)) ? "hash OK" : "hash KO";
                    if (status == "hash OK")
                        console.log(`DG${dgNum.toString(10)} hash verified`);
                    else {
                        console.warn(`DG${dgNum.toString(10)} hash verification failed`);
                        response.status = "warning";
                    }
                } else if (!this.#verifyHash && (dgNum > 0)) {
                    status = "hash unverified"
                    response.status = "warning";
                }
                response.debug.push({
                    stage: "hash-info",
                    status: status
                });
            }
        } catch (error) {
            response.status = "failed";
            response.error = error;
        }
        return response;
    }

    /*
     * Read DG1
     */
    async readDG1() {
        return this.readDG(1);
    }

    /*
     * Read DG2
     */
    async readDG2() {
        return this.readDG(2);
    }

    /*
     * Read DG3
     */
    async readDG3() {
        return this.readDG(3);
    }

    /*
     * Read DG4
     */
    async readDG4() {
        return this.readDG(4);
    }

    /*
     * Read DG6
     */
    async readDG6() {
        return this.readDG(6);
    }

    /*
    * Read DG7
    */
    async readDG7() {
        return this.readDG(7);
    }

    /*
     * Read DG11
     */
    async readDG11() {
        return this.readDG(11);
    }

    /*
     * Read DG12
     */
    async readDG12() {
        return this.readDG(12);
    }

    /*
     * Read DG13
     */
    async readDG13() {
        return this.readDG(13);
    }

    /*
     * Read DG14
     */
    async readDG14() {
        return this.readDG(14);
    }

    /*
     * Read DG15
     *
     */
    async readDG15() {
        return this.readDG(15);
    }

    /*
     * Get portrait image as bitmap
     */
    getPhoto(data) {
        console.log(this.getPhoto.name);
        let response = this.resetResponse();

        try {
            const image = this.webEvents.getImageDetails(data);
            response.data = {};
            response.data.imageData = image.data;
            response.data.imageType = image.type;
            response.debug = this.webEvents.debug;
            return response;
        } catch (error) {
            response.status = "failed";
            response.error = error;
            return response;
        }
    }

    /*
     * Perform Passive Authentication
     */
    async passiveAuthentication(cscaCertData, dsCertData = null) {
        console.log(this.passiveAuthentication.name);
        let response = this.resetResponse();

        result = await this.readEfSod();
        console.log("result: ", result);
        if (result.status == "success") {
            var efSodData = this.webEvents.unwrapTlv([0x77], result.data, result.data.length);
            this.#verifyHash = true;
        } else {
            response.status = "failed";
            response.error = "Failed to get EF.SOD";
            return Promise.resolve(response);
        }

        result = this.webEvents.doPassiveAuthentication(efSodData, cscaCertData, dsCertData);
        response.status = (result == 1) ? "success" : "failed";
        let newEntry = { stage: "Perform Passive Authentication-hidden", command: "doPassiveAuthentication", response: response.status, status: (result == 1) ? "OK" : "KO" };
        this.webEvents.debug.push(newEntry);
        response.debug = this.webEvents.debug;
        return Promise.resolve(response);
    }

    /*
     * Perform Active Authentication
     */
    async activeAuthentication() {
        console.log(this.activeAuthentication.name);
        let response = this.resetResponse();
        let publicKeyData = null;
        let result = this.resetResponse();
        let error;

        if (this.#appletType != AppletType.ICAO.name) {
            // read DG13 data
            result = await this.readDG13();
            if (result.status != "failed") {
                publicKeyData = this.webEvents.unwrapTlv([0x6F], result.data, result.data.length);
            } else { error = "Failed to get DG13"; }
        } else {
            // read DG15 data
            result = await this.readDG15();
            if (result.status != "failed") {
                publicKeyData = this.webEvents.unwrapTlv([0x6F], result.data, result.data.length);
            } else { error = "Failed to get DG15"; }
        }

        if (publicKeyData == null) {
            response.status = "failed";
            response.error = error;
            response.debug = this.webEvents.debug;
            return Promise.resolve(response);
        }

        let dgDebug = this.webEvents.debug;
        let aaKeyTypeResult = await this.webEvents.getAaKeyType(publicKeyData);
        dgDebug = dgDebug.concat(aaKeyTypeResult.debug);
        let aaKeyType = aaKeyTypeResult.status;
        if (aaKeyType == "ECDSA") {
            if (this.#dg14Data == null) {
                result = await this.readDG14();
                if (result.status == "failed") {
                    response.status = result.status;
                    response.error = "Failed to get DG14";
                    return Promise.resolve(response);
                }
                this.#dg14Data = this.webEvents.unwrapTlv([0x6E], result.data, result.data.length);
            }
            dgDebug = dgDebug.concat(result.debug);
        } else if (aaKeyType != "RSA") { return Promise.resolve(response); }

        result = await this.webEvents.performActiveAuthentication(aaKeyType, publicKeyData, this.#dg14Data);
        result.debug = dgDebug.concat(this.webEvents.debug);
        return Promise.resolve(result);
    }

    /*
     * Perform Chip Authentication
     */
    async chipAuthentication() {
        console.log(this.chipAuthentication.name);
        let response = this.resetResponse();

        let dgDebug = null;
        if (this.#dg14Data == null) {
            result = await this.readDG14();
            if (result.status == "failed") {
                response.status = result.status;
                response.error = "Failed to get DG14";
                return Promise.resolve(response);
            }
            this.#dg14Data = this.webEvents.unwrapTlv([0x6E], result.data, result.data.length);
            dgDebug = result.debug;
        }

        result = await this.webEvents.performChipAuthentication(this.#dg14Data);
        result.debug = dgDebug ? dgDebug.concat(this.webEvents.debug)
            : this.webEvents.debug;
        return Promise.resolve(result);
    }

    async readEfCvca() {
        console_ely.logFuncName(this.readEfCvca.name);
        let response = this.resetResponse();

        return this.webEvents.start(mainEvents.EVENT_GET_EF_CVCA).then((result) => {
            response.status = (responseStatusOk == true) ? "success" : "failed";
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    async terminalAuthentication(dvData, isData, isPrivKeyData, cvcaLinkData = null) {
        console_ely.logFuncName(this.terminalAuthentication.name);
        let response = this.resetResponse();
        let resultDebug = null;

        if ((dvData == null) || (isData == null) || (isPrivKeyData == null)) {
            response.status = "failed"
            response.error = "Certificate(s) missing";
            return Promise.resolve(response);
        }

        await this.webEvents.setTaCertificates(cvcaLinkData, dvData, isData, isPrivKeyData);
        // Read EF.CVCA
        response = await this.readEfCvca();
        if (response.status == "failed") {
            response.error = "Failed to get EF.CVCA";
            return Promise.resolve(response);
        }
        resultDebug = this.webEvents.debug;

        // Verify CVCA Link
        if (cvcaLinkData != null) {
            response = await this.webEvents.verifyCvcaLink();
            if (response.status == "failed") {
                response.error = "Failed to verify CVCA Link";
                return Promise.resolve(response);
            }
            resultDebug = resultDebug.concat(this.webEvents.debug);
        }

        // Verify DV Cert
        response = await this.webEvents.verifyDvCert();
        if (response.status == "failed") {
            response.error = "Failed to verify DV Cert";
            return Promise.resolve(response);
        }
        resultDebug = resultDebug.concat(this.webEvents.debug);

        // Verify IS Cert
        response = await this.webEvents.verifyIsCert();
        if (response.status == "failed") {
            response.error = "Failed to verify IS Cert";
            return Promise.resolve(response);
        }
        resultDebug = resultDebug.concat(this.webEvents.debug);

        // Perform Terminal Auth
        response = await this.webEvents.PerformTerminalAuthentication();
        if (response.status == "failed") {
            response.error = "Failed to perform Terminal authentication";
        }
        response.debug = resultDebug.concat(this.webEvents.debug);

        return Promise.resolve(response);
    }

    getDocumentDetails(mrzVal) {
        console.log(this.getDocumentDetails.name);
        let response = this.resetResponse();

        try {
            let result = mrz.parse(mrzVal);
            response.status = "success";
            response.data = {};
            response.data.firstName = result.fields.firstName;
            response.data.lastName = result.fields.lastName;
            response.data.birthDate = util.buildDate(result.fields.birthDate.substring(4, 6), result.fields.birthDate.substring(2, 4), result.fields.birthDate.substring(0, 2), 'dd/mm/yy');
            response.data.nationality = result.fields.nationality;
            response.data.sex = result.fields.sex;
            response.data.expirationDate = util.buildDate(result.fields.expirationDate.substring(4, 6), result.fields.expirationDate.substring(2, 4), result.fields.expirationDate.substring(0, 2), 'dd/mm/yy');
            response.data.documentNumber = result.fields.documentNumber;
            response.data.documentCode = result.fields.documentCode;
            response.data.issuingState = result.fields.issuingState;
            response.data.optional1 = result.fields.optional1;
            response.data.optional2 = result.fields.optional2;
            response.debug = this.webEvents.debug;
            return response;
        } catch (error) {
            response.status = "failed";
            response.error = error;
            return response;
        }
    }

    validateMrzWithDG1(scannedMrzData, dg1Data) {
        console.log(this.validateMrzWithDG1.name);
        let response = this.resetResponse();

        let mrz = scannedMrzData.replace(/(?:\r\n|\r|\n)/g, '').trim();
        let dg1 = dg1Data.replace(/(?:\r\n|\r|\n)/g, '').trim();
        response.status = (mrz == dg1) ? "success" : "failed";
        response.debug = this.webEvents.debug;
        return response;
    }

    isCardSupportPace() {
        console.log(this.isCardSupportPace.name);
        let response = this.resetResponse();

        return this.webEvents.start(mainEvents.IS_CARD_SUPPORT_PACE).then((result) => {
            response.status = (responseStatusOk == true) ? "success" : "failed";
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    isCardSupportPaceCam() {
        return this.webEvents.isPaceCam();
    }

    /**
     * 
     * @returns 
     */
    getAppletType() {
        console.log(this.getAppletType.name);
        return this.#appletType;
    }

    async selectAppletType(appletTypeData) {
        console.log(this.selectAppletType.name);
        let response = this.resetResponse();

        this.webEvents.setAid(appletTypeData.AID);
        return this.webEvents.start(mainEvents.SELECT_AID).then((result) => {
            response.status = (responseStatusOk == true) ? "success" : "failed";
            response.data = appletTypeData.name;
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    async identifyAppletType() {
        console.log(this.identifyAppletType.name);
        let res = { status: 'failed', debug: '', data: 'unknown' };
        var debug = [];

        do {
            res = await this.selectAppletType(AppletType.ICAO);
            debug = debug.concat(this.webEvents.debug);
            if (res.status == "success") {
                break;
            }

            res = await this.selectAppletType(AppletType.IDL_EU);
            debug = debug.concat(this.webEvents.debug);
            if (res.status == "success") {
                break;
            }
            res = await this.selectAppletType(AppletType.IDL);
            debug = debug.concat(this.webEvents.debug);
            if (res.status == "success") {
                break;
            }

        } while (false);

        res.debug = debug.concat({ stage: "appletType-info", status: res.data });

        return res;
    }

    /**
     * Identifies the authentication type based on the given applet type.
     *
     * @param {string} appletType - The type of applet to identify the authentication type for.
     *      - The corresponding authentication type. Returns "unknown" if the applet type does not match any known types.
     */
    identifyAccessType(appletType) {
        let res;
        if (appletType == AppletType.ICAO.name)
            res = (this.#isPaceSupported == true) ? AuthType.PACE : AuthType.BAC;
        else if (appletType == AppletType.IDL.name) {
            res = AuthType.BAP;
        } else if (appletType == AppletType.IDL_EU.name) {
            res = AuthType.BAP_EU;
        } else {
            res = "unknown";
        }
        return res;
    }

    async checkForIcaoApplet() {
        console.log(this.checkForIcaoApplet.name);
        return this.selectAppletType(AppletType.ICAO);
    }

    async checkForIdlApplet() {
        console.log(this.checkForIdlApplet.name);
        let response = this.resetResponse();

        let result = await this.selectAppletType(AuthType.BAP_EU);
        if (responseStatusOk == true) {
            response.status = result.status;
            response.data = AuthType.BAP_EU;
        } else {
            response = this.resetResponse();
            result = await this.selectAppletType(AuthType.BAP);
            if (responseStatusOk == true) {
                response.status = result.status;
                response.data = AuthType.BAP;
            } else { response.status = "failed"; }
        }
        response.debug = this.webEvents.debug;
        return response;
    }

    async selectElyctisReader(readers) {
        let response = this.resetResponse();
        return new Promise((resolve, reject) => {
            try {
                const result = util.selectElyctisReader(readers);
                if (result) {
                    this.device.setReaderName(result);
                    response.status = "success";
                    response.data = result;
                } else {
                    response.status = "failed";
                    response.error = "Reader not found";
                }
                response.debug = this.webEvents.debug;
                resolve(response);
            } catch (error) {
                reject({ status: 'error', message: error.message });
            }
        });
    }

    async deinit() {
        console.log(this.deinit.name);
        await this.cleanup();
        let response = this.resetResponse();
        return this.webEvents.start(mainEvents.EVENT_CLEANUP).then((result) => {
            response.status = result.status;
            response.debug = this.webEvents.debug;
            return response;
        }).catch(error => {
            response.status = "failed";
            response.error = error;
            return response;
        });
    }

    setApduType(apduType) {
        console.log(this.setApduType.name);
        let response = this.resetResponse();

        const apduFormatType = this.webEvents.setApduFormat(apduType);
        if (apduFormatType == null) {
            response.status = "failed";
            response.data = APDU_FORMAT.SHORT;
            response.debug = this.webEvents.debug;
        } else {
            response.status = "success";
            response.data = apduFormatType;
        }

        return response;
    }

    getAccessType() {
        return this.accessType;
    }

    async activateAutoReadMode() {
        console.log(this.activateAutoReadMode.name);

        let response = this.resetResponse();
        response = await this.device.enableContinuousReadMode(true);
        response.debug = this.webEvents.debug;
        return response;
    }

    async deactivateAutoReadMode() {
        console.log(this.deactivateAutoReadMode.name);

        let response = this.resetResponse();
        response.status = await this.device.enableContinuousReadMode(false);
        response.debug = this.webEvents.debug;
        return response;
    }

    getOpenpaceVersion() {
        const decoder = new TextDecoder('iso-8859-1');
        return decoder.decode(this.webEvents.getOpenpaceVersion());
    }

    getDg1Mrz() {
        return this.webEvents.getDg1Mrz();
    }

    getDgImage() {
        return this.webEvents.getDgImage();
    }

    getDgImages() {
        return this.webEvents.getDgImages();
    }

    getEfComData() {
        return this.webEvents.getEfComData();
    }

    async initBioScanner() {
        return await this.device.initBioScanner();
    }

    async getBioScannerDetails() {
        return await this.device.getBioScannerDetails();
    }

    async bioScannerAutoCapture() {
        return this.device.autoCapture();
    }

    async bioScannerAutoCaptureLoop() {
        return this.device.autoCaptureLoop();
    }

    async bioScannerAbortCapture() {
        return this.device.abortCapture();
    }

    async bioScannerDeinit() {
        return this.device.deinitBioScanner();
    }

    async wsqToImageBuffer(wsqData) {
        return this.device.wsqToImageBuffer(wsqData);
    }

    async getDecodedWsqData() {
        return this.device.decodedWsqData;
    }

    verifyWithImageFile(data) {
        return this.device.verifyWithImageFile(data);
    }

    async abortMrzAutoRead() {
        return await this.device.abortMrzAutoRead();
    }

    getLastResponseData() {
        return this.webEvents.getLastResponseData();
    }

    parseIdlMrz(mrzData, idlType) {
        return this.webEvents.parseIdlMrz(mrzData, idlType);
    }

    parseEmrtdDg11(dg11Data) {
        let dgData = (TEST_DG11_DATA) ? testDg11Data : dg11Data;
        return this.webEvents.parseEmrtdDg11(dgData);
    }

    parseEmrtdDg12(dg12Data) {
        let dgData = (TEST_DG12_DATA) ? testDg12Data : dg12Data;
        return this.webEvents.parseEmrtdDg12(dgData);
    }

    parseEmrtdDg13(dg13Data) {
        let dgData = (TEST_DG13_DATA) ? testDg13Data : dg13Data;
        return this.webEvents.parseEmrtdDg13(dgData);
    }

    // Retrieve WSQ image data (retrieved from DG3) to 'listOfImageData' to compare it with live fingerprint.
    getWsqImageData(images) {
        const listOfImageData = [];
        if ((images != null) && (images.length > 0)) {
            for (const image of images) {
                if (image.type == IMGTYPE.WSQ)
                    listOfImageData.push(image.data);
            }
        }
        return listOfImageData;
    }

    // Decode WSQ data (retrieved from DG3) to base64 format to display in the GUI.
    // This depends on the Xperix WebAgent service.
    async retrieveAndDecodeFpData(images) {
        let status;
        let listOfImageData = this.getWsqImageData(images);
        if ((images != null) && (images.length > 0)) {
            for (const image of images) {
                if (image.type == IMGTYPE.WSQ) {
                    var result = await this.initBioScanner();
                    if (result.status == "success") {
                        result = await this.getBioScannerDetails();
                        if (result.status == "success") {
                            result = await this.wsqToImageBuffer(image.data);
                            if(result.status != "success") {
                                console_ely.log("Error: decode WSQ data to JPG");
                            } else {
                                // image.data = this.getDecodedWsqData();
                                image.data = result.data;
                            }
                        }
                        await this.bioScannerDeinit();
                        status = "success";
                    } else {
                        console.log("Error: retrieveAndDecodeFpData failed")
                        listOfImageData = [];
                        status = "failed";
                    }
                }
            }
        }
        return new Promise(resolve => {
            resolve({
                status: status,
                data: {listOfImageData, images}
            });
        });
    }

    // Get live fingerprint data from the sensor.
    // This depends on the Xperix WebAgent service.
    async getLiveFingerprint() {
        console_ely.logFuncName(this.getLiveFingerprint.name);
        let timeout = false;
        try {
            let result = await this.initBioScanner();
            if (result.status == "success") {
                result = await this.getBioScannerDetails();
                if (result.status == "success") {
                    result = await this.bioScannerAutoCapture();
                    if (result == "success") {
                        result = await this.bioScannerAutoCaptureLoop();
                        if (result == "success")
                            console_ely.log("Fingerprint captured successfully.");
                        else {
                            console_ely.log("Fingerprint capture timeout.");
                            timeout = true;
                        }
                        // abort capture
                        result = await this.bioScannerAbortCapture();
                        console_ely.log(((result == "success") ? "Aborted capture successfully." : "Error: Failed to abort capture."));
                    } else
                        console_ely.log("Error: Failed to set BioMini Scanner to auto capture");
                } else
                    console_ely.log("Error: Failed to get BioMini Scanner Details");
            } else
                console_ely.log("Error: Failed to init BioMini Scanner");

            return new Promise(resolve => { 
                resolve({
                    status: ((result == "success") && (timeout == false)) ? "success" : "failed"
                });
            });

        } catch (error) {
            console.error("Error: Failed to retrieve live fingerprint, ", error);
        }
    }

    onDeviceDisconnect() {
        this.isMrzScannerAvailable = false;
        this.isClReaderAvailable = false;
    }

    async cleanup() {
        this.#dg14Data = null;
        this.#isPaceSupported = false;
        this.#verifyHash = false;
        if (urlparams_pcsc != '1' && isCardPresent)
            this.device.deinitWebUsb();
        return Promise.all([
            this.webEvents.cleanup(),
        ]).then(() => {
            return 'success';
        }).catch((error) => {
            return 'failed';
        });
    }
}