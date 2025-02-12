const GUI = {
    CLEAR: 'clear', // clear gui
    CLEAR_DEVICE_DETAILS: 'clearDeviceDetails',
    CLEAR_ON_RUN: 'clearOnRun', // Clear the GUI when the run button is clicked
    CONNECT_ENABLE : 'connectEnable', // enable connect button
    CONNECT_DISABLE : 'connectDisable', // disable connect button
    RUN: 'run', // run
    RUN_ENABLE: 'runEnable', // enable run button
    RUN_DISABLE: 'runDisable', // disable run button
    ATR: 'updateAtr', // update ATR
    CARD_PRESENT: 'cardPresent', // card present
    CARD_ABSENT: 'cardAbsent', // card absent
    READER_PRESENT: 'readerPresent', // reader present
    READER_ABSENT: 'readerAbsent', // reader absent
    PORTRAIT_LOAD: 'portraitLoading', // portrait loading
    PORTRAIT_ERROR: 'portraitError', // portrait error
    SIGNATURE_LOAD: 'signatureLoading', // signature loading
    SIGNATURE_ERROR: 'signatureError', // signature error
    FINGERPRINT_LOAD: 'fingerprintLoading', // fingerprint loading
    FINGERPRINT_ERROR: 'fingerprintError', // fingerprint error
    SCANNER_DETAILS: 'scannerDetails', // scanner details
};

// Configuration variables
const IMGTYPE = {
    UNKNOWN: 'unknown', // Unknown value
    JP2: 'JP2', // JP2
    JPG: 'JPG', // JPG
    PNG: 'PNG', // PNG
    WSQ: 'WSQ', // WSQ
}

const VALUE = {
    RUN: 'Run',
    CONNECT: 'Connect',
}

// Pop-up
let pwdTypeCan;
let pwdTypePin;
let pinpadInputValue;
let okayButtonPopup;
let cancelButtonPopup;
let pwdTypeMrzPopup;
let pwdTypeCanPopup;
let pwdTypePinPopup;
let pinpadInputValuePopup;
let authTypeSelected;
let pwdTypeSelected;
let askEveryTimePopup;
let askEveryTimeInputSelected = false;

class Gui {

    #isMrzValid = false;
    #preventImmediateClose = false;

    // Reading options
    #enablePaCheckbox;
    #enableAaCheckbox;
    #enableCaCheckbox;
    #enableTaCheckbox;
    #enableAutoReadCheckbox;
    #enableReadSignatureCheckbox;
    #enableReadDg3Checkbox;
    #enableVerifyFpCheckbox;

    // passive auth
    #cscaFileBrowser = null;
    #dsFileBrowser = null;

    // terminal auth
    #cvcaLinkFileBrowser = null;
    #dvFileBrowser = null;
    #isFileBrowser = null;
    #iskFileBrowser = null;

    id = {
        mrz: "mrz",
        dg1Mrz: "dg1Mrz",
        dg1Idl: "dg1Idl",
        dg11Emrtd: "dg11Emrtd",
        dg12Emrtd: "dg12Emrtd",
        dg13Emrtd: "dg13Emrtd",
        portraitImg: "portraitImg",
        signatureImg: "signatureImg",
        fingerprintImg: "fingerprintImg",
    };

    constructor() {
        this.update (GUI.CLEAR);
        this.setPopupControls();
        this.setApduType();
        this.setAutoRead();
        this.setReadSignature();
        this.setReadDg3();
        this.setVerifyFp();
        this.setAuthOptions();
        this.setPasswordType();
        this.setAuthType();
        this.addEventListeners();
    }

