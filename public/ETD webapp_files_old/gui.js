const guiEvents = {
    GUI_CLEAR: 'clear', // clear gui
    GUI_CLEAR_ON_RUN: 'clearOnRun', // Clear the GUI when the run button is clicked
    GUI_CONNECT_DISABLE : 'connectDisable', // disable connect button
    GUI_RUN: 'run', // run
    GUI_RUN_ENABLE: 'runEnable', // enable run button
    GUI_RUN_DISABLE: 'runDisable', // disable run button
    GUI_ATR: 'updateAtr', // update ATR
    GUI_CARD_PRESENT: 'cardPresent', // card present
    GUI_CARD_ABSENT: 'cardAbsent', // card absent
    GUI_READER_PRESENT: 'readerPresent', // reader present
    GUI_READER_ABSENT: 'readerAbsent', // reader absent
    GUI_PORTRAIT_LOAD: 'portraitLoading', // portrait loading
    GUI_SIGNATURE_LOAD: 'signatureLoading', // signature loading
    GUI_FINGERPRINT_LOAD: 'fingerprintLoading', // fingerprint loading
    GUI_FINGERPRINT_ERROR: 'fingerprintError', // fingerprint error
    GUI_SCANNER_DETAILS: 'scannerDetails', // scanner details
};

class Gui {
    id = {
        mrz: "mrz",
        dg1Mrz: "dg1Mrz",
        dg1Idl: "dg1Idl",
        portraitImg: "portraitImg",
        signatureImg: "signatureImg",
        fingerprintImg: "fingerprintImg",
    };

    initAuthControls() {
        // apdu type
        gui.setApduType(urlparams_apdu);

        // auto read
        enableAutoReadCheckbox = document.getElementById('arCheckbox');
        this.setReadingOptions();

        // passive auth
        enablePaCheckbox = document.getElementById('paCheckbox');
        cscaFileBrowser = document.getElementById('paCscaFileBrowser');
        dsFileBrowser = document.getElementById('paDsFileBrowser');
        if (urlparams_pa == 1) {
            enablePaCheckbox.checked = true;
            cscaFileBrowser.disabled = !enablePaCheckbox.checked;
            dsFileBrowser.disabled = !enablePaCheckbox.checked;
            doPassiveAuthentication = true;
        }

        // active auth
        enableAaCheckbox = document.getElementById('aaCheckbox');
        enableAaCheckbox.checked = (urlparams_aa == 1) ? true : false;
        doActiveAuthentication = enableAaCheckbox.checked;

        // chip auth
        enableCaCheckbox = document.getElementById('caCheckbox');
        enableCaCheckbox.checked = (urlparams_ca == 1) ? true : false;
        doChipAuthentication = enableCaCheckbox.checked;

        // terminal auth
        enableTaCheckbox = document.getElementById('taCheckbox');
        dvFileBrowser = document.getElementById('taDvFileBrowser');
        isFileBrowser = document.getElementById('taIsFileBrowser');
        iskFileBrowser = document.getElementById('taIsKeyFileBrowser');
        if (urlparams_ta == 1) {
            enableTaCheckbox.checked = true;
            enableCaCheckbox.checked = true;
            dvFileBrowser.disabled = !enableTaCheckbox.checked;
            isFileBrowser.disabled = !enableTaCheckbox.checked;
            iskFileBrowser.disabled = !enableTaCheckbox.checked;
            doChipAuthentication = true;
            doTerminalAuthentication = true;
        }
    }

    setApduType(type) {
        let types = ['extended', 'short', 'auto'];
        if (!types.includes (type)) { type = sessionStorage.getItem('apdu'); }
        if (!types.includes (type)) { type = 'short'; }
        if (type == "extended") { document.getElementById('apduTypeExtended').checked = true; }
        else if (type == "short") { document.getElementById('apduTypeShort').checked = true; }
        else { document.getElementById('apduTypeShort').checked = true; } // todo
        sessionStorage.setItem('apdu', type);
    }

    getApduType() {
        if (document.getElementById('apduTypeExtended').checked) { return "extended"; }
        else if (document.getElementById('apduTypeShort').checked) { return "short"; }
        else if (document.getElementById('apduTypeExtended').checked) { return "short"; } // todo
    }

    setReadingOptions() {
        // Auto read
        if (urlparams_autoRead == '1') {
            enableAutoReadCheckbox.checked = true;
        } else {
            var autoReadResult = sessionStorage.getItem('autoRead');
            sessionStorage.setItem('autoRead', autoReadResult);
            enableAutoReadCheckbox.checked = (autoReadResult == "true") ? true : false;    
        }
        doAutoRead = enableAutoReadCheckbox.checked;
        // todo: PA, AA, CA, TA
    }

