let Module = null;
let scriptElement = null;

class Util {

    /* load external scripts like, emscripten openpace.js and openjpeg.js.*/
    loadJS(file) {
        // DOM: Create the script element
        let jsElm = document.createElement("script");
        // set the type attribute
        jsElm.type = "application/javascript";
        // make the script element load file
        jsElm.src = file;
        // finally insert the element to the body element in order to load the script
        document.body.appendChild(jsElm);
    }

    /* remove external scripts like, emscripten openpace.js and openjpeg.js.*/
    removeJS(fileName, fileType) {
        let targetElement = (fileType == "js") ? "script" : ((fileType == "css") ? "link" : "none"); // determine element type to create nodelist from
        let targetAttr = (fileType == "js") ? "src" : ((fileType == "css") ? "href" : "none"); // determine corresponding attribute to test for
        let elements = document.getElementsByTagName(targetElement)
        for (let i = elements.length; i >= 0; i--) { // search backwards within nodelist for matching elements to remove
            if (elements[i] && elements[i].getAttribute(targetAttr) !== null && elements[i].getAttribute(targetAttr).includes(fileName))
                elements[i].parentNode.removeChild(elements[i]) // remove element by calling parentNode.removeChild()
        }
    }

    byteToHexStr(byData) {
        return (`0${(byData & 0xFF).toString(16)}`).slice(-2);
    }

    hexStrToInt(str) {
        return parseInt(str, 16);
    }

    hexStrToIntStr(str) {
        return ((`0${this.hexStrToInt(str)}`).slice(-2).toString());
    }

    byteArrayToInt(byteArray) {
        let val = 0;
        if ((byteArray != null) && (byteArray.length > 0)) {
            for (let i = (byteArray.length - 1), j = 0; i >= 0; --i, j++)
                val += (byteArray[i] << (j * 8));
        }
        return val;
    }

    // convert byte array into hexadecimal string
    toHexStringCa(byteArray) {
        return Array.prototype.map.call(byteArray, (byte) => (`0${(byte & 0xFF).toString(16)}`).slice(-2)).join('');
    }

    // convert byte array into hexadecimal string
    toHexString(byteArray, delimiter = ' ', len = 0) {
        if (byteArray?.length) {
            if (len && (len < byteArray.length)) {
                byteArray = byteArray.slice(0, len);
            }
            return Array.prototype.map.call(byteArray, (byte) => (`0${(byte & 0xFF).toString(16)}`).slice(-2)).join(delimiter);
        }
        return "";
    }

    // convert byte array into hexadecimal string
    strToByteArray(byteStr) {
        return new TextEncoder("utf-8").encode(byteStr);
    }

    // convert ASCII string to hex string
    asciiToHexString(asciiStr) {
        return this.asciiToHex(asciiStr).join(' ');
    }
    asciiToHex(str) {
        let arr = [];
        for (let n = 0, l = str.length; n < l; n++) {
            let hex = Number(str.toString().charCodeAt(n)).toString(16);
            arr.push(hex);
        }
        return arr;
    }

    hexToBase64(str) {
        return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
    }

    hexToAscii(hex) {
        if (hex == undefined) { return ""; }
        let hexStr = hex.toString(); //force conversion
        let str = '';
        for (let i = 0;
            (i < hexStr.length && hexStr.substr(i, 2) !== '00'); i += 2)
            str += String.fromCharCode(parseInt(hexStr.substr(i, 2), 16));
        return str;
    }

    toUtf8Array(str) {
        let utf8 = [];
        for (let i = 0; i < str.length; i++) {
            let charCode = str.charCodeAt(i);
            if (charCode < 0x80) utf8.push(charCode);
            else if (charCode < 0x800) {
                utf8.push(0xc0 | (charCode >> 6),
                    0x80 | (charCode & 0x3f));
            } else if (charCode < 0xd800 || charCode >= 0xe000) {
                utf8.push(0xe0 | (charCode >> 12),
                    0x80 | ((charCode >> 6) & 0x3f),
                    0x80 | (charCode & 0x3f));
            }
            // surrogate pair
            else {
                i++;
                // UTF-16 encodes 0x10000-0x10FFFF by
                // subtracting 0x10000 and splitting the
                // 20 bits of 0x0-0xFFFFF into two halves
                charCode = 0x10000 + (((charCode & 0x3ff) << 10) |
                    (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charCode >> 18),
                    0x80 | ((charCode >> 12) & 0x3f),
                    0x80 | ((charCode >> 6) & 0x3f),
                    0x80 | (charCode & 0x3f));
            }
        }
        return utf8;
    }

