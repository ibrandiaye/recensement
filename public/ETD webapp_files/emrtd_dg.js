// let dgList = [];

const APDU_FORMAT = {
    AUTO: "auto",
    SHORT: "short",
    EXTENDED: "extended"
};
const ACCESS_TYPE = {
    AUTO: "auto",
    PACE: "pace",
    BAC_BAP: "bac/bap"
};
const PASSWORD_TYPE = {
    ASK_EVERY_TIME: "ASK_EVERY_TIME",
    MRZ: "MRZ",
    CAN: "CAN",
    PIN: "PIN"
};
const file_type = {
    CVCA_LINK_CERTIFICATE: 1,
    DV_CERTIFICATE: 2,
    IS_CERTIFICATE: 3,
}

let TEST_EF_SOD_DATA = 0;
let TEST_EF_ATR_DATA = 0;
let TEST_DG1_DATA = 0;
let TEST_DG2_DATA = 0;
let TEST_DG3_DATA = 0;
let TEST_DG11_DATA = 0;
let TEST_DG12_DATA = 0;
let TEST_DG13_DATA = 0;
let TEST_DG14_DATA = 0;
let TEST_DG15_DATA = 0;

/*
 * DataGroup class contains the functionality to build and read datagroups from the eMRTD.
 */
class DataGroup {
    constructor(webEventsObj, deviceObj) {
        this.webEvents = webEventsObj;
        this.device = deviceObj;
        this.openPace = new OpenPace();
        this.ssc = 0;
        this.totalSize;
        this.rxdSize;
        this.offset;
        this.prevResponseData = null;
        this.prevSw = 0;
        this.caPubKey;

        this.SW_SUCCESS = new Uint8Array([0x90, 0x00]);
        this.SW_WARNING = new Uint8Array([0x82, 0x82]);
        this.SW_SUCCESS_U16 = 0x90_00;
        this.SW_WARNING_U16 = 0x62_82;
        this.SW_GETRESP_U16 = 0x61_00;
        this.STATUS_WORD_SIZE = 2; // Status word length

        this.TAG_85 = [0x85];
        this.TAG_87 = [0x87];
        this.TAG_97 = [0x97];
        this.TAG_8E = [0x8E];
        this.TAG_99 = [0x99];
        this.TAG_61 = [0x61];
        this.TAG_54 = [0x54];
        this.TAG_5F1F = [0x5F, 0x1F];
        this.TAG_7F61 = [0x7F, 0x61];
        this.TAG_7F60 = [0x7F, 0x60];

        this.MAX_LE_SHORT_APDU = 0x100;
        this.MAX_LE_EXT_APDU = 0x1_00_00;
        this.isExtendedApdu;

        this.cvcChrData;
        this.taSignedData;
        this.encTag;

        this.dgTagListIcao = {
            1: '61', // dg1
            2: '75', // dg2
            3: '63', // dg3
            4: '76', // dg4
            5: '65', // dg5
            6: '66', // dg6
            7: '67', // dg7
            8: '68', // dg8
            9: '69', // dg9
            10: '6a', // dg10
            11: '6b', // dg11
            12: '6c', // dg12
            13: '6d', // dg13
            14: '6e', // dg14
            15: '6f', // dg15
            16: '70' // dg16
        };

        this.dgTagListIdl = {
            1: '61', // dg1
            2: '6b', // dg2
            3: '6c', // dg3
            4: '65', // dg4
            5: '67', // dg5
            6: '75', // dg6
            7: '63', // dg7
            8: '76', // dg8
            9: '70', // dg9
            11: '6d', // dg11
            12: '71', // dg12
            13: '6f', // dg13
            14: '6e', // dg14
        };

        this.apduFormatType = APDU_FORMAT.SHORT;
        this.efAtrData;
        this.efCardSecurity;
        this.cvcaLinkData = null;
        this.dvData = null;
        this.isData = null;
        this.isPrivKeyData = null;
        this.isSmActive = false;
        this.decryptDataBuffer = null;
    }

    getLastResponseData() {
        return this.decryptDataBuffer;
    }
    setSmStatus(status) {
        this.isSmActive = status;
    }

    getSmStatus() {
        return this.isSmActive;
    }

    setTaCertificates(cvcaLinkData, dvData, isData, isPrivKeyData) {
        this.cvcaLinkData = cvcaLinkData;
        this.dvData = dvData;
        this.isData = isData;
        this.isPrivKeyData = isPrivKeyData;
    }
    /*
     * Constructs c-apdu using CLA, INS, P1, P2, Lc, Data and Le as arguments.
     */
    createApdu(header, lc, payload, le) {
        console_ely.logFuncName(this.createApdu.name);
        // Initialize APDU length to the minimum length
        let apduLen = header.length;

        this.isExtendedApdu = false;

        // Determine the length of the APDU
        if (lc > -1) { // APDU with Lc
            if (lc > 0 && payload === null)
                return null;

            if (lc > 255) {
                this.isExtendedApdu = true;
                apduLen += (3 + lc);
            } else {
                apduLen += (1 + lc);
            }
        }

        if (le > -1) { // APDU with Le
            if (le > 256) {
                if (lc > -1 && !this.isExtendedApdu)
                    apduLen += 2; // Add two more bytes for Extended Lc

                this.isExtendedApdu = true;

                // Extended Le is 2 bytes for APDU "with" data
                // Extended Le is 3 bytes for APDU "without" data (CASE 2E)
                apduLen += ((lc > -1) ? 2 : 3);
            } else {
                // Le is 1 byte for Short APDU
                // Le is 2 bytes for Extended APDU
                apduLen += (this.isExtendedApdu ? 2 : 1);
            }
        }

        // Construct the APDU
        const apduBuffer = new Uint8Array(apduLen);
        apduBuffer.set(header)

        if (this.isExtendedApdu) {
            // Extended APDU
            apduBuffer[4] = 0x00;
            if (lc > -1) {
                apduBuffer[5] = (lc >> 8) & 0xFF;
                apduBuffer[6] = lc & 0xFF;
                apduBuffer.set(payload, 7);
            }
            if (le > -1) {
                apduBuffer[apduLen - 2] = (le >> 8) & 0xFF;
                apduBuffer[apduLen - 1] = le & 0xFF;
            }
        } else {
            // Short APDU
            if (lc > -1) {
                apduBuffer[4] = lc & 0xFF;
                apduBuffer.set(payload, 5);
            }
            if (le > -1)
                apduBuffer[apduLen - 1] = le & 0xFF;
        }
        console_ely.logByArray("apduBuffer", apduBuffer);
        return apduBuffer;
    }

