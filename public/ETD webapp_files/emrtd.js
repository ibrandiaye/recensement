class Emrtd {
    constructor(webEventsObj, deviceObj) {
        this.datagroup = new DataGroup(webEventsObj, deviceObj);
        this.openPace = new OpenPace();
        this.device = deviceObj;
    }

    createApdu(header, lc, payload, le) {
        return this.datagroup.createApdu(header, lc, payload, le);
    }

    buildSmCmd(cmd) {
        return this.datagroup.buildSmCmd(cmd);
    }

    getSmCmd() {
        return this.datagroup.smCmd;
    }

    verifyHash(dgNum) {
        return this.datagroup.verifyHash(dgNum);
    }

    setApduFormat(apduType) {
        return this.datagroup.setApduFormat(apduType);
    }

    getEfComData() {
        return this.datagroup.getEfComData();
    }

    getPaCertificates() {
        return this.datagroup.getPaCertificates();
    }

    getDg1Mrz() {
        return this.datagroup.getDg1Mrz();
    }

    getDgImage() {
        return this.datagroup.getDgImage();
    }

    getDgImages() {
        return this.datagroup.getDgImages();
    }

    selectBinary(cmd) {
        return this.datagroup.selectBinary(cmd);
    }

    getChallenge() {
        return this.datagroup.getChallenge();
    }

    performIntAuth() {
        return this.datagroup.performIntAuth();
    }

    readEfCardAccess() {
        return this.datagroup.readEfCardAccess();
    }

    doCaMseKat() {
        return this.datagroup.doCaMseKat();
    }

    doCaGeneralAuth() {
        return this.datagroup.doCaGeneralAuth();
    }

    selectEfCvca() {
        return this.datagroup.selectEfCvca();
    }

    selectDg(dgNum) {
        return this.datagroup.selectDg(dgNum);
    }

    readBinary() {
        return this.datagroup.readBinary();
    }

    performTaSetMse(data) {
        return this.datagroup.performTaSetMse(data);
    }

    doTaVerifyCert(data) {
        return this.datagroup.doTaVerifyCert(data);
    }

    doTaMseAt() {
        return this.datagroup.doTaMseAt();
    }

    taExtAuth() {
        return this.datagroup.taExtAuth();
    }

    getResponse() {
        return this.datagroup.getResponse();
    }

    isReadComplete() {
        return this.datagroup.isReadComplete();
    }

    storeEfAtr() {
        return this.datagroup.storeEfAtr();
    }

    storeEfCardSecurity() {
        return this.datagroup.storeEfCardSecurity();
    }

    getTaSignedData() {
        return this.datagroup.getTaSignedData();
    }

    preProcessResponse(u8Data, length) {
        return this.datagroup.preProcessResponse(u8Data, length);
    }

    storeDataIfAny() {
        return this.datagroup.storeDataIfAny();
    }

    getAaKeyType(publicKeyData) {
        return this.datagroup.getAaKeyType(publicKeyData);
    }

    doActiveAuth(keyType, publicKeyData, aaSignedData, dg14Data) {
        return this.datagroup.doActiveAuth(keyType, publicKeyData, aaSignedData, dg14Data);
    }

    performCa(dg14Data) {
        return this.datagroup.performCa(dg14Data);
    }

    //OpenPace
    init() {
        return this.openPace.init();
    }

    ConfigureDetailedLogging(value) {
        return this.openPace.ConfigureDetailedLogging(value);
    }

    efCardAccess(data, length) {
        return this.openPace.efCardAccess(data, length);
    }

    getPaceParameterId() {
        return this.openPace.getPaceParameterId();
    }

    getCaAlgorithmId() {
        return this.openPace.getCaAlgorithmId();
    }

    getCaOid() {
        return this.openPace.getCaOid();
    }

    setCaSsc() {
        return this.openPace.setCaSsc();
    }

    initPace(secret, size, type, encnonce, length) {
        return this.openPace.initPace(secret, size, type, encnonce, length);
    }

    getPaceMapData(length) {
        return this.openPace.getPaceMapData(length);
    }

    getPaceMapGenerator(mapPiccData, length) {
        return this.openPace.getPaceMapGenerator(mapPiccData, length);
    }

    getPaceEphemeralPubKeyPcdData(length) {
        return this.openPace.getPaceEphemeralPubKeyPcdData(length);
    }

    computeSharedSecret(sharedSecret, length) {
        return this.openPace.computeSharedSecret(sharedSecret, length);
    }

    doPaceCam(aic, efCardSecurity) {
        return this.openPace.doPaceCam(aic, efCardSecurity);
    }

    doPassiveAuthentication(efSodBuffer, cscaCertBuffer, dsCertBuffer) {
        return this.openPace.doPassiveAuthentication(efSodBuffer, cscaCertBuffer, dsCertBuffer);
    }

    getPaceAuthenticateToken(length) {
        return this.openPace.getPaceAuthenticateToken(length);
    }

    initBac() {
        return this.openPace.initBac();
    }

    getBacChallenge(encryptedData, length, secret, size, auth) {
        return this.openPace.getBacChallenge(encryptedData, length, secret, size, auth);
    }

    getExternalAuthenticateData(length) {
        return this.openPace.getExternalAuthenticateData(length);
    }

    decryptCryptogram(encryptedData, length) {
        return this.openPace.decryptCryptogram(encryptedData, length);
    }

    getPaceOid() {
        return this.openPace.getPaceOid();
    }

    getPaceMappingId() {
        return this.openPace.getPaceMappingId();
    }

    getOpenpaceVersion() {
        return this.openPace.getOpenpaceVersion();
    }

    getEfCardSecurity() {
        return this.datagroup.efCardSecurity;
    }

    getLastStatusWord() {
        return this.datagroup.getLastStatusWord();
    }
    setPasswordType(pwdType) {
        this.pwdType = pwdType;
    }
    async setTaCertificates(cvcaLinkData, dvData, isData, isPrivKeyData) {
        await this.datagroup.setTaCertificates(cvcaLinkData, dvData, isData, isPrivKeyData);
    }

    setSmStatus(status) {
        this.datagroup.setSmStatus(status);
    }

    getSmStatus() {
        return this.datagroup.getSmStatus();
    }

    getLastResponseData() {
        return this.datagroup.getLastResponseData();
    }

    wrapTlv(tag, payLoad) {
        if (payLoad.length < 0) {
            return null;
        }

        const wrappedData = [];
        wrappedData.push(tag & 0xFF);

        if (payLoad.length <= 0x7F) {
            wrappedData.push(payLoad.length & 0xFF);
        } else if (payLoad.length <= 0xFF) {
            wrappedData.push(0x81);
            wrappedData.push(payLoad.length & 0xFF);
        } else if (payLoad.length <= 0xFFFF) {
            wrappedData.push(0x82);
            wrappedData.push((payLoad.length >> 8) & 0xFF);
            wrappedData.push(payLoad.length & 0xFF);
        } else if (payLoad.length <= 0xFF_FF_FF) {
            wrappedData.push(0x83);
            wrappedData.push((payLoad.length >> 16) & 0xFF);
            wrappedData.push((payLoad.length >> 8) & 0xFF);
            wrappedData.push(payLoad.length & 0xFF);
        } else if (payLoad.length <= 0xFF_FF_FF_FF) {
            wrappedData.push(0x84);
            wrappedData.push((payLoad.length >> 24) & 0xFF);
            wrappedData.push((payLoad.length >> 16) & 0xFF);
            wrappedData.push((payLoad.length >> 8) & 0xFF);
            wrappedData.push(payLoad.length & 0xFF);
        } else {
            return null;
        }

        // Append the data from payLoad to the wrappedData array.
        wrappedData.push(...payLoad);

        return wrappedData;
    }

    unwrapTlv(expectedTags, wrappedData, length, skip = false) {
        console_ely.logFuncName(this.unwrapTlv.name);
        if (wrappedData == null || wrappedData.length == 0) { return null; }
        if (length == null) { length = wrappedData.length; }
        if (!expectedTags.length || (length < 2)) {
            console.log("ERROR: Invalid wrapped data length", 4);
            return null;
        }
        let expectedTagSize = expectedTags.length;

        for (let i = 0; i < length;) {
            let berTagLen = wrappedData[i + expectedTagSize];
            let dataLen = 0;
            let tagLenSize = 0;

            if (berTagLen == 0x81) {
                tagLenSize = (expectedTagSize + 2);
                dataLen = wrappedData[i + expectedTagSize + 1];
            }
            else if (berTagLen == 0x82) {
                tagLenSize = (expectedTagSize + 3);
                dataLen = wrappedData[i + expectedTagSize + 1];
                dataLen = (dataLen << 8) + wrappedData[i + expectedTagSize + 2];
            }
            else if (berTagLen == 0x83) {
                tagLenSize = (expectedTagSize + 4);
                dataLen = wrappedData[i + expectedTagSize + 1];
                dataLen = (dataLen << 8) + wrappedData[i + expectedTagSize + 2];
                dataLen = (dataLen << 8) + wrappedData[i + expectedTagSize + 3];
            }
            else if (berTagLen == 0x84) {
                tagLenSize = (expectedTagSize + 5);
                dataLen = wrappedData[i + expectedTagSize + 1];
                dataLen = (dataLen << 8) + wrappedData[i + expectedTagSize + 2];
                dataLen = (dataLen << 8) + wrappedData[i + expectedTagSize + 3];
                dataLen = (dataLen << 8) + wrappedData[i + expectedTagSize + 4];
            }
            else {
                tagLenSize = (expectedTagSize + 1);
                dataLen = wrappedData[i + expectedTagSize];
            }

            let k = 0;
            for (let expectedTag of expectedTags) {
                if (expectedTag === wrappedData[i + k]) {
                    k++;
                } else break;
            }
            if (k == expectedTagSize) {
                console_ely.log(`     ${util.uint8ArrayToHexString(expectedTags)}`);
                return skip == false ? wrappedData.slice(i + tagLenSize, dataLen + tagLenSize + i) : wrappedData.slice(dataLen + tagLenSize + i);
            }

            i += (tagLenSize + dataLen);
        }

        return null;
    }

    unwrapTlvs(expectedTags, wrappedData, skip = false) {
        for (let expectedTag of expectedTags) {
            wrappedData = expectedTag.skip >= 0 ? wrappedData.slice(expectedTag.skip) : this.unwrapTlv(expectedTag, wrappedData, wrappedData.length, skip);
            if (wrappedData == null) {
                break;
            }
        }
        return wrappedData;
    }

    //
    getBioHeader(data) {
        let header = {
            ver: null, type: null, subType: null, creationDate: null, validityPeriod: null,
            creatorOfBrd: null, formatOwner: null, formatType: null
        };
        let tagList = [[0xA1]];
        let bht = this.unwrapTlvs(tagList, data);
        header.ver = this.unwrapTlv([0x80], bht);
        header.type = this.unwrapTlv([0x81], bht);
        header.subType = this.unwrapTlv([0x82], bht);
        header.creationDate = this.unwrapTlv([0x83], bht);
        header.validityPeriod = this.unwrapTlv([0x85], bht);
        header.creatorOfBrd = this.unwrapTlv([0x86], bht);
        header.formatOwner = this.unwrapTlv([0x87], bht);
        header.formatType = this.unwrapTlv([0x88], bht);
        return header;
    }

    // find index of a subarray in an array
    findIndex(array, subarray, index) {
        index.val = -1;
        if ((array.toString()).includes(subarray.toString())) {
            for (let i = 0, j = 0; i < array.length; i++) {
                for (j = 0; j < subarray.length; j++) {
                    if (array[i + j] != subarray[j])
                        break;
                }
                if (j == subarray.length) {
                    index.val = i;
                    return true;
                }
            }
        }
        return false;
    }

    // 
    getImageDetails(data) {
        const patternJp2 = [0x00, 0x00, 0x00, 0x0C, 0x6A];
        const patternPng = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A];
        const patternJpg = [0xFF, 0xD8, 0xFF];
        const patternWsqSoi = [0xFF, 0xA0];
        const patternWsqEoi = [0xFF, 0xA1];

        const image = { header: {}, data: [], type: IMGTYPE.UNKNOWN };
        image.header = this.getBioHeader(data);

        let index = { val: -1 };
        let type;
        if (this.findIndex(data, patternJp2, index)) {
            type = IMGTYPE.JP2;
        } else if (this.findIndex(data, patternPng, index)) {
            type = IMGTYPE.PNG;
        } else if (this.findIndex(data, patternJpg, index)) {
            type = IMGTYPE.JPG;
        } else if ((this.findIndex(data, patternWsqSoi, index)) && (this.findIndex(data, patternWsqEoi, index))) {
            type = IMGTYPE.WSQ;
        } /*else if ((image.header.formatType != null) && (image.header.formatType == 0x02)) {
            type = IMGTYPE.WSQ; // todo: WSQ decoder to be added
            index.val = 0x2E; // offset at which WSQ SOI (FF A0) exists 
        }*/
        if (index.val == -1) {
            console_ely.log("Invalid image type");
        } else {
            image.type = type;
            console_ely.log(`image.type: ${image.type}`);
            if (image.type == IMGTYPE.WSQ) {
                const imgData = this.device.retrieveWsqData(data);
                if (imgData != null) {
                    // TODO: If multiple FPs in a single template, this needs to be worked
                    image.data = imgData[0];
                }
            } else
                image.data = new Uint8Array(data.slice(index.val));
        }
        return image;
    }

    parseIdlMrz(mrzData, idlType) {
        const data = { fields: { familyName: '', givenName: '', birthDate: '', issueDate: '', expirationDate: '', issuingCountry: '', issuingAuthority: '', documentNumber: '', categories : ([]) } };

        if (idlType == "IDL EU") {

            // Family name
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x04]];
            var wrappedData = this.unwrapTlvs(tagList, mrzData);
            data.fields.familyName = util.fromUtf8Array(wrappedData);

            // Given name
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x05]];
            var wrappedData = this.unwrapTlvs(tagList, mrzData);
            data.fields.givenName = util.fromUtf8Array(wrappedData);

            // Date of birth (IDL_EU cards store date in ddmmyyyy format)
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x06]];
            var wrappedData = this.unwrapTlvs(tagList, mrzData);
            var date = util.toHexString(wrappedData, '');
            data.fields.birthDate = util.buildDate(date.substring(0, 2), date.substring(2, 4), date.substring(4, 8), 'dd/mm/yyyy');

            // Date of issue
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x0A]];
            var wrappedData = this.unwrapTlvs(tagList, mrzData);
            var date = util.toHexString(wrappedData, '');
            data.fields.issueDate = util.buildDate(date.substring(0, 2), date.substring(2, 4), date.substring(4, 8), 'dd/mm/yyyy');

            // Date of expiry
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x0B]];
            var wrappedData = this.unwrapTlvs(tagList, mrzData);
            var date = util.toHexString(wrappedData, '');
            data.fields.expirationDate = util.buildDate(date.substring(0, 2), date.substring(2, 4), date.substring(4, 8), 'dd/mm/yyyy');

            // Issuing country
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x03]];
            var wrappedData = this.unwrapTlvs(tagList, mrzData);
            data.fields.issuingCountry = util.fromUtf8Array(wrappedData);

            // Issuing authority
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x0C]];
            var wrappedData = this.unwrapTlvs(tagList, mrzData);
            data.fields.issuingAuthority = util.fromUtf8Array(wrappedData);

            // Document number
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x0E]];
            var wrappedData = this.unwrapTlvs(tagList, mrzData);
            data.fields.documentNumber = util.fromUtf8Array(wrappedData);

        } else {

            var tagList = [[0x61], [0x5F, 0x1F]];
            var wrappedData = this.unwrapTlvs(tagList, mrzData);

            // Family name
            var len = wrappedData[0];
            wrappedData = wrappedData.slice(1);
            data.fields.familyName = util.fromUtf8Array(wrappedData, len);
            wrappedData = wrappedData.slice(len);

            // Given name
            len = wrappedData[0];
            wrappedData = wrappedData.slice(1);
            data.fields.givenName = util.fromUtf8Array(wrappedData, len);
            wrappedData = wrappedData.slice(len);

            // Date of birth (IDL cards store date in yyyymmdd format)
            len = 4;
            var date = util.toHexString(wrappedData, '', len);
            data.fields.birthDate = util.buildDate(date.substring(6, 8), date.substring(4, 6), date.substring(0, 4), 'dd/mm/yyyy');
            wrappedData = wrappedData.slice(len);

            // Date of issue
            len = 4;
            var date = util.toHexString(wrappedData, '', len);
            data.fields.issueDate = util.buildDate(date.substring(6, 8), date.substring(4, 6), date.substring(0, 4), 'dd/mm/yyyy');
            wrappedData = wrappedData.slice(len);

            // Date of expiry
            len = 4;
            var date = util.toHexString(wrappedData, '', len);
            data.fields.expirationDate = util.buildDate(date.substring(6, 8), date.substring(4, 6), date.substring(0, 4), 'dd/mm/yyyy');
            wrappedData = wrappedData.slice(len);

            // Issuing country
            len = 3;
            data.fields.issuingCountry = util.fromUtf8Array(wrappedData, len);
            wrappedData = wrappedData.slice(len);

            // Issuing authority
            len = wrappedData[0];
            wrappedData = wrappedData.slice(1);
            data.fields.issuingAuthority = util.fromUtf8Array(wrappedData, len);
            wrappedData = wrappedData.slice(len);

            // Document number
            len = wrappedData[0];
            wrappedData = wrappedData.slice(1);
            data.fields.documentNumber = util.fromUtf8Array(wrappedData, len);
            wrappedData = wrappedData.slice(len);
        }

        // Categories
        let categories = '';
        var tagList = [[0x61], [0x7F, 0x63]];
        var wrappedData = this.unwrapTlvs(tagList, mrzData);
        if (wrappedData?.length && wrappedData[0] == 0x02) {
            const nb_cat_len = wrappedData [1];
            const nb_cat  = wrappedData[2];
            let j = 3;
            for (let i = 0; i < nb_cat; i++) {
                if (wrappedData[j] != 0x87) {
                    break;
                }
                len = wrappedData[j + 1];
                const category = wrappedData.slice(j + 2, j + 2 + len);
                j = j + 2 + len;
                categories = util.toHexString(category, '');
                len = categories.length;
                categories = categories.padEnd(len + 2, '3b');
                data.fields.categories[i] = categories;
            }
            // [test]
            //data.fields.categories[i++] = '423b010120123b010120223b5330313b3c3d3b383030303b';
            //data.fields.categories[i++] = '433b010120123b010120223b5330313b3c3d3b383030303b';
        }

        return {
            status: "success",
            data: data
        };
    }

    parseEmrtdDgx(dgId, dgData) {
        let status = 'success';
        let data = { field: {} };
    
        // Set tagList and dataField based on dgId
        if (dgId == "11") {
            // Unwrap data and remove target tag [0x5C]
            let wrappedData = this.unwrapTlv([0x6B], dgData);
            wrappedData = this.unwrapTlv([0x5C], wrappedData, wrappedData.length, true);
            let wrappedData_A0 = this.unwrapTlvs([[0x5F, 0x0E]], wrappedData, true);

            data = { fields: {
                fullName: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x0E]], wrappedData)),
                otherNames: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x0F]], wrappedData_A0)),
                personalNumber: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x10]], wrappedData)),
                fullDateOfBirth: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x2B]], wrappedData)),
                placeOfBirth: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x11]], wrappedData)),
                permanentAddress: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x42]], wrappedData)),
                telephone: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x12]], wrappedData)),
                profession: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x13]], wrappedData)),
                title: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x14]], wrappedData)),
                personalSummary: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x15]], wrappedData)),
                proofOfCitizenship: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x16]], wrappedData)),
                otherValidTdNumbers: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x17]], wrappedData)),
                custodyInfo: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x18]], wrappedData))
            } };
        } else if (dgId == "12") {
            // Unwrap data and remove target tag [0x5C]
            let wrappedData = this.unwrapTlv([0x6C], dgData);
            wrappedData = this.unwrapTlv([0x5C], wrappedData, wrappedData.length, true);
            let wrappedData_A0 = this.unwrapTlvs([[0x5F, 0x26]], wrappedData, true);

            data = { fields: {
                issuingAuthority: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x19]], wrappedData)),
                dateOfIssue: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x26]], wrappedData)),
                nameOfOtherPersons: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x1A]], wrappedData_A0)),
                endorsementsAndObservations: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x1B]], wrappedData)),
                taxExitRequirements: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x1C]], wrappedData)),
                docFrontImageData: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x1D]], wrappedData)),
                docRearImageData: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x1E]], wrappedData)),
                docPersoDateAndTime: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x55]], wrappedData)),
                serNumOfPersoSystem: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x56]], wrappedData))
            } };
        }
        else if (dgId == "13") {
            // Unwrap data and remove target tag [0x5C]
            let wrappedData = this.unwrapTlv([0x6D], dgData);
            wrappedData = this.unwrapTlv([0x5C], wrappedData, wrappedData.length, true);

            data = { fields: {
                number: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x58]], wrappedData)),
                tag_5f59: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x59]], wrappedData)),
                tag_5f60: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x60]], wrappedData)),
                district: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x61]], wrappedData)),
                municipality: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x62]], wrappedData)),
                location: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x63]], wrappedData)),
                office: util.fromUtf8Array(this.unwrapTlvs([[0x5F, 0x64]], wrappedData))
            } };
        }
        else {
            status = 'failed';
        }

        // Return the parsed fields
        return {
            status: status,
            data: data 
        };
    }

    cleanup() {
        this.datagroup.cleanup();
        this.openPace.cleanup();
    }
}