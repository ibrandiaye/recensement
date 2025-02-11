port = 0; // serial port number
isPortOpen = false;
isMrzRead = 0;
isMrzValid = false;
updateScannerVer = true;
var isReadAwaitAborted;
var awaitedForScanner = false; 

async function getScannerVer() {
    var result = await serDev.getVer();
    if(result == "success") {
        resetConfig();
        gui.selectAutoAndMrz();
        if (doAutoRead){
            ReactivateContinuousReadMode();
            gui.update(guiEvents.GUI_RUN_DISABLE);
        }
    }
}

// listener for serial device connection state.
navigator.serial.addEventListener('connect', (e) => {
    console.log("Serial reader connected");
    updateScannerVer = true;
    serDev = new SerialDevice();
    serDev.isScannerAvailable().then(() => {
        if (isScannerAvailable == 1)
            gui.update(guiEvents.GUI_CONNECT_DISABLE);
        getScannerVer();
    });
});

// listener for serial device disconnection state.
navigator.serial.addEventListener('disconnect', (e) => {
    // Remove 'e.target' from the list of available ports.
    console.log("Serial reader disconnected");
    isScannerAvailable = 0;
    updateScannerVer = true;
    resetConfig();
    document.getElementById("connect").innerHTML = webapp_config.CONNECT;
});

/*
 * SerialDevice class provides methods to Connect to scanner, Send request to device and Read response from device.
 */
class SerialDevice {

    async isScannerAvailable() {
        try {
            if ("serial" in navigator) {
                console_ely.log("The WebSerial API is supported in this browser");
            } else {
                console_ely.log("The WebSerial API is NOT supported in this browser", 4);
            }
            // WebSerial API to request a particular VID/PID USB device and get the corresponding port.
            // If it is a previously selected serial device (scanner), get its device port.
            console_ely.log("Getting ports with VID 2B78");
            console.log(port = await navigator.serial.getPorts());
            console_ely.log("Num ports: " + port.length);
            if (port.length >= 1) {
                var i = 0;
                while (i < port.length) {
                    const { usbProductId, usbVendorId } = port[i].getInfo();
                    if ((usbVendorId == 0x2B78) && ((usbProductId == 0x0005) || (usbProductId == 0x000A))) {
                        console_ely.log("productId " + usbProductId);
                        port = port[i];
                        break;
                    }
                    i++;
                }
                isScannerAvailable = 1;
                console_ely.log("Permission already given");
            } else {
                console_ely.log("Requesting available ports with VID 2B78");
                awaitedForScanner = true;
                // If it is a previously selected serial device (scanner), get its device port.
                const usbVendorId = 0x2B78;
                port = await navigator.serial.requestPort({
                    filters: [{ usbVendorId }]
                });
                console_ely.log(port);
                isScannerAvailable = 1;
            }
        } catch (e) {
            isScannerAvailable = 0;
            resetConfig();
            if (isClReaderAvailable == 1) {
                gui.update(guiEvents.GUI_RUN);
            }
        }
    }

    async openPort() {
        try {
            if (port.length == 0) {
                if (isPortOpen) {
                    closePort();
                    isPortOpen = false;
                }
                this.isScannerAvailable();
            }
            if (!isPortOpen && (port.length != 0)) {
                await port.open({
                    baudRate: 9600
                }).then(() => {
                    isPortOpen = true;
                });
            }
        } catch (e) {
            console.log(e);
            alert(e);
        }
    }

    async closePort() {
        try {
            if (isPortOpen) {
                await port.close().then(() => {
                    isPortOpen = false
                });
            }
        } catch (e) {
            console.log(e);
            alert(e);
        }
    }