    /*
     * Gets APDU case number
     */
    getApduCase(apdu, lc, le) {
        console_ely.logFuncName(this.getApduCase.name);
        let caseNum = -1;
        if (apdu.length == 4) {
            // Case 1
            caseNum = "1";
        }
        else if (apdu.length == 5) {
            // Case 2S
            lc = null;
            le[0] = apdu[4];
            caseNum = "2S";
        }
        else if ((apdu.length == (5 + apdu[4])) && (apdu[4] != 0)) {
            // Case 3S
            lc[0] = apdu[4];
            le = null;
            caseNum = "3S";
        }
        else if ((apdu.length == (6 + apdu[4])) && (apdu[4] != 0)) {
            // Case 4S
            lc[0] = apdu[4];
            le[0] = apdu[apdu.length - 1];
            caseNum = "4S";
        }
        else if ((apdu.length == 7) && (apdu[4] == 0)) {
            // Case 2E
            lc = null;
            le[0] = apdu[5];
            le[1] = apdu[6];
            caseNum = "2E";
        }
        else if ((apdu.length == (7 + (apdu[5] * 256) + apdu[6]))
            && (apdu[4] == 0) && ((apdu[5] != 0) || (apdu[6] != 0))) {
            // Case 3E
            lc[0] = apdu[5];
            lc[1] = apdu[6];
            le = null;
            caseNum = "3E";
        }
        else if ((apdu.length == (9 + (apdu[5] * 256) + apdu[6]))
            && (apdu[4] == 0) && ((apdu[5] != 0) || (apdu[6] != 0))) {
            // Case 4E
            lc[0] = apdu[5];
            lc[1] = apdu[6];
            le[0] = apdu[apdu.length - 2];
            le[1] = apdu[apdu.length - 1];
            caseNum = "4E";
        }
        console_ely.log(`Case ${caseNum} Lc: ${lc} Le: ${le}`);
        return caseNum;
    }

    /*
     * Build Tag87 with Encrypted Data (formatted encrypted data)
     */
    buildEncData(cmdBuf, length, tag) {
        console_ely.logFuncName(this.buildEncData.name);
        if (length < 0)
            return null;

        console_ely.logByArray("Command payload", cmdBuf, length);
        // Pad command data
        let paddedCmdSize = this.openPace.addPadding(cmdBuf, cmdBuf.length);
        if (paddedCmdSize < 1) {
            console_ely.log("Error: Failed to add padding, paddedCmdSize is < 1");
            return null;
        }
        let paddedCmdData = this.openPace.getPaddedData(paddedCmdSize);
        if ((paddedCmdData == null) || (paddedCmdData == -1)) {
            console_ely.log("Error: Failed to get padded data, paddedCmdData is null");
            return paddedCmdData;
        }
        console_ely.logByArray("Padded command payload", paddedCmdData);

        // Encrypt the padded command data
        let encBufSize = this.openPace.encrypt(paddedCmdData, paddedCmdData.length);
        if (encBufSize < 1) {
            console_ely.log("Error: Failed to encrypt data, encBufSize is < 1");
            return null;
        }
        let encBuf = this.openPace.getPaceEncryptedData(encBufSize);
        if ((encBuf == null) || (encBuf == -1)) {
            console_ely.log("Error: Failed to get encrypted data, encBuf is null");
            return encBuf;
        }
        console_ely.logByArray("Encrypted data", encBuf);

        let i = 0;
        let j = 0;
        let len = 0;
        let tlvLenSize = 0;

        if (length <= 0x7F) {
            var tlvLen = new Uint8Array(1);
            len = (encBufSize + 1);
            tlvLen[j++] = (len & 0xFF);

        } else if (length <= 0xFF) {
            var tlvLen = new Uint8Array(2);
            len = (encBufSize + 1);
            tlvLenSize = 1;
            tlvLen[j++] = (0x81);
            tlvLen[j++] = (len & 0xFF);

        } else if (length <= 0xFF_FF) {
            var tlvLen = new Uint8Array(3);
            len = (encBufSize + 1);
            tlvLenSize = 2;
            tlvLen[j++] = (0x82);
            tlvLen[j++] = ((len >> 8) & 0xFF);
            tlvLen[j++] = (len & 0xFF);

        } else if (length <= 0xFF_FF_FF) {
            var tlvLen = new Uint8Array(4);
            len = (encBufSize + 1);
            tlvLenSize = 3;
            tlvLen[j++] = (0x83);
            tlvLen[j++] = ((len >> 16) & 0xFF);
            tlvLen[j++] = ((len >> 8) & 0xFF);
            tlvLen[j++] = (len & 0xFF);

        } else if (length <= 0xFF_FF_FF_FF) {
            var tlvLen = new Uint8Array(5);
            len = (encBufSize + 1);
            tlvLenSize = 4;
            tlvLen[j++] = (0x84);
            tlvLen[j++] = ((len >> 24) & 0xFF);
            tlvLen[j++] = ((len >> 16) & 0xFF);
            tlvLen[j++] = ((len >> 8) & 0xFF);
            tlvLen[j++] = (len & 0xFF);

        } else {
            return null;
        }

        let tlvBuf = new Uint8Array(len + 2 + tlvLenSize); // +2 is for Tag87 and 01
        tlvBuf[i++] = tag;
        util.memcpy(tlvBuf, tlvLen, tlvLen.length, i, 0);
        i += tlvLen.length;
        tlvBuf[i++] = 0x01;
        util.memcpy(tlvBuf, encBuf, encBuf.length, i, 0);
        let szTagName = ((tag == 0x87) ? "Tag87 buffer" : "Tag85 buffer");
        console_ely.logByArray(szTagName, tlvBuf);

        return tlvBuf;
    }

    /*
     * Build Tag97 with Le and its length
     */
    buildTag97(le, caseNum) {
        console_ely.logFuncName(this.buildTag97.name);
        if (le < 0)
            return null;

        const length = ((caseNum === "2E" || caseNum === "4E") ? 4 : 3);
        let dataBuffer = new Uint8Array(length);
        dataBuffer.set([this.TAG_97], 0);
        if (caseNum === "2E" || caseNum === "4E") {
            dataBuffer.set([0x02], 1);
            dataBuffer.set([(le >> 8) & 0xFF], 2);
            dataBuffer.set([le & 0xFF], 3);
        } else {
            dataBuffer.set([0x01], 1);
            dataBuffer.set([le & 0xFF], 2);
        }
        console_ely.logByArray("Tag97 buffer", dataBuffer);

        return dataBuffer;
    }

    /*
     * Build Tag8E with MAC.
     */
    buildTag8E(data, length) {
        console_ely.logFuncName(this.buildTag8E.name);
        let i = 0;

        // Add padding to the concatenated data
        let paddedDataSize = this.openPace.addPadding(data, length);
        if (paddedDataSize < 1)
            return null;
        let paddedData = this.openPace.getPaddedData(paddedDataSize);
        if ((paddedData == null) || (paddedData == -1))
            return null;
        console_ely.logByArray("Padded data", paddedData);

        // Perform MAC calculation for the concatenated data
        let macBufSize = this.openPace.authenticate(paddedData, paddedData.length);
        if (macBufSize < 1) {
            console_ely.log("Error: Failed to calculate MAC, mac buffer size < 1");
            return null;
        }
        let macBuf = this.openPace.getAuthenticatedData(macBufSize);
        if ((macBuf == null) || (macBuf == -1)) {
            console_ely.log("Error: Failed to get MAC buffer, macBuf is null");
            return macBuf;
        }
        console_ely.logByArray("Calculated MAC", macBuf);

        let appendedData = new Uint8Array(2 + 0x08);
        appendedData[i++] = this.TAG_8E;
        appendedData[i++] = 0x08;
        util.memcpy(appendedData, macBuf, 8, i++, 0);
        console_ely.logByArray("Tag8E buffer", appendedData);

        return appendedData;
    }

