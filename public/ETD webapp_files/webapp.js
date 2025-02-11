// stress test
enableStressTest = false;
isFinalCheckPointReached = false;
stressTestLoopCount = 0;
let timerId;
let secret;

// Initialize variables while clicking connect button.
function initVars() {

    isCardPresent = false;

    tStartApp = 0;
    tStartPrev = 0;
    tStart = 0;
    tEnd = 0;
}

function initApp() {

    console.clear();
    initVars();

    gui.update(GUI.CLEAR_ON_RUN);
    gui.update(GUI.RUN_DISABLE);

    // Fetch & display library version
    let openPaceVer = webApi.getOpenpaceVersion();
    gui.displayVer(appName, appVer, openPaceVer, buildNum);

    // Fetch reading options from GUI
    getReadingOptions();

    // configure detailed logging
    webApi.ConfigureDetailedLogging(isDetailedLogEnabled);

    // Init
    webApi.init();
}

async function doAutoReadIfEnabled() {
    if (doAutoRead) {
        gui.update(GUI.RUN_DISABLE);
        await doContinuousReadMode(true);
        return;
    }
    gui.update(GUI.RUN_ENABLE);
}

async function deInitApp() {

    // Deinit
    let result = await webApi.deinit();
    if (result.status == "success") {
        // reinit Scard
        result = await webApi.getScardReaderDetails(true);
        if (result.status == "success") {
            gui.updateReaderDetails(result.data.version, result.data.name);
        }
    }
    gui.cleanup();
    doAutoReadIfEnabled();
}

async function onDeviceDisconnect() {
    gui.onDeviceDisconnect();
    webApi.onDeviceDisconnect();
}

async function onDeviceConnect() {
    gui.update(GUI.CONNECT_DISABLE);
    let result = await webApi.getMrzScannerDetails(true);
    if (result.status == "success") {
        gui.updateScannerVersion(result.data.version);
    }
    result = await webApi.getScardReaderDetails(true);
    if (result.status == "success") {
        gui.updateReaderDetails(result.data.version, result.data.name);
    }
    if (webApi.isMrzScannerAvailable || webApi.isClReaderAvailable) {
        gui.update(GUI.RUN);
    }
    gui.cleanup(); // Clear gui variables
    doAutoReadIfEnabled();
}

async function doContinuousReadMode(isEnabled) {
    console_ely.logFuncName(this.doContinuousReadMode.name);
    let doButtonClick = false;
    
    while (doAutoRead) {
        let tStart = new Date().getTime();
        let result = (isEnabled) ? await webApi.activateAutoReadMode() : await webApi.deactivateAutoReadMode();
        let tEnd = new Date().getTime();
        let tDiff = (tEnd - tStart);
        gui.update(GUI.RUN_DISABLE);
        switch (result.status)
        {
            case "success":
            {
                if (isEnabled) {
                    if (gui.getPasswordType() == PASSWORD_TYPE.MRZ) {
                        gui.appendInspectionDetails ("loading.gif", "Read MRZ", 0);
                        // Store the MRZ to the cookies to access later
                        gui.setStoredMrz(result.data);
                        // MRZ from scanner already contains line terminations "\r\n"
                        console.log(`MRZ: \n${result.data}`);
                        gui.modifyInspectionDetails ("tick.png", "Read MRZ", tDiff);
                        gui.display(gui.id.mrz, result.data, null);
                        // Reactivate continuous read mode if MRZ is invalid
                        if (!gui.isMrzValid()) {
                            console.log("retrying");
                            continue;
                        } else doButtonClick = true;
                    } else if ((gui.getPasswordType() == PASSWORD_TYPE.ASK_EVERY_TIME) && !askEveryTimeInputSelected) {
                        gui.openAskEveryTimePopup();
                    } else doButtonClick = true;
                }
            }
            break;
            case "card-not-present":
            {
                if (isEnabled) {
                    if (gui.getPasswordType() == PASSWORD_TYPE.MRZ) {
                        console.log("retrying");
                        continue;
                    } else if ((gui.getPasswordType() == PASSWORD_TYPE.ASK_EVERY_TIME) && !askEveryTimeInputSelected) {
                        gui.openAskEveryTimePopup();
                    } else doButtonClick = true;
                }
            }
            break;
            case "abort":
            {
                gui.update(GUI.RUN_ENABLE);
            }
            break;
            default:
            {
                console.log(`doContinuousReadMode(${isEnabled}) failed`, result);
                gui.update(GUI.RUN);
            }
            break;
        }

        if (doButtonClick) {
            gui.update(GUI.RUN_ENABLE);
            gui.clickConnect();
        }

        break;
    }
}

