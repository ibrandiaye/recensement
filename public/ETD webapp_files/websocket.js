socket = 0;
resetSession = true;
updateReaderFwVer = true;
readerFwVer = '';

/*
 * WebSocketEly class provides websocket interface to access winscard APIs on the client machine.
 * It builds a custom JSON message wrapping the required PC/SC function (to be invoked on the
 * the client machine) and exchanges with the websocket.
 * Pre-requisite: The python script websocket_0.x.py (developed by ELYCTIS) must be running
 * on the client machine. 
 */
class WebSocketEly {
    open(dev) {
        device = dev;
        if (urlparams_socket == null)
            urlparams_socket = "8085";
        this.openSocket("ws://localhost:" + urlparams_socket);
        var obj = this;
    }

    openSocket(url) {
        socket = new WebSocket(url);
        socket.addEventListener("open", (evt) => {
            //console_ely.log("WebSocket connection found");
        });
        socket.addEventListener("close", (evt) => {
            // socket.close(code, reason)
            /*if (evt.wasClean) {
                //alert(`[close] Connection closed cleanly, code=${evt.code} reason=${evt.reason}`);
                console_ely.log(`[close] Connection closed cleanly, code=${evt.code} reason=${evt.reason}` );
            } else {
                // e.g. server process killed or network down
                // event.code is usually 1006 in this case
                console_ely.log('[close] Connection died');
            }*/
        });
        socket.addEventListener("error", (error) => {
           // alert("WebAgent connection error at " + url);
            gui.update(guiEvents.GUI_RUN_ENABLE);
        });
        socket.addEventListener('message', this.readIncomingMessage);
    }

    getPrintData(json) {
        if (isDetailedLogEnabled != webapp_config.ENABLED) {
            let obj = JSON.parse(json);
            let objstr = JSON.stringify(obj, null, 2);
            if (objstr.includes("Parameter"))
                return (objstr.includes("C-APDU") ? obj.Parameter['C-APDU'] : obj.Function);
            else if (objstr.includes("Status"))
                return (objstr.includes("R-APDU") ? obj.Return['R-APDU'] : obj.Return['Status']);
        }
        return json;
    }

