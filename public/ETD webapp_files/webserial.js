let TEST_MRZ_DATA = 0;
let testMrz = "P<UTOERIKSSON<<ANNA<MARIA<<<<<<<<<<<<<<<<<<<\r\nL898902C<3UTO6908061F9406236ZE184226B<<<<<14\r\n\r\n";

// listener for serial device connection state.
navigator.serial.addEventListener('connect', (e) => {
    console.log("Serial reader connected");
    this.setTimeout(() => {
        const tempSer = new SerialDevice();
        tempSer.isMrzScannerAvailable().then(() => {
            onDeviceConnect();
        });
    }, 2000);
});

// listener for serial device disconnection state.
navigator.serial.addEventListener('disconnect', (e) => {
    console.log("Serial reader disconnected");
    onDeviceDisconnect();
});

/*
 * SerialDevice class provides methods to Connect to scanner, Send request to device and Read response from device.
 */
class SerialDevice
{
    #port = 0;
    #isPortOpen = false;
    #isHidModeActive = false;
    #isAbortAutoRead = false;
    debug = [];
    debugCmd = null;
    debugRes = null;

    constructor() {
        if ("serial" in navigator)
            console_ely.log("The WebSerial API is supported in this browser");
        else
            console_ely.log("The WebSerial API is NOT supported in this browser", 4);
    }