    /*
     * Build C-APDU for Plain and SM case
     */
    buildSmCmd(cApdu) {
        console_ely.logFuncName(this.buildSmCmd.name);
        let caseNum;

        if (!cApdu) {
            return;
        }

        // Ensure CLA is 0x0C while SM is active
        if (this.isSmActive) {
            if (!(cApdu[0] & 0x0C))
                cApdu[0] = 0x0C;
        } else if ((cApdu[0] & 0x0C)) {
            cApdu[0] = 0x00;
        }

        // Increment SSC while SM is active
        if (this.isSmActive) {
            this.openPace.incrementSsc();
        }

        // Plain APDU case
        if (!this.isSmActive) {
            this.smCmd = new Uint8Array(cApdu.length);
            util.memcpy(this.smCmd, cApdu, cApdu.length, 0, 0);
            return;
        }

        // Secure Messaging case
        if (cApdu == null) {
            return;
        }
        let cmdLe = [];
        let cmdLc = [];
        let macBuffer;
        let encData;
        let tag97Buffer;
        let tag8EBuffer;
        let plainBuffer;
        let cmdLen = 0;
        let smCmdLen = 0;
        let macBufferSize = 0;
        let numBytesLc = 1;
        let numBytesLe = 1;

        let index = 4; // Cmd header length is 4
        let header = cApdu.slice(0, index);
        console_ely.logByArray("Header", header);

        // Get Case number
        caseNum = this.getApduCase(cApdu, cmdLc, cmdLe)
        console_ely.log(`caseNum: ${caseNum}`);
        if (caseNum == "-1") {
            console_ely.log("ERROR: Incorrect APDU", 4);
            return false;
        }
        console_ely.log(`cmdLen: ${cmdLen}`);

        // Determine numBytesLc and numBytesLe
        // 1 - No Lc and no Le. However, it will follow the case of 2 and 3 while building SM.
        // 2 - No Lc, but Le exists. However, while building SM, we will add 8E and 97 tags in the payload for this case.
        // 3 - Lc exists, but no Le. However, while building SM, we need to append 00 or 0000 at the end. Refer to Page64 of 9303 P11 document.
        // 4 - Lc and Le exists
        if ((caseNum == "1") || (caseNum === "3S") || caseNum === "2S" || caseNum === "4S") {
            // no change
            //numBytesLc = 1;
            //numBytesLe = 1;
        }
        else if (["2E", "3E", "4E"].includes(caseNum)) {
            numBytesLc = 3;
            numBytesLe = 2;
        }

        // Retrieve payload for applicable cases and build encData
        if (["3S", "4S", "3E", "4E"].includes(caseNum)) {
            // Get payload from C-APDU
            let lc = 0;
            if (caseNum === "3E" || caseNum === "4E") {
                lc = ((cmdLc[0] << 8) + cmdLc[1]);
            } else {
                lc = cmdLc[0];
            }
            // Use tag85 or tag87 based on INS odd or even
            //this.encTag = (header[1] % 2) ? this.TAG_85 : this.TAG_87;
            this.encTag = this.TAG_87;
            plainBuffer = cApdu.subarray((header.length + numBytesLc), (header.length + numBytesLc + lc))
            encData = new Uint8Array();
            encData = this.buildEncData(plainBuffer, plainBuffer.length, this.encTag);
            if (encData == null) {
                return false;
            }
            // Append encData to macBuffer
            macBufferSize += encData.length;
            cmdLen += encData.length;
            console_ely.log(`cmdLen: ${cmdLen}`);
        }

        // Retrieve Le for applicable cases and build tag97Buffer
        if (["2S", "4S", "2E", "4E"].includes(caseNum)) {
            // Build 97 tag
            tag97Buffer = new Uint8Array();
            tag97Buffer = this.buildTag97(cmdLe, caseNum);
            if (tag97Buffer == null) {
                return false;
            }

            // Append tag97Buffer to macBuffer
            macBufferSize += tag97Buffer.length;
            cmdLen += tag97Buffer.length;
            console_ely.log(`cmdLen: ${cmdLen}`);
        }

        // Pad the header
        let paddedHeaderSize = this.openPace.addPadding(header, header.length);
        if (paddedHeaderSize < 1)
            return false;
        let paddedHeaderData = this.openPace.getPaddedData(paddedHeaderSize);
        if ((paddedHeaderData == null) || (paddedHeaderData == -1))
            return false;
        console_ely.logByArray("Padded header", paddedHeaderData);

        // Determine size of macBuffer and initialize
        macBufferSize += paddedHeaderData.length;
        macBuffer = new Uint8Array(macBufferSize);
        let size = 0;

        // Determine size of smCmd and initialize
        smCmdLen = header.length + numBytesLc + cmdLen + 10 + numBytesLe; // 10 is tag8e data
        this.smCmd = new Uint8Array(smCmdLen);

        // Copy padded header to macBuffer
        util.memcpy(macBuffer, paddedHeaderData, paddedHeaderData.length, size, 0);
        size += paddedHeaderData.length;

        // Copy header to the smCmd
        index = 0;
        util.memcpy(this.smCmd, header, header.length, index, 0);
        index += header.length;
        let lcData = smCmdLen - (header.length + numBytesLc + numBytesLe);
        if (numBytesLc > 1) {
            this.smCmd[index++] = 0x00;
            this.smCmd[index++] = (lcData >> 8) & 0xff;
        }
        this.smCmd[index++] = (lcData & 0xff);

        // Process encData
        if (encData != null) {
            // Copy tag87 buffer to macBuffer
            util.memcpy(macBuffer, encData, encData.length, size, 0);
            size += encData.length;
            // Copy tag87 buffer to smCmd
            util.memcpy(this.smCmd, encData, encData.length, index, 0);
            index += encData.length;
        }

        // Process tag97Buffer
        if (tag97Buffer != null) {
            // Copy tag97 buffer to macBuffer
            util.memcpy(macBuffer, tag97Buffer, tag97Buffer.length, size, 0);
            size += tag97Buffer.length;
            // Copy tag97 buffer to smCmd
            util.memcpy(this.smCmd, tag97Buffer, tag97Buffer.length, index, 0);
            index += tag97Buffer.length;
        }

        // Compute MAC
        console_ely.logByArray("macBuffer", macBuffer);
        tag8EBuffer = this.buildTag8E(macBuffer, size);
        if (tag8EBuffer == null) {
            return false;
        }
        // Copy tag8E buffer to C-APDU
        util.memcpy(this.smCmd, tag8EBuffer, tag8EBuffer.length, index, 0);
        index += tag8EBuffer.length;

        // SM-command
        console_ely.logByArray("smCmd", this.smCmd);
    }

    /*
     * Build select command.
     */
    selectBinary(cmd) {
        console_ely.logFuncName(this.selectBinary.name);
        this.totalSize = 0;
        this.rxdSize = 0;
        this.offset = 0
        this.buildSmCmd(cmd);
        this.device.sendApdu(this.smCmd);
    }