    readIncomingMessage(event) {
        console_ely.log("<== (Websocket) : " + websock.getPrintData(event.data), 3);
        const obj = JSON.parse(event.data);
        var triggerResponseHandler = 0;
        console_ely.log("currentEvent: " + currentEvent);
        console_ely.status(obj.Return.Status);
        switch (currentEvent) {
            case events.EVENT_PERFORM_SCARD_ESTABLISHCONTEXT:
                if (obj.Return.Status == "OK") {
                    device.setEvent(events.EVENT_PERFORM_SCARD_LISTREADERS);
                }
                break;
            case events.EVENT_PERFORM_SCARD_LISTREADERS:
                if (obj.Return.Status == "OK") {
                    readerName = util.getPreferredReaderName(obj.Return.Readers);
                    updateReaderFwVer = ($("#scardReaderDetails").text().match(readerName) == null);
                    if (updateReaderFwVer) {
                        gui.update(guiEvents.GUI_READER_PRESENT, readerName);
                    }
                    device.setEvent(events.EVENT_PERFORM_SCARD_GETSLOTSTATUS);
                }
                break;
            case events.EVENT_PERFORM_SCARD_GETSLOTSTATUS:
                if (obj.Return.Status == "Card present") {
                    resetSession = true;
                    device.setEvent(events.EVENT_PERFORM_SCARD_CONNECT);
                }
                break;
            case events.EVENT_PERFORM_SCARD_CONNECT:
                if (obj.Return.Status == "OK") {
                    gui.update(guiEvents.GUI_ATR, obj.Return.ATR);
                    if (resetSession) { device.setEvent (events.EVENT_PERFORM_SCARD_DISCONNECT); }
                    else if (updateReaderFwVer) { device.setEvent (events.EVENT_PERFORM_SCARD_GETVERSION); }
                    else {
                        device.setEvent(((authTypeSelected == PACE) || (authTypeSelected == AUTO)) ?
                            events.EVENT_SELECT_EF_CARD_ACCESS :
                            events.EVENT_SELECT_AID);
                    }
                } else {
                    device.setEvent(events.EVENT_PERFORM_SCARD_RELEASECONTEXT);
                }
                break;
            case events.EVENT_PERFORM_SCARD_GETVERSION:
                if (obj.Return.Status == "OK") {
                    var version = obj.Return["R-APDU"];
                    version = util.getVersionString (readerName,
                        version.substring(10, 12), version.substring(8, 10), version.substring(6, 8))
                    console_ely.log(version);
                    gui.update(guiEvents.GUI_READER_PRESENT, version);
                    updateReaderFwVer = false;
                }
                device.setEvent(((authTypeSelected == PACE) || (authTypeSelected == AUTO)) ?
                    events.EVENT_SELECT_EF_CARD_ACCESS :
                    events.EVENT_SELECT_AID);
                break;
            case events.EVENT_PERFORM_SCARD_DISCONNECT:
                if (obj.Return.Status == "OK") {
                    if (resetSession === true) {
                        resetSession = false;
                        device.setEvent(events.EVENT_PERFORM_SCARD_CONNECT);
                    } else
                        device.setEvent(events.EVENT_PERFORM_SCARD_RELEASECONTEXT);
                }
                break;
            case events.EVENT_PERFORM_SCARD_RELEASECONTEXT:
                if (obj.Return.Status == "OK") {
                    device.setEvent(events.EVENT_FINAL);
                }
                break;
            default:
                if (obj.Return.Status == "OK") {
                    const fromHexString = (hexString) => Uint8Array.from(
                        hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
                    var rApdu = fromHexString(obj.Return["R-APDU"]);
                    console_ely.rApdu(rApdu);
                }
                triggerResponseHandler = 1;
                break;
        }
        var promise = Promise.resolve(currentEvent);
        if (triggerResponseHandler === 0)
            promise.then(device.eventHandler());
        else {
            if (rApdu && rApdu.length)
                promise.then(device.responseHandler(rApdu, rApdu.length));
            else
                device.setEvent(events.EVENT_FINAL);
        }
    }

    async send(json) {
        this.start = new Date().getTime();
        console_ely.log("==> (Websocket) : " + this.getPrintData(json), 2);
        if (socket.readyState === WebSocket.CLOSED) {
            console_ely.log("Waiting to open");
            await this.openSocket("ws://localhost:" + urlparams_socket);
        }
        if (socket.readyState === WebSocket.OPEN) {
            //console_ely.log("Already open");
            //socket.send(json); // todo: socket seems to be old. fixme
            socket.close();
            await this.openSocket("ws://localhost:" + urlparams_socket);
        }
        //else {
        //    console_ely.log("Neither open nor closed");
        //}
        socket.onopen = () => socket.send(json);
    }

    /*
     * Perform SCardEstablishContext through websocket
     */
    scardEstablishContext() {
        device.send("{\"Function\": \"SCardEstablishContext\", \"Parameter\": {\"Option\": \"SCOPE_USER\"}}");
    }

    /*
     * Perform SCardListReaders through websocket
     */
    scardListReaders() {
        device.send("{\"Function\": \"SCardListReaders\", \"Parameter\": {\"Option\": \"SCARD_AUTOALLOCATE\"}}");
    }

    /*
     * Perform SCardGetStatus through websocket
     */
    scardGetSlotStatus() {
        device.send("{\"Function\": \"SCardGetStatus\", \"Parameter\": {\"ReaderName\": \"" + readerName + "\"}}");
    }

    /*
     * Perform SCardConnect through websocket
     */
    scardConnect() {
        device.send("{\"Function\": \"SCardConnect\", \"Parameter\": {\"ReaderName\": \"" + readerName + "\", \"Mode\": \"SCARD_SHARE_SHARED\", \"Protocol\":\"T=0|1\"}}");
    }

    /*
     * Perform SCardDisconnect through websocket
     */
    scardDisconnect() {
        device.send("{\"Function\": \"SCardDisconnect\", \"Parameter\": {\"ReaderName\": \"" + readerName + "\", \"Option\": \"RESET\"}}");
    }

    /*
     * Perform SCardReleaseContext through websocket
     */
    scardReleaseContext() {
        device.send("{\"Function\": \"SCardReleaseContext\", \"Parameter\": {\"Option\": \"None\"}}");
    }

    /*
     * Perform SCardTransmit through websocket
     */
    scardTransmit(cmd) {
        var cApdu = util.uint8ArrayToHexString(cmd, false);
        device.send("{\"Function\": \"SCardTransmit\", \"Parameter\": {\"ReaderName\": \"" + readerName + "\", \"C-APDU\": \"" + cApdu + "\"}}");
    }

    scardGetFwVersion() {
        var cApdu = "FF0000000301080008";
        device.send("{\"Function\": \"SCardTransmit\", \"Parameter\": {\"ReaderName\": \"" + readerName + "\", \"C-APDU\": \"" + cApdu + "\"}}");
    }
}
