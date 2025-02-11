/**
 * WebSocketEly class provides websocket interface to access winscard APIs on the client machine.
 * It builds a custom JSON message wrapping the required PC/SC function (to be invoked on the
 * the client machine) and exchanges with the websocket.
 * Pre-requisite: The python script websocket_0.x.py (developed by ELYCTIS) must be running
 * on the client machine. 
 */
class WebSocketEly
{
    constructor(webEventsObj) {
        this.webEvents = webEventsObj;
        this.socket = 0;
        this.readerName = "";
        this.cmd;
    }

    open() {
        if (urlparams_socket == null)
            urlparams_socket = "8085";
        this.openSocket(`ws://localhost:${urlparams_socket}`);
    }

    openSocket(url) {
        this.socket = new WebSocket(url);
        this.socket.addEventListener("open", (evt) => {
            //console_ely.log("WebSocket connection found");
        });
        this.socket.addEventListener("close", (evt) => {
            // this.socket.close(code, reason)
            /*if (evt.wasClean) {
                //alert(`[close] Connection closed cleanly, code=${evt.code} reason=${evt.reason}`);
                console_ely.log(`[close] Connection closed cleanly, code=${evt.code} reason=${evt.reason}` );
            } else {
                // e.g. server process killed or network down
                // event.code is usually 1006 in this case
                console_ely.log('[close] Connection died');
            }*/
        });
        this.socket.addEventListener("error", (error) => {
            alert(`WebAgent connection error at ${url}`);
            gui.update(GUI.RUN_ENABLE);
        });
        this.socket.addEventListener('message', (event) => { this.webEvents.scardResponseHandler(event); });
    }

    getPrintData(json) {
        if (!isDetailedLogEnabled) {
            const obj = JSON.parse(json);
            const objStr = JSON.stringify(obj, null, 2);
            if (objStr.includes("Parameter"))
                return (objStr.includes("C-APDU") ? obj.Parameter['C-APDU'] : obj.Function);
            else if (objStr.includes("Status"))
                return (objStr.includes("R-APDU") ? obj.Return['R-APDU'] : obj.Return['Status']);
        }
        return json;
    }

    setReaderName(readerName) {
        this.readerName = readerName;
    }

    getParsedResponse(wsResponse) {
        console_ely.log(`<== : ${this.getPrintData(wsResponse.data)}`);
        let parseResponse = JSON.parse(wsResponse.data);
        var status = ((parseResponse.Return.Status == "OK") ||
            (parseResponse.Return.Status == "Card present") ||
            (parseResponse.Return.Status == "Card absent")) ? "success" : "failed";

        // Convert hex string to Uint8Array if "R-APDU" exists, otherwise set data to null
        var data = null;
        if (parseResponse.Return && parseResponse.Return["R-APDU"]) {
            const fromHexString = (hexString) => Uint8Array.from(
                hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
            );
            data = fromHexString(parseResponse.Return["R-APDU"]);
        } else if (parseResponse.Return && parseResponse.Return.Readers) {
            data = parseResponse.Return.Readers;
        } else if (parseResponse.Return && parseResponse.Return["ATR"]) {
            data = parseResponse.Return["ATR"];
        } else if (parseResponse.Return.Status) {
            data = parseResponse.Return.Status;
        } else {
            data = null;
        }
        return { Status: status, data: data };
    }

    async send(json) {
        this.start = new Date().getTime();
        console_ely.log(`==> : ${this.getPrintData(json)}`);
        this.cmd = (JSON.parse(json).Function == "SCardTransmit") ? (JSON.parse(json).Parameter['C-APDU']) : json;
        if (this.socket.readyState === WebSocket.CLOSED) {
            console_ely.log("Waiting to open");
            await this.openSocket(`ws://localhost:${urlparams_socket}`);
        }
        if (this.socket.readyState === WebSocket.OPEN) {
            this.socket.close();
            await this.openSocket(`ws://localhost:${urlparams_socket}`);
        }
        this.socket.onopen = () => this.socket.send(json);
    }

    getCommand() {
        return this.cmd;
    }

    isReaderAvailable() {
        return (this.readerName?.length > 0);
    }

    /**
     * Perform SCardEstablishContext through websocket
     */
    scardEstablishContext() {
        this.send(`{"Function": "SCardEstablishContext", "Parameter": {"Option": "SCOPE_USER"}}`);
    }

    /**
     * Perform SCardListReaders through websocket
     */
    scardListReaders() {
        this.send(`{"Function": "SCardListReaders", "Parameter": {"Option": "SCARD_AUTOALLOCATE"}}`);
    }

    /**
     * Perform SCardGetStatus through websocket
     */
    scardGetSlotStatus() {
        this.send(`{"Function": "SCardGetStatus", "Parameter": {"ReaderName": "${this.readerName}"}}`);
    }

    /**
     * Perform SCardConnect through websocket
     */
    scardConnect() {
        this.send(`{"Function": "SCardConnect", "Parameter": {"ReaderName": "${this.readerName}", "Mode": "SCARD_SHARE_SHARED", "Protocol":"T=0|1"}}`);
    }

    /**
     * Perform SCardDisconnect through websocket
     */
    scardDisconnect() {
        this.send(`{"Function": "SCardDisconnect", "Parameter": {"ReaderName": "${this.readerName}", "Option": "RESET"}}`);
    }

    /**
     * Perform SCardReleaseContext through websocket
     */
    scardReleaseContext() {
        this.send(`{"Function": "SCardReleaseContext", "Parameter": {"Option": "None"}}`);
    }

    /**
     * Perform SCardTransmit through websocket
     */
    scardTransmit(cmd) {
        const cApdu = util.uint8ArrayToHexString(cmd, false);
        this.send(`{"Function": "SCardTransmit", "Parameter": {"ReaderName": "${this.readerName}", "C-APDU": "${cApdu}"}}`);
    }

    /**
     * Get FW version of the scard reader
     */
    scardGetFwVersion() {
        const cApdu = "FF0000000301080008";
        this.send(`{"Function": "SCardTransmit", "Parameter": {"ReaderName": "${this.readerName}", "C-APDU": "${cApdu}"}}`);
    }
}
