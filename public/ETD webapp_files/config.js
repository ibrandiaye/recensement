// url params
let urlparams_pcsc;
let urlparams_log;
let urlparams_socket;
let urlparams_pa;
let urlparams_csca;
let urlparams_dsc;
let urlparams_ca;
let urlparams_apdu;
let urlparams_ta;
let urlparams_dv;
let urlparams_is;
let urlparams_isk;
let urlparams_signature;
let urlparams_dg3;
let urlparams_autoRead;
let urlparams_verifyFp;
let urlparams_cvcaLink;

function getUrlParams() {

    // Retrieve URL parameters
    url = window.location.toLocaleString();
    console.log(url);

    const urlParams = new URL(url).searchParams;

    urlparams_pcsc = urlParams.get('pcsc');
    urlparams_pcsc = '1'; // Force to '1' to work with the webagent by default
    urlparams_log = urlParams.get('log');
    if (!urlparams_log)
        urlparams_log = 'basic';
    urlparams_socket = urlParams.get('socket');
    urlparams_apdu = urlParams.get('apdu');
    urlparams_pa = urlParams.get('pa');
    urlparams_csca = urlParams.get('csca');
    urlparams_dsc = urlParams.get('dsc');
    urlparams_aa = urlParams.get('aa');
    urlparams_ca = urlParams.get('ca');
    urlparams_ta = urlParams.get('ta');
    urlparams_cvcaLink = urlParams.get('cvcalink');
    urlparams_dv = urlParams.get('dv');
    urlparams_is = urlParams.get('is');
    urlparams_isk = urlParams.get('isk');
    urlparams_signature = urlParams.get('signature');
    urlparams_dg3 = urlParams.get('dg3');
    urlparams_autoRead = urlParams.get('autoread');
    urlparams_verifyFp = urlParams.get('verifyfp');

    isLogEnabled = true;
    isDetailedLogEnabled = (urlparams_log === 'basic') ? false : true;
};

let doPassiveAuthentication = false;
let doActiveAuthentication = false;
let doChipAuthentication = false;
let doTerminalAuthentication = false;
let doAutoRead = false;
let doReadSignature = false;
let doReadDg3 = false;
let doVerifyFp = false;

function getReadingOptions() {
    doPassiveAuthentication = gui.getReadingOptions().pa;
    doActiveAuthentication = gui.getReadingOptions().aa;
    doChipAuthentication = gui.getReadingOptions().ca;
    doTerminalAuthentication = gui.getReadingOptions().ta;
    doAutoRead = gui.getReadingOptions().autoread;
    doReadSignature = gui.getReadingOptions().readsign;
    doReadDg3 = gui.getReadingOptions().readdg3;
    doVerifyFp = gui.getReadingOptions().verifyfp;
};

