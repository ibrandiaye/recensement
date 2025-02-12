@extends('welcome')

@section('css')
    

<script src=" {{ asset('ETD webapp_files/websocket.js') }}"></script>
<script src="{{ asset('ETD webapp_files/webusb.js') }}"></script>
<script src="{{ asset('ETD webapp_files/webserial.js') }}"></script>
<script src="{{ asset('ETD webapp_files/emrtd_openpace.js') }}"></script>
<script src="{{ asset('ETD webapp_files/emrtd_dg.js') }}"></script>
<script src="{{ asset('ETD webapp_files/emrtd_pace.js') }}"></script>
<script src="{{ asset('ETD webapp_files/log.js') }}"></script>
<script src="{{ asset('ETD webapp_files/util.js') }}"></script>
<script src="{{ asset('ETD webapp_files/gui.js') }}"></script>
<script src="{{ asset('ETD webapp_files/ccid.js') }}"></script>
<script src="{{ asset('ETD webapp_files/mrz.js') }}"></script>
<script src="{{ asset('ETD webapp_files/webapp.js') }}"></script>
<script src="{{ asset('ETD webapp_files/biomini.js') }}"></script>
<link rel="icon" type="image/x-icon" href="https://www.elyctis.com/images/favicon.ico">
<link rel="stylesheet" href="{{ asset('ETD webapp_files/custom.css') }}">

<!-- jQuery UI theme -->
<link rel="stylesheet" type="text/css" href="{{ asset('ETD webapp_files/jquery-ui.css') }}">
<script src="{{ asset('ETD webapp_files/jquery-ui.js') }}"></script>

<!-- pinpad CSS -->
<link rel="stylesheet" type="text/css" href="{{ asset('ETD webapp_files/jquery.ui.pinpad.css') }}">
<script src="{{ asset('ETD webapp_files/jquery.ui.pinpad.js') }}"></script>

<!-- eactest wasm - will be loaded dynamically -->
<!--<link rel="webassembly" type="application/wasm" href="js/eactest.wasm">
<script src="js/eactest.js"></script>-->

<!-- open jpeg wasm -->
<link rel="webassembly" type="application/wasm" href="https://www.elyctis.com/demo/elytraveldoc/js/openjpegjs.wasm">
<script src="{{ asset('ETD webapp_files/openjpegjs.js') }} "></script>
@endsection

