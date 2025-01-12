var deviceInfos =  null;
var deviceIndex = 0;
var gPreviewFaileCount = 0;
var pageID, gIsCaptureEnd, gIsFingeOn = false, gLfdScore;
var urlStr = "http://localhost:8084";
var aLoopflag;
var bioScannerHandle, bioScannerType = null, bioScannerName = null;
var decodedWsqData = null;
var wsqImageCount = 0;
let listOfIndices = [];

class BioMini {

    // Init BioMini Scanner
    initBioScanner() {
        console_ely.logFuncName(this.initBioScanner.name);
        pageID = Math.random();
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                type : "GET",
                url : urlStr + "/api/initDevice?dummy=" + Math.random(),
                dataType : "json",
                success : function(msg) {
                    console_ely.log("Init: " + msg.retString);
                    if(msg.retValue == 0) {
                        deviceInfos = msg.ScannerInfos;
                        bioScannerType = deviceInfos[deviceIndex].DeviceType;
                        bioScannerName = deviceInfos[deviceIndex].ScannerName;
                        bioScannerHandle = deviceInfos[deviceIndex].DeviceHandle;
                        console.log("DeviceInfos:");
                        console.log("   DeviceHandle: ", bioScannerHandle);
                        console.log("   DeviceType: ", bioScannerType);
                        console.log("   ScannerName: ", bioScannerName);
                        resolve("success");
                    } else {
                        console.log("Error: initBioScanner failed");
                        resolve("error");
                    }
                },
                error : function(request, status, error) {
                    console.log("Error: request ", request);
                    console.log("Error: status ", status);
                    console.log("Error: error ", error);
                    reject("error");
                }
            });
        });
    }

    // Get scanner details
    getScannerDetails() {
        console_ely.logFuncName(this.getScannerDetails.name);
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                type : "GET",
                url : urlStr + "/api/getScannerStatus?dummy=" + Math.random(),
                dataType : "json",
                data : {
                    sHandle: bioScannerHandle,
                    sIndex: deviceInfos[deviceIndex].DeviceIndex
                },
                success : function(msg) {
                    console_ely.log("getScannerStatus: " + msg.retString);
                    if(msg.retValue == 0) {
                        console.log("   SensorValid: ", msg.SensorValid);
                        console.log("   SensorOn: ", msg.SensorOn);
                        console.log("   IsCapturing: ", msg.IsCapturing);
                        console.log("   IsFingerOn: ", msg.IsFingerOn);
                        resolve("success");
                    } else {
                        console.log("Error: getScannerDetails failed");
                        resolve("error");
                    }
                },
                error : function(request, status, error) {
                    console.log("Error: request ", request);
                    console.log("Error: status ", status);
                    console.log("Error: error ", error);
                    reject("error");
                }
            });
        });
    }

    // Deinit BioMini scanner
    deinitBioScanner() {
        console_ely.logFuncName(this.deinitBioScanner.name);
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                type : "GET",
                url : urlStr + "/api/uninitDevice?dummy=" + Math.random(),
                dataType : "json",
                success : function(msg) {
                    deviceInfos = null;
                    resolve("success");
                },
                error : function(request, status, error) {
                    console.log("Error: request ", request);
                    console.log("Error: status ", status);
                    console.log("Error: error ", error);
                    reject("error");
                }
            });
        });
    }

    // Auto capture
    autoCapture() {
        console_ely.logFuncName(this.autoCapture.name);
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                type : "GET",
                url : urlStr + "/api/autoCapture?dummy=" + Math.random(),
                data : {
                    sHandle: bioScannerHandle,
                    id: pageID
                },
                success : function(msg)
                {
                    console_ely.log("Auto capture:" + msg.retString);
                    //if (msg.retValue == 0) {
                        resolve("success");
                    /*} else {
                        console.log("Error: autoCapture failed");
                        resolve("error");
                    }*/
                },
                error : function(request, status, error) {
                    console.log("Error: request ", request);
                    console.log("Error: status ", status);
                    console.log("Error: error ", error);
                    reject("error");
                }
            });
        });
    }

    // Auto capture loop
    async autoCaptureLoop() {
        console_ely.logFuncName(this.autoCaptureLoop.name);
        return new Promise((resolve, reject) => {
            const checkFinger = () => {
                this.getCaptureEnd();
                if (gIsFingeOn) {
                    console_ely.log("Auto Capture detected a finger.");
                    gIsFingeOn = false;
                    gPreviewFaileCount = 0;
                    resolve("success");
                } else if (gPreviewFaileCount < 30) {
                    aLoopflag = setTimeout(checkFinger, 1000);
                    gPreviewFaileCount++;
                } else {
                    gPreviewFaileCount = 0;
                    console_ely.log("Error: 30s timeout. End autoCaptureLoop()");
                    resolve("timeout");
                }
            };
            checkFinger();
        });
    }


    // Get capture end
    async getCaptureEnd() {
        console_ely.logFuncName(this.getCaptureEnd.name);
        jQuery.ajax({
            type : "GET",
            url : urlStr + "/api/getCaptureEnd?dummy=" + Math.random(),
            dataType : "json",
            async: false,
            data : {
                sHandle: bioScannerHandle,
                id: pageID
            },
            success : function(msg) {
                gIsFingeOn = msg.IsFingerOn;
                gIsCaptureEnd = msg.captureEnd;
                gLfdScore = msg.lfdScore;
            },
            error : function(request, status, error) {
                console.log("Error: request ", request);
                console.log("Error: status ", status);
                console.log("Error: error ", error);
            }
        });
    }

    // Abort capture
    abortCapture() {
        console_ely.logFuncName(this.abortCapture.name);
        var delayVal = 30000;
        return new Promise((resolve, reject) => {
            jQuery.ajax({
                type : "GET",
                url : urlStr + "/api/abortCapture?dummy=" + Math.random(),
                dataType : "json",
                data : {
                    sHandle: bioScannerHandle,
                    resetTimer: delayVal
                }, 
                success : function(msg) {
                    resolve("success");
                },
                error : function(request, status, error) {
                    console.log("Error: request ", request);
                    console.log("Error: status ", status);
                    console.log("Error: error ", error);
                    reject("error");
                }
            });
        });
    }

    /**
     * Perform verification with an image file.
     * 
     * @param {ArrayBuffer} data - The binary data of the image file to be verified.
     * @returns {Promise<string>} A Promise that resolves with a string indicating the verification result ('success' or 'error').
     */
    verifyWithImageFile(data) {
        console_ely.logFuncName(this.verifyWithImageFile.name);

        // Convert array to Uint8Array
        var uint8Array = new Uint8Array(data);
        // Create a Blob from Uint8Array
        var blob = new Blob([uint8Array]);
        // Return a Promise for asynchronous handling
        return new Promise((resolve, reject) => {
            var jsonData = {
                'dummy': Math.random(),
                'HND': bioScannerHandle,
                'ID': pageID,
                'IMG_TYP' : 2
            };
            // Create a FormData object and append the image blob and JSON data to it.
            var formData = new FormData();
            formData.append('file', blob);
            formData.append('param', JSON.stringify(jsonData));
            jQuery.ajax({
                type : "POST",
                url: urlStr + "/api/VerifyWithImageFile",
                data : formData,
                processData:false,
                contentType:false,
                success : function(msg) {
                    console_ely.log("Verify result : " + msg.verifySucceed);
                    console_ely.log("Verify score : " + msg.score);
                     if(msg.retValue == 0) {
                        resolve((msg.verifySucceed == 1) ? "success" : "error");
                    } else {
                        console.log("Error: verifyWithImageFile failed");
                        resolve("error");
                    }
                },
                error : function(request, status, error) {
                    console.log("Error: request ", request);
                    console.log("Error: status ", status);
                    console.log("Error: error ", error);
                    reject("error");
                }
            });
        });
    }

    /**
     * Convert WSQ data to an image buffer.
     * 
     * @param {ArrayBuffer} wsqData - The binary data of the WSQ file to be converted.
     * @returns {Promise<string>} A Promise that resolves with a string indicating the conversion result ('success' or 'error').
     */
    wsqToImageBuffer(wsqData) {
        console_ely.logFuncName(this.wsqToImageBuffer.name);
        decodedWsqData = null;    
        // Convert array to Uint8Array
        var uint8Array = new Uint8Array(wsqData);
        // Create a Blob from Uint8Array
        var wsqBlobData = new Blob([uint8Array]);
        // Return a Promise for asynchronous handling
        return new Promise((resolve,reject)=>{
            // Prepare JSON data to be sent along with the WSQ blob
            var jsonData = {
                'dummy': Math.random(),
                'HND': bioScannerHandle,
                'ID': pageID,
                'IMG_TYP': 3 //jpg
            };
            var formData = new FormData();
            formData.append('file', wsqBlobData);
            formData.append('param', JSON.stringify(jsonData));
    
            jQuery.ajax({
                type: "POST",
                url: urlStr + "/api/wsqFileToImageBufferByType",
                data: formData,
                processData: false,
                contentType: false,
                success: function(msg) {
                    console_ely.log("WSQ to image buffer result " + msg.retValue);
                    console_ely.log("WSQ to image buffer message " + msg.retString);
                    if (msg.retValue == 0) {
                        decodedWsqData = msg.B64_IMG;
                        console_ely.log("decodedWsqData : " + decodedWsqData);
                        // Resolve the Promise with 'success'
                        resolve("success");
                    } else {
                        console.log("Error: wsqToImageBuffer failed");
                        resolve("error");
                    }
                },
                error: function(request, status, error) {
                    console.log("Error: request ", request);
                    console.log("Error: status ", status);
                    console.log("Error: error ", error);
                    // Resolve the Promise with 'error'
                    reject("error");
                }
            });
        });
    }

    /*
     * Function to find the starting index of a subarray in the given array
     * Parameters:
     *   - subarray: The subarray to search for
     *   - start   : Optional parameter specifying the starting index for the search
     */
    findIndices(dataArray, subarray, start = 0) {
        // Iterate through the array, considering possible starting indices
        for (let i = start; i < dataArray.length - subarray.length + 1; i++) {
            let isMatchFound = true;

            // Check if the subarray matches at the current position
            for (let j = 0; j < subarray.length; j++) {
                if (dataArray[i + j] !== subarray[j]) {
                    // Break the loop if there is a mismatch
                    isMatchFound = false;
                    break;
                }
            }

            // If a match is found, return the starting index
            if (isMatchFound) {
                return i;
            }
        }

        // Return -1 if the subarray is not found in the array
        return -1;
    }

    /**
     * Function to get the count of WSQ images in the given data array.
     * @param {Uint8Array} dataArray - The array containing WSQ image information.
     * @returns {number} - The count of WSQ images.
     */
    getWsqImageCount(dataArray) {
        let index = [];
        let imageCount = 0;

        // Variables to keep track of the image count and list of start and end indices
        listOfIndices = [];

        // Check if the data array is not null
        if (dataArray !== null) {
            const wsqTagSoi = [0xFF, 0xA0]; // WSQ tag for Start of Image
            const wsqTagEoi = [0xFF, 0xA1]; // WSQ tag for End of Image
    
            let position = this.findIndices(dataArray, wsqTagSoi);
    
            // Loop through the array to find WSQ image start and end tags
            while (position !== -1) {
                index.push(position);
                position = this.findIndices(dataArray, wsqTagEoi, position);
    
                // If the end tag is found, update indices and increment image count
                if (position !== -1) {
                    position = position + 1;
                    index.push(position);
                    listOfIndices.push(index);
                    index = [];
                    imageCount++;
                }
    
                // Find the next WSQ image start tag
                position = this.findIndices(dataArray, wsqTagSoi, position);
            }
    
            // Return the count of WSQ images
            console.log("Num WSQ images: ", imageCount);
            return imageCount;
        }
    }

    /**
     * Retrieves data from the specified indices in the given dataArray.
     *
     * @param {Uint8Array} dataArray - The array containing the data.
     * @param {Array} indexList - List of pairs [startIndex, endIndex] specifying the range of indices to retrieve.
     * @returns {Array} An array containing the data slices corresponding to the specified indices.
     */
    retrieveDataFromIndices(dataArray, indexList) {
        const resultArray = [];

        // Iterate through each pair of indices in the indexList
        for (const indices of indexList) {
            const [startIndex, endIndex] = indices;

            // Check if the indices are valid
            if (startIndex >= 0 && endIndex < dataArray.length && startIndex <= endIndex) {
                // Slice the dataArray to get the data corresponding to the indices
                const subArray = dataArray.slice(startIndex, endIndex + 1);
                resultArray.push(subArray);
            } else {
                // Log an error for invalid indices
                console.error('Invalid indices: ', indices);
            }
        }

        console.log("List of WSQ data: ", resultArray);
        return resultArray;
    }

    /**
     * Function to retrieve WSQ data from a given array.
     * If the WSQ image count is not already calculated, it calculates it.
     * @param {Uint8Array} data - The array containing WSQ image information.
     */
    retrieveWsqData(data) {
        console_ely.logFuncName(this.retrieveWsqData.name);

        // Get WSQ image count and list of indices
        wsqImageCount = this.getWsqImageCount(data);
        if (wsqImageCount > 0 && listOfIndices.length > 0) {
            // Retrieve and log WSQ data from the specified indices
            var wsqData = this.retrieveDataFromIndices(data, listOfIndices);
            return wsqData;
        }

        return null;
    }
}