    setPopupControls() {

        // options popup
        const optionsButton = document.getElementById('optionsButton');
        const optionsPopup = document.getElementById('optionsPopup');
        const backgroundElement = document.getElementById('backgroundElement');
        pwdTypeCan = document.getElementById('pwdTypeCan');
        pwdTypePin = document.getElementById('pwdTypePin');
        pinpadInputValue = document.getElementById('pinpadInputValue');

        // AskEveryTime popup
        askEveryTimePopup = document.getElementById('askEveryTimePopup');
        pwdTypeMrzPopup = document.getElementById("pwdTypeMrzPopup");
        pwdTypeCanPopup = document.getElementById("pwdTypeCanPopup");
        pwdTypePinPopup = document.getElementById("pwdTypePinPopup");
        pinpadInputValuePopup = document.getElementById('pinpadInputValuePopup');
        okayButtonPopup = document.getElementById('okayButtonPopup');
        cancelButtonPopup = document.getElementById('cancelButtonPopup');

        // Button listener to show options popup
        optionsButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevents the click from propagating to the document
            optionsPopup.classList.toggle('show');
            backgroundElement.classList.toggle('options-popup-background-blur');
            // Click outside popup to close
            document.addEventListener('click', closeHandler);
            // Adding event listener to detect escape key press
            document.addEventListener('keydown', keyListener);
            if (localStorage.getItem('secret') == null) {
                document.getElementById('pinpadInputValue').value = localStorage.getItem('secret');
            }
        });

        function closeHandler(event) {
            if (!optionsPopup.contains(event.target) && event.target !== optionsButton) {
                optionsPopup.classList.remove('show');
                backgroundElement.classList.remove('options-popup-background-blur');
                document.removeEventListener('click', closeHandler);
            }
        }

        function keyListener(event) {
            if (event.key === 'Escape')
                closeHandler('click');
            else if (event.key === 'Enter')
                gui.okButton("pinpad");
        }

        // numeric keypad
        document.addEventListener("click", (event) => {
            const numKeyboard = document.getElementById("pinpad");
            const pinpad = document.getElementById('pinpadInputValue');

            if (event.target !== pinpad && !numKeyboard.contains(event.target)) {
                // Clicked outside the number pad or pinpad input
                numKeyboard.style.display = "none"; // Hide the number pad
            }
        });
    }

    clickConnect() {
        const connectButton = document.querySelector("#connect");
        connectButton.click();
    }

    setApduType() {
        const types = [APDU_FORMAT.AUTO, APDU_FORMAT.SHORT, APDU_FORMAT.EXTENDED];
        let type = urlparams_apdu;
        if (!types.includes (type)) { type = localStorage.getItem('apdu'); }
        if (!types.includes (type)) { type = APDU_FORMAT.AUTO; }
        if (type == APDU_FORMAT.AUTO) { this.dispatchChangeEvent("apduTypeAuto", true); }
        else if (type == APDU_FORMAT.SHORT) { this.dispatchChangeEvent("apduTypeShort", true); }
        else if (type == APDU_FORMAT.EXTENDED) { this.dispatchChangeEvent("apduTypeExtended", true); }
    }

    getApduType() {
        if (document.getElementById('apduTypeAuto').checked) { return APDU_FORMAT.AUTO; }
        else if (document.getElementById('apduTypeShort').checked) { return APDU_FORMAT.SHORT; }
        else if (document.getElementById('apduTypeExtended').checked) { return APDU_FORMAT.EXTENDED; }
    }

    setAutoRead() {
        this.#enableAutoReadCheckbox = document.getElementById('autoReadCheckbox');
        this.#enableAutoReadCheckbox.checked = (urlparams_autoRead == '1') ? true : (localStorage.getItem('autoRead') == "true");
        doAutoRead = this.#enableAutoReadCheckbox.checked;
    }

    setReadSignature() {
        this.#enableReadSignatureCheckbox = document.getElementById('readSignatureCheckbox');
        this.#enableReadSignatureCheckbox.checked = (urlparams_signature == '1') ? true : (localStorage.getItem('signature') == "true");
        doReadSignature = this.#enableReadSignatureCheckbox.checked;
    }

    setReadDg3() {
        this.#enableReadDg3Checkbox = document.getElementById('readDg3Checkbox');
        this.#enableReadDg3Checkbox.checked = (urlparams_dg3 == '1') ? true : (localStorage.getItem('dg3') == "true");
        doReadDg3 = this.#enableReadDg3Checkbox.checked;
    }

    setVerifyFp() {
        this.#enableVerifyFpCheckbox = document.getElementById('verifyFpCheckbox');
        this.#enableVerifyFpCheckbox.checked = (urlparams_verifyFp == '1') ? true : (localStorage.getItem('verifyfp') == "true");
        doVerifyFp = this.#enableVerifyFpCheckbox.checked;
    }

    setPasswordType() {
        const pwdType = localStorage.getItem('pwdType');
        if (pwdType == null) {
            pwdTypeSelected = this.getSelectedRadioButtonValue('pwdType', PASSWORD_TYPE);
            localStorage.setItem('pwdType', pwdTypeSelected);
        } else {
            if (pwdType == PASSWORD_TYPE.ASK_EVERY_TIME)
                this.dispatchChangeEvent("pwdTypeAskEveryTime", true);
            else if (pwdType == PASSWORD_TYPE.MRZ)
                this.dispatchChangeEvent("pwdTypeMrz", true);
            else if ((pwdType == PASSWORD_TYPE.CAN) || (pwdType == PASSWORD_TYPE.PIN)) {
                const cookie = localStorage.getItem('secret');
                if (cookie)
                    document.getElementById('pinpadInputValue').value = cookie;
                if (pwdType == PASSWORD_TYPE.CAN)
                    this.dispatchChangeEvent("pwdTypeCan", true);
                else if (pwdType == PASSWORD_TYPE.PIN)
                    this.dispatchChangeEvent("pwdTypePin", true);
            }
            pwdTypeSelected = pwdType;
        }
        console.log('Updated passwordType:', pwdTypeSelected);
    }

    getPasswordType() {
        return localStorage.getItem('pwdType');
    }

    getPasswordTypeAskEveryTime() {
        return localStorage.getItem('pwdTypeAskEveryTime');
    }

    setAuthType() {
        const authType = localStorage.getItem('authType');
        if (authType == null) {
            localStorage.setItem('authType', this.getSelectedRadioButtonValue('authType', ACCESS_TYPE));
        } else {
            if (authType == ACCESS_TYPE.AUTO)
                this.dispatchChangeEvent("authTypeAuto", true);
            else if (authType == ACCESS_TYPE.PACE)
                this.dispatchChangeEvent("authTypePace", true);
            else if (authType == ACCESS_TYPE.BAC_BAP)
                this.dispatchChangeEvent("authTypeBac", true);
            else 
                console.log('Unknown Auth type');
        }
        console.log('Updated accessType:', this.getAuthType());
    }

    getAuthType() {
        return localStorage.getItem('authType');
    }

    setAuthOptions() {
        // passive auth
        this.#enablePaCheckbox = document.getElementById('paCheckbox');
        this.#cscaFileBrowser = document.getElementById('paCscaFileBrowser');
        this.#dsFileBrowser = document.getElementById('paDsFileBrowser');
        if (urlparams_pa == '1') {
            this.#enablePaCheckbox.checked = true;
        } else {
            const cacheVal = localStorage.getItem('pa');
            this.#enablePaCheckbox.checked = (cacheVal == "true");
        }
        doPassiveAuthentication = this.#enablePaCheckbox.checked;
        this.#cscaFileBrowser.disabled = !this.#enablePaCheckbox.checked;
        this.#dsFileBrowser.disabled = !this.#enablePaCheckbox.checked;
        // updating GUI
        var cookieStatus = localStorage.getItem('csca');
        this.appendCertCacheStatus ("paLabel", cookieStatus);

        // active auth
        this.#enableAaCheckbox = document.getElementById('aaCheckbox');
        this.#enableAaCheckbox.checked = (urlparams_aa == '1') ? true : (localStorage.getItem('aa') == "true");
        doActiveAuthentication = this.#enableAaCheckbox.checked;

        // chip auth
        this.#enableCaCheckbox = document.getElementById('caCheckbox');
        this.#enableCaCheckbox.checked = (urlparams_ca == '1') ? true : (localStorage.getItem('ca') == "true");
        doChipAuthentication = this.#enableCaCheckbox.checked;

        // terminal auth
        this.#enableTaCheckbox = document.getElementById('taCheckbox');
        this.#cvcaLinkFileBrowser = document.getElementById('taCvcaLinkFileBrowser');
        this.#dvFileBrowser = document.getElementById('taDvFileBrowser');
        this.#isFileBrowser = document.getElementById('taIsFileBrowser');
        this.#iskFileBrowser = document.getElementById('taIsKeyFileBrowser');
        this.#enableTaCheckbox.checked = (urlparams_ta == '1') ? true : (localStorage.getItem('ta') == "true");
        if (this.#enableTaCheckbox.checked && !this.#enableCaCheckbox.checked) {
            this.#enableCaCheckbox.checked = this.#enableTaCheckbox.checked;
            doChipAuthentication = this.#enableTaCheckbox.checked;
        }
        doTerminalAuthentication = this.#enableTaCheckbox.checked;
        this.#cvcaLinkFileBrowser.disabled = !this.#enableTaCheckbox.checked;
        this.#dvFileBrowser.disabled = !this.#enableTaCheckbox.checked;
        this.#isFileBrowser.disabled = !this.#enableTaCheckbox.checked;
        this.#iskFileBrowser.disabled = !this.#enableTaCheckbox.checked;
        // updating GUI
        var cookieStatus = (localStorage.getItem('cvcaLink') || localStorage.getItem('dv') ||
            localStorage.getItem('is') || localStorage.getItem('isk'));
        this.appendCertCacheStatus ("taLabel", cookieStatus);
    }

    getReadingOptions() {
        return {
            pa: this.#enablePaCheckbox.checked,
            aa: this.#enableAaCheckbox.checked,
            ca: this.#enableCaCheckbox.checked,
            ta: this.#enableTaCheckbox.checked,
            autoread: this.#enableAutoReadCheckbox.checked,
            readsign: this.#enableReadSignatureCheckbox.checked,
            readdg3: this.#enableReadDg3Checkbox.checked,
            verifyfp: this.#enableVerifyFpCheckbox.checked,
            taCertCvcaLink: this.#cvcaLinkFileBrowser,
            taCertDv: this.#dvFileBrowser,
            taCertIs: this.#isFileBrowser,
            taCertIsk: this.#iskFileBrowser,
            paCertDs: this.#dsFileBrowser,
            paCertCsca: this.#cscaFileBrowser,
        };
    }

    // Generic function to check which radio button is selected
    getSelectedRadioButtonValue(groupName, mapping) {
        const radios = document.getElementsByName(groupName);
        let selectedValue = '';
        radios.forEach(radio => {
            if (radio.checked) {
                selectedValue = radio.value;
            }
        });
        return mapping[selectedValue] || '';
    }

    addEventListeners() {

        // Add event listeners to each authType radio button
        document.getElementsByName('authType').forEach(radio => {
            radio.addEventListener('change', () => {
                authTypeSelected = this.getSelectedRadioButtonValue('authType', ACCESS_TYPE);
                localStorage.setItem('authType', authTypeSelected);
                console.log('Updated accessType:', authTypeSelected);
            });
        });

        // Add event listeners to each pwdType radio button
        document.getElementsByName('pwdType').forEach(radio => {
            radio.addEventListener('change', () => {
                pwdTypeSelected = this.getSelectedRadioButtonValue('pwdType', PASSWORD_TYPE);
                localStorage.setItem('pwdType', pwdTypeSelected);
                if ((pwdTypeSelected == PASSWORD_TYPE.CAN) || (pwdTypeSelected == PASSWORD_TYPE.PIN))
                    document.getElementById('pinpadInputValue').click();
                console.log('Updated passwordType:', pwdTypeSelected);
            });
        });
        pwdTypeCan.addEventListener('change', () => { this.updatePinpadInputVisibilityType('optionsPopup'); });
        pwdTypePin.addEventListener('change', () => { this.updatePinpadInputVisibilityType('optionsPopup'); });

        // Event listener for each apduType radio button
        document.getElementsByName('apduType').forEach(radio => {
            radio.addEventListener('change', () => {
                localStorage.setItem('apdu', this.getSelectedRadioButtonValue('apduType', APDU_FORMAT));
            });
        });

        // Event listener for auto read checkbox
        this.#enableAutoReadCheckbox.addEventListener('change', () => {
            localStorage.setItem('autoRead', this.#enableAutoReadCheckbox.checked);
            webApi.abortMrzAutoRead();
            /*setTimeout(async () => {
                if (webApi.isMrzScannerAvailable && doAutoRead && !this.#enableAutoReadCheckbox.checked) {
                    await webApi.deactivateAutoReadMode();
                }
            }, 0);*/
            doAutoRead = this.#enableAutoReadCheckbox.checked;
            setTimeout(async () => {
                if (webApi.isMrzScannerAvailable) {
                    doAutoReadIfEnabled();
                }
            }, 250);
        });

        // Event listener for read signature checkbox
        this.#enableReadSignatureCheckbox.addEventListener('change', () => {
            localStorage.setItem('signature', this.#enableReadSignatureCheckbox.checked);
            doReadSignature = this.#enableReadSignatureCheckbox.checked;
        });

        // Event listener for read DG3 checkbox
        this.#enableReadDg3Checkbox.addEventListener('change', () => {
            localStorage.setItem('dg3', this.#enableReadDg3Checkbox.checked);
            doReadDg3 = this.#enableReadDg3Checkbox.checked;
        });

        // Event listener for verify fingerprint checkbox
        this.#enableVerifyFpCheckbox.addEventListener('change', () => {
            localStorage.setItem('verifyfp', this.#enableVerifyFpCheckbox.checked);
            doVerifyFp = this.#enableVerifyFpCheckbox.checked;
        });

        // Event listeners for PA controls
        this.#enablePaCheckbox.addEventListener('change', () => {
            localStorage.setItem('pa', this.#enablePaCheckbox.checked);
            this.#cscaFileBrowser.disabled = !this.#enablePaCheckbox.checked;
            this.#dsFileBrowser.disabled = !this.#enablePaCheckbox.checked;
            doPassiveAuthentication = this.#enablePaCheckbox.checked;
        });
        document.getElementById('paCscaFileBrowser').addEventListener('change', () => {
            this.#cscaFileBrowser = document.getElementById("paCscaFileBrowser");
        });
        document.getElementById('paDsFileBrowser').addEventListener('change', () => {
            this.#dsFileBrowser = document.getElementById("paDsFileBrowser");
        });

        // Event listener for AA checkbox
        this.#enableAaCheckbox.addEventListener('change', () => {
            localStorage.setItem('aa', this.#enableAaCheckbox.checked);
            doActiveAuthentication = this.#enableAaCheckbox.checked;
        });

        // Event listener for CA checkbox
        this.#enableCaCheckbox.addEventListener('change', () => {
            if (this.#enableTaCheckbox.checked) {
                if (!this.#enableCaCheckbox.checked) {
                    alert("CA is needed to perform TA.");
                }
                this.#enableCaCheckbox.checked = true;
            }
            localStorage.setItem('ca', this.#enableCaCheckbox.checked);
            doChipAuthentication = this.#enableCaCheckbox.checked;
        });

        // Event listeners for TA controls
        this.#enableTaCheckbox.addEventListener('change', () => {
            if (this.#enableTaCheckbox.checked) {
                this.#enableCaCheckbox.checked = true;
            }
            localStorage.setItem('ca', this.#enableCaCheckbox.checked);
            doChipAuthentication = this.#enableCaCheckbox.checked;
            localStorage.setItem('ta', this.#enableTaCheckbox.checked);
            this.#cvcaLinkFileBrowser.disabled = !this.#enableTaCheckbox.checked;
            this.#dvFileBrowser.disabled = !this.#enableTaCheckbox.checked;
            this.#isFileBrowser.disabled = !this.#enableTaCheckbox.checked;
            this.#iskFileBrowser.disabled = !this.#enableTaCheckbox.checked;
            doTerminalAuthentication = this.#enableTaCheckbox.checked;
        });

        document.getElementById('taCvcaLinkFileBrowser').addEventListener('change', () => {
            this.#cvcaLinkFileBrowser = document.getElementById('taCvcaLinkFileBrowser');
        });
        document.getElementById('taDvFileBrowser').addEventListener('change', () => {
            this.#dvFileBrowser = document.getElementById('taDvFileBrowser');
        });
        document.getElementById('taIsFileBrowser').addEventListener('change', () => {
            this.#isFileBrowser = document.getElementById('taIsFileBrowser');
        });
        document.getElementById('taIsKeyFileBrowser').addEventListener('change', () => {
            this.#iskFileBrowser = document.getElementById('taIsKeyFileBrowser');
        });

        // Add event listeners to each pwdTypePopup radio button
        document.getElementsByName('pwdTypePopup').forEach(radio => {
            radio.addEventListener('change', () => {
                pwdTypeSelected = this.getSelectedRadioButtonValue('pwdTypePopup', PASSWORD_TYPE);
                localStorage.setItem('pwdTypeAskEveryTime', pwdTypeSelected);
                console.log('Updated passwordType:', pwdTypeSelected);
                if ((pwdTypeSelected == PASSWORD_TYPE.CAN) || (pwdTypeSelected == PASSWORD_TYPE.PIN))
                    document.getElementById('pinpadInputValuePopup').click();
            });
        });
        // Add event listeners for buttons in AskEveryTime popup
        pwdTypeMrzPopup.addEventListener('change', () => { this.closePinpadPopup(); });
        pwdTypeCanPopup.addEventListener('change', () => { this.updatePinpadInputVisibilityType('askEveryTimePopup'); });
        pwdTypePinPopup.addEventListener('change', () => { this.updatePinpadInputVisibilityType('askEveryTimePopup'); });
        okayButtonPopup.addEventListener('click', () => { this.okButtonHandlerPopup(); });
        cancelButtonPopup.addEventListener('click', () => { this.closeButtonHandlerPopup(); });
    }

    clearImage(id) {
        if (id == "fingerprintDisplay") {
            document.getElementById(id).innerHTML = "";
        } else {
            document.getElementById(id).width = 0;
            document.getElementById(id).height = 0;
        }
    }

    clearImages() {
        this.clearImage("portraitDisplay");
        this.clearImage("signatureDisplay");
        this.clearImage("fingerprintDisplay");
    }

    clearDocumentDetails() {
        this.clearImages();
        $("#mrzDisplay").text('');
        document.getElementById("mrzDisplay").style.display = 'none';
        if (document.getElementById("dg1EmrtdFields").style.display == 'block') {
            $("#firstName").text('');
            $("#surName").text('');
            $("#dob").text('');
            $("#nationality").text('');
            $("#sex").text('');
            $("#doe").text('');
            $("#docNumber").text('');
            $("#docType").text('');
            $("#issuer").text('');
            $("#optionalData").text('');

            $("#firstName_input").val('');
            $("#surName_input").val('');
            $("#dob_input").val('');
            $("#lieunaiss").val('');
            $("#doe_input").val('');
            $("#sex_input").val('');
            $("#numcni_input").val('');
            $("#numelec_input").val('');
            $("#docNumber_input").val('');

        } else {
            $("#familyName-idl").text('');
            $("#givenName-idl").text('');
            $("#dob-idl").text('');
            $("#doi-idl").text('');
            $("#doe-idl").text('');
            $("#issuingCountry-idl").text('');
            $("#issuingAuthority-idl").text('');
            $("#docNumber-idl").text('');
            $("#categories-idl").text('');

            $("#firstName_input").val('');
            $("#surName_input").val('');
            $("#dob_input").val('');
            $("#lieunaiss").val('');
            $("#doe_input").val('');
            $("#sex_input").val('');
            $("#numcni_input").val('');
            $("#numelec_input").val('');
            $("#docNumber_input").val('');
        }
        this.#isMrzValid = false;
        document.getElementById("fingerprintDisplay").style.display = 'none';
    }
    clearInspectionDetails() {
        document.getElementById('inspectionList').innerHTML = "";
    }

    clearDeviceDetails() {
        document.getElementById('scanner').innerHTML = "";
        document.getElementById('scardReader').innerHTML = "";
        document.getElementById('scardAtr').innerHTML = "";
    }

    htmlFormat(data) {
        return data.replace(/\t/g, "&zwnj;&nbsp;&nbsp;&nbsp;&nbsp;").replace(/(?:\r\n|\r|\n)/g, '<br>');
    }

    update(guiEvent, data = null) {
        if (data) {
            data = this.htmlFormat(data);
        }
        switch (guiEvent) {
            case GUI.CLEAR:
                this.clearDocumentDetails();
                break;
            case GUI.CLEAR_DEVICE_DETAILS:
                this.clearDeviceDetails();
                break;
            case GUI.CLEAR_ON_RUN:
                this.clearDocumentDetails();
                this.clearInspectionDetails();
                break;
            case GUI.CONNECT_DISABLE:
            case GUI.RUN_DISABLE:
                $('#connect').attr('disabled', 'disabled');
                break;    
            case GUI.RUN:
                $("#connect").text(VALUE.RUN);
                break;
            case GUI.CONNECT_ENABLE:
            case GUI.RUN_ENABLE:
                $('#connect').removeAttr('disabled');
                break;
            case GUI.ATR:
            case GUI.CARD_PRESENT:
                $("#scardAtr").text(data);
                break;
            case GUI.CARD_ABSENT:
                $("#scardAtr").text('');
                break;
            case GUI.READER_PRESENT:
                document.getElementById('scardReader').innerHTML = data;
                break;
            case GUI.READER_ABSENT:
                document.getElementById('scardReader').innerHTML = "";
                break;
            case GUI.PORTRAIT_LOAD:
                this.setImageSrc("portraitDisplay", "images/loading.gif", 48, 48);
                break;
            case GUI.PORTRAIT_ERROR:
                this.setImageSrc("portraitDisplay", "images/cross.png", 48, 48);
                break;
            case GUI.SIGNATURE_LOAD:
                this.setImageSrc("signatureDisplay", "images/loading.gif", 48, 48);
                break;
            case GUI.SIGNATURE_ERROR:
                this.setImageSrc("signatureDisplay", "images/cross.png", 48, 48);
                break;
            case GUI.FINGERPRINT_LOAD:
                document.getElementById("fingerprintDisplay").innerHTML =
                    "<img class=\"fp-image\" id=\"fingerprintDisplayTemp\"></img>";
                this.setImageSrc("fingerprintDisplayTemp", "images/loading.gif", 48, 48);
                document.getElementById("fingerprintDisplay").style.display = 'block';
                break;
            case GUI.FINGERPRINT_ERROR:
                document.getElementById("fingerprintDisplay").innerHTML =
                    "<img class=\"fp-image\" id=\"fingerprintDisplayTemp\"></img>";
                this.setImageSrc("fingerprintDisplayTemp", "images/cross.png", 48, 48);
                document.getElementById("fingerprintDisplay").style.display = 'block';
                break;
            case GUI.SCANNER_DETAILS:
                document.getElementById('scanner').innerHTML = data;
                break;
            default:
                break;
        }
    }

    appendInspectionDetails(imageName, statusText, time) {
        // remove current recent flags to add a new entry with new recent flags
        let htmlText  = document.getElementById('inspectionList').innerHTML;
        htmlText = htmlText.replaceAll("id=\"recent-status-flag\" ", '');
        htmlText = htmlText.replaceAll("id=\"recent-status-image-flag\" ", '');
        htmlText = htmlText.replaceAll("id=\"recent-status-text-flag\" ", '');
        htmlText = htmlText.replaceAll("id=\"recent-status-time-flag\" ", '');
        // create entry
        const newEntry = "<div id='recent-status-flag' class=\"columns is-vcentered\"> \
                            <div id='recent-status-image-flag' class=\"column is-1\"><img src=\"images/" + imageName + "\" width=48 height=48/></div> \
                            <div id='recent-status-text-flag' class=\"column is-8 has-text-dark\">" + statusText + "</div> \
                            <div id='recent-status-time-flag' class=\"column is-3 has-text-dark is-family-monospace\" style=\"text-align: right;\">" + time + " ms</div> \
                          </div>";
        document.getElementById('inspectionList').innerHTML = htmlText + newEntry;
    }

    modifyStatusImage(imageName) {
        const newEntry = `<img src="images/${imageName}"width=48 height=48/>`;
        document.getElementById('recent-status-image-flag').innerHTML = newEntry;
    }

    modifyStatusText(statusText) {
        document.getElementById('recent-status-text-flag').innerHTML = statusText;
    }

    appendStatusTextTag(statusText, tagType="info") {
        console_ely.log(statusText);
        if (tagType != "success" && tagType != "fail" && tagType != "warning" && tagType != "pending" && tagType != "info") {
            tagType = "info";
        }
        const newEntry = `<span class="is-italic tag-${tagType}">${statusText}</span>`;
        if (document.getElementById('recent-status-text-flag').innerHTML)
            document.getElementById('recent-status-text-flag').innerHTML += newEntry;
    }

    modifyStatusTime(time) {
        document.getElementById('recent-status-time-flag').innerHTML = `${time} ms`;
    }

    modifyInspectionDetails(imageName, statusText, time) {
        this.modifyStatusImage(imageName);
        this.modifyStatusText(statusText);
        this.modifyStatusTime(time);
    }

    appendCertCacheStatus(label, status) {
        const idLabelCacheStatus = `${label}CacheStatus`;
        const textCacheStatus = "using cert data from cookie";
        const textCacheStatusHtml = `<span class="is-italic tag-warning" id="${idLabelCacheStatus}">${textCacheStatus}</span>`;
        if (status) {
            if (!document.getElementById(idLabelCacheStatus)) {
                document.getElementById(label).innerHTML += textCacheStatusHtml;
            }
        } else if (document.getElementById(idLabelCacheStatus)) {
            const text = document.getElementById(label).innerHTML.replaceAll(textCacheStatusHtml, '');
            document.getElementById(label).innerHTML = text;
        }
    }

    displayVer(appName, appVer, libVer, buildNum) {
        let ver = `${appName} v`;
        if (appVer == "") { appVer = "0"; }
        ver += appVer;
        if (libVer != "") { ver = `${ver}-wasm-${libVer}`; }
        if (buildNum != "") { ver = `${ver}-rc${buildNum}`; }
        console.log(ver);
        localStorage.setItem('version', ver);
        $("#version").text(ver);
    }

    isEppOnIdBox5xxOr6xx(szMrz) {
        if ((szMrz != null) && (szMrz.length != 0) && (szMrz[0] == 'P')) {
            szMrz = szMrz.trim();
            const mrzLines = szMrz.replaceAll("\r\n", "\r").split('\r');
            return ((mrzLines[0].length >= 28) && (mrzLines[0].length != 44)
                && (mrzLines[1].length >= 28) && (mrzLines[1].length != 44)
                && (mrzLines.length == 2));
        }
        return false;
    }

    preprocessMrz(szMrz) {
        //szMrz = "P<UTOERIKSSON<<ANNA<MARIA<<<<<<\r\nL898902C<3UTO6908061M9406236<<9\r\n\r\n";   // Default TD3 MRZ on ID BOX 5xx or 6xx
        if (this.isEppOnIdBox5xxOr6xx(szMrz)) {
            const mrzLines = szMrz.replaceAll("\r\n", "\r").split('\r');
            const strFillers = "________________";
            szMrz = `${mrzLines[0] + strFillers.substring(0, (44 - mrzLines[0].length))}\r\n` +
                mrzLines[1] + strFillers.substring(0, (44 - mrzLines[0].length)) + "\r\n" +
                "\r\n";
        }
        // Store the MRZ to the cookies to access during auth
        localStorage.setItem('mrz', szMrz);
        document.getElementById('mrzDisplay').innerHTML =
            szMrz.replace(/</g, '&lt;').replace(/(?:\r\n|\r|\n)/g, ' ').trim().replace(/ /g, '<br>');
        document.getElementById("mrzDisplay").style.display = 'block';
        szMrz = szMrz.trim().replaceAll("_", "<");
        // Update the secret 
        //secret = szMrz;
        return szMrz;
    }

    displayMrzFields(szMrz) {
        const mrzVal = this.preprocessMrz(szMrz);
        this.#isMrzValid = true;
        if (mrzVal != null && mrzVal.length == 30 && mrzVal[0] == 'D') {
            console.log("IDL MRZ: MRZ Parsing skipped");
        } else {
            try {
                let result = mrz.parse(mrzVal.split(/(?:\r\n|\r|\n)/g));
                if (result === 'undefined') {
                    this.#isMrzValid = false;
                }
                console.log(result);
                document.getElementById("dg1IdlFields").style.display = 'none';
                console.log(result.fields.firstName); $("#firstName").text(result.fields.firstName);
                console.log(result.fields.lastName); $("#surName").text(result.fields.lastName);

                console.log(result.fields.birthDate);
                var date = result.fields.birthDate;
                $("#dob").text(util.buildDate(date.substring(4, 6), date.substring(2, 4), date.substring(0, 2), 'dd/mm/yy'));

                console.log(result.fields.nationality); $("#nationality").text(result.fields.nationality);
                console.log(result.fields.sex); $("#sex").text(result.fields.sex);

                console.log(result.fields.expirationDate);
                var date = result.fields.expirationDate;
                $("#doe").text(util.buildDate(date.substring(4, 6), date.substring(2, 4), date.substring(0, 2), 'dd/mm/yy'));

                console.log(result.fields.documentNumber); $("#docNumber").text(result.fields.documentNumber);
                console.log(result.fields.documentCode); $("#docType").text(result.fields.documentCode);
                console.log(result.fields.issuingState); $("#issuer").text(result.fields.issuingState);
                console.log(result.fields.optional1); $("#optionalData").text(result.fields.optional1);
                document.getElementById("dg1EmrtdFields").style.display = 'block';

                $("#firstName_input").val(result.fields.firstName);
                $("#surName_input").val(result.fields.lastName);
                $("#dob_input").val(util.buildDate( result.fields.birthDate.substring(4, 6),  result.fields.birthDate.substring(2, 4),  result.fields.birthDate.substring(0, 2), 'dd/mm/yyyy'));
                $("#lieunaiss").val('');
                $("#doe_input").val(util.buildDate( result.fields.expirationDate.substring(4, 6),  result.fields.expirationDate.substring(2, 4),  result.fields.expirationDate.substring(0, 2), 'dd/mm/yy'));
                $("#sex_input").val(result.fields.sex);
                $("#numcni_input").val('');
                $("#numelec_input").val('');
                $("#docNumber_input").val(result.fields.documentNumber);
            } catch (e) {
                this.appendStatusTextTag ("Parsing KO", "fail");
                this.modifyStatusImage ("cross.png");
                this.#isMrzValid = false;
            }
        }
    }

    addIdlCategoriesAsTree(vehicle_categories) {
        document.getElementById('categories-idl').innerHTML = '';
        for (const vehicleCategory of vehicle_categories) {
            // Create and append entry
            const newEntry =
            "<div class=\"box\"> \
                <ul> \
                    <li class=\"container\"><span class=\"caret\">" + vehicleCategory.category + "</span> \
                        <ul class=\"tree nested\"> \
                            <li>" + vehicleCategory.valid_from + "</li> \
                            <li>" + vehicleCategory.valid_till + "</li> \
                            <li>" + vehicleCategory.code + "</li> \
                            <li>" + vehicleCategory.sign + "</li> \
                            <li>" + vehicleCategory.value + "</li> \
                        </ul> \
                    </li> \
                </ul> \
            </div>";
            document.getElementById('categories-idl').innerHTML += newEntry;

            // Active caret toggler in GUI
            const toggler = document.getElementsByClassName("caret");
            for (const element of toggler) {
                element.addEventListener("click", function() {
                    this.parentElement.querySelector(".nested").classList.toggle("active");
                    this.classList.toggle("caret-down");
                });
            }
        }
    }

    displayIdlCategories(aszCategories, idlType) {
        function vehicle_category(fields) {
            this.category = `Category: ${util.hexToAscii(fields[0])}`;
            if (idlType == "IDL EU") {
                this.valid_from = `Valid from: ${util.buildDate(fields[1].substring(0, 2), fields[1].substring(2, 4), fields[1].substring(4, 8), 'dd/mm/yyyy')}`;
                this.valid_till = `Valid till: ${util.buildDate(fields[2].substring(0, 2), fields[2].substring(2, 4), fields[2].substring(4, 8), 'dd/mm/yyyy')}`;
            } else {
                this.valid_from = `Valid from: ${util.buildDate(fields[1].substring(6, 8), fields[1].substring(4, 6), fields[1].substring(0, 4), 'dd/mm/yyyy')}`;
                this.valid_till = `Valid till: ${util.buildDate(fields[2].substring(6, 8), fields[2].substring(4, 6), fields[2].substring(0, 4), 'dd/mm/yyyy')}`;
            }
            this.code = `Code: ${util.hexToAscii(fields[3])}`;
            this.sign = `Sign: ${util.hexToAscii(fields[4])}`;
            this.value = `Value: ${util.hexToAscii(fields[5])}`;
        }
        const vehicle_categories = [];
        for (let i = 0; i < aszCategories.length; i++) {
            const fields = aszCategories[i].replaceAll('3b', ' ').trim().split(' ');
            vehicle_categories[i] = new vehicle_category(fields);
        }
        this.addIdlCategoriesAsTree(vehicle_categories);
    }

    displayIdlFields(data, idlType) {
        var result = webApi.parseIdlMrz(data, idlType);
        document.getElementById("dg1EmrtdFields").style.display = 'none';
        console.log(result.data.fields.familyName); $("#familyName-idl").text(result.data.fields.familyName);
        console.log(result.data.fields.givenName); $("#givenName-idl").text(result.data.fields.givenName);
        console.log(result.data.fields.birthDate); $("#dob-idl").text(result.data.fields.birthDate);
        console.log(result.data.fields.issueDate); $("#doi-idl").text(result.data.fields.issueDate);
        console.log(result.data.fields.expirationDate); $("#doe-idl").text(result.data.fields.expirationDate);
        console.log(result.data.fields.issuingCountry); $("#issuingCountry-idl").text(result.data.fields.issuingCountry);
        console.log(result.data.fields.issuingAuthority); $("#issuingAuthority-idl").text(result.data.fields.issuingAuthority);
        console.log(result.data.fields.documentNumber); $("#docNumber-idl").text(result.data.fields.documentNumber);
        console.log(result.data.fields.categories); this.displayIdlCategories(result.data.fields.categories, idlType);
        document.getElementById("dg1IdlFields").style.display = 'block';
    }

    displayEmrtdAdditionalPersonalDetails(data) {
        var result = webApi.parseEmrtdDg11(data);
        console.log("dg11 parse data: ", result);
        console.log("ibraaaaaaaaaaaaaaaaaa ");
        document.getElementById('dg11EmrtdFields').innerHTML = '';
        const newEntry =
            `<table>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg11EmrtdFullNameLabel">Full name</elyLabel></td>
                    <td><div id="dg11EmrtdFullName">${result.data.fields.fullName}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg11EmrtdOtherNameLabel">Other names</elyLabel></td>
                    <td><div id="">${result.data.fields.otherNames}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg11EmrtdOtherNameLabel">Personal number</elyLabel></td>
                    <td><div id="dg11EmrtdOtherNames">${result.data.fields.personalNumber}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg11EmrtdOtherNameLabel">Full DOB</elyLabel></td>
                    <td><div id="dg11EmrtdOtherNames">${result.data.fields.fullDateOfBirth}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg11EmrtdPlaceOfBirthLabel">Birth place</elyLabel></td>
                    <td><div id="dg11EmrtdPlaceOfBirth">${result.data.fields.placeOfBirth}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg11EmrtdPermanentAddressLabel">Permanent address</elyLabel></td>
                    <td><div id="dg11EmrtdPermanentAddress">${result.data.fields.permanentAddress}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg11EmrtdTelephoneLabel">Telephone</elyLabel></td>
                    <td><div id="dg11EmrtdTelephone">${result.data.fields.telephone}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg11EmrtdProfessionLabel">Profession</elyLabel></td>
                    <td><div id="dg11EmrtdProfession">${result.data.fields.profession}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg11EmrtdTitleLabel">Title</elyLabel></td>
                    <td><div id="dg11EmrtdTitle">${result.data.fields.title}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg11EmrtdPersonalSummaryLabel">Personal summary</elyLabel></td>
                    <td><div id="dg11EmrtdPersonalSummary">${result.data.fields.personalSummary}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg11EmrtdProofOfCitizenshipLabel">Proof of citizenship</elyLabel></td>
                    <td><div id="dg11EmrtdProofOfCitizenship">${result.data.fields.proofOfCitizenship}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg11EmrtdOtherValidTdNumbersLabel">Other valid TD numbers</elyLabel></td>
                    <td><div id="dg11EmrtdOtherValidTdNumbers">${result.data.fields.otherValidTdNumbers}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg11EmrtdCustodyInfoLabel">Custody info</elyLabel></td>
                    <td><div id="dg11EmrtdCustodyInfo">${result.data.fields.custodyInfo}</div></td>
                </tr>
            </table>`;
        document.getElementById('dg11EmrtdFields').innerHTML += newEntry;
        document.getElementById('additionalPersonalDetails').style.display = 'block';
        $("numcni_input").val("dfdf");
       document.getElementById('numcni_input').value =result.data.fields.personalNumber;
       document.getElementById('lieunaiss').value =result.data.fields.placeOfBirth;

       

    }

    displayEmrtdAdditionalDocumentDetails(data) {
        var result = webApi.parseEmrtdDg12(data);
        console.log("dg12 parse data: ", result);
        document.getElementById('dg12EmrtdFields').innerHTML = '';
        const newEntry =
            `<table>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg12EmrtdIssuingAuthorityLabel">Issuing authority</elyLabel></td>
                    <td><div id="dg12EmrtdIssuingAuthority">${result.data.fields.issuingAuthority}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg12IssuingDateLabel">Issuing date</elyLabel></td>
                    <td><div id="dg12IssuingDate">${result.data.fields.dateOfIssue}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg12EmrtdEndorsementsAndObservationsLabel">Endorsements and observations</elyLabel></td>
                    <td><div id="dg12EmrtdEndorsementsAndObservations">${result.data.fields.endorsementsAndObservations}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg12EmrtdTaxExitRequirementsLabel">Tax exit requirements</elyLabel></td>
                    <td><div id="dg12EmrtdTaxExitRequirements">${result.data.fields.taxExitRequirements}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg12EmrtdDocPersoDateAndTimeLabel">Personalization date and time</elyLabel></td>
                    <td><div id="dg12EmrtdDocPersoDateAndTime">${result.data.fields.docPersoDateAndTime}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg12EmrtdSerNumOfPersoSystemLabel">Personalization system S/N</elyLabel></td>
                    <td><div id="dg12EmrtdSerNumOfPersoSystem">${result.data.fields.serNumOfPersoSystem}</div></td>
                </tr>
            </table>`;
        document.getElementById('dg12EmrtdFields').innerHTML += newEntry;
        document.getElementById('additionalDocumentDetails').style.display = 'block';
    }

    displayEmrtdOptionalDetails(data) {
        var result = webApi.parseEmrtdDg13(data);
        console.log("dg13 parse data: ", result);
        document.getElementById('dg13EmrtdFields').innerHTML = '';
        document.getElementById('numelec_input').value =result.data.fields.number;
        document.getElementById('commune_input').value =result.data.fields.municipality;
        
        const newEntry =
            `<table>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg13EmrtdNumberLabel">Number</elyLabel></td>
                    <td><div id="dg13EmrtdNumber">${result.data.fields.number}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg13DistrictLabel">District</elyLabel></td>
                    <td><div id="dg13District">${result.data.fields.district}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg13MunicipalityLabel">Municipality</elyLabel></td>
                    <td><div id="dg13Municipality">${result.data.fields.municipality}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg13LocationLabel">Location</elyLabel></td>
                    <td><div id="dg13Location">${result.data.fields.location}</div></td>
                </tr>
                <tr>
                    <td style="text-align: right;"><elyLabel id="dg13OfficeLabel">Office</elyLabel></td>
                    <td><div id="dg13Office">${result.data.fields.office}</div></td>
                </tr>
            </table>`;
        document.getElementById('dg13EmrtdFields').innerHTML += newEntry;
        document.getElementById('optionalDetails').style.display = 'block';
    }

    setImageSrc(id, url, width, height) {
        document.getElementById(id).src = url;
        document.getElementById(id).width = width;
        document.getElementById(id).height = height;
    }

    displayImage(id, images) {
        if (images?.length) {
            document.getElementById(id).innerHTML = "";
            const numImages = (id == "fingerprintDisplay") ? images.length : 1;
            let text = "";
            for (let i = 0; i < numImages; i++) {
                var idx = id;
                if (id == "fingerprintDisplay") {
                    idx = id + i;
                    //<table>
                    //<tr>
                    //  <!--Fingerprint0-->
                    //  <td><img class="fp-image" id="fingerprintDisplay0"><figcaption>fingerprintDisplay0</figcaption></td>
                    //  <!--Fingerprint1-->
                    //  <td><img class="fp-image" id="fingerprintDisplay1"><figcaption>fingerprintDisplay1</figcaption></td>
                    //</tr>
                    //</table>
                    var fingerType = util.getBioSubTypeName(images[i].header);
                    var newEntry = `<td><img class="fp-image" id="${idx}"><figcaption>${fingerType}</figcaption></td>`;
                    text += newEntry;
                }
            }
            if (id == "fingerprintDisplay") {
                document.getElementById(id).innerHTML = `<table><tr>${text}</tr></table>`;
            }
            for (let i = 0; i < numImages; i++) {
                if (id == "fingerprintDisplay") {
                    idx = id + i;
                    this.setImageSrc(idx, 'images/loading.gif', 48, 48);
                }
                const imageUrl = util.getDecodedImageData(images[i]);
                if (imageUrl == '') {
                    this.setImageSrc(idx, "images/cross.png", 48, 48);
                } else {
                    this.setImageSrc(idx, imageUrl, 240, 320);
                }
            }
        }
    }

    validateDg1Mrz(buffer) {
        if (pwdTypeSelected == PASSWORD_TYPE.MRZ) {
            const dg1Mrz = buffer.replace(/(?:\r\n|\r|\n)/g, '').trim();
            const scannerMrz = localStorage.getItem('mrz').replace(/(?:\r\n|\r|\n)/g, '').trim();
            if (dg1Mrz == scannerMrz) {
                this.appendStatusTextTag("Same as MRZ", 'success');
            }
            else {
                this.appendStatusTextTag("Does not match MRZ", 'warning');
                console.log(`Scanner MRZ: ${scannerMrz}`);
                console.log("DG1 MRZ", dg1Mrz);
            }
        }
    }

    // Test DG1 data of IDL
    display(id, buffer, type) {
        if (id == this.id.mrz) {
            this.displayMrzFields(buffer);
        } else if (id == this.id.dg1Mrz) {
            this.validateDg1Mrz(buffer);
            this.displayMrzFields(buffer);
        } else if (id == this.id.dg1Idl) {
            this.displayIdlFields(buffer, type);
        } else if (id == this.id.dg11Emrtd) {
            this.displayEmrtdAdditionalPersonalDetails(buffer);
        } else if (id == this.id.dg12Emrtd) {
            this.displayEmrtdAdditionalDocumentDetails(buffer);
        } else if (id == this.id.dg13Emrtd) {
            this.displayEmrtdOptionalDetails(buffer);
        } else if (id == this.id.portraitImg) {
            this.displayImage("portraitDisplay", buffer);
        } else if (id == this.id.fingerprintImg) {
            this.displayImage("fingerprintDisplay", buffer);
        } else if (id == this.id.signatureImg) {
            this.displayImage("signatureDisplay", buffer);
        } else {
            // Unknown id
            return false;
        }
        return true;
    }

    // Wait for the fingerprint image to load in the GUI.
    // This is needed in order to show the fingerprint images in the GUI before invoking the alert pop-up
    waitForFingerprintImageToLoad() {
        return new Promise(resolve => {
            setTimeout(resolve, 100); //wait for 100 milliseconds
        });
    }

    // Scan a live fingerprint and verify it against the WSQ data (retrieved from DG3).
    // This depends on the Xperix WebAgent service.
    async scanAndVerifyFingerprint(listOfFingerprints) {
        console_ely.logFuncName(this.scanAndVerifyFingerprint.name);
        if (listOfFingerprints.length < 1) {
            console_ely.log("Error: listOfFingerprints.length < 1");
            return false;
        }
        // Scan live fingerprint
        let result = await webApi.getLiveFingerprint();
        let status = false;
        if (result.status == "success") {
            console_ely.log("getLiveFingerprint is successful.");
            // Verify it with the fingerprints retrieved from DG3
            for (let index = 0; index < listOfFingerprints.length; index++) {
                const fingerprintFile = listOfFingerprints[index];
                try {
                    result = await webApi.verifyWithImageFile(fingerprintFile);
                    if (result.status == "success") {
                        console_ely.log(`Verification successful for fingerprint template index: ${index}`);
                        status = true;
                        break;
                    } else
                        console_ely.log(`Error: Verification failed for fingerprint template index: ${index}`);
                } catch (error) { console_ely.log(`Verification failed: ${error}`); }
            }
            if ((status)) {
                alert("Live finger matches DG3 data.");
            } else {
                alert("ERROR: Live finger DOES NOT match DG3 data.");
            }
        } else
            alert("ERROR: getLiveFingerprint failed.");
        
        return new Promise(resolve => {
            resolve (status);
        });
    }

    getSecret() {
        if (pwdTypeSelected == PASSWORD_TYPE.MRZ) {
            return localStorage.getItem('mrz');
        } else if (document.getElementById('pwdTypeAskEveryTime').checked
            && ((pwdTypeSelected == PASSWORD_TYPE.CAN) || (pwdTypeSelected == PASSWORD_TYPE.PIN))) {
            return document.getElementById('pinpadInputValuePopup').value;
        } else {
            return document.getElementById('pinpadInputValue').value;
        }
    }

    getStoredMrz() {
        return localStorage.getItem('mrz');
    }

    setStoredMrz(val) {
        localStorage.setItem('mrz', val);
    }

    clearStoredMrz() {
        localStorage.setItem('mrz', '');
    }

    openPinpad() {
        // if CAN and PIN are not selected, force the selection to CAN
        if ((document.getElementById("pwdTypeCan").checked != true) &&
            (document.getElementById("pwdTypePin").checked != true))
            this.dispatchChangeEvent("pwdTypeCan", true);
        const element = document.getElementById("pinpad");
        element.style.display = 'block';
        element.style.left = 'calc(50% - 5px)';
        document.getElementById('pinpadInputValue').focus();
    }

    closePopups(targetId, pinpad) {
        const pinpadElement = document.getElementById(pinpad);
        pinpadElement.value = ''; // Clear the input value
        inputValue = ''; // Clear the stored value

        if (targetId == "pinpad") {
            document.getElementById(targetId).style.display = 'none';
            return;
        }
        document.getElementById(targetId).classList.remove('show');
        document.getElementById('askEveryTimePopup').style.height = '275px';
        document.getElementById('pinpadInputValue').value = inputValue;
    }

    enterNumber(num, pinpad) {
        const targetInput = document.getElementById(pinpad);
        if (targetInput.value !== '')
            inputValue = targetInput.value + num;
        else
            inputValue += num;

        targetInput.value = inputValue;
    }

    clearInput(pinpad) {
        inputValue = inputValue.slice(0, -1);
        document.getElementById(pinpad).value = inputValue;
    }

    okButton(targetId) {
        if (targetId == "pinpad") {
            document.getElementById(targetId).style.display = 'none';
        } else {
            document.getElementById(targetId).classList.remove('show');
            if (targetId == "pinpadPopup") {
                document.getElementById('askEveryTimePopup').style.height = '275px';
            }
        }
        if (document.getElementById('pwdTypeCan').checked == true)
            localStorage.setItem('secret', document.getElementById('pinpadInputValue').value);
    }

    openPinpadPopup() {
        if (askEveryTimePopup.style.display === 'none' || askEveryTimePopup.style.visibility === 'hidden')
            return;
        askEveryTimePopup.style.height = '465px';
        // if CAN and PIN are not selected, force the selection to CAN
        if ((document.getElementById("pwdTypeCanPopup").checked != true) &&
            (document.getElementById("pwdTypePinPopup").checked != true))
            this.dispatchChangeEvent("pwdTypeCanPopup", true);
        this.updatePinpadInputVisibilityType('askEveryTimePopup');

        const pinpadPopup = document.getElementById("pinpadPopup");
        if (!pinpadPopup.classList.contains('show'))
            pinpadPopup.classList.add('show');
        document.getElementById('pinpadInputValuePopup').focus();
        if (!pinpadPopup.classList.contains('show')) {
            return;
        }
        pinpadPopup.style.top = '70%';
        pinpadPopup.style.left = '193px';
        pinpadPopup.style.width = '330px';
        pinpadPopup.style.border = 'none';
    }

    updatePinpadInputVisibilityType(popupId) {
        const pinpadId = (popupId == 'askEveryTimePopup') ? "pinpadInputValuePopup" : "pinpadInputValue";
        const pwdTypeCanId = (popupId == 'askEveryTimePopup') ? "pwdTypeCanPopup" : 'pwdTypeCan';
        const pinpad = document.getElementById(pinpadId);
        const pwdTypeCan = document.getElementById(pwdTypeCanId);
        pinpad.type = (pwdTypeCan.checked) ? 'number' : 'password';
    }

    closePinpadPopup() {
        inputValue = '';
        document.getElementById('pinpadInputValuePopup').value = inputValue;
        document.getElementById("pinpadPopup").classList.remove('show');
        document.getElementById('askEveryTimePopup').style.height = '275px';
    }

    openAskEveryTimePopup() {
        askEveryTimePopup.style.width = '390px';
        askEveryTimePopup.classList.add('show');
        const pinpadPopup = document.getElementById("pinpadPopup");
        const pwdTypeMrzPopup = document.getElementById("pwdTypeMrzPopup");

        if (pinpadPopup.classList.contains('show')) {
            if (!webApi.isMrzScannerAvailable && !pwdTypeMrzPopup.disabled)
                pwdTypeMrzPopup.disabled = true;
            else if (webApi.isMrzScannerAvailable && pwdTypeMrzPopup.disabled)
                pwdTypeMrzPopup.disabled = false;

            document.getElementById('pinpadInputValuePopup').focus();
            askEveryTimePopup.style.height = '465px';
        } else if (webApi.isMrzScannerAvailable) {
            pwdTypeMrzPopup.disabled = false;
            this.dispatchChangeEvent("pwdTypeMrzPopup", true);
        } else {
            this.openPinpadPopup();
            pwdTypeMrzPopup.disabled = true;
        }

        // Blur the background elements
        document.getElementById('backgroundElement').classList.toggle('options-popup-background-blur');

        // Disable Menu and Run button
        document.getElementById('optionsButton').disabled = true;
        this.update(GUI.RUN_DISABLE);

        // Clear pinpad value
        inputValue = '';
        document.getElementById('pinpadInputValuePopup').value = inputValue;

        // Set a flag to prevent immediate close
        this.#preventImmediateClose = true;

        // Add an event listener to detect clicks outside the popup
        document.addEventListener('click', this.outsideClickListener);

        // Add an event listener to detect enter & escape key inputs
        document.addEventListener('keydown', (event) => {
            if ((event.key === 'Escape') && (askEveryTimePopup != null))
                this.closeButtonHandlerPopup();
            else if ((event.key === 'Enter') && (document.getElementById("pinpadPopup").classList.contains('show') == true))
                this.okButton("pinpadPopup");
            else if ((event.key === 'Enter') && (document.getElementById('askEveryTimePopup').classList.contains('show') == true))
                this.okButtonHandlerPopup();
        });

        // Allow the popup to be closed after a short delay
        setTimeout(() => {
            this.#preventImmediateClose = false;
        }, 0);
    }

    okButtonHandlerPopup() {
        askEveryTimeInputSelected = true; // Mark user input is valid
        askEveryTimePopup.classList.remove('show'); // Hide AskEveryTime popup
        document.getElementById('backgroundElement').classList.remove('options-popup-background-blur');
        document.getElementById('optionsButton').disabled = false; // Enable Menu button
        document.removeEventListener('click', this.outsideClickListener); // Remove outsideClickListener
        gui.update(GUI.RUN_ENABLE); // Enable Run button
        gui.clickConnect(); // Simulate run button click
    }

    closeButtonHandlerPopup() {
        askEveryTimePopup = document.getElementById('askEveryTimePopup');
        askEveryTimePopup.classList.remove('show');
        document.getElementById('backgroundElement').classList.remove('options-popup-background-blur');
        document.getElementById('optionsButton').disabled = false; // Enable Menu button
        document.removeEventListener('click', this.outsideClickListener); // Remove outsideClickListener
        doAutoReadIfEnabled();
    }

    outsideClickListener(event) {
        if (!gui.#preventImmediateClose && !askEveryTimePopup.contains(event.target)) {
            gui.closeButtonHandlerPopup();
        }
    }

    dispatchChangeEvent(id, status) {
        const radio = document.getElementById(id);
        radio.checked = status;

        // Dispatch a change event to notify listeners
        const event = new Event('change', {
            'bubbles': true,
            'cancelable': true
        });
        radio.dispatchEvent(event);
    }

    updateScannerVersion(scannerVer) {
        if (scannerVer != null) {
            this.update(GUI.SCANNER_DETAILS, scannerVer);
        }
    }

    updateReaderDetails(readerVer, readerName='') {
        let szReaderVer;
        if (readerVer == null) {
            szReaderVer = readerName;
        }
        else if (readerName?.length > 0){
            let str = util.toHexString(readerVer, '')
            szReaderVer = util.getVersionString (readerName,
                str.substring(10, 12), str.substring(8, 10), str.substring(6, 8));
        }
        this.update(GUI.READER_PRESENT, szReaderVer);
    }

    getTimeToUpdate(time = -1) {
        if (tStartApp == 0) {
            tStartApp = new Date().getTime();
            tStartPrev = tStart = tStartApp;
        }
        if (time == -1) {
            tEnd = new Date().getTime();
            let tDiff = (tEnd - tStart);
            if (tDiff == 0)
                tDiff = (tEnd - tStartPrev);
            const tTotal = (tEnd - tStartApp);
            time = `(+${tDiff}) ${tTotal}`;
            tStartPrev = tStart;
            tStart = tEnd;
        }
        return time;
    }

    appendDetails(name, log_style, time = -1) {
        if (log_style == 4) {
            console_ely.log(`${name} failed`, log_style);
            var image = "cross.png";
        } else if (log_style == 5) {
            console_ely.log(`${name} success`, log_style);
            var image = "tick.png";
        } else {
            var image = "loading.gif"
        }
        time = this.getTimeToUpdate(time);
        if (log_style != 2) {
            console_ely.log(`${name} time: ${time} ms`, log_style);
        }
        this.appendInspectionDetails (image, name, time);
    }

    modifyStatus(image) {
        this.modifyStatusImage(image);
        this.modifyStatusTime(this.getTimeToUpdate());
    }

    isMrzValid() {
        return this.#isMrzValid;
    }

    // displayDebugResults
    updateInspectionDetails(result) {
        let lastStage = null;
        console.log("result: ", result);
        this.modifyStatus((result.status == "success") ? 'tick.png' : (result.status == "warning") ? 'tick.png' : 'cross.png');
        let response = result.debug;
        if (Array.isArray(response)) {
            response.forEach(entry => {
                if (!entry?.stage?.toLowerCase().includes('-hidden') && entry?.stage !== lastStage) {
                    if (entry?.stage?.toLowerCase().includes('-info')) {
                        this.appendStatusTextTag(entry.status, (entry.status == 'hash unverified') ? 'warning' : result.status);
                    } else {
                        this.appendStatusTextTag(entry.stage?.split('-')[0], (entry.status == 'OK' || entry.status == 'success') ? 'success' : (entry.status == "warning") ? 'warning' : 'fail');
                    }
                    lastStage = entry.stage;
                }
            });
        } else {
            console.log(`Response: ${response}`);
        }
    }

    onDeviceDisconnect() {
        this.update(GUI.CLEAR_DEVICE_DETAILS);
        this.update(GUI.CONNECT_DISABLE);
        if (askEveryTimePopup.classList.contains('show') == true) {
            this.closeButtonHandlerPopup();
        }
    }

    cleanup()
    {
        // Clear old MRZ lines data
        this.clearStoredMrz();
        askEveryTimeInputSelected = false;
    }
}