    addEventListeners() {
        // Event listener for APDU type
        $(document).ready(function(){
            $('input[type=radio]').change(function(){
                if ((this.id == "apduTypeShort") || (this.id == "apduTypeExtended"))
                    sessionStorage.setItem('apdu', gui.getApduType());
            });
        });

        // Event listener for auto read checkbox
        enableAutoReadCheckbox.addEventListener('change', () => {
            sessionStorage.setItem('autoRead', enableAutoReadCheckbox.checked);
            doAutoRead = enableAutoReadCheckbox.checked;
            if(!doAutoRead) {
                isReadAwaitAborted = true;
            }
        });

        // Event listeners for PA controls
        enablePaCheckbox.addEventListener('change', () => {
            cscaFileBrowser.disabled = !enablePaCheckbox.checked;
            dsFileBrowser.disabled = !enablePaCheckbox.checked;
            doPassiveAuthentication = enablePaCheckbox.checked;
        });
        cscaFileBrowser.addEventListener('change', (event) => {
            cscaListOfFiles = event.target.files;
        });
        dsFileBrowser.addEventListener('change', (event) => {
            dsListOfFiles = event.target.files;
        });

        // Event listener for AA checkbox
        enableAaCheckbox.addEventListener('change', () => {
            if (enableAaCheckbox.checked) {
                enableAaCheckbox.checked = true;
            }
            doActiveAuthentication = enableAaCheckbox.checked;
        });

        // Event listener for CA checkbox
        enableCaCheckbox.addEventListener('change', () => {
            if (enableTaCheckbox.checked) {
                if (!enableCaCheckbox.checked) {
                    alert("CA is needed to perform TA");
                }
                enableCaCheckbox.checked = true;
            }
            doChipAuthentication = enableCaCheckbox.checked;
        });

        // Event listeners for TA controls
        enableTaCheckbox.addEventListener('change', () => {
            if (enableTaCheckbox.checked) {
                enableCaCheckbox.checked = true;
            }
            doChipAuthentication = enableCaCheckbox.checked;
            dvFileBrowser.disabled = !enableTaCheckbox.checked;
            isFileBrowser.disabled = !enableTaCheckbox.checked;
            iskFileBrowser.disabled = !enableTaCheckbox.checked;
            doTerminalAuthentication = enableTaCheckbox.checked;
        });
        dvFileBrowser.addEventListener('change', (event) => {
            dvListOfFiles = event.target.files;
        });
        isFileBrowser.addEventListener('change', (event) => {
            isListOfFiles = event.target.files;
        });
        iskFileBrowser.addEventListener('change', (event) => {
            iskListOfFiles = event.target.files;
        });
    }

    initAuthConfig(isScannerAvailable, isClReaderAvailable) {
        console.log("Scanner presence: " + isScannerAvailable + ", CL reader presence: " + isClReaderAvailable);
        document.getElementById("authTypes").disabled = false;
        document.getElementById("pwdTypes").disabled = false;
        if (isScannerAvailable == 1) {
            document.getElementById("authTypeBac").disabled = false;
            document.getElementById("pwdTypeCan").disabled = false;
            if (isClReaderAvailable == 1) {
                document.getElementById("authTypeAuto").disabled = false;
                document.getElementById("authTypePace").disabled = false;
                document.getElementById("pwdTypeMrz").disabled = false;
                document.getElementById("pwdTypePin").disabled = false;
            } else {
                document.getElementById("authTypeAuto").disabled = true;
                document.getElementById("authTypePace").disabled = true;
                document.getElementById("pwdTypeMrz").disabled = true;
                document.getElementById("pwdTypePin").disabled = true;
            }
        } else if (isClReaderAvailable == 1) {
            document.getElementById("authTypePace").checked = true; // Force select PACE
            document.getElementById("pwdTypeCan").checked = true; // Force select CAN
            document.getElementById("authTypeAuto").disabled = true;
            document.getElementById("authTypePace").disabled = false;
            document.getElementById("authTypeBac").disabled = true;
            document.getElementById("pwdTypeMrz").disabled = true;
            document.getElementById("pwdTypeCan").disabled = false;
            document.getElementById("pwdTypePin").disabled = false;
            this.update(guiEvents.GUI_SCANNER_DETAILS, '');
        } else {
            document.getElementById("authTypes").disabled = true;
            document.getElementById("pwdTypes").disabled = true;
            this.update(guiEvents.GUI_SCANNER_DETAILS, '');
        }
    }