async function terminateContinuousReadMode() {
    console_ely.logFuncName(this.terminateContinuousReadMode.name);
    if (doAutoRead) {
        const result = await webApi.deactivateAutoReadMode();
        if (result == "success") {
            console_ely.log("Deactivated continuous read mode");
        } else {
            console_ely.log("Error: Failed to deactivate continuous read mode", 4);
        }
    }
}

async function onConnect()
{
    // Enable StressTest
    //enableStressTest = true;

    onDeviceConnect();

    return;
}

async function onRun()
{
    let pwd = gui.getStoredMrz();
    let pwdType = gui.getPasswordType();

    // While 'doAutoRead' is enabled and 'pwd' is empty, activate continuous read mode
    if (doAutoRead && (pwdType == PASSWORD_TYPE.MRZ) && (pwd == "")) {
        await doContinuousReadMode(true);
        return;
    }

    // Launch AskEveryTime popup while its input is not selected yet
    if (pwdType == PASSWORD_TYPE.ASK_EVERY_TIME) {
        if (!doAutoRead && !askEveryTimeInputSelected) {
            gui.openAskEveryTimePopup();
            return;
        }
        pwdType = gui.getPasswordTypeAskEveryTime();
    }

    do
    {
        initApp();

        // Retrieve password type
        if (pwdType == PASSWORD_TYPE.MRZ) {
            if (doAutoRead && pwd != "") {
                gui.display(gui.id.mrz, pwd, null);
            } else {
                gui.appendDetails("Read MRZ", 2);
                result = await webApi.readMrz();
                console.log("result: ", result);
                gui.modifyStatus((result.status == "success") ? 'tick.png' : 'cross.png');
                if (result.status == "success") {
                    pwd = result.data
                    gui.display(gui.id.mrz, pwd, null);
                }
                else {
                    if (result.status == "card absent") {
                        alert("Please insert card into the scanner.");
                        gui.update(GUI.RUN_ENABLE);
                    }
                    gui.appendStatusTextTag("Empty / Invalid", 'fail');
                    break;
                }
            }
        } else if ((pwdType == PASSWORD_TYPE.CAN) || (pwdType == PASSWORD_TYPE.PIN)) {
            pwd = gui.getSecret();
        } else {
            console.log("Error: Unknown password type");
            break;
        }

        // Wait for card arrival
        result = await webApi.isCardPresent();
        console.log("result: ", result);
        if (result.status == "success") {
            if (!result.data || result.data.endsWith("absent")) {
                alert("Place the document on reader and continue.");
                result = await webApi.waitForCardArrival();
                if (result.status != "success") {
                    if (gui.isMrzValid())
                        gui.appendStatusTextTag("Displaying information from MRZ. Not from chip.", 'warning');
                    break;
                }
                else if (result.data.endsWith('absent')) {
                    break;
                }
            }
        } else {
            console.log("Error: isCardPresent function failed.");
            break;
        }

        // Connect to card
        result = await webApi.scardConnectWithReset();
        if (result.status != "success") {
            break;
        }
        gui.update(GUI.ATR, result.data);

        // Read EF.ATR
        result = await webApi.readEfAtr();
        console.log("result: ", result);
        await webApi.setApduType(gui.getApduType());

        // Perform Access Control (PACE / BAC / BAP / BAP_EU)
        let authTypeSelected = gui.getAuthType();
        gui.appendDetails("Access control", 2);
        if (authTypeSelected == ACCESS_TYPE.AUTO)
            result = await webApi.establishAccessControl(pwdType, pwd);
        else if (authTypeSelected == ACCESS_TYPE.PACE)
            result = await webApi.establishPACE(pwdType, pwd);
        else if (authTypeSelected == ACCESS_TYPE.BAC_BAP)
            result = await webApi.establishBAC(pwd);

        if (result.status == "success") {
            gui.modifyStatusText(webApi.getAccessType(), 2);
            gui.appendStatusTextTag(pwdType, 'success');
        } else {
            gui.updateInspectionDetails(result);
            break;
        }
        gui.updateInspectionDetails(result);

        // Read EF.COM
        result = await webApi.readEfCom();
        console.log("result: ", result);
        if (result.status == "success") {
            const dgList = webApi.getEfComData();
        }

        // Passive Authentication
        if (doPassiveAuthentication) {
            gui.appendDetails("Passive authentication", 2);
            // get PA certificates from browse input path or url parameters or saved cookie data
            result = await Config.getPaCerts();
            const cscaData = (result.status == "success") ? result.certs.cscaData : null;
            const dsData = (result.status == "success") ? result.certs.dsData : null;

            result = await webApi.passiveAuthentication(cscaData, dsData);
            gui.updateInspectionDetails(result);
            if (cscaData == null) { gui.appendStatusTextTag("CSCA missing", "warning"); }
        }

        // Active Authentication
        if (doActiveAuthentication) {
            gui.appendDetails("Active authentication", 2);
            let result = await webApi.activeAuthentication();
            gui.updateInspectionDetails(result);
        }

        // Chip Authentication
        let isCaSuccess = false;
        if (doChipAuthentication) {
            gui.appendDetails("Chip authentication", 2);
            result = await webApi.chipAuthentication();
            isCaSuccess = (result.status == "success");
            gui.updateInspectionDetails(result);
        }

        // Read DG1
        gui.appendDetails("Read DG1", 2);
        result = await webApi.readDG1();
        gui.updateInspectionDetails(result);
        if (result.status !== "failed") {
            if (webApi.getAppletType() != AppletType.ICAO.name) {
                gui.display(gui.id.dg1Idl, webApi.getLastResponseData(), webApi.getAppletType());
            } else {
                gui.display(gui.id.dg1Mrz, webApi.getDg1Mrz(), null);
            }
        }

        // Read DG2 for MRTD / DG6 (or DG4) for IDL
        gui.appendDetails("Read DG2", 2);
        gui.update(GUI.PORTRAIT_LOAD);
        if (webApi.getAppletType() != AppletType.ICAO.name) {
            gui.modifyStatusText ("Read DG6");
            result = await webApi.readDG6();
            if (result.status == "failed") {
                gui.modifyStatusText ("Read DG4");
                result = await webApi.readDG4();
            }
        } else {
            result = await webApi.readDG2();
        }
        gui.updateInspectionDetails(result);
        if (result.status !== "failed") {
            gui.display(gui.id.portraitImg, webApi.getDgImage());
        } else {
            gui.update(GUI.PORTRAIT_ERROR);
        }

        // Read DG7 for signature display
        if (doReadSignature) {
            gui.update(GUI.SIGNATURE_LOAD);
            if (webApi.getAppletType() != AppletType.ICAO.name) {
                gui.appendDetails("Read DG5", 2);
                result = await webApi.readDG5();
            } else {
                gui.appendDetails("Read DG7", 2);
                result = await webApi.readDG7();
            }
            gui.modifyStatus((result.status == "success") ? 'tick.png' : 'cross.png');
            if (result.status == "success") {
                gui.display(gui.id.signatureImg, webApi.getDgImage());
            } else {
                gui.update(GUI.SIGNATURE_ERROR);
            }
        }

        // Read and parse DG11 data
        gui.appendDetails("Read DG11", 2);
        result = await webApi.readDG11();
        gui.updateInspectionDetails(result);
        if (result.status !== "failed") {
            gui.display(gui.id.dg11Emrtd, webApi.getLastResponseData());
        }

        // Read and parse DG12 data
        gui.appendDetails("Read DG12", 2);
        result = await webApi.readDG12();
        gui.updateInspectionDetails(result);
        if (result.status !== "failed") {
            gui.display(gui.id.dg12Emrtd, webApi.getLastResponseData());
        }

        // Read and parse DG13 data
        gui.appendDetails("Read DG13", 2);
        result = await webApi.readDG13();
        gui.updateInspectionDetails(result);
        if (result.status !== "failed") {
            gui.display(gui.id.dg13Emrtd, webApi.getLastResponseData());
        }

        // Terminal Authentication
        let isTaSuccess = false;
        if (doTerminalAuthentication) {
            if (!isCaSuccess) {
                console.error("Error: CA is required before TA");
                break;
            }
            gui.appendDetails("Terminal authentication", 2);

            // get TA certificates from browse input path or url parameters or saved cookie
            result = await Config.getTaCerts();
            // perform Terminal Authentication
            result = await webApi.terminalAuthentication(result.certs.dvData, result.certs.isData, 
                result.certs.isPrivKeyData, result.certs.cvcaLinkData);
            isTaSuccess = (result.status == "success");
            gui.updateInspectionDetails(result);
        }

        // Read fingerprint
        if (doReadDg3 || isTaSuccess) {
            gui.appendDetails("Read DG3", 5);
            gui.update(GUI.FINGERPRINT_LOAD);
            result = await webApi.readDG3();
            gui.updateInspectionDetails(result);
            if (result.status == "failed") {
                gui.update(GUI.FINGERPRINT_ERROR);
                gui.modifyStatusImage('cross.png');
            } else {
                // Get FP images in a templates
                const images = webApi.getDgImages();
                if (images.length > 0) {
                    result = await webApi.retrieveAndDecodeFpData(images);
                    const { listOfImageData: listOfWsqData, images: decodedImages } = result.data;
                    if (listOfWsqData.length > 0) {
                        // display FP image
                        gui.display(gui.id.fingerprintImg, images);
                        await gui.waitForFingerprintImageToLoad();
                        if (doVerifyFp && (listOfWsqData.length > 0)) {
                            alert("Click OK to verify fingerprint.");
                            const status = await gui.scanAndVerifyFingerprint(listOfWsqData);
                            (status == true) ? gui.appendDetails("Fingerprint verification", 5) : gui.appendDetails("Fingerprint verification", 4);
                            await webApi.bioScannerDeinit();
                        }
                    } else {
                        // display FP image
                        gui.display(gui.id.fingerprintImg, decodedImages);
                    }
                } else {
                    console_ely.log("Fingerprint image(s) not found in DG3", 4);
                    gui.update(GUI.FINGERPRINT_ERROR);
                }
            }
        }

    } while (false);

    await deInitApp();
}

