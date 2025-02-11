class Device {
    constructor(webEventsObj) {
        this.websocket = new WebSocketEly(webEventsObj);
        this.prevIns = 0;
    }
    webusb = new WebUsbEly();
    ccid = new Ccid();
    serDev = new SerialDevice();
    bioMini = new BioMini();
    devPcsc = (urlparams_pcsc == '1');

    #initWebSocket() {
        this.websocket.open();
        this.websocket.scardEstablishContext();
    }

    #deinitWebSocket() {
        this.websocket.scardReleaseContext();
    }

    #setPrevIns(prevIns) {
        this.prevIns = prevIns;
    }

    getPrevIns() {
        return this.prevIns;
    }

    //---------------------------------------
    // Wrapper functions for Smartcard reader
    //---------------------------------------
    scardEstablishContext() {
        ((this.devPcsc) ? this.#initWebSocket() : this.webusb.open());
    }

    scardReleaseContext() {
        ((this.devPcsc) ? this.#deinitWebSocket() : this.webusb.close());
    }

    sendApdu(apdu) {
        console_ely.cApdu(apdu);
        this.#setPrevIns(apdu[1]);
        ((this.devPcsc) ? this.websocket.scardTransmit(apdu) : this.ccid.xfrBlock(apdu));
    }

    getListOfReaders() {
        if (this.devPcsc)
            this.websocket.scardListReaders();
    }

    getScardReaderVersion() {
        if (this.devPcsc)
            this.websocket.scardGetFwVersion();
    }

    setReaderName(readerName) {
        if (this.devPcsc)
            this.websocket.setReaderName(readerName);
    }

    getSlotStatus() {
        (this.devPcsc) ? this.websocket.scardGetSlotStatus() : this.ccid.getSlotStatus();
    }

    scardConnect() {
        (this.devPcsc) ? this.websocket.scardConnect() : this.ccid.iccPowerOn();
    }

    scardDisconnect() {
        (this.devPcsc) ? this.websocket.scardDisconnect() : this.ccid.iccPowerOff();
    }

    scardGetCommand() {
        return this.websocket.getCommand();
    }

    scardGetParsedResponse(response) {
        return this.websocket.getParsedResponse(response);
    }

    parseGetSlotStatus(u8Data, length) {
        if (!this.devPcsc) {
            isCardPresent = this.ccid.parseGetSlotStatusResponse(u8Data, length);
            return new Promise(resolve => {
                resolve({
                    status: "success",
                    data: (isCardPresent) ? "Card present" : "Card absent"
                });
            });
        }
    }

    parseAtrData(u8Data) {
        return ((this.devPcsc) ? "" : this.ccid.parseAtrResponse(u8Data));
    }

    isReaderAvailable() {
        return (this.devPcsc) ? this.websocket.isReaderAvailable() : this.webusb.isAvailable();
    }

    //------------------------------
    // Wrapper functions for Scanner
    //------------------------------
    isMrzScannerAvailable() {
        return this.serDev.isMrzScannerAvailable();
    }

    getMrzScannerMode() {
        return this.serDev.getMrzScannerMode();
    }

    getMrzScannerVersion() {
        return this.serDev.getScannerVersion();
    }

    getMrzData() {
        return this.serDev.getMrzData();
    }

    abortMrzAutoRead() {
        return this.serDev.abortAutoRead();
    }

    clearScannerInputStream() {
        return this.serDev.clearInputStream();
    }

    enableContinuousReadMode(isEnabled) {
        return this.serDev.enableContinuousReadMode(isEnabled);
    }

    //------------------------------
    // Wrapper functions for BioMini
    //------------------------------
    async initBioScanner() {
        let result = await this.bioMini.initBioScanner();
        return new Promise(resolve => { resolve({ status: result, }); });
    }

    async getBioScannerDetails() {
        let result = await this.bioMini.getScannerDetails();
        return new Promise(resolve => {
            resolve({
                status: result,
                data: this.bioMini.bioScannerName
            });
        });
    }

    autoCapture() {
        return this.bioMini.autoCapture();
    }

    autoCaptureLoop() {
        return this.bioMini.autoCaptureLoop();
    }

    abortCapture() {
        return this.bioMini.abortCapture();
    }

    async wsqToImageBuffer(wsqData) {
        let result = await this.bioMini.wsqToImageBuffer(wsqData);
        return new Promise(resolve => {
            resolve({
                status: result,
                data: this.bioMini.decodedWsqData
            });
        });
    }

    getDecodedWsqData() {
        return this.bioMini.decodedWsqData;
    }

    verifyWithImageFile(data) {
        let result = this.bioMini.verifyWithImageFile(data);
        return new Promise(resolve => { resolve({ status: result }); });
    }

    retrieveWsqData(data) {
        return this.bioMini.retrieveWsqData(data);
    }

    deinitBioScanner() {
        return this.bioMini.deinitBioScanner();
    }

    getMrzScannerDebugData() {
        return this.serDev.getDebugData();
    }
}