    async isMrzScannerAvailable() {
        let result;
        try {
            this.#port = await navigator.serial.getPorts();
            console_ely.log(`Num ports: ${this.#port.length}`);
            if (this.#port.length >= 1) {
                let i = 0;
                while (i < this.#port.length) {
                    const { usbProductId, usbVendorId } = this.#port[i].getInfo();
                    if ((usbVendorId == 0x2B_78) && ((usbProductId == 0x00_05) || (usbProductId == 0x00_10))) {
                        console_ely.log(`productId ${usbProductId}`);
                        this.#port = this.#port[i];
                        this.#isHidModeActive = (usbProductId == 0x00_10);
                        break;
                    }
                    i++;
                }
            } else {
                // If it is a previously selected serial device (scanner), get its device port.
                const usbVendorId = 0x2B_78;
                this.#port = await navigator.serial.requestPort({
                    filters: [{ usbVendorId }]
                });
            }
            result = "success";
        } catch (e) {
            console.log(e);
            result = "failed";
        }
        return new Promise(resolve => {
            resolve(result);
        });
    }

    async getScannerVersion() {
        let result = "success";
        let scannerVer = null;
        try {

            this.debug = [];
            var newEntry = null;
            let tStart = new Date().getTime();
            let response = await this.#send(new Uint8Array([0x56, 0x0, 0x0]));
            let responseOcrVer = response.status ? response.data : "Unknown";
            let tEnd = new Date().getTime();
            newEntry = { stage: "FW OCR", command: this.debugCmd, response: this.debugRes, time_taken: (tEnd - tStart), status: response.status ? "OK" : "KO" };
            this.debug.push(newEntry);

            tStart = new Date().getTime();
            response = await this.#send(new Uint8Array([0x57, 0x0, 0x0]));
            let responseNnaVer = response.status ? response.data : "Unknown";
            tEnd = new Date().getTime();
            newEntry = { stage: "NNA", command: this.debugCmd, response: this.debugRes, time_taken: (tEnd - tStart), status: response.status ? "OK" : "KO" };
            this.debug.push(newEntry);

            tStart = new Date().getTime();
            response = await this.#send(new Uint8Array([0x52, 0x0, 0x0]));
            let responseSn = response.status ? response.data : "";
            tEnd = new Date().getTime();
            newEntry = { stage: "S/N", command: this.debugCmd, response: this.debugRes, time_taken: (tEnd - tStart), status: response.status ? "OK" : "KO" };
            this.debug.push(newEntry);

            tStart = new Date().getTime();
            response = await this.#send(new Uint8Array([0x54, 0x0, 0x0]));
            let responsePn = response.status ? response.data : "";
            tEnd = new Date().getTime();
            newEntry = { stage: "P/N", command: this.debugCmd, response: this.debugRes, time_taken: (tEnd - tStart), status: response.status ? "OK" : "KO" };
            this.debug.push(newEntry);

            scannerVer = `FW OCR ${responseOcrVer}\t\tNNA ${responseNnaVer}`
                + "\t\tS/N " + responseSn + "\t\tP/N " + responsePn;

            if ((responseOcrVer === "Unknown" || responseNnaVer === "Unknown") || (responseSn === "" || responsePn === ""))
                result = "failed";

        } catch (e) {
            console_ely.log(e);
            result = "failed";
        }

        return new Promise(resolve => {
            resolve({ status: result, data: scannerVer });
        });
    }

    getDebugData() {
        return this.debug;
    }

    async getMrzData() {
        console_ely.logFuncName(this.getMrzData.name);
        let result = "";
        let data = null;
        this.debug = [];

        try {
            var tStart = new Date().getTime();
            let response = await this.#send(new Uint8Array([0x49, 0x0, 0x0]));
            if (TEST_MRZ_DATA) {
                response.data = testMrz;
                response.error = null;
            }

            if (response.error != null) {
                result = response.error;
            } else if ((response.data != null) && (response.data != "") && (response.data.length > 3)) {
                result = "success";
                data = response.data
            } else {
                result = "failed";
            }
            var tEnd = new Date().getTime();

        } catch (error) {
            console_ely.log(error);
            result = "failed";
        }

        return new Promise(resolve => {
            this.debug.push({
                stage: "get Mrz data",
                command: util.toHexString([0x49, 0x0, 0x0]),
                response: data,
                time_taken: tEnd - tStart
            });
            resolve({ status: result, data });
        });
    }

    async #openPort() {
        try {
            if (this.#port.length == 0) {
                if (this.#isPortOpen) {
                    this.#closePort();
                    this.#isPortOpen = false;
                }
                this.isMrzScannerAvailable();
            }
            if (!this.#isPortOpen && (this.#port.length != 0)) {
                await this.#port.open({
                    baudRate: 9600
                }).then(() => {
                    this.#isPortOpen = true;
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    async #closePort() {
        try {
            if (this.#isPortOpen) {
                await this.#port.close().then(() => {
                    this.#isPortOpen = false
                });
            }
        } catch (e) {
            console.log(e);
        }
    }

    async #send(cmd) {

        let resLen = 0;
        let resUtf8 = 0;
        let resString = "";
        let resFinal = 0;
        let isReadCompleted = 0;
        var timeoutId;
        let status = true;
        let error = null;

        this.#isAbortAutoRead = false;

        try {
            if (!this.#isPortOpen) {
                await this.isMrzScannerAvailable();
                await this.#openPort();
                if (this.#port.length == 0) {
                    throw "Port not available";
                }
            }

            // Prepare readable and writable stream for further transactions.
            let decoder = new TextDecoderStream();
            let writer = this.#port.writable.getWriter();
            let readableStreamClosed = this.#port.readable.pipeTo(decoder.writable);
            let inputStream = decoder.readable;
            let reader = inputStream.getReader();

            console_ely.log(`cmd (bytes): {${util.toHexString(cmd)}}h`);
            this.debugCmd = util.toHexString(cmd);
            writer.write(cmd); // Write command to the serial device (scanner).
            writer.releaseLock();

            if ((cmd[0] == 0) && (cmd.length == 1)) {
                const timeout = 500; // Timeout duration in milliseconds
                // Execute after the timeout
                timeoutId = setTimeout(() => {
                    console.log(`Value & Done are empty after ${timeout} milliseconds`);
                    this.#isAbortAutoRead = true;
                }, timeout);
            }

            while (true) {
                console_ely.log(`waiting for data from ${reader}`);
                const { value, done } = await Promise.race([
                    reader.read(),
                    new Promise((resolve) => {
                        const interval = setInterval(() => {
                            if (this.#isAbortAutoRead) {
                                clearInterval(interval); // Halt this interval check once the condition is met.
                                clearTimeout(timeoutId);
                                resolve({ value: undefined, done: true }); // Resolve early based on user choice or timeout.
                            }
                        }, 100); // Check every 100 milliseconds
                    }),
                ]);

                if (value) {
                    resString += value;
                    resUtf8 = util.toUtf8Array(resString);
                    console_ely.log(`res (${resUtf8.length} bytes): {${util.toHexString(resUtf8)}}h`);
                    // Check if received buffer is more than 3 bytes. If so, calculate response length.
                    // If received buffer is 3 bytes, then alert the user to place the card.
                    if (resLen === 0) {
                        console_ely.log("case-1");
                        if (resUtf8.length >= 3) {
                            console_ely.log("case-1.1");
                            if (resUtf8[0] == cmd[0]) {
                                console_ely.log("case-1.1.1");
                                resLen = (resUtf8[1] << 8) | resUtf8[2]; // Calculate response length.
                                console_ely.log(`(bytes to read: ${resLen})`);
                                if ((resLen == 3) && (resUtf8[0] == 0x49)) { // 'I'
                                    if (resLen == (resString.length - 3)) {
                                        console_ely.log("case-1.1.1.1");
                                        error = "card absent"
                                        isReadCompleted = 1;
                                    } else {
                                        console_ely.log("case-1.1.1.2");
                                    }
                                }
                            } else if (resUtf8[0] == 0x43) {
                                console_ely.log("case-1.2");
                                if (resUtf8.length > 3)
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
                        console_ely.log(`[First value: ${resDecode[0]}], Decode length: [${resDecode.length}], [MRZ length: ${resLen}]`);
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
                        console_ely.log(`resUtf8 (${resUtf8.length} bytes): {${util.toHexString(resUtf8)}}h`);
                        resFinal = util.fromUtf8Array(resUtf8);
                        console_ely.log(`resFinal (str): \n"${resFinal}"`);
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
                if (isReadCompleted || this.#isAbortAutoRead)
                    reader.cancel();
                if (done) {
                    // Allow the serial port to be closed later.
                    await readableStreamClosed.catch(() => { /* Ignore the error */ });
                    reader.releaseLock();
                    if (!this.#isAbortAutoRead) {
                        status = (error == null);

                        if ((isReadCompleted == 1)) {
                            console_ely.log("read success", 5);
                        } else {
                            console_ely.log("read failed", 4);
                        }
                    }
                    break;
                }
            }

        } catch (e) {
            console.log(e);
        }
        finally {
            this.debugRes = util.toHexString(resUtf8);
            await this.#closePort();
            return new Promise(resolve => {
                resolve({
                    status: status,
                    data: resFinal,
                    error: error
                });
            });
        }
    }

    // Send a dummy byte to clear input stream
    async clearInputStream() {
        console.log("clearInputStream()");
        let result = await this.#send(new Uint8Array([0x00]));
        return new Promise(resolve => {
            resolve("success");
        })
    }

    async enableContinuousReadMode(isEnabled) {
        console_ely.logFuncName(this.enableContinuousReadMode.name);
        let status = "";
        let data = null;

        try {
            let payLoad = (isEnabled) ? 0x01 : 0x00;
            let response = await this.#send(new Uint8Array([0x43, 0x00, 0x01, payLoad]));
            data = response.data;
            if ((response.data != null) && (response.data != "") && ((response.data.length > 3) || (isEnabled == false))) {
                status = "success";
            } else if ((response.data == "\r\r\r")) {
                status = "card-not-present"
            } else if (this.#isAbortAutoRead) {
                status = "abort";
            } else {
                status = "failed";
            }
        } catch (e) {
            console_ely.log(e);
            status = "failed";
        }

        return new Promise(resolve => {
            resolve({
                status: status,
                data: data
            });
        });
    }

    abortAutoRead() {
        this.#isAbortAutoRead = true;
    }

    getMrzScannerMode() {
        return (this.#isHidModeActive) ? "HID" : "CDC";
    }
}