    /*
     * Build and send read binary command.
     */
    readBinary() {
        console_ely.logFuncName(this.readBinary.name);
        let remainingSize = (this.totalSize - this.rxdSize);

        if ((this.totalSize == 0) || (this.totalSize > this.rxdSize)) {
            // set Le for read binary.
            let le = 0;
            if (this.totalSize == 0) {
                le = 6;
            } else if (remainingSize) {
                le = (this.apduFormatType == APDU_FORMAT.EXTENDED) ? remainingSize :
                    ((remainingSize < 0xDF) ? remainingSize : 0xDF);
            }
            console_ely.log(`Le: ${le}`);
            // set offset for read binary.
            if (le || remainingSize) {
                let header;
                let payload = null;
                let lc = -1;
                if (this.offset <= 0x7F_FF) {
                    header = [0x00, 0xB0, (this.offset >> 8), this.offset];
                } else {
                    // refer to ICAO Doc9303 p10 page19
                    header = [0x00, 0xB1, 0x00, 0x00];
                    payload = [this.TAG_54, 0x02, (this.offset >> 8), this.offset];
                    lc = payload.length;
                    // Adjust le to accommodate tag 53 in the response
                    if (le < 0x80)
                        le += 2;
                    else if (le < MAX_LE_SHORT_APDU)
                        le += 3;
                    else
                        le += 4;
                }
                let cApdu = this.createApdu(header, lc, payload, le);
                console_ely.logByArray("cmd", cApdu);
                this.buildSmCmd(cApdu);
                this.device.sendApdu(this.smCmd);
            }
            return;
        }
        console.log("Remaining bytes to read is 0");
    }

    /*
     * Select DG
     */
    selectDg(dgNum) {
        console_ely.logFuncName(this.selectDg.name);
        let le = -1;
        let lc = 0x02;
        let header = [0x0C, 0xA4, 0x02, 0x0C];
        let payload = ((this.webEvents.getAppletType() != "ICAO") ?
            new Uint8Array([0x00, dgNum]) : // BAP_DGx
            new Uint8Array([0x01, dgNum])); // ICAO_DGx
        // create APDU
        let apdu = this.createApdu(header, lc, payload, le)
        this.selectBinary(apdu);
    }

    /*
     * Select EF.CVCA
     */
    selectEfCvca() {
        console_ely.logFuncName(this.selectEfCvca.name);
        let le = -1;
        let lc = 0x02;
        let header = [0x0C, 0xA4, 0x02, 0x0C];
        let payload = new Uint8Array([0x01, 0x1C]); // EF.CVCA
        // create APDU
        let apdu = this.createApdu(header, lc, payload, le)
        this.selectBinary(apdu);
    }

    /*
     * Read EF.CardAccess
     */
    readEfCardAccess() {
        const CMD_READ_BINARY = new Uint8Array([0x00, 0xB0, 0x00, 0x00, 0x00]);
        this.device.sendApdu(CMD_READ_BINARY);
    }

    /*
     * Get challenge
     */
    getChallenge() {
        const CMD_GET_CHALLENGE = new Uint8Array([0x00, 0x84, 0x00, 0x00, 0x08]);
        if (false == this.isSmActive) {
            this.device.sendApdu(CMD_GET_CHALLENGE);
        } else {
            this.buildSmCmd(CMD_GET_CHALLENGE);
            this.device.sendApdu(this.smCmd);
        }
    }

    /*
     * Get response
     */
    getResponse() {
        let le = (this.prevSw & 0xFF);
        const CMD_GET_RESPONSE = new Uint8Array([0x00, 0xC0, 0x00, 0x00, le]);
        this.device.sendApdu(CMD_GET_RESPONSE);
    }

    /*
     * Get total size of the binary to be read.
     */
    getTotalSize(data) {
        console_ely.logFuncName(this.getTotalSize.name);
        let headerSize;
        let length;
        if ((data == null) || !data.length)
            return -1;
        if (data.length < 4) {
            this.totalSize = data.length;
            return;
        }
        if (data[1] & 0x80) { // long form tlv
            headerSize = 4;
            let lengthSize = (data[1] & 0x0F);
            if (lengthSize <= 2) {
                let lengthBuf = data.slice(2, (2 + lengthSize));
                length = util.byteArrayToInt(lengthBuf)
            } else {
                console_ely.log(`ERROR: Unsupported length tag found: ${data[1]}`, 4);
                this.totalSize = -1;
                return;
            }
        } else { // short form tlv
            headerSize = 2;
            length = data[1];
        }
        this.totalSize = (length + headerSize);
    }

    /*
     * Check if read binary is complete
     */
    isReadComplete() {
        return ((this.totalSize != 0) && (this.totalSize == this.rxdSize));
    }

    /*
     * Preprocess R-APDU
     */
    getStatusWord(u8Data, length) {
        if (length >= 2)
            return ((u8Data[length - 2] << 8) | u8Data[length - 1])
        return null;
    }

    /*
     * Retrieve Tag87 or Tag85 data for decryption.
     */
    getEncData(encData, encDataLen) {
        console_ely.logFuncName(this.getEncData.name);
        let szRespTag = (this.encTag == this.TAG_87) ? "Tag87 response" : "Tag85 response";
        console_ely.logByArray(szRespTag, encData, encDataLen);
        this.dgReadResponseData = this.webEvents.unwrapTlv(this.encTag, encData, encDataLen);
        if (this.dgReadResponseData) {
            /*
             * [87 or 85, length, 01, data]
             * remove 01
             */
            this.dgReadResponseData = this.dgReadResponseData.slice(1);
        }
    }

    /*
     * Compute response checksum for verification.
     */
    computeMac(resp) {
        console_ely.logFuncName(this.computeMac.name);
        if ((resp[0] != this.TAG_87) && (resp[0] != this.TAG_85) && (resp[0] != this.TAG_99)) {
            console_ely.log(`ERROR: unknown tag ${resp[0]}`, 4);
            return false;
        }
        let tag8EVal = this.webEvents.unwrapTlv(this.TAG_8E, resp, resp.length);
        if (tag8EVal == null) {
            console_ely.log("ERROR: Tag8E not found", 4);
            return false;
        }
        console_ely.logByArray("tag8EVal", tag8EVal);
        let index = resp.length - (tag8EVal.length + 4); // + 4 is for tag8E header & status
        console_ely.log(`index: ${index}`);
        if (index < 0) {
            console_ely.log("ERROR: Tag8E not found", 4);
            return false;
        }
        // Retrieve tag87/tag85 and/or tag99 data
        let rawData = new Uint8Array();
        rawData = resp.slice(0, index);
        console_ely.logByArray("Raw data", rawData);

        // Add Padding
        let paddedDataSize = this.openPace.addPadding(rawData, rawData.length);
        if (paddedDataSize < 1) {
            console_ely.log("Error: Failed to add padding, padded data size < 1");
            return false;
        }
        let paddedData = this.openPace.getPaddedData(paddedDataSize);
        if ((paddedData == null) || (paddedData == -1)) {
            console_ely.log("Error: Failed to get padded data, padded data is null");
            return false;
        }
        console_ely.logByArray("Padded data", paddedData);

        // Calculate MAC
        let macBufSize = this.openPace.authenticate(paddedData, paddedData.length);
        if (macBufSize < 1) {
            console_ely.log("Error: Failed to calculate MAC, macBufSize is < 1");
            return false;
        }
        let macBuf = this.openPace.getAuthenticatedData(macBufSize);
        if ((macBuf == null) || (macBuf == -1)) {
            console_ely.log("Error: Failed to calculate MAC, macBuf is null");
            return false;
        }

        return macBuf;
    }

    /*
     * Verify response checksum
     */
    verifyMac(responseData) {
        console_ely.logFuncName(this.verifyMac.name);
        if ((responseData == null) || (responseData.length == 0)) {
            console_ely.log("ERROR: Invalid argument", 4);
            return false;
        }
        //console_ely.logByArray("responseData", responseData);
        // Retrieve response Mac
        let responseMac = this.webEvents.unwrapTlv(this.TAG_8E, responseData, responseData.length);
        if (responseMac == null) {
            console_ely.log("ERROR: Tag8E not found", 4);
            return false;
        }
        console_ely.logByArray("Response MAC", responseMac);
        // Compute response Mac
        let computedMac = this.computeMac(responseData);
        if (computedMac == false) {
            console_ely.log("Error: Failed to calculate MAC");
            return false;
        }
        console_ely.logByArray("Calculated MAC", computedMac);

        return util.compareUint8Arrays(responseMac, computedMac);
    }