    async send(cmd) {
        try {
            if (!isPortOpen) {
                await this.isScannerAvailable();
                await this.openPort();
                if (port.length == 0) {
                    throw "Port not available";
                }
            }

            var resLen = 0;
            var resUtf8 = 0;
            var resString = "";
            var resFinal = 0;
            var isReadCompleted = 0;
            var timeoutId;
            isReadAwaitAborted = false;

            // Prepare readable and writable stream for further transactions.
            var decoder = new TextDecoderStream();
            const writer = port.writable.getWriter();
            var readableStreamClosed = port.readable.pipeTo(decoder.writable);
            var inputStream = decoder.readable;
            const reader = inputStream.getReader();

            console_ely.log("cmd (bytes): {" + util.toHexString(cmd) + "}h");
            writer.write(cmd); // Write command to the serial device (scanner).
            writer.releaseLock();

            if((cmd[0] == 0) && (cmd.length == 1)) {
                const timeout = 500; // Timeout duration 500 milliseconds
                // Set a timeout
                timeoutId = setTimeout(() => {
                    console.log("Value & Done are empty after 500 milliseconds");
                    isReadAwaitAborted = true;
                }, timeout);
            }

            while (true) {
                console_ely.log("waiting for data from " + reader);
                const { value, done } = await Promise.race([
                    reader.read(),
                    new Promise((resolve) => {
                      const interval = setInterval(() => {
                        if (isReadAwaitAborted) {
                          clearInterval(interval); // Halt this interval check once the condition is met.
                          clearTimeout(timeoutId);
                          resolve({ value: undefined, done: true }); // Resolve early based on user choice or timeout.
                        }
                      }, 100); // Check every 100 milliseconds
                    }),
                  ]);

                if (value) {
                    resString += value;
                    console_ely.log("res (str): \"" + resString + "\"");
                    resUtf8 = util.toUtf8Array(resString);
                    console_ely.log("res (" + resUtf8.length + " bytes): {" + util.toHexString(resUtf8) + "}h");
                    // Check if received buffer is more than 3 bytes. If so, calculate response length.
                    // If received buffer is 3 bytes, then alert the user to place the card.
                    if (resLen === 0) {
                        console_ely.log("case-1");
                        if (resUtf8.length >= 3) {
                            console_ely.log("case-1.1");
                            if (resUtf8[0] == cmd[0]) {
                                console_ely.log("case-1.1.1");
                                resLen = (resUtf8[1] << 8) | resUtf8[2]; // Calculate response length.
                                console_ely.log("(bytes to read: " + resLen + ")");
                                if ((resLen == 3) && (resUtf8[0] == 0x49)) { // 'I'
                                    console_ely.log("case-1.1.1.1");
                                    alert("Please insert card into the scanner");
                                    gui.update(guiEvents.GUI_RUN_ENABLE);
                                    isReadCompleted = 1;
                                }
                            } else if (resUtf8[0] == 0x43) {
                                console_ely.log("case-1.2");
                                resString = "";
                            }
                        }
                        // If received length and expected length are same.
                        if (resLen == (resString.length - 3)) {
                            console_ely.log("case-2");
                            var resDecode = util.toUtf8Array(resString);
                            if (resDecode[0] == cmd[0]) {
                                console_ely.log("case-2.1");
                                isReadCompleted = 1;
                            }
                        }
                    } else { // Second time reading the buffer.
                        console_ely.log("case-3");
                        var resDecode = util.toUtf8Array(resString);
                        console_ely.log("[First value: " + resDecode[0] + "], Decode length: [" + resDecode.length + "], [MRZ length: " + resLen + "]");
                        if (resLen == (resString.length - 3)) {
                            console_ely.log("case-3.1");
                            if (resDecode[0] == cmd[0]) {
                                console_ely.log("case-3.1.1");
                                isReadCompleted = 1;
                            }
                        }
                    }
                    if (isReadCompleted == 1) { // Read completed
                        resUtf8 = resDecode.slice(3);
                        console_ely.log("resUtf8 (" + resUtf8.length + " bytes): {" + util.toHexString(resUtf8) + "}h");
                        resFinal = util.fromUtf8Array(resUtf8);
                        console_ely.log("resFinal (str): \n\"" + resFinal + "\"");
                        if ((resDecode[0] == 0x43) && (resDecode[3] == 0x01)) {
                            console_ely.log("case-4");
                            // Reset reception to get the response of inquire during continuous read mode
                            cmd[0] = 0x49;
                            isReadCompleted = 0;
                            resString = "";
                            resLen = 0;
                        }
                    }
                }
                if (isReadCompleted || isReadAwaitAborted)
                    reader.cancel();
                if (done) {
                    // Allow the serial port to be closed later.
                    await readableStreamClosed.catch(() => { /* Ignore the error */ });
                    reader.releaseLock();
                    if (!isReadAwaitAborted) {
                        (isReadCompleted == 1) ?
                            console_ely.log("read success", 5):
                            console_ely.log("read failed", 4);
                    }
                    break;
                }
            }

        } catch (e) {
            console.log(e);
            alert(e);
        }
        finally {
            await this.closePort();
            return resFinal;
        }
    }

    // Send a dummy bytes to clear input stream
    async clearInputStream() {
        console.log("clearInputStream()");
        if (!isScannerAvailable) {
            return new Promise(resolve => {
                resolve ("failed");
            });
        }
        var result = await this.send(new Uint8Array([0x00]));
        console.log("result: " + result);
        // Return promise
        return new Promise(resolve => {
            resolve ("success");
        })
    }