const Config = (() => {

    const PaCert = (() => {

        let cert = {
            cscaData: null,
            dsData: null
        };

        return {
            /**
             * Get Passive authentication certificate from browse path.
             * @returns {status: msg, certs: cert}
             */
            getCertFromBrowsePath: async () => {

                console.log(PaCert.getCertFromBrowsePath.name);
                let strMsg = "success"
                cert.dsData = await util.processAndRetrieveFileData(gui.getReadingOptions().paCertDs);
                cert.cscaData = await util.processAndRetrieveFileData(gui.getReadingOptions().paCertCsca);
                if (cert.cscaData == null) {
                    strMsg = "PA - CSCA Cert missing in browse path";
                } else {
                    // Set certificate data to cookie
                    util.getSetCertCookie(cert.dsData, 'dsc');
                    util.getSetCertCookie(cert.cscaData, 'csca');
                }
                return new Promise((resolve) => {
                    resolve({
                        status: strMsg,
                        certs: cert
                    });
                });
            },

            /**
             * Get Passive authentication certificate from URL parameter path.
             * @returns {status: msg, certs: cert}
             */
            getCertFromUrlParameters: async () => {

                console.log(PaCert.getCertFromUrlParameters.name);
                let strMsg = "success"
                cert.dsData = await util.readDefaultCertificates(`certs/pa/${urlparams_dsc}`);
                cert.cscaData = await util.readDefaultCertificates(`certs/pa/${urlparams_csca}`);
                if (cert.cscaData == null) {
                    strMsg = "PA - CSCA Cert missing in URL parameters";
                } else {
                    // Set certificate data to cookie
                    util.getSetCertCookie(cert.dsData, 'dsc');
                    util.getSetCertCookie(cert.cscaData, 'csca');
                }
                return new Promise((resolve) => {
                    resolve({
                        status: strMsg,
                        certs: cert
                    });
                });
            },

            /**
             * Get Passive authentication certificate from saved cookies data
             * 
             * @returns {status: msg, certs: cert} 
             */
            getCertFromCookie: async () => {

                console.log(PaCert.getCertFromCookie.name);
                let strMsg = "success"
                cert.dsData = util.getSetCertCookie(null, 'dsc');
                cert.cscaData = util.getSetCertCookie(null, 'csca');
                if (cert.cscaData == null) {
                    strMsg = "CSCA Cert missing in cookie";
                }
                return new Promise(resolve => {
                    resolve({
                        status: strMsg,
                        certs: cert
                    });
                });
            },

            /**
             * Get Passive authentication certificate from browse path or URL parameter path or saved cookies data
             * 
             * @returns {status: "success" or "Certificate(s) missing", certs: cert} 
             */

            get: async () => {

                let result = await PaCert.getCertFromBrowsePath();
                if (result.status != "success")
                    result = await PaCert.getCertFromUrlParameters();
                if (result.status != "success")
                    result = await PaCert.getCertFromCookie();
                if (result.status != "success") {
                    console.warn(result.status);
                    result.status = "Certificate(s) missing"
                }
                return new Promise(resolve => {
                    resolve({
                        status: result.status,
                        certs: result.certs
                    });
                });
            }
        };
    })();

    const TaCert = (() => {

        let cert = {
            cvcaLinkData: null,
            dvData: null,
            isData: null,
            isPrivKeyData: null
        };

        return {

            /**
             * Get Terminal authentication certificate from browse path.
             * @returns {status: msg, certs: cert}
             */
            getCertFromBrowsePath: async () => {

                console.log(TaCert.getCertFromBrowsePath.name);
                let strMsg = "success"

                do {
                    cert.cvcaLinkData = await util.processAndRetrieveFileData(gui.getReadingOptions().taCertCvcaLink);
                    cert.dvData = await util.processAndRetrieveFileData(gui.getReadingOptions().taCertDv);
                    if (cert.dvData == null) {
                        strMsg = "TA - DV Cert missing in browse path";
                        break;
                    }
                    cert.isData = await util.processAndRetrieveFileData(gui.getReadingOptions().taCertIs);
                    if (cert.isData == null) {
                        strMsg = "TA - IS Cert missing in browse path";
                        break;
                    }
                    cert.isPrivKeyData = await util.processAndRetrieveFileData(gui.getReadingOptions().taCertIsk);
                    if (cert.isPrivKeyData == null) {
                        strMsg = "TA - IS key missing in browse path";
                        break;
                    }
                    // Set certificate data to cookie
                    util.getSetCertCookie(cert.cvcaLinkData, 'cvcaLink');
                    util.getSetCertCookie(cert.dvData, 'dv');
                    util.getSetCertCookie(cert.isData, 'is');
                    util.getSetCertCookie(cert.isPrivKeyData, 'isk');

                } while (false);

                return new Promise((resolve) => {
                    resolve({
                        status: strMsg,
                        certs: cert
                    });
                });
            },

            /**
             * Get Terminal authentication certificate from URL parameter path
             * 
             * @returns {status: msg, certs: cert} 
             */
            getCertFromUrlParameters: async () => {

                console.log(TaCert.getCertFromUrlParameters.name);
                let strMsg = "success"

                do {

                    cert.cvcaLinkData = await util.readDefaultCertificates(`certs/ta/${urlparams_cvcaLink}`);
                    cert.dvData = await util.readDefaultCertificates(`certs/ta/${urlparams_dv}`);
                    if (cert.dvData == null) {
                        strMsg = "TA - DV Cert missing in URL parameters";
                        break;
                    }
                    cert.isData = await util.readDefaultCertificates(`certs/ta/${urlparams_is}`);
                    if (cert.isData == null) {
                        strMsg = "TA - IS Cert missing in URL parameters";
                        break;
                    }
                    cert.isPrivKeyData = await util.readDefaultCertificates(`certs/ta/${urlparams_isk}`);
                    if (cert.isPrivKeyData == null) {
                        strMsg = "TA - IS key missing in URL parameters";
                        break;
                    }
                    // Set certificate data to cookie
                    util.getSetCertCookie(cert.cvcaLinkData, 'cvcaLink');
                    util.getSetCertCookie(cert.dvData, 'dv');
                    util.getSetCertCookie(cert.isData, 'is');
                    util.getSetCertCookie(cert.isPrivKeyData, 'isk');

                } while (false);

                return new Promise((resolve) => {
                    resolve({
                        status: strMsg,
                        certs: cert
                    });
                });

            },

            /**
             * Get Terminal authentication certificate from saved cookies data
             * 
             * @returns {status: msg, certs: cert}
             */
            getCertFromCookie: async () => {

                console.log(TaCert.getCertFromCookie.name);
                let strMsg = "success"

                do {
                    // Get certificate data from cookie
                    cert.cvcaLinkData = util.getSetCertCookie(null, 'cvcaLink');
                    cert.dvData = util.getSetCertCookie(null, 'dv');
                    cert.isData = util.getSetCertCookie(null, 'is');
                    cert.isPrivKeyData = util.getSetCertCookie(null, 'isk');
                    if (cert.dvData == null) {
                        strMsg = "TA - DV Cert missing in cookie";
                        break;
                    }
                    if (cert.isData == null) {
                        strMsg = "TA - IS Cert missing in cookie";
                        break;
                    }
                    if (cert.isPrivKeyData == null) {
                        strMsg = "TA - IS key missing in cookie";
                        break;
                    }

                } while (false);

                return new Promise(resolve => {
                    resolve({
                        status: strMsg,
                        certs: cert
                    });
                });
            },

            /**
             * Get Terminal authentication certificate from browse path or URL parameter path or saved cookies data
             * 
             * @returns {status: "success" or "Certificate(s) missing", certs: cert}
             */
            get: async () => {

                let result = await TaCert.getCertFromBrowsePath();
                if (result.status != "success") {
                    result = await TaCert.getCertFromUrlParameters();
                }
                if (result.status != "success") {
                    result = await TaCert.getCertFromCookie();
                }
                if (result.status != "success") {
                    console.warn(result.status);
                    result.status = "Certificate(s) missing";
                }
                return new Promise(resolve => {
                    resolve({
                        status: result.status,
                        certs: result.certs
                    });
                });
            }
        };
    })();

    return {
        getTaCerts: async () => await TaCert.get(),
        getPaCerts: async () => await PaCert.get(),
    };

})();