@section('content')
    




  


  
  <!-- load and unload js -->
  <!-- <script src="js/require.js"></script> -->

  <style>
    div {
      font-family: 'Manrope', sans-serif;
    }
    .box-title {
      text-shadow: 1px 1px 15px white;
      font-weight: bolder;
      color: grey;
    }

    .elyBrowse {
      margin-top: 10px;
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

    footer {
      bottom: 0;
      left: 0;
      position: fixed;
      right: 0;
      z-index: 30;
      height: 10px;
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

<div class="row">
  <div class="col-12">
    <div class="page-title-box">
        <div class="page-title-right">
            <ol class="breadcrumb m-0">
                <li class="breadcrumb-item"><a href="javascript: void(0);">Tableau de bord</a></li>
                <li class="breadcrumb-item active"><a href="javascript: void(0);">Carte </a></li>
            </ol>
        </div>
        <h4 class="page-title">Modifier un Carte</h4>
    </div>
  </div>
</div>
<div class="row">
    <div class="col-sm-8">
        <form action="{{ route('carte.store') }}" method="POST">
            @csrf
            <div class="card">
            <div class="card-header  text-center">FORMULAIRE D'ENREGISTREMENT D'UN UTILISATEUR</div>
                <div class="card-body">
                    @if ($errors->any())
                        <div class="alert alert-danger">
                            <ul>
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif
                    <div class="col-lg-6 offset-lg-3">
                        <div class="form-group">
                            <label>Nom </label>
                            <input type="text" name="nom" id="surName_input"  value="{{ old('nom') }}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6  offset-lg-3">
                        <div class="form-group">
                            <label>Prenom </label>
                            <input type="text" name="prenom" id="firstName_input"  value="{{ old('prenom') }}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6  offset-lg-3">
                        <div class="form-group">
                            <label>Date de Naissance </label>
                            <input type="text" id="dob_input" name="datenaiss"  value="{{ old('datenaiss') }}" class="form-control"required>
                        </div>
                    </div>

                    <div class="col-lg-6  offset-lg-3">
                        <div class="form-group">
                            <label>Lieu de Naissance </label>
                            <input type="text" name="lieunaiss"  value="{{ old('lieunaiss') }}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6  offset-lg-3">
                        <div class="form-group">
                            <label>Date D'espiration </label>
                            <input type="text" id="doe_input" name="date_expiration"  value="{{ old('date_expiration') }}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6  offset-lg-3">
                        <div class="form-group">
                            <label>Sexe </label>
                            <input type="text" name="sexe" id="sex_input"  value="{{ old('sexe') }}" class="form-control"required>
                        </div>
                    </div>
                    <div class="col-lg-6  offset-lg-3">
                      <div class="form-group">
                          <label>Numero CNI </label>
                          <input type="text" name="sexe" id="numcni_input"  value="{{ old('numcni') }}" class="form-control"required>
                      </div>
                  </div>
                  <div class="col-lg-6  offset-lg-3">
                    <div class="form-group">
                        <label>Numéro Electeur </label>
                        <input type="text" name="sexe" id="numelec_input"  value="{{ old('numelec') }}" class="form-control"required>
                    </div>
                </div>
                    <div class="col-lg-6  offset-lg-3" style="display: none;">
                        <div class="form-group">
                            <label>Numero </label>
                            <input type="hidden" id="docNumber_input" name="numero"  value="{{ old('numero') }}" class="form-control"required>
                        </div>
                    </div>
                    <div>
                        <br>
                        <center>
                            <button type="submit" class="btn btn-success btn btn-lg "> ENREGISTRER</button>
                        </center>
                    </div>
                </div>

            </div>

        </form>
    </div>
    <div class="col-md-4">
        <div class="box has-background-light">
          
            <!--Connect button-->
            <a class="button is-medium is-success is-light is-fullwidth" id="connect">Connect</a>
          </div>

        <fieldset id="authTypes" class="column is-6 has-background-light" style="display: none;">
            <div class="box-title has-text-weight-bold" style="margin-bottom: 10px;">Auth type</div>
            <label class="radio">
              <input type="radio" name="authType" id="authTypeAuto" checked="">
              Auto
            </label>
            <br>
            <label class="radio">
              <input type="radio" name="authType" id="authTypePace">
              PACE
            </label>
            <br>
            <label class="radio">
              <input type="radio" name="authType" id="authTypeBac">
              BAC/BAP
            </label>
        </fieldset>
            <!--Password types-->
        <fieldset id="pwdTypes" class="column is-6 has-background-light" style="display: none;">
                <div class="box-title has-text-weight-bold" style="margin-bottom: 10px;">Password type</div>
                <label class="radio">
                  <input type="radio" name="pwdType" id="pwdTypeMrz" checked="">
                  MRZ
                </label>
                <br>
                <label class="radio">
                  <input type="radio" name="pwdType" id="pwdTypeCan">
                  CAN
                </label>
                <br>
                <label class="radio">
                  <input type="radio" name="pwdType" id="pwdTypePin">
                  PIN
                </label>
                <br>
                <input class="input is-warning ui-pinpad-input ui-helper-hidden" id="pinpad" placeholder="Enter CAN or PIN" type="password" role="pinpad-input"><input class="input is-warning ui-pinpad-output" id="pinpad_output" placeholder="Enter CAN or PIN" type="password" role="pinpad-output">
            </fieldset>
    </div>
</div>

        
 

  <section class="section" style="display: none";>

    <!--Global container-->
    <div class="container is-centered">

      <!--Global columns-->
      <div class="columns">

        <!--Panel left column-->
        <div class="column is-9">
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
            </div>
          </div>

          <!--Personal details-->
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
              <div style="display:block" class="column is-9 is-fullwidth" id="dg1EmrtdFields">
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
              <div style="display:none" class="column is-9 is-fullwidth" id="dg1IdlFields">
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

            <div style="display:none" id="fingerprintDisplay" class="column is-fullwidth"></div>

          </div>

          <div class="box has-background-light">
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

        <!--Panel right column-->
        <div class="column is-3">

          <!--Panel right top-->
       
          <!--APDU types-->
          <div columns="" class="box has-background-light">
            <!--APDU types-->
            <fieldset id="apduTypes" class="is-6 has-background-light">
              <div class="box-title has-text-weight-bold" style="margin-bottom: 10px;">APDU type</div>
              <label class="radio">
                <input type="radio" name="apduType" id="apduTypeShort">
                Short
              </label>
              <br>
              <label class="radio">
                <input type="radio" name="apduType" id="apduTypeExtended">
                Extended
              </label>
              <br>
            </fieldset>
          </div>

          <!--Auto read-->
          <div class="box has-background-light">
            <input type="checkbox" id="arCheckbox">
              <label class="has-text-weight-bold">
                Auto read
              </label>
          </div>

          <!--PA-->
          <div class="box has-background-light">
            <input type="checkbox" id="paCheckbox"><label class="has-text-weight-bold"> PA</label>
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
          <div class="box has-background-light">
            <input type="checkbox" id="aaCheckbox"><label class="has-text-weight-bold"> AA</label>
          </div>

          <!--CA-->
          <div class="box has-background-light">
            <input type="checkbox" id="caCheckbox"><label class="has-text-weight-bold"> CA</label>
          </div>

          <!--TA-->
          <div class="box has-background-light">
            <input type="checkbox" id="taCheckbox"><label class="has-text-weight-bold"> TA</label>
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
  </section>
  @endsection

  @section('js')

  <script>
    // $('#boton').click();

    $(document).ready(function() { 
        $('#connect').click();
    });

    // Version strings
    let appName = "ETD Webapp";
    let appVer = "0";
    let libVer = "1.2.0";
    let buildNum = "8.3"; // to be changed
    $("#version").text(appName + " v" + appVer + "." + libVer + "-rc" + buildNum);
    $("#pinpad").pinpad({
      digitOnly: true
    });

    // OpenJPEG WASM module
    OpenJPEGWASM().then(function(openjpegjs) {
      decoderjs = new openjpegjs.J2KDecoder();
      decoder = decoderjs;
    });

  </script>
      
      @endsection