    /*
     * Store data from R-APDU
     */
    storeData(encData, encDataLen) {

        let prevIns = this.device.getPrevIns();
        if ((prevIns != 0x84) && (prevIns != 0x88)
            && (prevIns != 0xB0) && (prevIns != 0xB1)
            && (prevIns != 0xC0)) {
            // nothing to store
            return true;
        }
        console_ely.logFuncName(this.storeData.name);
        // remove command header in case of WebUsb
        if (urlparams_pcsc != '1' && chainParameter != 2) {
            encData = encData.slice(CCID_HDR_LEN);
            encDataLen -= CCID_HDR_LEN;
        }
        if (this.prevResponseData != null) { // todo: not tested yet
            console_ely.log("Prepending the previous data", 4);
            util.appendUint8Arrays(this.prevResponseData, encData);
            encData = this.prevResponseData;
            encDataLen = this.prevResponseData.length;
        }

        if (this.isSmActive) {
            console_ely.logByArray("encData", encData);
            // verify response checksum
            if (this.verifyMac(encData, encDataLen) == false) {
                console_ely.log("ERROR: Failed to verify response checksum", 4);
                return false
            }
            // verify SW
            let tag99Data = this.webEvents.unwrapTlv(this.TAG_99, encData, encDataLen);
            if (tag99Data == null) {
                console_ely.log("ERROR: Tag99 not found", 4);
                return false;
            }
            console_ely.logByArray("Tag99 data", tag99Data);
            if ((util.compareUint8Arrays(tag99Data, this.SW_SUCCESS) == false) &&
                (util.compareUint8Arrays(tag99Data, this.SW_WARNING) == false))
                return false;

            // retrieve the encrypted payload for decryption
            this.getEncData(encData, encDataLen);
            if (this.dgReadResponseData) {
                console_ely.logByArray("encrypted response", this.dgReadResponseData);
                var decryptedSize = this.openPace.decrypt(this.dgReadResponseData, this.dgReadResponseData.length);
                var decryptedData = this.openPace.getDecryptedData(decryptedSize);
                console_ely.logByArray("decrypted response", decryptedData);
            }
        } else { // todo: not tested yet
            // assign the received plain data to dgReadResponseData
            var decryptedSize = (encDataLen - this.STATUS_WORD_SIZE);
            var decryptedData = new Uint8Array(decryptedSize);
            util.memcpy(decryptedData, encData, decryptedSize, 0, 0);
            this.dgReadResponseData = decryptedData;
        }

        if (this.dgReadResponseData) {
            if ((prevIns == 0x84) || (prevIns == 0x88)) {
                this.decryptDataBuffer = decryptedData;
                return true;
            }
            else if (prevIns == 0xB1 && ((decryptedData.length > 2) && (decryptedData[0] == 0x53))) {
                let unwrappedData = this.webEvents.unwrapTlv([0x53], decryptedData, decryptedData.length);
                console_ely.logByArray("Unwrapped data", unwrappedData);
                decryptedData = unwrappedData;
            }
            if (this.totalSize == 0) {
                this.getTotalSize(decryptedData);
                console_ely.log(`totalSize: ${this.totalSize}`);
                if (this.totalSize == -1)
                    return false;
                this.decryptDataBuffer = new Uint8Array(this.totalSize);
            }

            // While receiving the last chunk, the data returned from the chip is appended with zeros.
            // So copy only the required data based on 'totalSize' expected from the file.
            let copySize = decryptedData.length;
            if ((this.rxdSize + decryptedData.length) > this.totalSize)
                copySize = (this.totalSize - this.rxdSize);

            util.memcpy(this.decryptDataBuffer, decryptedData, copySize, this.rxdSize, 0);
            this.rxdSize += copySize;
            this.offset += copySize;

            console_ely.log(`received: ${this.rxdSize} / ${this.totalSize}`);
            if (this.isReadComplete()) {
                console_ely.logByArray("Decrypted data", this.getLastResponseData());
            }
            this.prevResponseData = null;
        }
        return true;
    }

    /*
     * Store data if any
     */
    storeDataIfAny(u8Data, length) { // todo: not tested yet
        console_ely.logFuncName(this.storeDataIfAny.name);
        if (urlparams_pcsc != '1') {
            u8Data = u8Data.slice(CCID_HDR_LEN);
            length -= CCID_HDR_LEN;
        }
        if (length > this.STATUS_WORD_SIZE) {
            util.appendUint8Arrays(this.prevResponseData, u8Data, (length - this.STATUS_WORD_SIZE));
        }
        return true;
    }

    /*
     * Preprocess R-APDU
     */
    preProcessResponse(u8Data, length) {
        let performGetResponse = false;
        if (!length || (chainParameter == 1) || (chainParameter == 3))
            return true;
        if (length >= 2) {
            if (this.isSmActive) {
                this.openPace.incrementSsc();
            }
            let sw = this.getStatusWord(u8Data, length);
            this.prevSw = sw;
            if ((sw === this.SW_SUCCESS_U16) || (sw === this.SW_WARNING_U16)) {
                if (performGetResponse) { // todo: not tested yet
                    this.webEvents.popEvent();
                    performGetResponse = false;
                }
                if (this.storeData(u8Data, length) == false) {
                    console_ely.log("ERROR: Failed to store R-APDU", 4);
                    this.webEvents.setEvent(events.EVENT_CLEANUP);
                    return false;
                }
                return true;
            }
            else if ((sw & 0xFF_00) === this.SW_GETRESP_U16) { // todo: not tested yet
                console_ely.log("Preparing for GetResponse");
                this.webEvents.pushEvent();
                this.webEvents.setEvent(events.EVENT_GET_RESPONSE);
                performGetResponse = true;
                return true;
            }
        }
        return false;
    }

    verifyHash(dgNum) {
        console_ely.logFuncName(this.verifyHash.name);
        return this.openPace.doHashVerification(this.getLastResponseData(), dgNum);
    }

    /*
     * perform Chip Authentication
     */
    performCa(dg14Data) {
        console_ely.logFuncName(this.performCa.name);
        let pubKeyLen = this.openPace.doChipAuthentication(dg14Data, dg14Data.length);
        if (pubKeyLen > 0) {
            this.caPubKey = this.openPace.getCaEphemeralPubKey(pubKeyLen);
            let caPubKeyData = new Uint8Array(this.caPubKey.length);
            caPubKeyData.set(this.caPubKey);
            console_ely.logByArray("caPubKeyData", caPubKeyData);
            return 1;
        } else {
            return 0;
        }
    }

    /*
     * perform MSE-KAT
     */
    doCaMseKat() {
        console_ely.logFuncName(this.doCaMseKat.name);
        let payload = this.webEvents.wrapTlv(0x91, this.caPubKey);
        if (payload == null) {
            console_ely.log("payload is null", 4);
            return;
        }
        console_ely.logByArray("payload", payload);
        let header = [0x00, 0x22, 0x41, 0xA6];
        let lc = payload.length;
        let le = -1;
        const CMD_MSE_KAT = this.createApdu(header, lc, payload, le);
        console_ely.logByArray("CMD_MSE_KAT:", CMD_MSE_KAT);
        this.buildSmCmd(CMD_MSE_KAT);
        this.device.sendApdu(this.smCmd);
    }