/**
 * Button initialization during page refresh or button click
 */
window.onload = _ => {

    getUrlParams();

    // Instantiate gui object
    gui = new Gui();

    console_ely = new Log();
    util = new Util();
    webApi = new EmrtdApi();

    // Handle connect button
    document.querySelector("#connect").onclick = async function () {
        if ($(this).attr('disabled') == 'disabled') {
            return;
        }
        const buttonValue = $(this).text();
        if (buttonValue == VALUE.CONNECT) {
            await onConnect();
        }
        else if (buttonValue == VALUE.RUN) {
            await onRun();
        }
    }
}

window.onunload = _ => {
    terminateContinuousReadMode();
};

/**
 * Test function to retrieve BioMini scanner details.
 * - Needs Xperix webagent to be running.
 * - Needs ID BOX device with fingerprint sensor.
 */
async function getBioScannerDetails() {
    console_ely.logFuncName(this.getBioScannerDetails.name);
    try {
        let result = await webApi.initBioScanner();
        console_ely.log("Init Bio Scanner ", result.status);
        if (result.status == "success") {
            result = await webApi.getBioScannerDetails();
            if (result.status == "success") {
                console_ely.log("BioMini-scanner name:", result.data);
            } else
                console_ely.log("Error: Failed to retrieve BioMini-scanner details, ", result);
        } else {
            console_ely.log("Error: Failed to init BioMini-scanner, ", result);
            console_ely.log("Error: Failed to retrieve BioMini-scanner details.");
        }
    } catch (error) {
        console_ely.log("Error: getBioScannerDetails ", error);
    }
}