    async getVer() {
        var result = "";
        try {
            if (!isScannerAvailable) {
                return new Promise(resolve => {
                    resolve ("failed");
                });
            }

            if (!updateScannerVer) {
                return new Promise(resolve => {
                    resolve ("pre-existing");
                });
            }

            var responseOcrVer = await this.send(new Uint8Array([0x56, 0x0, 0x0]));
            if ((responseOcrVer == null) || (responseOcrVer == "")) {
                responseOcrVer = "Unknown"
            }

            var responseNnaVer = await this.send(new Uint8Array([0x57, 0x0, 0x0]));
            if ((responseNnaVer == null) || (responseNnaVer == "")) {
                responseNnaVer = "Unknown"
            }

            var responseSn = await this.send(new Uint8Array([0x52, 0x0, 0x0]));
            if ((responseSn == null) || (responseSn == "")) {
                responseSn = ""
            }

            var responsePn = await this.send(new Uint8Array([0x54, 0x0, 0x0]));
            if ((responsePn == null) || (responsePn == "")) {
                responsePn = ""
            }

            var response = "FW OCR " + responseOcrVer + "\t\tNNA " + responseNnaVer
                + "\t\tS/N " + responseSn + "\t\tP/N " + responsePn;
            gui.update(guiEvents.GUI_SCANNER_DETAILS, response);
            gui.update(guiEvents.GUI_RUN_ENABLE);
            updateScannerVer = false;
            result = "success";
        } catch (e) {
            currentEvent = events.EVENT_FINAL;
            console_ely.log(e);
            alert(e);
            result = "failed";
        }

        // Return promise
        return new Promise(resolve => {
            resolve (result);
        });
    }

    async readMrz() {
        try {
            var tStart = new Date().getTime();
            gui.appendInspectionDetails ("loading.gif", "Read MRZ", 0);
            var response = await this.send(new Uint8Array([0x49, 0x0, 0x0]));
            var tEnd = new Date().getTime();
            var tDiff = (tEnd - tStart);
            if ((response != null) && (response != "") && (response.length > 3)) {
                // Store the MRZ to the cookies to access later
                sessionStorage.setItem('mrz', response);
                // MRZ from scanner already contains line terminations "\r\n"
                console.log("MRZ: \n" + response);
                gui.modifyInspectionDetails ("tick.png", "Read MRZ", tDiff);
                gui.display(gui.id.mrz, response, null);
                if (performAuth == 1 && isMrzValid)
                    usbDev.open();
            }
            else {
                gui.modifyInspectionDetails ("cross.png", "Read MRZ", tDiff);
                gui.update(guiEvents.GUI_CLEAR);
                gui.update(guiEvents.GUI_RUN);
                return;
            }
        } catch (e) {
            currentEvent = events.EVENT_FINAL;
            console_ely.log(e);
            alert(e);
        }
    }

    async enableContinuousReadMode(isEnabled) {
        console_ely.logFuncName(this.enableContinuousReadMode.name);
        var result = "";
        try {
            var payLoad = (isEnabled) ? 0x01 : 0x00;
            var tStart = new Date().getTime();
            var response = await this.send(new Uint8Array([0x43, 0x00, 0x01, payLoad]));
            var tEnd = new Date().getTime();
            var tDiff = (tEnd - tStart);
            if ((response != null) && (response != "") && ((response.length > 3) || (isEnabled == false))) {
                if(isEnabled){
                    gui.appendInspectionDetails ("loading.gif", "Read MRZ", 0);
                    // Store the MRZ to the cookies to access later
                    sessionStorage.setItem('mrz', response);
                    // MRZ from scanner already contains line terminations "\r\n"
                    console.log("MRZ: \n" + response);
                    gui.modifyInspectionDetails ("tick.png", "Read MRZ", tDiff);
                    gui.display(gui.id.mrz, response, null);
                }
                result = "success";
            } else if (isReadAwaitAborted) {
                result = "abort";
            } else {
                console.log("enableContinuousReadMode failed, " + response);
                gui.update(guiEvents.GUI_CLEAR);
                gui.update(guiEvents.GUI_RUN);
                result = "failed";
                // return;
            }
        } catch (e) {
            currentEvent = events.EVENT_FINAL;
            console_ely.log(e);
            alert(e);
            result = "failed";
        }
        // Return promise
        return new Promise(resolve => {
            resolve (result);
        });
    }
}