    fromUtf8Array(data, len = 0) { // array of bytes
        let str = '';

        if (!len)
            len = data?.length;

        for (let i = 0; i < len; i++) {
            let value = data[i];

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
                let charCode = ((value & 0x07) << 18 | (data[i + 1] & 0x3F) << 12 | (data[i + 2] & 0x3F) << 6 | data[i + 3] & 0x3F) - 0x010000;

                str += String.fromCharCode(charCode >> 10 | 0xD800, charCode & 0x03FF | 0xDC00);
                i += 3;
            }
        }
        return str;
    }

    strToArrayBuffer(str) {
        let buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
        let bufView = new Uint16Array(buf);
        for (let i = 0, strLen = str.length; i < strLen; i++) {
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

        for (const uint8Element of uint8Array) {
            const hex = uint8Element.toString(16).padStart(2, "0");
            hexString += hex + separator;
        }

        // Remove the trailing separator (space at the end)
        hexString = hexString.trimEnd(separator);
        return hexString.toUpperCase();
    }

    /*
     * Format hexadecimal string in a pattern for printing purpose.
     */
    formatHexPattern(hexString) {
        let formattedString = '';
        const hexArray = hexString.split(' ');

        for (let i = 0; i < hexArray.length; i++) {
            formattedString += hexArray[i];

            formattedString += (i + 1) % 24 === 0 ? '\n' : ' ';
        }

        return formattedString.trim();
    }

    memcpy(destination, source, length, destIndex, srcIndex) {
        if (length >= 0) {
            // Convert source and destination to typed arrays
            let src = new Uint8Array(source.buffer || source, source.byteOffset || srcIndex, length);
            let dst = new Uint8Array(destination.buffer || destination, destination.byteOffset || destIndex, length);

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


    appendUint8Arrays(existingArray, newData, length = 0) {
        console_ely.logFuncName(this.appendUint8Arrays.name);
        if (length === 0)
            length = newData.length;
        const newArray = new Uint8Array(existingArray.length + length);
        newArray.set(existingArray, 0);
        newArray.set(newData, existingArray.length);
        return newArray;
    }

    /**
     * Reads a file and converts it into a byte array (Uint8Array).
     * 
     * @param {File} file - The file to be read, typically from an HTML file input element.
     * @returns {Promise<Uint8Array>} A promise that resolves to a `Uint8Array` representing the file's content.
     */
    readFileAsArrayBuffer(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(new Uint8Array(reader.result));
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }

    /**
     * Processes the list of selected files and converts them into byte arrays.
     * 
     * @param {FileList|Array} listOfFiles - The list of files to be processed, typically from an HTML file input element.
     * @returns {Promise<Uint8Array[]>} A promise that resolves to an array of `Uint8Array`, where each element represents the byte array of a file.
     */
    async fileSelectionHandler(listOfFiles) {
        console_ely.logFuncName(this.fileSelectionHandler.name);
        const byteArrayFile = [];

        const filesArray = Array.from(listOfFiles);

        if (filesArray.length > 0) {
            // Read each file and store the result in byteArrayFile
            for (let index = 0; index < filesArray.length; index++) {
                byteArrayFile[index] = await this.readFileAsArrayBuffer(filesArray[index]);
            }
        }

        return byteArrayFile;
    }

    /**
     * Processes the selected files from the given file input element and retrieves their data as byte arrays.
     * 
     * @param {HTMLInputElement} fileInput - The file input element containing the selected files.
     * @returns {Promise<Uint8Array[]|null>} A promise that resolves to an array of byte arrays representing the file data,
     * or null if no files are selected.
     */
    async processAndRetrieveFileData(fileInput) {
        const listOfFiles = fileInput.files;

        // Return null if no files are selected
        if (!listOfFiles || listOfFiles.length === 0) {
            return null;
        }

        const byteArray = await this.fileSelectionHandler(listOfFiles);

        // Access the byte arrays corresponding to each file
        let fileData = null;
        Array.from(listOfFiles).forEach((file, index) => {
            fileData = byteArray[index];
        });

        return fileData;
    }

    async readDefaultCertificates(filename) {
        console_ely.logFuncName(this.readDefaultCertificates.name);
        try {
            // Check filename presence
            if (filename.search("/null") != -1) {
                return null;
            }
            const response = await fetch(filename);
            if (response.status == 404) {
                return null;
            }
            const data = await response.arrayBuffer();
            return new Uint8Array(data);
        } catch (error) {
            console.error('Error reading file: ', error);
            throw error;
        }
    }

    getSetCertCookie(data, cookie) {
        if (data) {
            localStorage.setItem(cookie, data);
            // NOTE: It will be saved as a string containing comma separated integers
        } else if (localStorage.getItem(cookie)) {
            let savedData = localStorage.getItem(cookie).split(",");
            let outData = [];
            for (let i = 0; i < savedData.length; i++)
                outData[i] = parseInt(savedData[i]);
            data = outData;
        }
        return data;
    }

    isElyctisMultiSlotReader(readerName) {
        const REGEX_MULTISLOT = /CL [Rr]{1}eader [A-F0-9]{16} [0-9]{1}/; // Uses Proprietary CCID driver
        return (readerName.match(REGEX_MULTISLOT) != null);
    }

    isElyctisIdReader(readerName) {
        const REGEX_IDREADER = /ELYCTIS CL [Rr]{1}eader [A-F0-9]{12} [0-9]{1}/; // Uses Microsoft CCID driver
        return (readerName.match(REGEX_IDREADER) != null);
    }

    selectElyctisReader(readers) {
        const keyword1 = "ELYCTIS".toLowerCase();
        const keyword2 = "CL ".toLowerCase();

        // Check if readers is undefined or null
        if (!readers) {
            console.error("Error: readers is undefined or null");
            return null;
        }

        // Check if readers is a string and convert it to an array
        if (typeof readers === 'string') {
            readers = [readers];
        }

        // Ensure readers is an array before proceeding
        if (!Array.isArray(readers)) {
            console.error("Error: readers should be an array or a string");
            return null;
        }

        for (const readerElement of readers) {
            const reader = readerElement.toLowerCase();
            if (reader.includes(keyword1) && reader.includes(keyword2))
                return readerElement;
        }
        return null;
    }

    getVersionString(readerName, mj, mi, bld) {
        if (this.isElyctisIdReader(readerName)) {
            // encoding in hexadecimal
            mj = this.hexStrToIntStr(mj);
            mi = this.hexStrToIntStr(mi);
            bld = this.hexStrToIntStr(bld);
        } // else encoding in bcd
        let version = `FW ${mj}.${mi}.${bld}`;

        return (`${readerName}\t\t${version}`);
    }

    buildDate(d, m, y, format) {
        let date = '';
        let ylen = y.length;
        let mlen = m.length;
        let dlen = d.length;
        if (ylen && mlen && dlen) {
            switch (format) {
                case 'yymmdd': // YEAR_FIRST_WITH_NO_SEPARATOR
                case 'yyyymmdd':
                    return date.padEnd(ylen, y).padEnd(ylen + mlen, m).padEnd(ylen + mlen + dlen, d);
                case 'yy/mm/dd': // YEAR_FIRST_WITH_SLASH_SEPARATOR
                case 'yyyy/mm/dd':
                    return date.padEnd(ylen, y).padEnd(ylen + 1, "/").padEnd(ylen + 1 + mlen, m).padEnd(ylen + 1 + mlen + 1, "/").padEnd(ylen + 1 + mlen + 1 + dlen, d);
                case 'yy-mm-dd': // YEAR_FIRST_WITH_HYPHEN_SEPARATOR
                case 'yyyy-mm-dd':
                    return date.padEnd(ylen, y).padEnd(ylen + 1, "-").padEnd(ylen + 1 + mlen, m).padEnd(ylen + 1 + mlen + 1, "-").padEnd(ylen + 1 + mlen + 1 + dlen, d);
                case 'ddmmyy': // YEAR_LAST_WITH_NO_SEPARATOR
                case 'ddmmyyyy':
                    return date.padEnd(dlen, d).padEnd(dlen + mlen, m).padEnd(dlen + mlen + ylen, y);
                default:
                case 'dd/mm/yy': // YEAR_LAST_WITH_SLASH_SEPARATOR
                case 'dd/mm/yyyy':
                    return date.padEnd(dlen, d).padEnd(dlen + 1, "/").padEnd(dlen + 1 + mlen, m).padEnd(dlen + 1 + mlen + 1, "/").padEnd(dlen + 1 + mlen + 1 + ylen, y);
                case 'dd-mm-yy': // YEAR_LAST_WITH_HYPHEN_SEPARATOR
                case 'dd-mm-yyyy':
                    return date.padEnd(dlen, d).padEnd(dlen + 1, "-").padEnd(dlen + 1 + mlen, m).padEnd(dlen + 1 + mlen + 1, "-").padEnd(dlen + 1 + mlen + 1 + ylen, y);
            }
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
            return frameInfo.isSigned ? new Int16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2) : new Uint16Array(decodedBuffer.buffer, decodedBuffer.byteOffset, decodedBuffer.byteLength / 2);
        } else {
            return decodedBuffer;
        }
    }

    colorToCanvas(frameInfo, pixelData, imageData) {
        let outOffset = 0;
        const bytesPerSample = (frameInfo.bitsPerSample <= 8) ? 1 : 2;
        let planeSize = frameInfo.width * frameInfo.height * bytesPerSample;
        let shift = frameInfo.bitsPerSample > 8 ? 8 : 0;
        let inOffset = 0;

        for (let y = 0; y < frameInfo.height; y++) {
            for (let x = 0; x < frameInfo.width; x++) {
                imageData.data[outOffset++] = pixelData[inOffset++] >> shift;
                imageData.data[outOffset++] = pixelData[inOffset++] >> shift;
                imageData.data[outOffset++] = pixelData[inOffset++] >> shift;
                imageData.data[outOffset++] = 255;
            }
        }
    }

    grayToCanvas(frameInfo, pixelData, imageData) {
        let outOffset = 0;
        let planeSize = frameInfo.width * frameInfo.height;
        let inOffset = 0;

        let minMax = this.getMinMax(frameInfo, pixelData);
        //console.log(minMax);
        let dynamicRange = minMax.max - minMax.min;
        //console.log('dynamicRange=', dynamicRange);
        let bitsOfData = 1;
        while (dynamicRange > 1) {
            dynamicRange >>= 1;
            bitsOfData++;
        }
        //console.log('bitsOfData = ', bitsOfData);
        const bitShift = bitsOfData - 8;
        const offset = -minMax.min;
        //console.log('bitShift=', bitShift);
        //console.log('offset=', offset);

        let value;
        for (let y = 0; y < frameInfo.height; y++) {
            for (let x = 0; x < frameInfo.width; x++) {
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

        const resolutionAtLevel = decoder.calculateSizeAtDecompositionLevel(decodeLevel);
        frameInfo = decoder.getFrameInfo();

        // Get decoded data
        let decodedBuffer = decoder.getDecodedBuffer();
        frameInfo.width = resolutionAtLevel.width;
        frameInfo.height = resolutionAtLevel.height;
        frameInfo = decoder.getFrameInfo();

        return [frameInfo, decodedBuffer];
    }

    getDecodedImageData(image) {
        let dataURL;
        if (image.type == IMGTYPE.UNKNOWN) {
            dataURL = '';
        } else if (image.type == IMGTYPE.JP2) {
            // image format is JP2
            let t0 = new Date().getTime();
            let [rgbImage, decodedBuffer] = this.decodeJpeg2K(image.data);
            console_ely.log(`w x h: (${rgbImage.width} x ${rgbImage.height})`);
            console_ely.log('Timetaken to decode: ', `${(new Date().getTime()) - t0} ms`);
            const pixelData = this.getPixelData(rgbImage, decodedBuffer);
            let canvas = document.createElement('canvas');
            canvas.width = rgbImage.width;
            canvas.height = rgbImage.height;
            let ctx = canvas.getContext('2d');
            let imageData = ctx.createImageData(rgbImage.width, rgbImage.height);
            if (rgbImage.componentCount > 1)
                this.colorToCanvas(rgbImage, pixelData, imageData);
            else {
                this.grayToCanvas(rgbImage, pixelData, imageData);
            }
            ctx.putImageData(imageData, 0, 0);
            dataURL = canvas.toDataURL();
        } else if (image.type == IMGTYPE.WSQ) {
            dataURL = `data:image/jpeg;base64,${image.data}`;
        } else {
            // image format is JPG, PNG
            let buffer = this.hexToBase64(this.toHexString(image.data));
            dataURL = `data:image/jpeg;base64,${buffer}`;
        }
        if (dataURL == '') { gui.appendStatusTextTag(image.type, "fail"); }
        else { gui.appendStatusTextTag(image.type, "success"); }
        return dataURL;
    }

    getBioSubTypeName(header) {
        let type = header.type;
        let subType = header.subType;
        let name = '';
        if (type == 0x08) { // Mandatory field for fingerprint
            switch (subType & 0x03) {
                case 0x01: { name += 'Right'; break }
                case 0x02: { name += 'Left'; break }
                default: { name += 'Unknown'; break }
            }
            switch (subType & 0x1C) {
                case 0x04: { name += '-Thumb'; break }
                case 0x08: { name += '-Pointer'; break }
                case 0x0C: { name += '-Middle'; break }
                case 0x10: { name += '-Ring'; break }
                case 0x14: { name += '-Little'; break }
                default: { name += '-Unspecified'; break }
            }
            name += ' finger';
        } else {
            switch (subType & 0x03) {
                case 0x01: { name += 'Right'; break }
                case 0x02: { name += 'Left'; break }
                default: { name += 'Unknown'; break }
            }
        }
        return name;
    }

    // stress Test
    // initiate reading
    loopStart() {
        initApp();
    }

    // stress Test
    startDelayedFunction() {
        stressTestLoopCount++;
        console.log(`stressTestLoopCount: ${stressTestLoopCount}`);
        timerId = setTimeout(this.loopStart, 2000);
    }
}