    /*
     * perform CA General Auth
     */
    doCaGeneralAuth() {
        console_ely.logFuncName(this.doCaGeneralAuth.name);
        this.webEvents.buildGa(0x00, 0x80, this.caPubKey);
        let apduData = this.webEvents.getApduData();
        let CMD_CA_GA = new Uint8Array(apduData.length);
        CMD_CA_GA.set(apduData);
        console_ely.logByArray("CMD_CA_GA", CMD_CA_GA);
        this.buildSmCmd(CMD_CA_GA);
        this.device.sendApdu(this.smCmd);
    }

    /*
     * perform TA Set MSE
     */
    performTaSetMse(filetype) {
        console_ely.logFuncName(this.performTaSetMse.name);
        let dataBuffer;
        let cvcaData;
        let le = -1;
        let header = [0x0C, 0x22, 0x81, 0xB6];
        if (filetype == file_type.CVCA_LINK_CERTIFICATE) {
            if (cvcaData == null) {
                cvcaData = this.getLastResponseData();
            }
            dataBuffer = this.webEvents.unwrapTlv([0x42], cvcaData, cvcaData.length);
        } else if (filetype == file_type.DV_CERTIFICATE) {
            if ((this.cvcaLinkData == null)) {
                // Set MSE using CVCA for DV
                if (cvcaData == null) {
                    cvcaData = this.getLastResponseData();
                }
                dataBuffer = this.webEvents.unwrapTlv([0x42], cvcaData, cvcaData.length);
            } else {
                // Set MSE using CVC CHR from CVCA for DV
                dataBuffer = this.cvcChrData;
            }
        } else if (filetype == file_type.IS_CERTIFICATE) {
            // Set Mse using Cvc Chr from DV for IS
            dataBuffer = this.cvcChrData;
        }
        let payload = this.webEvents.wrapTlv(0x83, dataBuffer);
        let lc = payload.length;
        let apdu = this.createApdu(header, lc, payload, le)
        this.buildSmCmd(apdu);
        this.device.sendApdu(this.smCmd);
    }

    /*
     * perform TA MSE-AT
     */
    doTaMseAt() {
        console_ely.logFuncName(this.doTaMseAt.name);
        let le = -1;
        let header = [0x0C, 0x22, 0x81, 0xA4];
        let payload = this.webEvents.wrapTlv(0x83, this.cvcChrData);
        let lc = payload.length;
        // create APDU
        let apdu = this.createApdu(header, lc, payload, le)
        this.buildSmCmd(apdu);
        this.device.sendApdu(this.smCmd);
    }

    /*
     * Verify TA Certificate Chain
     */
    doTaVerifyCert(fileType) {
        console_ely.logFuncName(this.doTaVerifyCert.name);
        if (fileType == file_type.DV_CERTIFICATE) {
            return this.doPsoVerifyCertificate(this.dvData, fileType);
        } else if (fileType == file_type.IS_CERTIFICATE) {
            return this.doPsoVerifyCertificate(this.isData, fileType);
        } else if (fileType == file_type.CVCA_LINK_CERTIFICATE) {
            return this.doPsoVerifyCertificate(this.cvcaLinkData, fileType);
        }
        return -1;
    }

    /*
     * Perform PSO Verify Certificate
     */
    doPsoVerifyCertificate(cert, certId) {
        console_ely.logFuncName(this.doPsoVerifyCertificate.name);
        let result = -1;
        if (cert == null) {
            console_ely.log("cert is null", 4);
            return result;
        }
        console_ely.logByArray("certificate data", cert);
        result = this.openPace.doPsoVerifyCertificate(cert, certId);
        if (result == 1) {
            // get CVC Body Data
            let cvcBodyDataLength = this.openPace.getCvcBodyLength();
            let cvcBodyData = this.openPace.getCvcBody(cvcBodyDataLength);
            // get CVC Signature Data
            let cvcSignatureDataLength = this.openPace.getCvcSignatureLength();
            let cvcSignatureData = this.openPace.getCvcSignature(cvcSignatureDataLength);
            // get CVC CHR Data
            let cvcChrDataLength = this.openPace.getCvcChrLength();
            this.cvcChrData = this.openPace.getCvcChr(cvcChrDataLength);

            console_ely.logByArray("cvcBodyData", cvcBodyData);
            console_ely.logByArray("cvcSignatureData", cvcSignatureData);
            console_ely.logByArray("cvcChrData", this.cvcChrData);

            // perform PSO certificate verification
            this.psoVerifyCert(cvcBodyData, cvcSignatureData);
            result = 1;
        } else {
            console_ely.log("this.openPace.doPsoVerifyCertificate failed", 4);
        }
        return result;
    }

    /*
     * Prepare and send PSO certificate verification command
     */
    psoVerifyCert(bodyData, signatureData) {
        console_ely.logFuncName(this.psoVerifyCert.name);
        let le = -1;
        let lc = bodyData.length + 2 + signatureData.length + 1;
        let header = [0x0C, 0x2A, 0x00, 0xBE];
        let signatureSubHeader = [0x5F, 0x37];
        let subHeaderLen = [signatureData.length];
        let payload = [...bodyData, ...signatureSubHeader, ...subHeaderLen, ...signatureData];
        console_ely.logByArray("payload", payload);
        // create and send a secured APDU to verify certificate Chain
        let apdu = this.createApdu(header, lc, payload, le)
        this.buildSmCmd(apdu);
        this.device.sendApdu(this.smCmd);
    }

    /*
     * Get signed terminal data
     */
    getTaSignedData() {
        console_ely.logFuncName(this.getTaSignedData.name);
        console_ely.logByArray("TA Nonce", this.getLastResponseData());
        let ret = this.openPace.taSignData(this.isPrivKeyData, this.getLastResponseData(), this.isData);
        if (ret != 0) {
            let taSignedDataLength = this.openPace.getTaSignedDataLength();
            this.taSignedData = this.openPace.getTaSignedData(taSignedDataLength);
            console_ely.logByArray("Signed data", this.taSignedData);
            return this.taSignedData;
        }
        return -1;
    }

    /*
     * Perform Terminal Auth verification
     */
    taExtAuth() {
        console_ely.logFuncName(this.taExtAuth.name);
        let le = -1;
        let lc = this.taSignedData.length;
        let header = [0x0C, 0x82, 0x00, 0x00];
        let payload = this.taSignedData;
        let apdu = this.createApdu(header, lc, payload, le)
        this.buildSmCmd(apdu);
        this.device.sendApdu(this.smCmd);
    }

    // Check for DG presence in EF.COM DG list
    // checkForDgTagInEfComDgList(dgNum) {
    //     console_ely.logFuncName(this.checkForDgTagInEfComDgList.name);
    //     if (dgList.length == 0)
    //         return null;
    //     else
    //         return dgList.includes(dgNum);
    // }

    // Get DG list from EF.COM
    getDgListFromEfCom(obj, array) {
        console_ely.logFuncName(this.getDgListFromEfCom.name);
        let listOfDg = [];
        array = util.toHexString(array);
        // Loop through the object values
        for (let key in obj) {
            // Check if the object value exists in the array
            if (array.includes((obj[key])))
                listOfDg.push(Number(key));
        }
        return listOfDg;
    }