    selectAutoAndMrz() {
        document.getElementById("authTypeAuto").checked = true; // Force select Auto
        document.getElementById("pwdTypeMrz").checked = true; // Force select MRZ
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
            $("#nationality_input").val('');
            $("#sex_input").val('');
            $("#doe_input").val('');
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
        }
        document.getElementById("fingerprintDisplay").style.display = 'none';
    }

    clearInspectionDetails() {
        document.getElementById('inspectionList').innerHTML = "";
    }

    htmlFormat(data) {
        return data.replace(/\t/g, "&zwnj;&nbsp;&nbsp;&nbsp;&nbsp;").replace(/(?:\r\n|\r|\n)/g, '<br>');
    }

    update(guiEvent, data = null) {
        if (data) {
            data = this.htmlFormat(data);
        }
        switch (guiEvent) {
            case guiEvents.GUI_CLEAR:
                this.clearDocumentDetails();
                break;
            case guiEvents.GUI_CLEAR_ON_RUN:
                this.clearDocumentDetails();
                this.clearInspectionDetails();
                break;
            case guiEvents.GUI_CONNECT_DISABLE:
                $('#connect').attr('disabled', 'disabled');
                break;    
            case guiEvents.GUI_RUN:
                $("#connect").text(webapp_config.RUN);
                break;
            case guiEvents.GUI_RUN_ENABLE:
                $('#connect').removeAttr('disabled');
                break;
            case guiEvents.GUI_RUN_DISABLE:
                $('#connect').attr('disabled', 'disabled');
                break;
            case guiEvents.GUI_ATR:
            case guiEvents.GUI_CARD_PRESENT:
                $("#scardAtr").text(data);
                break;
            case guiEvents.GUI_CARD_ABSENT:
                $("#scardAtr").text('');
                break;
            case guiEvents.GUI_READER_PRESENT:
                document.getElementById('scardReader').innerHTML = data;
                break;
            case guiEvents.GUI_READER_ABSENT:
                document.getElementById('scardReader').innerHTML = "";
                break;
            case guiEvents.GUI_PORTRAIT_LOAD:
                this.setImageSrc("portraitDisplay", "/images/loading.gif", 48, 48);
                break;
            case guiEvents.GUI_SIGNATURE_LOAD:
                this.setImageSrc("signatureDisplay", "/images/loading.gif", 48, 48);
                break;
            case guiEvents.GUI_FINGERPRINT_LOAD:
                document.getElementById("fingerprintDisplay").innerHTML =
                    "<img class=\"fp-image\" id=\"fingerprintDisplayTemp\"></img>";
                this.setImageSrc("fingerprintDisplayTemp", "/images/loading.gif", 48, 48);
                document.getElementById("fingerprintDisplay").style.display = 'block';
                break;
            case guiEvents.GUI_FINGERPRINT_ERROR:
                document.getElementById("fingerprintDisplay").innerHTML =
                    "<img class=\"fp-image\" id=\"fingerprintDisplayTemp\"></img>";
                this.setImageSrc("fingerprintDisplayTemp", "/images/cross.png", 48, 48);
                document.getElementById("fingerprintDisplay").style.display = 'block';
                break;
            case guiEvents.GUI_SCANNER_DETAILS:
                document.getElementById('scanner').innerHTML = data;
                break;
            default:
                break;
        }
    }

    appendInspectionDetails(imageName, statusText, time) {
        // remove current recent flags to add a new entry with new recent flags
        var htmlText  = document.getElementById('inspectionList').innerHTML;
        htmlText = htmlText.replaceAll("id=\"recent-status-flag\" ", '');
        htmlText = htmlText.replaceAll("id=\"recent-status-image-flag\" ", '');
        htmlText = htmlText.replaceAll("id=\"recent-status-text-flag\" ", '');
        htmlText = htmlText.replaceAll("id=\"recent-status-time-flag\" ", '');
        // create entry
        var newEntry = "<div id='recent-status-flag' class=\"columns is-vcentered\"> \
                            <div id='recent-status-image-flag' class=\"column is-1\"><img src=\"/images/" + imageName + "\" width=48 height=48/></div> \
                            <div id='recent-status-text-flag' class=\"column is-8 has-text-dark\">" + statusText + "</div> \
                            <div id='recent-status-time-flag' class=\"column is-3 has-text-dark is-family-monospace\" style=\"text-align: right;\">" + time + " ms</div> \
                        </div>";
        document.getElementById('inspectionList').innerHTML = htmlText + newEntry;
    }

    modifyStatusImage(imageName) {
        var newEntry = "<img src=\"/images/" + imageName + "\"width=48 height=48/>";
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
        var newEntry = "<span class=\"is-italic tag-" + tagType + "\">" + statusText + "</span>";
        document.getElementById('recent-status-text-flag').innerHTML += newEntry;
    }

    modifyStatusTime(time) {
        document.getElementById('recent-status-time-flag').innerHTML = time + " ms";
    }

    modifyInspectionDetails(imageName, statusText, time) {
        this.modifyStatusImage(imageName);
        this.modifyStatusText(statusText);
        this.modifyStatusTime(time);
    }

    getAuthType() {
        var auth = AUTO;
        if (document.getElementById('authTypeAuto').checked) { auth = AUTO; }
        else if (document.getElementById('authTypePace').checked) { auth = PACE; }
        else if (document.getElementById('authTypeBac').checked) { auth = BAC_BAP; }
        else { console_ely.log("ERROR: Unknown authType selection", 4); }
        console_ely.log("auth type selected: " + auth);
        return auth;
    }

    getPwdType() {
        var pwd = MRZ;
        if (document.getElementById('pwdTypeMrz').checked) { pwd = MRZ; }
        else if (document.getElementById('pwdTypeCan').checked) { pwd = CAN; }
        else if (document.getElementById('pwdTypePin').checked) { pwd = PIN; }
        else { console_ely.log("ERROR: Unknown pwdType selection", 4); }
        console_ely.log("pwd type selected: " + pwd);
        return pwd;
    }

    getPwdTypeName() {
        var pwd = "MRZ";
        if (document.getElementById('pwdTypeMrz').checked) { pwd = "MRZ"; }
        else if (document.getElementById('pwdTypeCan').checked) { pwd = "CAN"; }
        else if (document.getElementById('pwdTypePin').checked) { pwd = "PIN"; }
        else { console_ely.log("ERROR: Unknown pwdType selection", 4); }
        console_ely.log("pwd type selected: " + pwd);
        return pwd;
    }

    displayVer(appName, appVer, libVer, buildNum) {
        var ver = appName + " v";
        if (appVer == "") { appVer = "0"; }
        ver = ver + appVer;
        if (libVer != "") { ver = ver + "." + libVer; }
        if (buildNum != "") { ver = ver + "-rc" + buildNum; }
        console.log(ver);
        sessionStorage.setItem('version', ver);
        $("#version").text(ver);
    }

    isEppOnIdBox5xxOr6xx(szMrz) {
        if ((szMrz != null) && (szMrz.length != 0) && (szMrz[0] == 'P')) {
            szMrz = szMrz.trim();
            var mrzLines = szMrz.replaceAll("\r\n", "\r").split('\r');
            return ((mrzLines[0].length >= 28) && (mrzLines[0].length != 44)
                && (mrzLines[1].length >= 28) && (mrzLines[1].length != 44)
                && (mrzLines.length == 2));
        }
        return false;
    }

    preprocessMrz(szMrz) {
        //szMrz = "P<UTOERIKSSON<<ANNA<MARIA<<<<<<\r\nL898902C<3UTO6908061M9406236<<9\r\n\r\n";   // Default TD3 MRZ on ID BOX 5xx or 6xx
        if (this.isEppOnIdBox5xxOr6xx(szMrz)) {
            var mrzLines = szMrz.replaceAll("\r\n", "\r").split('\r');
            var strFillers = "________________";
            szMrz = mrzLines[0] + strFillers.substring(0, (44 - mrzLines[0].length)) + "\r\n" +
                mrzLines[1] + strFillers.substring(0, (44 - mrzLines[0].length)) + "\r\n" +
                "\r\n";
        }
        // Store the MRZ to the cookies to access during auth
        sessionStorage.setItem('mrz', szMrz);
        document.getElementById('mrzDisplay').innerHTML =
            szMrz.replace(/</g, '&lt;').replace(/(?:\r\n|\r|\n)/g, ' ').trim().replace(/ /g, '<br>');
        document.getElementById("mrzDisplay").style.display = 'block';
        szMrz = szMrz.trim().replaceAll("_", "<");
        // Update the secret 
        secret = szMrz;
        return szMrz;
    }

    displayMrzFields(szMrz) {
        var mrzVal = this.preprocessMrz(szMrz);
        isMrzValid = true;
        if (mrzVal != null && mrzVal.length == 30 && mrzVal[0] == 'D') {
            console.log("IDL MRZ: MRZ Parsing skipped");
        } else {
            try {
                var result = mrz.parse(mrzVal.split(/(?:\r\n|\r|\n)/g));
                console.log("resultats" + result.fields);
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
                $("#dob_input").val(util.buildDate( result.fields.birthDate.substring(4, 6),  result.fields.birthDate.substring(2, 4),  result.fields.birthDate.substring(0, 2), 'dd/mm/yy'));
                $("#nationality_input").val(result.fields.nationality);
                $("#sex_input").val(result.fields.sex);
                $("#doe_input").val(util.buildDate(result.fields.expirationDate.substring(4, 6), result.fields.expirationDate.substring(2, 4), result.fields.expirationDate.substring(0, 2), 'dd/mm/yy'));
                $("#docNumber_input").val(result.fields.documentNumber);
            } catch (e) {
                gui.update(guiEvents.GUI_RUN_ENABLE);
                gui.appendStatusTextTag ("Parsing KO", "fail");
                gui.modifyStatusImage ("cross.png");
                isMrzValid = false;
            }
        }
    }

    addIdlCategoriesAsTree(vehicle_categories) {
        document.getElementById('categories-idl').innerHTML = '';
        for (var i = 0; i < vehicle_categories.length; i++) {
            // Create and append entry
            var newEntry =
            "<div class=\"box\"> \
                <ul> \
                    <li class=\"container\"><span class=\"caret\">" + vehicle_categories[i].category + "</span> \
                        <ul class=\"tree nested\"> \
                            <li>" + vehicle_categories[i].valid_from + "</li> \
                            <li>" + vehicle_categories[i].valid_till + "</li> \
                            <li>" + vehicle_categories[i].code + "</li> \
                            <li>" + vehicle_categories[i].sign + "</li> \
                            <li>" + vehicle_categories[i].value + "</li> \
                        </ul> \
                    </li> \
                </ul> \
            </div>";
            document.getElementById('categories-idl').innerHTML += newEntry;

            // Active caret toggler in GUI
            var toggler = document.getElementsByClassName("caret");
            for (var j = 0; j < toggler.length; j++) {
                toggler[j].addEventListener("click", function() {
                    this.parentElement.querySelector(".nested").classList.toggle("active");
                    this.classList.toggle("caret-down");
                });
            }
        }
    }

    displayIdlCategories(aszCategories, idlType) {
        function vehicle_category(fields) {
            this.category = "Category: " + util.hexToAscii(fields[0]);
            if (idlType == "IDL_EU") {
                this.valid_from = "Valid from: " + util.buildDate(fields[1].substring(0, 2), fields[1].substring(2, 4), fields[1].substring(4, 8), 'dd/mm/yyyy');
                this.valid_till = "Valid till: " + util.buildDate(fields[2].substring(0, 2), fields[2].substring(2, 4), fields[2].substring(4, 8), 'dd/mm/yyyy');
            } else {
                this.valid_from = "Valid from: " + util.buildDate(fields[1].substring(6, 8), fields[1].substring(4, 6), fields[1].substring(0, 4), 'dd/mm/yyyy');
                this.valid_till = "Valid till: " + util.buildDate(fields[2].substring(6, 8), fields[2].substring(4, 6), fields[2].substring(0, 4), 'dd/mm/yyyy');
            }
            this.code = "Code: " + util.hexToAscii(fields[3]);
            this.sign = "Sign: " + util.hexToAscii(fields[4]);
            this.value = "Value: " + util.hexToAscii(fields[5]);
        }
        var vehicle_categories = [];
        for (var i = 0; i < aszCategories.length; i++) {
            var fields = aszCategories[i].replaceAll('3b', ' ').trim().split(' ');
            vehicle_categories[i] = new vehicle_category(fields);
        }
        this.addIdlCategoriesAsTree(vehicle_categories);
    }

    displayIdlFields(data, idlType) {
        var found = false;
        var result = { fields: { familyName: '', givenName: '', birthDate: '', issueDate: '', expirationDate: '', issuingCountry: '', issuingAuthority: '', documentNumber: '', categories : ([]) } };

        if (idlType == "IDL_EU") {

            // Family name
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x04]];
            var wrappedData = util.unwrapTlvs(tagList, data);
            result.fields.familyName = util.fromUtf8Array(wrappedData);

            // Given name
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x05]];
            var wrappedData = util.unwrapTlvs(tagList, data);
            result.fields.givenName = util.fromUtf8Array(wrappedData);

            // Date of birth (IDL_EU cards store date in ddmmyyyy format)
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x06]];
            var wrappedData = util.unwrapTlvs(tagList, data);
            var date = util.toHexString(wrappedData, '');
            result.fields.birthDate = util.buildDate(date.substring(0, 2), date.substring(2, 4), date.substring(4, 8), 'dd/mm/yyyy');

            // Date of issue
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x0A]];
            var wrappedData = util.unwrapTlvs(tagList, data);
            var date = util.toHexString(wrappedData, '');
            result.fields.issueDate = util.buildDate(date.substring(0, 2), date.substring(2, 4), date.substring(4, 8), 'dd/mm/yyyy');

            // Date of expiry
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x0B]];
            var wrappedData = util.unwrapTlvs(tagList, data);
            var date = util.toHexString(wrappedData, '');
            result.fields.expirationDate = util.buildDate(date.substring(0, 2), date.substring(2, 4), date.substring(4, 8), 'dd/mm/yyyy');

            // Issuing country
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x03]];
            var wrappedData = util.unwrapTlvs(tagList, data);
            result.fields.issuingCountry = util.fromUtf8Array(wrappedData);

            // Issuing authority
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x0C]];
            var wrappedData = util.unwrapTlvs(tagList, data);
            result.fields.issuingAuthority = util.fromUtf8Array(wrappedData);

            // Document number
            var tagList = [[0x61], [0x5F, 0x02], [0x5F, 0x0E]];
            var wrappedData = util.unwrapTlvs(tagList, data);
            result.fields.documentNumber = util.fromUtf8Array(wrappedData);

            found = true;

        } else {

            var tagList = [[0x61], [0x5F, 0x1F]];
            var wrappedData = util.unwrapTlvs(tagList, data);

            // Family name
            var len = wrappedData[0];
            wrappedData = wrappedData.slice(1);
            result.fields.familyName = util.fromUtf8Array(wrappedData, len);
            wrappedData = wrappedData.slice(len);

            // Given name
            len = wrappedData[0];
            wrappedData = wrappedData.slice(1);
            result.fields.givenName = util.fromUtf8Array(wrappedData, len);
            wrappedData = wrappedData.slice(len);

            // Date of birth (IDL cards store date in yyyymmdd format)
            len = 4;
            var date = util.toHexString(wrappedData, '', len);
            result.fields.birthDate = util.buildDate(date.substring(6, 8), date.substring(4, 6), date.substring(0, 4), 'dd/mm/yyyy');
            wrappedData = wrappedData.slice(len);

            // Date of issue
            len = 4;
            var date = util.toHexString(wrappedData, '', len);
            result.fields.issueDate = util.buildDate(date.substring(6, 8), date.substring(4, 6), date.substring(0, 4), 'dd/mm/yyyy');
            wrappedData = wrappedData.slice(len);

            // Date of expiry
            len = 4;
            var date = util.toHexString(wrappedData, '', len);
            result.fields.expirationDate = util.buildDate(date.substring(6, 8), date.substring(4, 6), date.substring(0, 4), 'dd/mm/yyyy');
            wrappedData = wrappedData.slice(len);

            // Issing country
            len = 3;
            result.fields.issuingCountry = util.fromUtf8Array(wrappedData, len);
            wrappedData = wrappedData.slice(len);

            // Issing authority
            len = wrappedData[0];
            wrappedData = wrappedData.slice(1);
            result.fields.issuingAuthority = util.fromUtf8Array(wrappedData, len);
            wrappedData = wrappedData.slice(len);

            // Document number
            len = wrappedData[0];
            wrappedData = wrappedData.slice(1);
            result.fields.documentNumber = util.fromUtf8Array(wrappedData, len);
            wrappedData = wrappedData.slice(len);

            found = true;
        }

        if (found) {
            // Categories
            var categories = '';
            var tagList = [[0x61], [0x7F, 0x63]];
            var wrappedData = util.unwrapTlvs(tagList, data);
            if (wrappedData != null && wrappedData.length) {
                if (wrappedData[0] == 0x02) {
                    var nb_cat_len = wrappedData [1];
                    var nb_cat  = wrappedData[2];
                    var j = 3;
                    for(var i = 0; i < nb_cat; i++) {
                        if (wrappedData[j] != 0x87) {
                            break;
                        }
                        len = wrappedData[j + 1];
                        var category = wrappedData.slice(j + 2, j + 2 + len);
                        j = j + 2 + len;
                        categories = util.toHexString(category, '');
                        len = categories.length;
                        categories = categories.padEnd(len + 2, '3b');
                        result.fields.categories[i] = categories;
                    }
                    // [test]
                    //result.fields.categories[i++] = '423b010120123b010120223b5330313b3c3d3b383030303b';
                    //result.fields.categories[i++] = '433b010120123b010120223b5330313b3c3d3b383030303b';
                }
            }
            console.log(result);
            document.getElementById("dg1EmrtdFields").style.display = 'none';
            console.log(result.fields.familyName); $("#familyName-idl").text(result.fields.familyName);
            console.log(result.fields.givenName); $("#givenName-idl").text(result.fields.givenName);
            console.log(result.fields.birthDate); $("#dob-idl").text(result.fields.birthDate);
            console.log(result.fields.issueDate); $("#doi-idl").text(result.fields.issueDate);
            console.log(result.fields.expirationDate); $("#doe-idl").text(result.fields.expirationDate);
            console.log(result.fields.issuingCountry); $("#issuingCountry-idl").text(result.fields.issuingCountry);
            console.log(result.fields.issuingAuthority); $("#issuingAuthority-idl").text(result.fields.issuingAuthority);
            console.log(result.fields.documentNumber); $("#docNumber-idl").text(result.fields.documentNumber);
            console.log(result.fields.categories); this.displayIdlCategories(result.fields.categories, idlType);
            document.getElementById("dg1IdlFields").style.display = 'block';
        }
    }

    setImageSrc(id, url, width, height) {
        document.getElementById(id).src = url;
        document.getElementById(id).width = width;
        document.getElementById(id).height = height;
    }

    displayImage(id, images) {
        if (images != null && images.length) {
            document.getElementById(id).innerHTML = "";
            var numImages = (id == "fingerprintDisplay") ? images.length : 1;
            var text = "";
            for (var i = 0; i < numImages; i++) {
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
                    var newEntry = "<td><img class=\"fp-image\" id=\"" + idx + "\"><figcaption>" + fingerType + "</figcaption></td>";
                    text += newEntry;
                }
            }
            if (id == "fingerprintDisplay") {
                document.getElementById(id).innerHTML = "<table><tr>" + text + "</tr></table>";
            }
            for (var i = 0; i < numImages; i++) {
                if (id == "fingerprintDisplay") {
                    idx = id + i;
                    this.setImageSrc(idx, '/images/loading.gif', 48, 48);
                }
                var imageUrl = util.getDecodedImageData(images[i]);
                if (imageUrl == '') {
                    this.setImageSrc(idx, "/images/cross.png", 48, 48);
                } else {
                    this.setImageSrc(idx, imageUrl, 240, 320);
                }
            }
        }
    }

    validateDg1Mrz(buffer) {
        if (this.getPwdType() == MRZ) {
            var dg1Mrz = buffer.replace(/(?:\r\n|\r|\n)/g, '').trim();
            var scannerMrz = sessionStorage.getItem('mrz').replace(/(?:\r\n|\r|\n)/g, '').trim();
            if (dg1Mrz == scannerMrz) {
                gui.appendStatusTextTag("Same as MRZ", 'success');
            }
            else {
                gui.appendStatusTextTag("Does not match MRZ", 'warning');
                console.log("Scanner MRZ: " + scannerMrz);
                console.log("DG1 MRZ", dg1Mrz);
            }
        }
    }

    // Test DG1 data of IDL
    //tempBuffer = [0x61, 0x81, 0xAB, 0x5F, 0x1F, 0x81, 0x8D, 0x0F, 0x53, 0x6D, 0x69, 0x74, 0x68, 0x65, 0x2D, 0x57, 0x69, 0x6C, 0x6C, 0x69, 0x61, 0x6D, 0x73, 0x17, 0x41, 0x6C, 0x65, 0x78, 0x61, 0x6E, 0x64, 0x65, 0x72, 0x20, 0x47, 0x65, 0x6F, 0x72, 0x67, 0x65, 0x20, 0x54, 0x68, 0x6F, 0x6D, 0x61, 0x73, 0x19, 0x70, 0x03, 0x01, 0x20, 0x02, 0x09, 0x15, 0x20, 0x07, 0x09, 0x30, 0x4A, 0x50, 0x4E, 0x43, 0x48, 0x4F, 0x4B, 0x4B, 0x41, 0x49, 0x44, 0x4F, 0x20, 0x50, 0x52, 0x45, 0x46, 0x45, 0x43, 0x54, 0x55, 0x52, 0x41, 0x4C, 0x20, 0x50, 0x4F, 0x4C, 0x49, 0x43, 0x45, 0x20, 0x41, 0x53, 0x41, 0x48, 0x49, 0x4B, 0x41, 0x57, 0x41, 0x20, 0x41, 0x52, 0x45, 0x41, 0x20, 0x53, 0x41, 0x46, 0x45, 0x54, 0x59, 0x20, 0x50, 0x55, 0x42, 0x4C, 0x49, 0x43, 0x20, 0x43, 0x4F, 0x4D, 0x4D, 0x49, 0x53, 0x53, 0x49, 0x4F, 0x4E, 0x11, 0x41, 0x32, 0x39, 0x30, 0x36, 0x35, 0x34, 0x33, 0x39, 0x35, 0x31, 0x36, 0x34, 0x32, 0x37, 0x33, 0x58, 0x7F, 0x63, 0x1A, 0x02, 0x01, 0x01, 0x87, 0x15, 0x43, 0x31, 0x3B, 0x20, 0x00, 0x03, 0x15, 0x3B, 0x20, 0x10, 0x03, 0x14, 0x3B, 0x39, 0x33, 0x3B, 0x3C, 0x3D, 0x3B, 0x80, 0x00];
    display(id, buffer, type) {
        if (id == this.id.mrz) {
            this.displayMrzFields(buffer);
        } else if (id == this.id.dg1Mrz) {
            this.validateDg1Mrz(buffer);
            this.displayMrzFields(buffer);
        } else if (id == this.id.dg1Idl) {
            //buffer = this.tempBuffer;
            //type = "IDL";
            this.displayIdlFields(buffer, type);
        } else if (id == this.id.portraitImg) {
            this.displayImage("portraitDisplay", buffer);
        } else if (id == this.id.fingerprintImg) {
            this.displayImage("fingerprintDisplay", buffer);
        } else if (id == this.id.signatureImg) {
            this.displayImage("signatureDisplay", buffer);
        } else {
            // Unknown id
        }
    }

    // Get live fingerprint data from the sensor.
    // This depends on the Xperix WebAgent service.
    async getLiveFingerprint() {
        console_ely.logFuncName(this.getLiveFingerprint.name);
        var timeout = false;
        try {
            var result = await bioMini.initBioScanner();
            if (result == "success") {
                result = await bioMini.getScannerDetails();
                if (result == "success") {
                    result = await bioMini.autoCapture();
                    if (result == "success") {
                        result = await bioMini.autoCaptureLoop();
                        if (result == "success")
                            console_ely.log("Fingerprint captured successfully.");
                        else {
                            console_ely.log("Fingerprint capture timeout.");
                            timeout = true;
                        }
                        // abort capture
                        result = await bioMini.abortCapture();
                        console_ely.log(((result == "success") ? "Aborted capture successfully." : "Error: Failed to abort capture."));
                        return ((result == "success") && (timeout == false)) ? true : false;

                    } else
                        console_ely.log("Error: Failed to set BioMini Scanner to auto capture.");
                } else
                    console_ely.log("Error: Failed to get BioMini Scanner Details.");
            } else
                console_ely.log("Error: Failed to perform Init BioMini Scanner.");

        } catch (error) {
            console.error("Error: Failed to retrieve live fingerprint, ", error);
        }
    }

    // Wait for the fingerprint image to load in the GUI.
    // This is needed in order to show the fingerprint images in the GUI before invoking the alert pop-up
    waitForFingerprintImageToLoad() {
        return new Promise(resolve => {
            setTimeout(resolve, 100); //wait for 100 milli seconds
        });
    }

    // Retrieve WSQ image data (retrieved from DG3) to 'listOfImageData' to compare it with live fingerprint.
    getWsqImageData(images) {
        var listOfImageData = [];
        if ((images != null) && (images.length > 0)) {
            for (var i = 0; i < images.length; i++) {
                if (images[i].type == webapp_config.WSQ)
                    listOfImageData.push(images[i].data);
            }
        }
        return listOfImageData;
    }

    // De-initialize BioMini Scanner.
    // This depends on the Xperix WebAgent service.
    async deinitBioMiniScanner() {
        var result;
        try {
            result = await bioMini.deinitBioScanner();
            console_ely.log("deinitBioScanner successful");
        } catch (error) {
            result = error;
            console_ely.log("Error: deinitBioMiniScanner ", result);
        }
        return new Promise(resolve => {
            resolve(result);
        });
    }

    // Decode WSQ data (retrieved from DG3) to base64 format to display in the GUI.
    // This depends on the Xperix WebAgent service.
    async retrieveAndDecodeFpData(images) {
        var listOfImageData = this.getWsqImageData(images);
        if ((images != null) && (images.length > 0)) {
            for (var index = 0; index < images.length; index++) {
                if (images[index].type == webapp_config.WSQ) {
                    var result = await bioMini.initBioScanner();
                    if (result == "success") {
                        result = await bioMini.getScannerDetails();
                        if (result == "success") {
                            result = await bioMini.wsqToImageBuffer(images[index].data);
                            if(result != "success") {
                                console_ely.log("Error: decode WSQ data to JPG.");
                            }
                            images[index].data = decodedWsqData;
                        }
                        await this.deinitBioMiniScanner();
                    } else {
                        console.log("Error: retrieveAndDecodeFpData failed")
                        listOfImageData = [];
                    }
                }
            }
        }
        return new Promise(resolve => {
            resolve(listOfImageData);
        });
    }

    // Scan a live fingeprint and verify it against the WSQ data (retrieved from DG3).
    // This depends on the Xperix WebAgent service.
    async scanAndVerifyFingerprint(listOfFingerPrints) {
        console_ely.logFuncName(this.scanAndVerifyFingerprint.name);
        if (listOfFingerPrints.length < 1) {
            console_ely.log("Error: listOfFingerPrints.length < 1");
            return false;
        }
        // Scan live fingerprint
        var result = await this.getLiveFingerprint();
        var status = false;
        if(result == true) {
            console_ely.log("getLiveFingerprint is successful.");
            // Verify it with the fingerprints retrieved from DG3
            for (let index = 0; index < listOfFingerPrints.length; index++) {
                const fingerprintFile = listOfFingerPrints[index];
                try {
                    result = await bioMini.verifyWithImageFile(fingerprintFile);
                    if (result == "success") {
                        console_ely.log("Verification successful for fingerprint template index: " + index);
                        status = true;
                        break;
                    } else
                        console_ely.log("Error: Verification failed for fingerprint template index: " + index);
                } catch (error) { console_ely.log("Verification failed: " + error); }
            }
            (status == true) ? alert("Live finger matches DG3 data.") : alert("ERROR: Live finger DOES NOT match DG3 data.");
        } else
            alert("Error: getLiveFingerprint failed.");
        
        return new Promise(resolve => {
            resolve (status);
        });
    }

}
