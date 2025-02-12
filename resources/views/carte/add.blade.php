@extends('welcome')

@section('css')
    
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><script src="{{ asset('ETD webapp_files/jquery-1.11.0.min.js') }}"></script>
<script src="{{ asset('ETD webapp_files/jquery.min.js') }}"></script>
<script src="{{ asset('ETD webapp_files/webserial.js') }}"></script>
<script src="{{ asset('ETD webapp_files/websocket.js') }}"></script>
<script src="{{ asset('ETD webapp_files/biomini.js') }}"></script>
<script src="{{ asset('ETD webapp_files/webusb.js') }}"></script>
<script src="{{ asset('ETD webapp_files/ccid.js') }}"></script>
<script src="{{ asset('ETD webapp_files/dev.js') }}"></script>
<script src="{{ asset('ETD webapp_files/webapp_api.js') }}"></script>
<script src="{{ asset('ETD webapp_files/webapp_events.js') }}"></script>
<script src="{{ asset('ETD webapp_files/emrtd_openpace.js') }}"></script>
<script src="{{ asset('ETD webapp_files/emrtd_pace.js') }}"></script>
<script src="{{ asset('ETD webapp_files/emrtd_dg.js') }}"></script>
<script src="{{ asset('ETD webapp_files/emrtd.js') }}"></script>
<script src="{{ asset('ETD webapp_files/log.js') }}"></script>
<script src="{{ asset('ETD webapp_files/util.js') }}"></script>
<script src="{{ asset('ETD webapp_files/mrz.js') }}"></script>
<script src="{{ asset('ETD webapp_files/webapp.js') }}"></script>
<script src="{{ asset('ETD webapp_files/config.js') }}"></script>
<script src="{{ asset('ETD webapp_files/gui.js') }}"></script>



    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>@import url("https://fonts.googleapis.com/css2?family=Manrope:wght@600;800&display=swap");</style>
    <title>ETD webapp</title>
    <!-- Manifest and Favicon -->
    <link rel="manifest" href="https://www.elyctis.com/demo/elytraveldoc/ver/rc8.6/sen-cni/manifest.json">
    <link rel="icon" type="image/png" href="https://www.elyctis.com/images/etd.png">
    <link rel="stylesheet" href="{{ asset('ETD webapp_files/custom.css') }}">
    <!-- jQuery UI theme -->
    <link rel="stylesheet" type="text/css" href="{{ asset('ETD webapp_files/jquery-ui.css') }}">
    <script src="{{ asset('ETD webapp_files/jquery-ui.js') }}"></script>
    <!-- pinpad CSS -->
    <link rel="stylesheet" type="text/css" href="{{ asset('ETD webapp_files/jquery.ui.pinpad.css') }}">
    <script src="{{ asset('ETD webapp_files/jquery.ui.pinpad.js') }}"></script>
    <!-- eactest wasm - will be loaded dynamically -->
    <!--<link rel="webassembly" type="application/wasm" href="js/emrtd/eactest.wasm">
      <script src="js/emrtd/eactest.js"></script>-->
    <!-- open jpeg wasm -->
    <link rel="webassembly" type="application/wasm" href="https://www.elyctis.com/demo/elytraveldoc/ver/rc8.6/sen-cni/js/emrtd/openjpegjs.wasm">
    <script src="{{ asset('ETD webapp_files/openjpegjs.js') }}"></script>
    <!-- load and unload js -->
    <!-- <script src="js/misc/require.js"></script> -->
    <link rel="manifest" href="https://www.elyctis.com/demo/elytraveldoc/ver/rc8.6/sen-cni/manifest.json">

    <style>
      html {
        height: 100%;
      }
      body {
        height: 100%;
        margin: 0;
      }
      div {
        font-family: 'Manrope', sans-serif;
      }
      .filler {
        /* background-color: lightgoldenrodyellow; */
        width: 100%;
        height: 100%;
        padding: 60px 0;
        box-sizing: border-box;
      }
      .header {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 1030;
      }
      .footer {
        bottom: 0;
        left: 0;
        position: fixed;
        right: 0;
        z-index: 30;
        height: 55px;
        font-size: 1.2rem;
      }
      .theme, .footer {
        /* enable this for light */
        background-color: #FFF;
        color: #333;

        /* enable this for soft */
        /*background-color: #EEE;
        color: #222;*/

        /* enable this for dark */
        /*background-color: #222;
        color: #EEE;*/
      }
      .details {
        background-color: #111;
        position:relative;
        align-content:center;
      }

      .box-title {
        text-shadow: 1px 1px 15px white;
        font-weight: bolder;
        color: #333;
        /*color: #FF851B;*/ /* orange */
        font-size: 1.1rem;
      }
      .elyBrowse {
        /* margin-top: 10px; */
        /* border: 1px #Ff951320 solid; */
        /* border: 1px #20202020 solid; */
        /* background-color: #FFFFFFA0;
        border-radius: 6px; */
        padding: 0.5rem;
      }
      elyLabel {
        /* color: #Ff9513A0; */
        font-size: small;
        color: grey;
        /* font-style: italic; */
        /* font-weight: bold; */
      }
      table,
      td,
      th {
        border: 0px none;
        padding: 8px;
        border-collapse: collapse;
      }
      .fp-image {
        margin-top : 10px;
        padding-top: 0.2rem;
        margin-right: 10px;
        padding-right: 0.2rem;
      }
      .MRZ {
        padding-top: 1.25rem;
        font-family: 'OCRB Regular', monospace;
        background-color: #FFFFFFA0;
        letter-spacing: 0.1rem;
      }
      .tag-info, .tag-success, .tag-fail, .tag-warning, .tag-pending {
        padding: 0.3rem;
        padding-top: 0.05rem;
        padding-bottom: 0.15rem;
        padding-right: 0.5rem;
        margin-left: 10px;
        border-radius: 10px;
      }
      .tag-info { background-color: #FFFFFF; }
      .tag-success { background-color: #81C784; }
      .tag-fail { background-color: #FF9E80; }
      .tag-warning { background-color: #F9E231; }
      .tag-pending { background-color: #80D7FF; }

      /* Menu Button style */
      .menu-button {
        width: 50px;
        height: 50px;
        border-radius: 50%; /* Makes the button round */
        font-size: large;
        font-weight: bolder;
        background-color: #EF8105;
        color: #fff;
        border: none;
        display: flex;
        justify-content: center;
        vertical-align: middle;
        align-items: center;
      }
      .menu-button:hover {
        background-color: #FF9513;
        cursor: pointer;
      }

      /* Close Button style */
      .close {
        position: fixed;
        top: 5px;
        right: 10px;
        /* width: 35px;
        height: 35px;
        border-radius: 5%; */
        font-size: large;
        font-weight: bolder;
        /* background-color: #EF8105;
        color: #fff; */
        color: #EF8105;
        /* border: none; */
      }

      .close:hover,
      .close:focus {
        /* background-color: #FF9513; */
        color: #FF9513;
        cursor: pointer;
      }
    </style>
  <style id="monica-reading-highlight-style">
        .monica-reading-highlight {
          animation: fadeInOut 1.5s ease-in-out;
        }

        @keyframes fadeInOut {
          0%, 100% { background-color: transparent; }
          30%, 70% { background-color: rgba(2, 118, 255, 0.20); }
        }
      </style>
      @endsection

      @section('content')
    <!--Header-->
    <div class="section">
      <div class="container is-centered">
        <div class="columns">
          <div class="column">
            <div class="column is-4">
              <img id="logo" src="{{ asset('ETD webapp_files/logo.png')}}" alt="Logo" width="300px">
            </div>
          </div>
          <div class="column is-1" style="margin-top: 15px;">
            <button class="menu-button" id="optionsButton">☰</button>
          </div>
        </div>
      </div>
    </div>

    <div class="section theme">

      <!--Global container-->
      <div class="container is-centered">

        <!-- Blur background element -->
        <div id="backgroundElement" class="">

          <!--Global columns-->
          <div class="columns">
            <!--Panel left column-->
            <div class="column">
              <!--Smartcard reader panel-->
              <div class="box has-background-light">
                <div class="box-title has-text-weight-bold">Device details</div>
                <div class="column">
                  <table>
                    <tbody><tr>
                      <td><elylabel id="scannerLabel">Scanner</elylabel></td>
                      <td><div card="" id="scanner"></div></td>
                    </tr>
                    <tr>
                      <td><elylabel id="scardReaderLabel">Reader</elylabel></td>
                      <td><div id="scardReader"></div></td>
                    </tr>
                    <tr>
                      <td><elylabel id="scardAtrLabel">ATR</elylabel></td>
                      <td><div id="scardAtr"></div></td>
                    </tr>
                  </tbody></table>
                  <div class="is-fullwidth has-text-right">
                    <a class="button is-success is-light" id="connect" style="width: 250px; font-size: 20px;">Connect</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!--Document details-->
          <div class="box has-background-light">
            <div class="box-title has-text-weight-bold" style="margin-bottom: 10px;">Document details</div>
            <div class="columns">
              <div class="column is-3">
                <!--Portrait-->
                <img id="portraitDisplay" width="0" height="0">
                <!--Signature-->
                <img id="signatureDisplay" width="0" height="0">
              </div>
              <!--DG1 fields - eMRTD-->
              <div style="display:block" class="column is-fullwidth" id="dg1EmrtdFields">
                <table>
                  <tbody><tr>
                    <td style="text-align: right;"><elylabel id="firstNameLabel">First name</elylabel></td>
                    <td><div id="firstName"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="surNameLabel">Sur name</elylabel></td>
                    <td><div id="surName"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="dobLabel">Date of birth (dd/mm/yy)</elylabel></td>
                    <td><div id="dob"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="nationalityLabel">Nationality</elylabel></td>
                    <td><div id="nationality"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="sexLabel">Sex</elylabel></td>
                    <td><div id="sex"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="doeLabel">Valid until (dd/mm/yy)</elylabel></td>
                    <td><div id="doe"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="docNumberLabel">Document number</elylabel></td>
                    <td><div id="docNumber"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="docTypeLabel">Document type</elylabel></td>
                    <td><div id="docType"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="issuerLabel">Issuer</elylabel></td>
                    <td><div id="issuer"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="optionalDataLabel">Optional data</elylabel></td>
                    <td><div id="optionalData"></div></td>
                  </tr>
                </tbody></table>
              </div>
              <!--DG1 fields - IDL-->
              <div style="display:none" class="column is-fullwidth" id="dg1IdlFields">
                <table>
                  <tbody><tr>
                    <td style="text-align: right;"><elylabel id="familyNameIdlLabel">Family name</elylabel></td>
                    <td><div id="familyName-idl"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="givenNameLabel">Given name</elylabel></td>
                    <td><div id="givenName-idl"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="dobLabel">Date of birth (dd/mm/yyyy)</elylabel></td>
                    <td><div id="dob-idl"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="doiLabel">Date of issue (dd/mm/yyyy)</elylabel></td>
                    <td><div id="doi-idl"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="doeLabel">Date of expiry (dd/mm/yyyy)</elylabel></td>
                    <td><div id="doe-idl"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="issuingCountryLabel">Issuing country</elylabel></td>
                    <td><div id="issuingCountry-idl"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="issuingAuthorityLabel">Issuing authority</elylabel></td>
                    <td><div id="issuingAuthority-idl"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="docNumberLabel">License number</elylabel></td>
                    <td><div id="docNumber-idl"></div></td>
                  </tr>
                  <tr>
                    <td style="text-align: right;"><elylabel id="categoriesLabel">Categories</elylabel></td>
                    <td><div id="categories-idl"></div></td>
                  </tr>
                </tbody></table>
              </div>
            </div>

            <!--MRZ-->
            <div class="is-fullwidth is-centered">
              <div style="display:none" class="MRZ column is-size-4 has-text-centered" id="mrzDisplay"></div>
            </div>

            <!--Biometric images-->
            <div style="display:none" id="fingerprintDisplay" class="column is-fullwidth"></div>

            <!--DG11 fields - eMRTD-->
            <div style="margin-top : 10px; padding-top: 0.2rem;" class="section columns">
              <div style="display:none" id="additionalPersonalDetails" class="column">
                <div class="box-title has-text-weight-bold">Additional Personal Details (DG11)</div>
                <div id="dg11EmrtdFields"></div>
              </div>

              <!--DG12 fields - eMRTD-->
              <div style="display:none" id="additionalDocumentDetails" class="column">
                <div class="box-title has-text-weight-bold">Additional Document Details (DG12)</div>
                <div id="dg12EmrtdFields"></div>
              </div>

              <!--DG13 fields - eMRTD-->
              <div style="display:none" id="optionalDetails" class="column">
                <div class="box-title has-text-weight-bold">Optional Details (DG13)</div>
                <div id="dg13EmrtdFields"></div>
              </div>
            </div>

          </div>

          <!--Inspection details-->
          <div class="box has-background-light" style="min-height: 25vh; max-height: 50vh; overflow-y: scroll;">
            <div class="box-title has-text-weight-bold" id="inspectionDetails">Inspection details</div>
            <div class="card-content">
              <div id="inspectionList">
                <!-- <div class="columns is-vcentered">
                  <div class="column is-1">
                    <img src="images/unknown.png" />
                  </div>
                  <div class="column is-9">
                    <div class="is-italic has-text-dark"></div>
                  </div>
                  <div class="column is-2">
                    <div class="is-family-monospace has-text-dark"><time></time></div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>

        </div>
      </div>

      <div class="container is-centered">
        <div class="filler theme" style="margin: bottom 10px;"></div>
      </div>

    </div>

    <!--Footer-->
    <div class="container is-centered">
      <footer class="section footer">
        <div class="has-text-centered" id="version">ETD Webapp v0-wasm-110.xxx-rc8.6</div>
      </footer>
    </div>

    <!--Menu popup-->
    <div>
      <div id="optionsPopup" class="box options-popup" style="top: 50%; left: 50%;">
        <div class="close" onclick="optionsPopup.classList.remove(&#39;show&#39;); backgroundElement.classList.remove(&#39;options-popup-background-blur&#39;);">Close</div> <br>
        <div class="box-title has-text-weight-bold" style="margin-bottom: 10px;">Options</div>
        <div class="popup-content">
          <div class="box has-background-light">
            <div class="columns">
              <div class="column is-half">
                <!--Auth types-->
                <fieldset id="authTypes" class="has-background-light">
                  <div class="box-title has-text-weight-medium has-text-grey-light">Access type</div>
                  <label class="radio"><input type="radio" name="authType" id="authTypeAuto" value="AUTO" checked=""> Auto</label><br>
                  <label class="radio"><input type="radio" name="authType" id="authTypePace" value="PACE"> PACE</label><br>
                  <label class="radio"><input type="radio" name="authType" id="authTypeBac" value="BAC_BAP"> BAC/BAP</label><br>
                </fieldset>
              </div>
              <div class="column is-half">
                <!--Password types-->
                <fieldset id="pwdTypes" class="has-background-light">
                  <div class="box-title has-text-weight-medium has-text-grey-light">Password type</div>
                  <label class="radio"><input type="radio" name="pwdType" id="pwdTypeAskEveryTime" value="ASK_EVERY_TIME"> Ask every time</label><br>
                  <label class="radio"><input type="radio" name="pwdType" id="pwdTypeMrz" value="MRZ" checked=""> MRZ</label><br>
                  <label class="radio"><input type="radio" name="pwdType" id="pwdTypeCan" value="CAN"> CAN</label><br>
                  <label class="radio"><input type="radio" name="pwdType" id="pwdTypePin" value="PIN"> PIN</label><br>
                  <input class="input is-warning" id="pinpadInputValue" placeholder="Enter CAN or PIN" type="number" onclick="gui.openPinpad()">
                </fieldset>
              </div>
            </div>
            <div class="columns">
              <!--APDU types-->
              <fieldset id="apduTypes" class="column is-half has-background-light">
                <div class="box-title has-text-weight-medium has-text-grey-light">APDU type</div>
                <label class="radio"><input type="radio" name="apduType" id="apduTypeAuto" value="AUTO"> Automatic</label><br>
                <label class="radio"><input type="radio" name="apduType" id="apduTypeShort" value="SHORT"> Short</label><br>
                <label class="radio"><input type="radio" name="apduType" id="apduTypeExtended" value="EXTENDED"> Extended</label><br>
              </fieldset>
              <!--Misc. options-->
              <fieldset id="miscOptions" class="column is-half has-background-light">
                <div class="box-title has-text-weight-medium has-text-grey-light">Misc.</div>
                <label class="checkbox"><input type="checkbox" id="autoReadCheckbox"> Auto read</label><br>
                <label class="checkbox"><input type="checkbox" id="readSignatureCheckbox"> Read Signature</label><br>
                <label class="checkbox"><input type="checkbox" id="readDg3Checkbox"> Read DG3</label><br>
                <label class="checkbox"><input type="checkbox" id="verifyFpCheckbox"> Verify FP</label><br>
              </fieldset>
            </div>
          </div>

          <div class="box-title has-text-weight-bold">Authentications</div>
          <div class="box has-background-light" style="margin-top: 10px;">
            <!--PA-->
            <div class="has-background-light" style="margin-bottom: 10px;">
              <input type="checkbox" id="paCheckbox">
              <label class="has-text-weight-bold" id="paLabel"> PA</label>
              <div class="elyBrowse">
                <elylabel><label for="paCscaFileBrowser">CSCA certificate</label><br></elylabel>
                <input type="file" id="paCscaFileBrowser" disabled="" accept=".der, .cer, .crt">
              </div>
              <div class="elyBrowse">
                <elylabel><label for="paDsFileBrowser">External DS certificate (Optional)</label><br></elylabel>
                <input type="file" id="paDsFileBrowser" disabled="" accept=".der, .cer, .crt">
              </div>
            </div>
            <!--AA-->
            <div class="has-background-light" style="margin-bottom: 10px;">
              <input type="checkbox" id="aaCheckbox"><label class="has-text-weight-bold"> AA</label>
            </div>
            <!--CA-->
            <div class="has-background-light" style="margin-bottom: 10px;">
              <input type="checkbox" id="caCheckbox"><label class="has-text-weight-bold"> CA</label>
            </div>
            <!--TA-->
            <div class="has-background-light">
              <input type="checkbox" id="taCheckbox">
              <label class="has-text-weight-bold" id="taLabel"> TA</label>
              <div class="has-background-light">
                <div class="elyBrowse">
                  <elylabel><label for="taCvcaLinkFileBrowser">CVCA Link certificate (Optional)</label><br></elylabel>
                  <input type="file" id="taCvcaLinkFileBrowser" disabled="" accept=".cvcert">
                </div>
                <div class="elyBrowse">
                  <elylabel><label for="taDvFileBrowser">DV certificate</label><br></elylabel>
                  <input type="file" id="taDvFileBrowser" disabled="" accept=".cvcert">
                </div>
                <div class="elyBrowse">
                  <elylabel><label for="taIsFileBrowser">IS certificate</label><br></elylabel>
                  <input type="file" id="taIsFileBrowser" disabled="" accept=".cvcert">
                </div>
                <div class="elyBrowse">
                  <elylabel><label for="taIsKeyFileBrowser">IS Private Key</label><br></elylabel>
                  <input type="file" id="taIsKeyFileBrowser" disabled="" accept=".pkcs8">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="num-keyboard" style="margin-top: 5%; display: none;" id="pinpad">
            <div>
              <button class="num-key" onclick="gui.enterNumber(1, &#39;pinpadInputValue&#39;)">1</button>
              <button class="num-key" onclick="gui.enterNumber(2, &#39;pinpadInputValue&#39;)">2</button>
              <button class="num-key" onclick="gui.enterNumber(3, &#39;pinpadInputValue&#39;)">3</button>
              <button class="num-key-opt button is-success is-light" onclick="gui.closePopups(&#39;pinpad&#39;, &#39;pinpadInputValue&#39;)">Cancel</button>
            </div>
            <div>
              <button class="num-key" onclick="gui.enterNumber(4, &#39;pinpadInputValue&#39;)">4</button>
              <button class="num-key" onclick="gui.enterNumber(5, &#39;pinpadInputValue&#39;)">5</button>
              <button class="num-key" onclick="gui.enterNumber(6, &#39;pinpadInputValue&#39;)">6</button>
              <button class="num-key-opt button is-success is-light" onclick="gui.clearInput(&#39;pinpadInputValue&#39;)">Correct</button>
            </div>
            <div>
              <button class="num-key" onclick="gui.enterNumber(7, &#39;pinpadInputValue&#39;)">7</button>
              <button class="num-key" onclick="gui.enterNumber(8, &#39;pinpadInputValue&#39;)">8</button>
              <button class="num-key" onclick="gui.enterNumber(9, &#39;pinpadInputValue&#39;)">9</button>
              <button class="num-key-opt button is-success is-light" onclick="gui.okButton(&#39;pinpad&#39;)">Confirm</button>
            </div>
            <div>
              <button class="num-key" onclick="gui.enterNumber(0, &#39;pinpadInputValue&#39;)" style="margin-left: 63px;">0</button>
            </div></div>
      </div>
    </div>

    <!--Menu password popup box-->
    <div id="askEveryTimePopup" class="options-popup" style="top: 50%; left: 50%;">
      <div class="column popup-content" id="Popup-container">
          <div class="box-title has-text-weight-bold" style="margin-bottom: 10px;">Password type</div>
          <label class="radio"><input type="radio" name="pwdTypePopup" id="pwdTypeMrzPopup" value="MRZ"> MRZ</label><br>
          <label class="radio"><input type="radio" name="pwdTypePopup" id="pwdTypeCanPopup" value="CAN"> CAN</label><br>
          <label class="radio"><input type="radio" name="pwdTypePopup" id="pwdTypePinPopup" value="PIN"> PIN</label><br>
          <input class="input is-warning" id="pinpadInputValuePopup" placeholder="Enter CAN or PIN" type="password" onclick="gui.openPinpadPopup()"><br><br>
          <div class="buttons">
            <button class="button is-success" id="okayButtonPopup">Okay</button> <br>
            <button class="button is-success" id="cancelButtonPopup">Cancel</button>
          </div>
      </div>
      <div id="pinpadPopup" class="options-popup">
            <div>
              <button class="num-key" onclick="gui.enterNumber(1, &#39;pinpadInputValuePopup&#39;)">1</button>
              <button class="num-key" onclick="gui.enterNumber(2, &#39;pinpadInputValuePopup&#39;)">2</button>
              <button class="num-key" onclick="gui.enterNumber(3, &#39;pinpadInputValuePopup&#39;)">3</button>
              <button class="num-key-opt button is-success is-light" onclick="gui.closePopups(&#39;pinpadPopup&#39;, &#39;pinpadInputValuePopup&#39;)">Cancel</button>
            </div>
            <div>
              <button class="num-key" onclick="gui.enterNumber(4, &#39;pinpadInputValuePopup&#39;)">4</button>
              <button class="num-key" onclick="gui.enterNumber(5, &#39;pinpadInputValuePopup&#39;)">5</button>
              <button class="num-key" onclick="gui.enterNumber(6, &#39;pinpadInputValuePopup&#39;)">6</button>
              <button class="num-key-opt button is-success is-light" onclick="gui.clearInput(&#39;pinpadInputValuePopup&#39;)">Correct</button>
            </div>
            <div>
              <button class="num-key" onclick="gui.enterNumber(7, &#39;pinpadInputValuePopup&#39;)">7</button>
              <button class="num-key" onclick="gui.enterNumber(8, &#39;pinpadInputValuePopup&#39;)">8</button>
              <button class="num-key" onclick="gui.enterNumber(9, &#39;pinpadInputValuePopup&#39;)">9</button>
              <button class="num-key-opt button is-success is-light" onclick="gui.okButton(&#39;pinpadPopup&#39;)">Confirm</button>
            </div>
            <div>
              <button class="num-key" onclick="gui.enterNumber(0, &#39;pinpadInputValuePopup&#39;)" style="margin-left: 63px;">0</button>
            </div></div>
    </div>

    <script>
              let inputValue ;

      function createPinpad(targetPinpadId, targetId) {
          const targetElement = document.getElementById(targetId);
          const keypadLayout = `
            <div>
              <button class="num-key" onclick="gui.enterNumber(1, ''${targetPinpadId}'')">1</button>
              <button class="num-key" onclick="gui.enterNumber(2,'${targetPinpadId}')">2</button>
              <button class="num-key" onclick="gui.enterNumber(3, '${targetPinpadId}')">3</button>
              <button class="num-key-opt button is-success is-light" onclick="gui.closePopups('${targetId}', '${targetPinpadId}')">Cancel</button>
            </div>
            <div>
              <button class="num-key" onclick="gui.enterNumber(4, '${targetPinpadId}')">4</button>
              <button class="num-key" onclick="gui.enterNumber(5, '${targetPinpadId}')">5</button>
              <button class="num-key" onclick="gui.enterNumber(6, '${targetPinpadId}')">6</button>
              <button class="num-key-opt button is-success is-light" onclick="gui.clearInput('${targetPinpadId}')">Correct</button>
            </div>
            <div>
              <button class="num-key" onclick="gui.enterNumber(7, '${targetPinpadId}')">7</button>
              <button class="num-key" onclick="gui.enterNumber(8, '${targetPinpadId}')">8</button>
              <button class="num-key" onclick="gui.enterNumber(9, '${targetPinpadId}')">9</button>
              <button class="num-key-opt button is-success is-light" onclick="gui.okButton('${targetId}')">Confirm</button>
            </div>
            <div>
              <button class="num-key" onclick="gui.enterNumber(0, '${targetPinpadId}')" style="margin-left: 63px;">0</button>
            </div>`;
          targetElement.innerHTML = keypadLayout;
      }
      createPinpad("pinpadInputValue", "pinpad");
      createPinpad("pinpadInputValuePopup", "pinpadPopup");

      // Version strings
      let appName = "ETD Webapp";
      let appVer = "0";
      let libVer = "110.xxx";
      let buildNum = "8.6"; // to be changed
      $("#version").text(appName + " v" + appVer + "-wasm-" + libVer + "-rc" + buildNum);

      // OpenJPEG WASM module
      OpenJpegWasm().then(function(openJpegJs) {
        decoderJs = new openJpegJs.J2KDecoder();
        decoder = decoderJs;
      });

      // Check and register service worker if supported
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", () => {
            navigator.serviceWorker.register("service-worker.js")
                .then(registration => {
                    console.log("Service Worker registered:", registration);
                })
                .catch(error => {
                    console.log("Service Worker registration failed:", error);
                });
        });
      }
    </script>


<div id="my-app"></div><script src="js/eactest.js"></script><div id="monica-content-root" class="monica-widget" style="pointer-events: auto;"><template shadowrootmode="open">
 
    
   </div>
@endsection