    // Get EF.COM data
    getEfComData() {
        console_ely.logFuncName(this.getEfComData.name);
        let tmp = null;
        let tagList = [[0x60]];
        let efComData;
        tmp = this.webEvents.unwrapTlvs(tagList, this.getLastResponseData());
        if (tmp.length > 0) {
            tagList = [[0x5F, 0x01]];
            tmp = this.webEvents.unwrapTlvs(tagList, tmp, true);
        }
        if ((tmp.length > 0) && ((this.webEvents.getAppletType() == "ICAO"))) {
            tagList = [[0x5F, 0x36]];
            tmp = this.webEvents.unwrapTlvs(tagList, tmp, true);
        }
        if (tmp.length > 0) {
            tagList = [[0x5C]];
            efComData = this.webEvents.unwrapTlvs(tagList, tmp);
        }
        console_ely.logByArray("efComData: ", efComData);
        return this.getDgListFromEfCom(((this.webEvents.getAppletType() != "ICAO") ? this.dgTagListIdl : this.dgTagListIcao), efComData);
    }

    /*
     * Perform Internal Authenticate
     */
    performIntAuth() {
        console_ely.logFuncName(this.performIntAuth.name);
        let rnd = this.openPace.getIfdRnd();
        let lc = rnd.length;
        let le = 65536;
        let header = [0x0C, 0x88, 0x00, 0x00];
        let payload = rnd;
        let apdu = this.createApdu(header, lc, payload, le)
        this.buildSmCmd(apdu);
        this.device.sendApdu(this.smCmd);
    }

    getAaKeyType(publicKeyData) {
        console_ely.logFuncName(this.getAaKeyType.name);
        return this.openPace.getAaKeyType(publicKeyData);
    }
    /*
     * Perform Active Authenticate
     */
    doActiveAuth(keyType, publicKeyData, signedData, dg14Data = null) {
        console_ely.logFuncName(this.doActiveAuth.name);

        if (keyType == "ECDSA") {
            let oid_id_pk_ec = [0x06, 0x09, 0x04, 0x00, 0x7F, 0x00, 0x07, 0x02, 0x02, 0x01, 0x02];

            publicKeyData = this.webEvents.wrapTlv(0x30, [...oid_id_pk_ec, ...publicKeyData]);
            console_ely.logByArray("Modified dg data", publicKeyData);
        }

        return this.openPace.performActiveAuth(publicKeyData, signedData, dg14Data);
    }

    /*
     * Display DG1 MRZ in GUI
     */
    getDg1Mrz() {
        console_ely.logFuncName(this.getDg1Mrz.name);

        // Set TEST_DG1_DATA=0 for release
        if (TEST_DG1_DATA) {
            console_ely.log("Using test DG1", 2);
            this.decryptDataBuffer = testDg1Data;
        }
        // Retrieve MRZ bytes from DG1
        let tagList = [this.TAG_61, this.TAG_5F1F];
        let dg1MrzArray = this.webEvents.unwrapTlvs(tagList, this.getLastResponseData());
        if (dg1MrzArray == null) { console_ely.log("ERROR: Tag not found", 4); return null; }

        // Decode MRZ bytes to ASCII (NOTE: TextDecoder('iso-8859-1') needs Uint8Array)
        let dg1Mrz = new Uint8Array(dg1MrzArray);
        let decoder = new TextDecoder('iso-8859-1');
        let mrz = decoder.decode(dg1Mrz);
        let mrzSize = dg1Mrz.length;

        // Separate MRZ lines with "\r\n"
        if (mrzSize == 90) return (`${mrz.slice(0, 30)}\r\n${mrz.slice(30, 60)}\r\n${mrz.slice(60, 90)}`); // TD1
        else if (mrzSize == 72) return (`${mrz.slice(0, 36)}\r\n${mrz.slice(36, 72)}`); // TD2
        else if (mrzSize == 88) return (`${mrz.slice(0, 44)}\r\n${mrz.slice(44, 88)}`); // TD3
        else return mrz; // IDL
    }

    /*
     * Display DG image in GUI. Supported formats are JP2, PNG, and JPG.
     */
    getDgImage() {
        console_ely.logFuncName(this.getDgImage.name);
        let image;
        try {
            image = this.webEvents.getImageDetails(this.getLastResponseData());
        } catch (e) {
            console_ely.log(e);
        }
        return [image];
    }

    /*
     * Display FP image templates in GUI. Supported formats are JP2, PNG, and JPG.
     */
    getDgImages(primaryTag = this.decryptDataBuffer[0]) { // 0x63 for Fingerprint
        console_ely.logFuncName(this.getDgImages.name);
        let images = [];
        try {
            // Set TEST_DG3_DATA=0 for release
            if (TEST_DG3_DATA) {
                console_ely.log("Using test DG3", 2);
                this.decryptDataBuffer = testDg3Data;
                primaryTag = this.decryptDataBuffer[0];
            }
            // Retrieve image data from DG
            let tagList = [[primaryTag], this.TAG_7F61];
            let tag7F61Data = this.webEvents.unwrapTlvs(tagList, this.getLastResponseData());
            let numTemplates = 1;
            if ((tag7F61Data != null) && (tag7F61Data[0] == 0x02 /* T */) && (tag7F61Data[1] == 0x01 /* L */)) {
                numTemplates = tag7F61Data[2]; /* V */
            }
            let tag7F60Data = tag7F61Data.slice(3);
            if (tag7F60Data == null) {
                console_ely.log("ERROR: Tag 7F60 not found", 4); tag7F60Data = this.getLastResponseData(); /*return null;*/
            }
            console.log("Num FP templates: ", numTemplates);

            for (let i = 0; i < numTemplates; i++) {
                let unwrappedData = this.webEvents.unwrapTlvs([this.TAG_7F60], tag7F60Data);
                if (unwrappedData == null) { console_ely.log("End of loop", 4); break; }
                let image = this.webEvents.getImageDetails(unwrappedData);
                images = images.concat(image);
                tag7F60Data = this.webEvents.unwrapTlvs([this.TAG_7F60], tag7F60Data, true);
            }
        } catch (e) {
            console_ely.log(e);
        }
        return images;
    }

