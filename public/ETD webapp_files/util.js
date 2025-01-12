class Util {

    /* load external scripts like, emscripten openpace.js and openjpeg.js.*/
    loadJS(file) {
        // DOM: Create the script element
        var jsElm = document.createElement("script");
        // set the type attribute
        jsElm.type = "application/javascript";
        // make the script element load file
        jsElm.src = file;
        // finally insert the element to the body element in order to load the script
        document.body.appendChild(jsElm);
    }

    /* remove external scripts like, emscripten openpace.js and openjpeg.js.*/
    removeJS(fileName, fileType) {
        var targetElement = (fileType == "js") ? "script" : ((fileType == "css") ? "link" : "none"); // determine element type to create nodelist from
        var targetAttr = (fileType == "js") ? "src" : ((fileType == "css") ? "href" : "none"); // determine corresponding attribute to test for
        var elements = document.getElementsByTagName(targetElement)
        for (var i = elements.length; i >= 0; i--) { // search backwards within nodelist for matching elements to remove
            if (elements[i] && elements[i].getAttribute(targetAttr) !== null && elements[i].getAttribute(targetAttr).indexOf(fileName) != -1)
                elements[i].parentNode.removeChild(elements[i]) // remove element by calling parentNode.removeChild()
        }
    }

    byteToHexStr(byData) {
        return ('0' + (byData & 0xFF).toString(16)).slice(-2);
    }

    hexStrToInt(str) {
        return parseInt(str, 16);
    }

    hexStrToIntStr(str) {
        return (('0' + this.hexStrToInt(str)).slice(-2).toString());
    }

    byteArrayToInt(byteArray) {
        var val = 0;
        if ((byteArray != null) && (byteArray.length > 0)) {
            for (var i = (byteArray.length - 1), j = 0; i >= 0; --i, j++)
                val += (byteArray[i] << (j * 8));
        }
        return val;
    }

    // convert byte array into hexadecimal string
    toHexStringCa(byteArray) {
        return Array.prototype.map.call(byteArray, function (byte) {
            return ('0' + (byte & 0xFF).toString(16)).slice(-2);
        }).join('');
    }

    // convert byte array into hexadecimal string
    toHexString(byteArray, delimiter = ' ', len = 0) {
        if (byteArray && byteArray.length) {
            if (len && (len < byteArray.length)) {
                byteArray = byteArray.slice(0, len);
            }
            return Array.prototype.map.call(byteArray, function (byte) {
                return ('0' + (byte & 0xFF).toString(16)).slice(-2);
            }).join(delimiter);
        }
        return "";
    }

    // convert byte array into hexadecimal string
    strToByteArray(byteStr) {
        let u8Array = new TextEncoder("utf-8").encode(byteStr);
        return u8Array;
    }

    // convert ASCII string to hex string
    asciiToHexString(asciiStr) {
        return this.asciiToHex(asciiStr).join(' ');
    }
    asciiToHex(str) {
        var arr = [];
        for (var n = 0, l = str.length; n < l; n++) {
            var hex = Number(str.toString().charCodeAt(n)).toString(16);
            arr.push(hex);
        }
        return arr;
    }

    hexToBase64(str) {
        return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    }

    hexToAscii(hex) {
        if (hex == undefined) { return ""; }
        var hexStr = hex.toString(); //force conversion
        var str = '';
        for (var i = 0;
            (i < hexStr.length && hexStr.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
        return str;
    }

    toUtf8Array(str) {
        var utf8 = [];
        for (var i = 0; i < str.length; i++) {
            var charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6),
                    0x80 | (charcode & 0x3f));
            } else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charcode = 0x10000 + (((charcode & 0x3ff) << 10) |
                    (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >> 18),
                    0x80 | ((charcode >> 12) & 0x3f),
                    0x80 | ((charcode >> 6) & 0x3f),
                    0x80 | (charcode & 0x3f));
            }
        }
        return utf8;
    }

    fromUtf8Array(data, len = 0) { // array of bytes
        var str = '', i;
        if (!len)
            len = data.length;

        for (i = 0; i < len; i++) {
            var value = data[i];

            if (value < 0x80) {
                str += String.fromCharCode(value);
            } else if (value > 0xBF && value < 0xE0) {
                str += String.fromCharCode((value & 0x1F) << 6 | data[i + 1] & 0x3F);
                i += 1;
            } else if (value > 0xDF && value < 0xF0) {
                str += String.fromCharCode((value & 0x0F) << 12 | (data[i + 1] & 0x3F) << 6 | data[i + 2] & 0x3F);
                i += 2;
            } else {
                // surrogate pair
                var charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;

                str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00);
                i += 3;
            }
        }
        return str;
    }

    strToArrayBuffer(str) {
        var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        return buf;
    }

    /*
     * uint8ArrayToHexString converts each element in the Uint8Array to a two-digit hexadecimal string using toString(16).
     * parameters:
     *     - Uint8Array to convert to Hex string.
     *     - addSpace boolean indicating whether to include a space between hex values or not.
     */
    uint8ArrayToHexString(uint8Array, addSpace) {
        let hexString = "";
        const separator = addSpace ? " " : "";

        for (let i = 0; i < uint8Array.length; i++) {
            const hex = uint8Array[i].toString(16).padStart(2, "0");
            hexString += hex + separator;
        }

        // Remove the trailing separator (space at the end)
        hexString = hexString.trimEnd(separator);
        hexString = hexString.toUpperCase();

        return hexString;
    }

    /*
     * Format hexadecimal string in a pattern for printing purpose.
     */
    formatHexPattern(hexString) {
        let formattedString = '';
        const hexArray = hexString.split(' ');

        for (let i = 0; i < hexArray.length; i++) {
            formattedString += hexArray[i];

            if ((i + 1) % 24 === 0) {
                formattedString += '\n';
            } else {
                formattedString += ' ';
            }
        }

        return formattedString.trim();
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
        } else if (payLoad.length <= 0xFFFFFF) {
            wrappedData.push(0x83);
            wrappedData.push((payLoad.length >> 16) & 0xFF);
            wrappedData.push((payLoad.length >> 8) & 0xFF);
            wrappedData.push(payLoad.length & 0xFF);
        } else if (payLoad.length <= 0xFFFFFFFF) {
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
        var expectedTagSize = expectedTags.length;

        for (var i = 0; i < length;) {
            var berTagLen = wrappedData[i + expectedTagSize];
            var dataLen = 0;
            var tagLenSize = 0;

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

            var k = 0;
            for (var expectedTag of expectedTags) {
                if (expectedTag === wrappedData[i + k]) {
                    k++;
                } else break;
            }
            if (k == expectedTagSize) {
                console_ely.log("     " + this.uint8ArrayToHexString(expectedTags));
                if (skip == false)
                    return wrappedData.slice(i + tagLenSize, dataLen + tagLenSize + i);
                else
                    return wrappedData.slice(dataLen + tagLenSize + i);
            }

            i += (tagLenSize + dataLen);
        }

        return null;
    }

    unwrapTlvs(expectedTags, wrappedData, skip = false) {
        for (var expectedTag of expectedTags) {
            if (expectedTag.skip >= 0) {
                wrappedData = wrappedData.slice(expectedTag.skip);
            } else {
                wrappedData = this.unwrapTlv(expectedTag, wrappedData, wrappedData.length, skip);
            }
            if (wrappedData == null) {
                break;
            }
        }
        return wrappedData;
    }

    memcpy(destination, source, length, destIndex, srcIndex) {
        if (length >= 0) {
            // Convert source and destination to typed arrays
            var src = new Uint8Array(source.buffer || source, source.byteOffset || srcIndex, length);
            var dst = new Uint8Array(destination.buffer || destination, destination.byteOffset || destIndex, length);

            // Copy bytes from source to destination
            dst.set(src);
        }

        // Return the modified destination
        return destination;
    }

    // compares two Uint8Arrays element by element
    compareUint8Arrays(array1, array2) {
        return (
            array1.length === array2.length &&
            Array.from(array1).every((value, index) => value === array2[index])
        );
    }

    // find index of a subarray in an array
    findIndex(array, subarray, index) {
        index.val = -1;
        if ((array.toString()).indexOf(subarray.toString()) > -1) {
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

    appendUint8Arrays(existingArray, newData, length = 0) {
        console_ely.logFuncName(this.appendUint8Arrays.name);
        if (length === 0)
            length = newData.length;
        let newArray = new Uint8Array(existingArray.length + length);
        newArray.set(existingArray, 0);
        newArray.set(newData, existingArray.length);
        return newArray;
    }

    fileSelectionHandler(listOfFiles) {
        console_ely.logFuncName(this.fileSelectionHandler.name);
        var byteArrayFile = [listOfFiles.index];
        for (const file of listOfFiles) {
            const reader = new FileReader();
            reader.onload = function (event) {
                byteArrayFile[listOfFiles.index] = new Uint8Array(event.target.result);
            };
            reader.readAsArrayBuffer(file);
        }
        return byteArrayFile;
    }

    async readDefaultCertificates(filename) {
        console_ely.logFuncName(this.readDefaultCertificates.name);
        try {
            const response = await fetch(filename);
            let data = await response.arrayBuffer();
            return new Uint8Array(data);
        } catch (error) {
            console.error('Error reading file: ', error);
            throw error;
        }
    }

    isElyctisMultiSlotReader(readerName) {
        let REGEX_MULTISLOT = /CL [Rr]{1}eader [A-F0-9]{16} [0-9]{1}/; // Uses Proprietary CCID driver
        return (readerName.match(REGEX_MULTISLOT) != null);
    }

    isElyctisIdReader(readerName) {
        let REGEX_IDREADER = /ELYCTIS CL [Rr]{1}eader [A-F0-9]{12} [0-9]{1}/; // Uses Microsoft CCID driver
        return (readerName.match(REGEX_IDREADER) != null);
    }

    getPreferredReaderName(readers) {
        for (var i = 0; i < readers.length; i++) {
            if (readers[i].toLowerCase().match("ELYCTIS CL Reader".toLowerCase())) {
                console_ely.log("Selected reader: " + readerName);
                return readers[i];
            }
        }
    }

    getVersionString(readerName, mj, mi, bld) {
        if (this.isElyctisIdReader(readerName)) {
            // encoding in hexadecimal
            mj = this.hexStrToIntStr(mj);
            mi = this.hexStrToIntStr(mi);
            bld = this.hexStrToIntStr(bld);
        } // else encoding in bcd
        var version = "FW " + mj + "." + mi + "." + bld;

        return (readerName + '\t\t' + version);
    }

    buildDate(d, m, y, format) {
        var date = '';
        var ylen = y.length;
        var mlen = m.length;
        var dlen = d.length;
        switch (format) {
            case 'yymmdd': // YEAR_FIRST_WITH_NO_SEPARATOR
            case 'yyyymmdd':
                date = date.padEnd(ylen, y).padEnd(ylen + mlen, m).padEnd(ylen + mlen + dlen, d);
                break;
            case 'yy/mm/dd': // YEAR_FIRST_WITH_SLASH_SEPARATOR
            case 'yyyy/mm/dd':
                date = date.padEnd(ylen, y).padEnd(ylen + 1, "/").padEnd(ylen + 1 + mlen, m).padEnd(ylen + 1 + mlen + 1, "/").padEnd(ylen + 1 + mlen + 1 + dlen, d);
                break;
            case 'yy-mm-dd': // YEAR_FIRST_WITH_HYPHEN_SEPARATOR
            case 'yyyy-mm-dd':
                date = date.padEnd(ylen, y).padEnd(ylen + 1, "-").padEnd(ylen + 1 + mlen, m).padEnd(ylen + 1 + mlen + 1, "-").padEnd(ylen + 1 + mlen + 1 + dlen, d);
                break;
            case 'ddmmyy': // YEAR_LAST_WITH_NO_SEPARATOR
            case 'ddmmyyyy':
                date = date.padEnd(dlen, d).padEnd(dlen + mlen, m).padEnd(dlen + mlen + ylen, y);
                break;
            default:
            case 'dd/mm/yy': // YEAR_LAST_WITH_SLASH_SEPARATOR
            case 'dd/mm/yyyy':
                date = date.padEnd(dlen, d).padEnd(dlen + 1, "/").padEnd(dlen + 1 + mlen, m).padEnd(dlen + 1 + mlen + 1, "/").padEnd(dlen + 1 + mlen + 1 + ylen, y);
                break;
            case 'dd-mm-yy': // YEAR_LAST_WITH_HYPHEN_SEPARATOR
            case 'dd-mm-yyyy':
                date = date.padEnd(dlen, d).padEnd(dlen + 1, "-").padEnd(dlen + 1 + mlen, m).padEnd(dlen + 1 + mlen + 1, "-").padEnd(dlen + 1 + mlen + 1 + ylen, y);
                break;
        }

        return date;
    }

    getMinMax(frameInfo, pixelData) {
        const numPixels = frameInfo.width * frameInfo.height * frameInfo.componentCount;
        let min = pixelData[0];
        let max = pixelData[0];
        for (let i = 0; i < numPixels; i++) {
            if (pixelData[i] < min) {
                min = pixelData[i];
            }
            if (pixelData[i] > max) {
                max = pixelData[i];
            }
        }
        return { min, max };
    }

    getPixelData(frameInfo, decodedBuffer) {
        if (frameInfo.bitsPerSample > 8) {
            if (frameInfo.isSigned) {
                return new Int16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2);
            } else {
                return new Uint16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2);
            }
        } else {
            return decodedBuffer;
        }
    }

    colorToCanvas(frameInfo, pixelData, imageData) {
        let outOffset = 0;
        const bytesPerSample = (frameInfo.bitsPerSample <= 8) ? 1 : 2;
        let planeSize = frameInfo.width * frameInfo.height * bytesPerSample;
        let shift = 0;
        if (frameInfo.bitsPerSample > 8) {
            shift = 8;
        }
        let inOffset = 0;

        for (var y = 0; y < frameInfo.height; y++) {
            for (var x = 0; x < frameInfo.width; x++) {
                imageData.data[outOffset++] = pixelData[inOffset++] >> shift;
                imageData.data[outOffset++] = pixelData[inOffset++] >> shift;
                imageData.data[outOffset++] = pixelData[inOffset++] >> shift;
                imageData.data[outOffset++] = 255;
            }
        }
    }

    grayToCanvas(frameInfo, pixelData, imageData) {
        var outOffset = 0;
        var planeSize = frameInfo.width * frameInfo.height;
        var inOffset = 0;

        let minMax = this.getMinMax(frameInfo, pixelData);
        //console.log(minMax);
        let dynamicRange = minMax.max - minMax.min;
        //console.log('dynamicRange=', dynamicRange);
        let bitsOfData = 1;
        while (dynamicRange > 1) {
            dynamicRange = dynamicRange >> 1;
            bitsOfData++;
        }
        //console.log('bitsOfData = ', bitsOfData);
        let bitShift = bitsOfData - 8;
        const offset = -minMax.min;
        //console.log('bitShift=', bitShift);
        //console.log('offset=', offset);

        let value;
        for (var y = 0; y < frameInfo.height; y++) {
            for (var x = 0; x < frameInfo.width; x++) {
                if (frameInfo.bitsPerSample <= 8) {
                    value = pixelData[inOffset++];
                } else {
                    // Do a simple transformation to display 16 bit data:
                    //  * Offset the pixels so the smallest value is 0
                    //  * Shift the pixels to display the most significant 8 bits
                    const fullPixel = pixelData[inOffset++] + offset;
                    value = (fullPixel >> bitShift);
                }
                imageData.data[outOffset++] = value;
                imageData.data[outOffset++] = value;
                imageData.data[outOffset++] = value;
                imageData.data[outOffset++] = 255;
            }
        }
    }

    decodeJpeg2K(encodedBitStream) {
        console_ely.logFuncName(this.decodeJpeg2K.name);
        let decodeLevel = 0;
        let decodeLayer = 0;
        let frameInfo;

        // Setup
        const encodedBuffer = decoder.getEncodedBuffer(encodedBitStream.length);
        encodedBuffer.set(encodedBitStream);

        // Decode
        decoder.decodeSubResolution(decodeLevel, decodeLayer);

        let resolutionAtLevel = decoder.calculateSizeAtDecompositionLevel(decodeLevel);
        frameInfo = decoder.getFrameInfo();

        // Get decoded data
        var decodedBuffer = decoder.getDecodedBuffer();
        frameInfo.width = resolutionAtLevel.width;
        frameInfo.height = resolutionAtLevel.height;
        frameInfo = decoder.getFrameInfo();

        return [frameInfo, decodedBuffer];
    }

    getDecodedImageData(image) {
        var dataURL;
        if (image.type == webapp_config.UNKNOWN) {
            dataURL = '';
        } else if (image.type == webapp_config.JP2) {
            // image format is JP2
            var t0 = new Date().getTime();
            var [rgbImage, decodedBuffer] = util.decodeJpeg2K(image.data);
            console_ely.log("w x h: (" + rgbImage.width + " x " + rgbImage.height + ")");
            console_ely.log('Timetaken to decode: ', ((new Date().getTime()) - t0) + ' ms');
            const pixelData = this.getPixelData(rgbImage, decodedBuffer);
            var canvas = document.createElement('canvas');
            canvas.width = rgbImage.width;
            canvas.height = rgbImage.height;
            var ctx = canvas.getContext('2d');
            var imageData = ctx.createImageData(rgbImage.width, rgbImage.height);
            if (rgbImage.componentCount > 1)
                this.colorToCanvas(rgbImage, pixelData, imageData);
            else {
                this.grayToCanvas(rgbImage, pixelData, imageData);
            }
            ctx.putImageData(imageData, 0, 0);
            dataURL = canvas.toDataURL();
        } else if (image.type == webapp_config.WSQ) {
            dataURL = "data:image/jpeg;base64," + image.data;
        } else {
            // image format is JPG, PNG
            var buffer = util.hexToBase64(util.toHexString(image.data));
            dataURL = "data:image/jpeg;base64," + buffer;
        }
        if (dataURL == '') { gui.appendStatusTextTag(image.type, "fail"); }
        else { gui.appendStatusTextTag(image.type, "success"); }
        return dataURL;
    }

    getBioHeader(data) {
        var header = { ver: null, type: null, subType: null, creationDate: null, validityPeriod: null,
            creatorOfBrd: null, formatOwner: null, formatType: null };
        var tagList = [[0xA1]];
        var bht = this.unwrapTlvs (tagList, data);
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
    getBioSubTypeName (header) {
        var type = header.type;
        var subType = header.subType;
        var name = '';
        if (type == 0x08) { // Mandatory field for fingerprint
            switch (subType & 0x03) {
                case 0x01: { name += 'Right'; break }
                case 0x02: { name += 'Left'; break }
                default:   { name += 'Unknown'; break }
            }
            switch (subType & 0x1C) {
                case 0x04: { name += '-Thumb'; break }
                case 0x08: { name += '-Pointer'; break }
                case 0x0C: { name += '-Middle'; break }
                case 0x10: { name += '-Ring'; break }
                case 0x14: { name += '-Little'; break }
                default:   { name += '-Unspecified'; break }
            }
            name += ' finger';
        } else {
            switch (subType & 0x03) {
                case 0x01: { name += 'Right'; break }
                case 0x02: { name += 'Left'; break }
                default:   { name += 'Unknown'; break }
            }
        }
        return name;
    }

    getImageDetails(data) {
        const patternJp2 = [0x00, 0x00, 0x00, 0x0C, 0x6A];
        const patternPng = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A];
        const patternJpg = [0xFF, 0xD8, 0xFF];
        const patternWsqSoi = [0xFF, 0xA0];
        const patternWsqEoi = [0xFF, 0xA1];

        var image = { header: {}, data: [], type: webapp_config.UNKNOWN };
        image.header = this.getBioHeader(data);

        let index = { val: -1 };
        var type;
        if (util.findIndex(data, patternJp2, index)) {
            type = webapp_config.JP2;
        } else if (util.findIndex(data, patternPng, index)) {
            type = webapp_config.PNG;
        } else if (util.findIndex(data, patternJpg, index)) {
            type = webapp_config.JPG;
        } else if ((util.findIndex(data, patternWsqSoi, index)) && (util.findIndex(data, patternWsqEoi, index))) {
            type = webapp_config.WSQ;
        } /*else if ((image.header.formatType != null) && (image.header.formatType == 0x02)) {
            type = webapp_config.WSQ; // todo: WSQ decoder to be added
            index.val = 0x2E; // offset at which WSQ SOI (FF A0) exists 
        }*/
        if (index.val != -1) {
            image.type = type;
            console_ely.log("image.type: " + image.type);
            if (image.type == webapp_config.WSQ) {
                var imgData = bioMini.retrieveWsqData(data);
                if (imgData != null) {
                    // TODO: If multiple FPs in a single template, this needs to be worked
                    image.data = imgData[0];
                }
            } else
                image.data = new Uint8Array(data.slice(index.val));
        } else {
            console_ely.log("Invalid image type");
        }
        return image;
    }

    async loadOpenPaceModule() {
        return new Promise((resolve, reject) => {
            scriptElement = document.createElement('script');
            scriptElement.src = '/js/eactest.js';
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

    async unloadOpenPaceModule() {
        return new Promise((resolve) => {
            if (scriptElement instanceof Node && scriptElement.parentNode === document.body) {
                document.body.removeChild(scriptElement);
                scriptElement = null;
                Module = null;
            } else {
                console.log('No script to unload.');
            }
            resolve("success");
        });
    }

    async reloadOpenPaceModule() {
        var result = await this.unloadOpenPaceModule();
        if (result === "success")
            return await this.loadOpenPaceModule();
        else {
            console.log("Error: Unloading script failed.");
            return "failed";
        }
    }

    // stress Test
    // initiate reading
    loopStart() {
        initApp();
    }

    // stress Test
    startDelayedFunction() {
        stressTestLoopCount++;
        console.log("stressTestLoopCount: " + stressTestLoopCount);
        timerId = setTimeout(this.loopStart, 2000);
    }
}