    setApduFormat(apduType) {
        console_ely.logFuncName(this.setApduFormat.name);

        try {
            const TAG_47 = 0x47;
            const TAG_7F = 0x7F;
            const TAG_66 = 0x66;
            const EFATR_EXTLEN_SUPPORT_MASK = 0x40;
            const EFATR_EXTLEN_INFO_MASK = 0x20;
            let tagLen = 0;
            let off = 0;
            let cmdDataMaxLen = 0;
            let rspDataMaxLen = 0;
            let bIsExtLenInfoExists = false;
            let b1 = 0;
            let b2 = 0;
            let b3 = 0;
            let b4 = 0;

            console.log("Setting APDU configuration");

            if (apduType === APDU_FORMAT.AUTO) {
                console.log("Parsing EF.ATR");

                // Set TEST_EF_ATR_DATA=0 for release
                if (TEST_EF_ATR_DATA) {
                    console_ely.log("Using test EF.ATR", 2);
                    this.efAtrData = testEfAtrData;
                }

                // Implementing Table 2 of
                // https://www.icao.int/Security/FAL/TRIP/Documents/TR%20-%20Logical%20Data%20Structure%20LDS%20for%20Storage%20of%20Data%20V20.7.pdf
                if (this.efAtrData && this.efAtrData.length > 2) {
                    // If 0x80 is found as the first byte, ignore it, as it may be coming from Historical bytes
                    if (this.efAtrData[0] === 0x80) {
                        console.log("Skipping the first byte 0x80");
                        off++;
                    }

                    do {
                        if (this.efAtrData[off] === TAG_47 && !bIsExtLenInfoExists) {
                            console.log("TAG_47 found");
                            tagLen = this.efAtrData[++off];
                            if (0x03 === tagLen) {
                                console.log("LEN_03 found for TAG_47");
                                off += 3;
                                if (this.efAtrData[off] & EFATR_EXTLEN_SUPPORT_MASK) {
                                    console.log("Extended length supported.");
                                    apduType = APDU_FORMAT.EXTENDED;
                                    if (this.efAtrData[off] & EFATR_EXTLEN_INFO_MASK) {
                                        console.log("Extended length info found.");
                                        bIsExtLenInfoExists = true;
                                        off += 1;
                                    }
                                } else {
                                    console.log("Extended length NOT supported.");
                                    apduType = APDU_FORMAT.SHORT;
                                }

                                console.log("TAG_47 found and processed");
                                if (!bIsExtLenInfoExists)
                                    break;
                            } else {
                                console.log("LEN_03 not found for TAG_47. Skipping LEN_xx bytes.");
                                off += (tagLen + 1);
                            }
                        } else if (this.efAtrData[off] === TAG_7F) {
                            console.log("TAG_7Fxx found");

                            if (this.efAtrData[++off] === TAG_66) {
                                console.log("TAG_7F66 found");
                                bIsExtLenInfoExists = true;

                                // Skip the LEN byte of TAG_7F66
                                tagLen = this.efAtrData[++off];

                                // Check for First Inner TAG_02. It should be 0x02 as per specification. It holds the cmdDataMaxLen information.
                                if (0x02 === this.efAtrData[++off]) {
                                    console.log("TAG_7F66, LEN_xx, TAG_02 found");

                                    // Check for First Inner TAG_02's LEN. It should be 0x02 as per specification
                                    tagLen = this.efAtrData[++off];

                                    if (tagLen === 0x02) {
                                        console.log("TAG_7F66, LEN_xx, TAG_02, LEN_02 found");
                                        b1 = this.efAtrData[++off];
                                        b2 = this.efAtrData[++off];
                                        cmdDataMaxLen = ((b1 << 8) & 0xFF_00) | ((b2 << 0) & 0xFF);
                                        off++;
                                        // Move to the next byte
                                    } else if (tagLen === 0x03) {
                                        console.log("TAG_7F66, LEN_xx, TAG_02, LEN_03 found. Violation!");
                                        b1 = this.efAtrData[++off];
                                        b2 = this.efAtrData[++off];
                                        b3 = this.efAtrData[++off];
                                        cmdDataMaxLen = ((b1 << 16) & 0xFF_00_00) | ((b2 << 8) & 0xFF_00) | ((b3 << 0) & 0xFF);
                                        off++;
                                        // Move to the next byte
                                    } else {
                                        console.log("LEN of First Inner TAG_02 is not 0x02");
                                    }

                                    if (cmdDataMaxLen < 256) {
                                        console.log("Extended length not supported in command.");
                                        apduType = APDU_FORMAT.SHORT;
                                    } else {
                                        console.log("Extended length supported in command.");
                                        apduType = APDU_FORMAT.EXTENDED;
                                    }
                                } else {
                                    console.log("First Inner TAG_02 is not 0x02");
                                }

                                // Check for Second Inner TAG_02. It should be 0x02 as per specification. It holds the rspDataMaxLen information.
                                if (0x02 === this.efAtrData[off]) {
                                    console.log("TAG_7F66, LEN_xx, TAG_02, LEN_02, VAL_00, VAL_01, TAG_02 found");

                                    // Check for Second Inner TAG_02's LEN. It should be 0x02 or 0x03 as per specification
                                    tagLen = this.efAtrData[++off];

                                    if (tagLen === 0x02) {
                                        console.log("TAG_7F66, LEN_xx, TAG_02, LEN_02, VAL_00, VAL_01, TAG_02, LEN_02 found");
                                        b1 = this.efAtrData[++off];
                                        b2 = this.efAtrData[++off];
                                        rspDataMaxLen = ((b1 << 8) & 0xFF_00) | ((b2 << 0) & 0xFF);
                                    } else if (tagLen === 0x03) {
                                        console.log("TAG_7F66, LEN_xx, TAG_02, LEN_02, VAL_00, VAL_01, TAG_02, LEN_03 found");
                                        b1 = this.efAtrData[++off];
                                        b2 = this.efAtrData[++off];
                                        b3 = this.efAtrData[++off];
                                        rspDataMaxLen = ((b1 << 16) & 0xFF_00_00) | ((b2 << 8) & 0xFF_00) | ((b3 << 0) & 0xFF);
                                    } else {
                                        console.log("LEN of Second Inner TAG_02 is neither 0x02 nor 0x03. Violation!");
                                    }

                                    if (rspDataMaxLen < 256) {
                                        console.log("Extended length not supported in response.");
                                        apduType = APDU_FORMAT.SHORT;
                                    } else {
                                        console.log("Extended length supported in response.");
                                        apduType = APDU_FORMAT.EXTENDED;
                                    }

                                    console.log("TAG_7F66 found and processed");
                                    break;
                                } else {
                                    console.log("Second Inner TAG_02 is not 0x02");
                                }
                            } else {
                                console.log("TAG_7F66 not found");
                            }
                        } else {
                            tagLen = this.efAtrData[++off];
                            off += (tagLen + 1);
                        }
                    } while (off < this.efAtrData.length);

                    if (cmdDataMaxLen)
                        console.log(`Command length supported by card: ${cmdDataMaxLen}`);

                    if (rspDataMaxLen)
                        console.log(`Response length supported by card: ${rspDataMaxLen}`);

                } else {
                    console.log("EF.ATR data not found");
                }

                // If APDU type is not found in EF.ATR, set it based on applet type.
                // We prefer Extended APDU for PACE cards and Short APDU for BAC/BAP cards
                if (apduType === APDU_FORMAT.AUTO) {
                    apduType = ((this.webEvents.getIsPaceDocument()) ? APDU_FORMAT.EXTENDED : APDU_FORMAT.SHORT);
                }

            } else {
                console.log("Ignoring EF.ATR");
            }

            if (apduType === APDU_FORMAT.EXTENDED) {
                console.log("Using Extended APDU configuration");
                this.apduFormatType = APDU_FORMAT.EXTENDED;
            } else {
                console.log("Using Short APDU configuration");
                this.apduFormatType = APDU_FORMAT.SHORT;
            }

            return apduType;
        } catch (error) {
            console.log("Error: parsing EF.ATR");
            return null;
        }
    }

    storeEfAtr() {
        this.efAtrData = this.getLastResponseData();
    }

    storeEfCardSecurity() {
        this.efCardSecurity = this.getLastResponseData();
    }

    getLastStatusWord() {
        return this.prevSw;
    }

    cleanup() {
        this.efCardSecurity = null;
        this.efAtrData = null;
        this.cvcaLinkData = null;
        this.dvData = null;
        this.isData = null;
        this.isPrivKeyData = null;
        this.isSmActive = false;
        // Clean webapp_events
        // todo: add an API in respective files and clean their variables.
    }
}
