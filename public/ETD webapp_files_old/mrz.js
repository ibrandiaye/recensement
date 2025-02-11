/**
 * mrz - Parse MRZ (Machine Readable Zone) from identity documents
 * @version v3.4.0
 * @link https://github.com/cheminfo/mrz#readme
 * @license MIT
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.mrz = {}));
})(this, (function (exports) { 'use strict';

    const formats = {
      TD1: 'TD1',
      TD2: 'TD2',
      TD3: 'TD3',
      SWISS_DRIVING_LICENSE: 'SWISS_DRIVING_LICENSE',
      FRENCH_NATIONAL_ID: 'FRENCH_NATIONAL_ID'
    };

    const states = {
      "AFG": "Afghanistan",
      "ALB": "Albania",
      "DZA": "Algeria",
      "ASM": "American Samoa",
      "AND": "Andorra",
      "AGO": "Angola",
      "AIA": "Anguilla",
      "ATA": "Antarctica",
      "ATG": "Antigua and Barbuda",
      "ARG": "Argentina",
      "ARM": "Armenia",
      "ABW": "Aruba",
      "AUS": "Australia",
      "AUT": "Austria",
      "AZE": "Azerbaijan",
      "BHS": "Bahamas (the)",
      "BHR": "Bahrain",
      "BGD": "Bangladesh",
      "BRB": "Barbados",
      "BLR": "Belarus",
      "BEL": "Belgium",
      "BLZ": "Belize",
      "BEN": "Benin",
      "BMU": "Bermuda",
      "BTN": "Bhutan",
      "BOL": "Bolivia (Plurinational State of)",
      "BES": "Bonaire, Sint Eustatius and Saba",
      "BIH": "Bosnia and Herzegovina",
      "BWA": "Botswana",
      "BVT": "Bouvet Island",
      "BRA": "Brazil",
      "IOT": "British Indian Ocean Territory (the)",
      "BRN": "Brunei Darussalam",
      "BGR": "Bulgaria",
      "BFA": "Burkina Faso",
      "BDI": "Burundi",
      "CPV": "Cabo Verde",
      "KHM": "Cambodia",
      "CMR": "Cameroon",
      "CAN": "Canada",
      "CYM": "Cayman Islands (the)",
      "CAF": "Central African Republic (the)",
      "TCD": "Chad",
      "CHL": "Chile",
      "CHN": "China",
      "CXR": "Christmas Island",
      "CCK": "Cocos (Keeling) Islands (the)",
      "COL": "Colombia",
      "COM": "Comoros (the)",
      "COD": "Congo (the Democratic Republic of the)",
      "COG": "Congo (the)",
      "COK": "Cook Islands (the)",
      "CRI": "Costa Rica",
      "HRV": "Croatia",
      "CUB": "Cuba",
      "CUW": "Curaçao",
      "CYP": "Cyprus",
      "CZE": "Czechia",
      "CIV": "Côte d'Ivoire",
      "DNK": "Denmark",
      "DJI": "Djibouti",
      "DMA": "Dominica",
      "DOM": "Dominican Republic (the)",
      "ECU": "Ecuador",
      "EGY": "Egypt",
      "SLV": "El Salvador",
      "GNQ": "Equatorial Guinea",
      "ERI": "Eritrea",
      "EST": "Estonia",
      "SWZ": "Eswatini",
      "ETH": "Ethiopia",
      "FLK": "Falkland Islands (the) [Malvinas]",
      "FRO": "Faroe Islands (the)",
      "FJI": "Fiji",
      "FIN": "Finland",
      "FRA": "France",
      "GUF": "French Guiana",
      "PYF": "French Polynesia",
      "ATF": "French Southern Territories (the)",
      "GAB": "Gabon",
      "GMB": "Gambia (the)",
      "GEO": "Georgia",
      "DEU": "Germany",
      "GHA": "Ghana",
      "GIB": "Gibraltar",
      "GRC": "Greece",
      "GRL": "Greenland",
      "GRD": "Grenada",
      "GLP": "Guadeloupe",
      "GUM": "Guam",
      "GTM": "Guatemala",
      "GGY": "Guernsey",
      "GIN": "Guinea",
      "GNB": "Guinea-Bissau",
      "GUY": "Guyana",
      "HTI": "Haiti",
      "HMD": "Heard Island and McDonald Islands",
      "VAT": "Holy See (the)",
      "HND": "Honduras",
      "HKG": "Hong Kong",
      "HUN": "Hungary",
      "ISL": "Iceland",
      "IND": "India",
      "IDN": "Indonesia",
      "IRN": "Iran (Islamic Republic of)",
      "IRQ": "Iraq",
      "IRL": "Ireland",
      "IMN": "Isle of Man",
      "ISR": "Israel",
      "ITA": "Italy",
      "JAM": "Jamaica",
      "JPN": "Japan",
      "JEY": "Jersey",
      "JOR": "Jordan",
      "KAZ": "Kazakhstan",
      "KEN": "Kenya",
      "KIR": "Kiribati",
      "PRK": "Korea (the Democratic People's Republic of)",
      "KOR": "Korea (the Republic of)",
      "KWT": "Kuwait",
      "KGZ": "Kyrgyzstan",
      "LAO": "Lao People's Democratic Republic (the)",
      "LVA": "Latvia",
      "LBN": "Lebanon",
      "LSO": "Lesotho",
      "LBR": "Liberia",
      "LBY": "Libya",
      "LIE": "Liechtenstein",
      "LTU": "Lithuania",
      "LUX": "Luxembourg",
      "MAC": "Macao",
      "MDG": "Madagascar",
      "MWI": "Malawi",
      "MYS": "Malaysia",
      "MDV": "Maldives",
      "MLI": "Mali",
      "MLT": "Malta",
      "MHL": "Marshall Islands (the)",
      "MTQ": "Martinique",
      "MRT": "Mauritania",
      "MUS": "Mauritius",
      "MYT": "Mayotte",
      "MEX": "Mexico",
      "FSM": "Micronesia (Federated States of)",
      "MDA": "Moldova (the Republic of)",
      "MCO": "Monaco",
      "MNG": "Mongolia",
      "MNE": "Montenegro",
      "MSR": "Montserrat",
      "MAR": "Morocco",
      "MOZ": "Mozambique",
      "MMR": "Myanmar",
      "NAM": "Namibia",
      "NRU": "Nauru",
      "NPL": "Nepal",
      "NLD": "Netherlands (the)",
      "NCL": "New Caledonia",
      "NZL": "New Zealand",
      "NIC": "Nicaragua",
      "NER": "Niger (the)",
      "NGA": "Nigeria",
      "NIU": "Niue",
      "NFK": "Norfolk Island",
      "MKD": "North Macedonia",
      "MNP": "Northern Mariana Islands (the)",
      "NOR": "Norway",
      "OMN": "Oman",
      "PAK": "Pakistan",
      "PLW": "Palau",
      "PSE": "Palestine, State of",
      "PAN": "Panama",
      "PNG": "Papua New Guinea",
      "PRY": "Paraguay",
      "PER": "Peru",
      "PHL": "Philippines (the)",
      "PCN": "Pitcairn",
      "POL": "Poland",
      "PRT": "Portugal",
      "PRI": "Puerto Rico",
      "QAT": "Qatar",
      "ROU": "Romania",
      "RUS": "Russian Federation (the)",
      "RWA": "Rwanda",
      "REU": "Réunion",
      "BLM": "Saint Barthélemy",
      "SHN": "Saint Helena, Ascension and Tristan da Cunha",
      "KNA": "Saint Kitts and Nevis",
      "LCA": "Saint Lucia",
      "MAF": "Saint Martin (French part)",
      "SPM": "Saint Pierre and Miquelon",
      "VCT": "Saint Vincent and the Grenadines",
      "WSM": "Samoa",
      "SMR": "San Marino",
      "STP": "Sao Tome and Principe",
      "SAU": "Saudi Arabia",
      "SEN": "Senegal",
      "SRB": "Serbia",
      "SYC": "Seychelles",
      "SLE": "Sierra Leone",
      "SGP": "Singapore",
      "SXM": "Sint Maarten (Dutch part)",
      "SVK": "Slovakia",
      "SVN": "Slovenia",
      "SLB": "Solomon Islands",
      "SOM": "Somalia",
      "ZAF": "South Africa",
      "SGS": "South Georgia and the South Sandwich Islands",
      "SSD": "South Sudan",
      "ESP": "Spain",
      "LKA": "Sri Lanka",
      "SDN": "Sudan (the)",
      "SUR": "Suriname",
      "SJM": "Svalbard and Jan Mayen",
      "SWE": "Sweden",
      "CHE": "Switzerland",
      "SYR": "Syrian Arab Republic (the)",
      "TWN": "Taiwan (Province of China)",
      "TJK": "Tajikistan",
      "TZA": "Tanzania, the United Republic of",
      "THA": "Thailand",
      "TLS": "Timor-Leste",
      "TGO": "Togo",
      "TKL": "Tokelau",
      "TON": "Tonga",
      "TTO": "Trinidad and Tobago",
      "TUN": "Tunisia",
      "TUR": "Turkey",
      "TKM": "Turkmenistan",
      "TCA": "Turks and Caicos Islands (the)",
      "TUV": "Tuvalu",
      "UGA": "Uganda",
      "UKR": "Ukraine",
      "ARE": "United Arab Emirates (the)",
      "GBR": "United Kingdom of Great Britain and Northern Ireland (the)",
      "UMI": "United States Minor Outlying Islands (the)",
      "USA": "United States of America (the)",
      "URY": "Uruguay",
      "UZB": "Uzbekistan",
      "VUT": "Vanuatu",
      "VEN": "Venezuela (Bolivarian Republic of)",
      "VNM": "Viet Nam",
      "VGB": "Virgin Islands (British)",
      "VIR": "Virgin Islands (U.S.)",
      "WLF": "Wallis and Futuna",
      "ESH": "Western Sahara*",
      "YEM": "Yemen",
      "ZMB": "Zambia",
      "ZWE": "Zimbabwe",
      "ALA": "Åland Islands",
      "GBD": "British Overseas Territories Citizen",
      "GBN": "British National (Overseas)",
      "GBO": "British Overseas Citizen",
      "GBS": "British Subject",
      "GBP": "British Protected Person",
      "RKS": "Republic of Kosovo",
      "D": "Germany",
      "XXK": "Kosovo",
      "EUE": "European Union (EU)",
      "UNO": "United Nations Organization or one of its officials",
      "UNA": "United Nations specialized agency or one of its officials",
      "UNK": "Resident of Kosovo to whom a travel document has been issued by the United Nations Interim Administration Mission in Kosovo (UNMIK)",
      "XBA": "African Development Bank (ADB)",
      "XIM": "African Export-Import Bank (AFREXIM bank)",
      "XCC": "Caribbean Community or one of its emissaries (CARICOM)",
      "XCE": "Council of Europe",
      "XCO": "Common Market for Eastern and Southern Africa (COMESA)",
      "XEC": "Economic Community of West African States (ECOWAS)",
      "XPO": "International Criminal Police Organization (INTERPOL)",
      "XES": "Organization of Eastern Caribbean States (OECS)",
      "XOM": "Sovereign Military Order of Malta or one of its emissaries",
      "XDC": "Southern African Development Community",
      "XXA": "Stateless person, as defined in Article 1 of the 1954 Convention Relating to the Status of Stateless Persons",
      "XXB": "Refugee, as defined in Article 1 of the 1951 Convention Relating to the Status of Refugees as amended by the 1967 Protocol",
      "XXC": "Refugee, other than as defined under the code XXB above",
      "XXX": "Person of unspecified nationality, for whom issuing State does not consider it necessary to specify any of the codes XXA, XXB or XXC above, whatever that person’s status may be. This category may include a person who is neither stateless nor a refugee but who is of unknown nationality and legally residing in the State of issue.",
      "ANT": "Netherlands Antilles",
      "NTZ": "Neutral Zone"
    };
    Object.freeze(states);
    var STATES = states;

    function checkLines(lines) {
      if (typeof lines === 'string') {
        lines = lines.split(/[\r\n]+/);
      }
      if (!Array.isArray(lines)) {
        throw new TypeError('input must be an array or string');
      }
      for (const line of lines) {
        if (!line.match(/[A-Z0-9<]+/)) {
          throw new TypeError('lines must be composed of only alphanumerical characters and "<"');
        }
      }
      return lines;
    }

    function cleanText(string) {
      return string.replace(/<+$/g, '').replace(/</g, ' ');
    }

    function parseAlpha(source) {
      if (!source.match(/^[A-Z<]+$/)) {
        throw new Error(`invalid text: ${source}. Must be only alphabetical with <`);
      }
      return cleanText(source);
    }

    function parseDocumentCodeId(source) {
      const first = source.charAt(0);
      if (first !== 'A' && first !== 'C' && first !== 'I') {
        throw new Error(`invalid document code: ${source}. First character must be A, C or I`);
      }
      const second = source.charAt(1);
      if (second === 'V') {
        throw new Error(`invalid document code: ${source}. Second character may not be V`);
      }
      if (second === '<') {
        return {
          value: first,
          start: 0,
          end: 1
        };
      } else {
        return source;
      }
    }

    function parseText(source) {
      let regexp = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : /^[0-9A-Z<]+$/;
      if (!source.match(regexp)) {
        throw new Error(`invalid text: ${source}. Must match the following regular expression: ${regexp.toString()}`);
      }
      return cleanText(source);
    }

    function parseOptional(source) {
      const value = parseText(source);
      return {
        value,
        start: 0,
        end: 0 + value.length
      };
    }

    const numberToLetterMismatches = {
      '8': 'B',
      '6': 'G',
      '0': 'O',
      '1': 'I',
      '5': 'S',
      '2': 'Z'
    };
    const letterToNumberMismatches = {
      B: '8',
      G: '6',
      O: '0',
      I: '1',
      S: '5',
      Z: '2'
    };
    function letterToNumber(char) {
      if (letterToNumberMismatches[char]) {
        return letterToNumberMismatches[char];
      }
      return char;
    }
    function numberToLetter(char) {
      if (numberToLetterMismatches[char]) {
        return numberToLetterMismatches[char];
      }
      return char;
    }
    function autoCorrection(source, fieldOptions) {
      let correctedLine = '';
      const autocorrect = [];
      const chars = source.split('');
      chars.forEach((char, i) => {
        if (fieldOptions.type === fieldTypes.ALPHABETIC) {
          const correctedChar = numberToLetter(char);
          if (correctedChar !== char) {
            autocorrect.push({
              line: fieldOptions.line,
              column: fieldOptions.start + i,
              original: char,
              corrected: correctedChar
            });
          }
          correctedLine += correctedChar;
        } else if (fieldOptions.type === fieldTypes.NUMERIC) {
          const correctedChar = letterToNumber(char);
          if (correctedChar !== char) {
            autocorrect.push({
              line: fieldOptions.line,
              column: fieldOptions.start + i,
              original: char,
              corrected: correctedChar
            });
          }
          correctedLine += correctedChar;
        } else {
          correctedLine += char;
        }
      });
      return {
        correctedLine,
        autocorrect
      };
    }

    const fieldTypes = {
      NUMERIC: 'NUMERIC',
      ALPHABETIC: 'ALPHABETIC',
      ALPHANUMERIC: 'ALPHANUMERIC'
    };
    function createFieldParser(fieldOptions) {
      checkType(fieldOptions, 'label', 'string');
      if (fieldOptions.field !== null) {
        checkType(fieldOptions, 'field', 'string');
      }
      checkType(fieldOptions, 'line', 'number');
      checkType(fieldOptions, 'start', 'number');
      checkType(fieldOptions, 'end', 'number');
      checkType(fieldOptions, 'parser', 'function');
      const ranges = [{
        line: fieldOptions.line,
        start: fieldOptions.start,
        end: fieldOptions.end
      }];
      if (Array.isArray(fieldOptions.related)) {
        for (const related of fieldOptions.related) {
          checkType(related, 'line', 'number');
          checkType(related, 'start', 'number');
          checkType(related, 'end', 'number');
          ranges.push(related);
        }
      }
      const parser = function (lines) {
        let autocorrect = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
        const source = getText(lines, fieldOptions);
        const related = fieldOptions.related || [];
        const textRelated = related.map(r => getText(lines, r));
        const result = {
          label: fieldOptions.label,
          field: fieldOptions.field,
          value: null,
          valid: false,
          ranges: ranges.map(range => ({
            line: range.line,
            start: range.start,
            end: range.end,
            raw: getText(lines, range)
          })),
          line: 0,
          start: 0,
          end: 0,
          autocorrect
        };
        const range = result.ranges[0];
        result.line = range.line;
        result.start = range.start;
        result.end = range.end;
        try {
          const parsed = fieldOptions.parser(source, ...textRelated);
          result.value = typeof parsed === 'object' ? parsed.value : parsed;
          result.valid = true;
          if (typeof parsed === 'object') {
            result.start = range.start + parsed.start;
            result.end = range.start + parsed.end;
          }
        } catch (e) {
          result.error = e.message;
        }
        return result;
      };
      const autocorrector = lines => {
        let corrected = lines;
        let source = getText(lines, fieldOptions);
        let autocorrect = [];
        const type = fieldOptions.type || fieldTypes.ALPHANUMERIC;
        if (type !== fieldTypes.ALPHANUMERIC) {
          const result = autoCorrection(source, fieldOptions);
          source = result.correctedLine;
          autocorrect = result.autocorrect;
        }
        corrected = changeText(lines, fieldOptions, source);
        return {
          correctedLines: corrected,
          autocorrect
        };
      };
      return {
        parser,
        autocorrector
      };
    }
    function getText(lines, options) {
      const line = lines[options.line];
      return line.substring(options.start, options.end);
    }
    function changeText(lines, options, text) {
      const line = lines[options.line];
      const newText = line.substring(0, options.start) + text + line.substring(options.end);
      lines[options.line] = newText;
      return lines;
    }
    function checkType(options, name, type) {
      if (typeof options[name] !== type) {
        throw new TypeError(`${name} must be a ${type}`);
      }
    }

    function check(string, value) {
      let code = 0;
      const factors = [7, 3, 1];
      for (let i = 0; i < string.length; i++) {
        let charCode = string.charCodeAt(i);
        if (charCode === 60) charCode = 0;
        if (charCode >= 65) charCode -= 55;
        if (charCode >= 48) charCode -= 48;
        charCode *= factors[i % 3];
        code += charCode;
      }
      code %= 10;
      if (code !== Number(value)) {
        throw new Error(`invalid check digit: ${value}. Must be ${code}`);
      }
    }

    function parseCompositeCheckDigit(checkDigit) {
      for (var _len = arguments.length, sources = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        sources[_key - 1] = arguments[_key];
      }
      const source = sources.join('');
      check(source, checkDigit);
      return checkDigit;
    }

    function parseDate(value) {
      if (!value.match(/^[0-9<]{4,6}$/)) {
        throw new Error(`invalid date: ${value}`);
      }
      const month = value.substring(2, 4);
      if (month !== '<<' && (parseInt(month, 10) < 1 || parseInt(month, 10) > 12)) {
        throw new Error(`invalid date month: ${month}`);
      }
      if (value.length === 6) {
        const day = value.substring(4, 6);
        if (day !== '<<' && (parseInt(day, 10) < 1 || parseInt(day, 10) > 31)) {
          throw new Error(`invalid date day: ${day}`);
        }
      }
      return value;
    }

    function parseCheckDigit(checkDigit, value) {
      check(value, checkDigit);
      return checkDigit;
    }

    function parseDocumentNumber$1(source, checkDigit, optional) {
      let end, value;
      if (checkDigit === '<' && optional) {
        const firstFiller = optional.indexOf('<');
        const tail = optional.substring(0, firstFiller - 1);
        value = source + tail;
        end = value.length + 1;
      } else {
        value = cleanText(source);
        end = value.length;
      }
      return {
        value,
        start: 0,
        end
      };
    }

    function parseDocumentNumberCheckDigit(checkDigit, source, optional) {
      if (checkDigit === '<' && optional) {
        const firstFiller = optional.indexOf('<');
        const tail = optional.substring(0, firstFiller - 1);
        source = `${source}<${tail}`;
        checkDigit = optional.charAt(firstFiller - 1);
        check(source, checkDigit);
        return {
          value: checkDigit,
          start: firstFiller,
          end: firstFiller + 1
        };
      } else {
        check(source, checkDigit);
        return checkDigit;
      }
    }

    function parseFirstName(source) {
      const withoutStart = source.replace(/.*?<{2}/, '');
      const value = parseText(withoutStart, /^[A-Z<]+<*$/);
      const start = source.length - withoutStart.length;
      return {
        value,
        start,
        end: start + value.length
      };
    }

    function parseLastName(source) {
      const parsed = parseText(source.replace(/<{2}.*/, ''), /^[A-Z<]*<*$/);
      return {
        value: parsed,
        start: 0,
        end: parsed.length
      };
    }

    function parseSex(source) {
      switch (source) {
        case 'M':
          return 'male';
        case 'F':
          return 'female';
        case '<':
          return 'nonspecified';
        default:
          throw new Error(`invalid sex: ${source}. Must be M, F or <.`);
      }
    }

    function parseState(source) {
      source = cleanText(source);
      let state = STATES[source];
      if (!state) {
        throw new Error(`invalid state code: ${source}`);
      }
      return {
        value: source,
        start: 0,
        end: source.length
      };
    }

    const documentNumberTemplate = {
      label: 'Document number',
      field: 'documentNumber',
      parser: parseDocumentNumber$1,
      type: fieldTypes.ALPHANUMERIC
    };
    const documentNumberCheckDigitTemplate = {
      label: 'Document number check digit',
      field: 'documentNumberCheckDigit',
      parser: parseDocumentNumberCheckDigit,
      type: fieldTypes.NUMERIC
    };
    const documentCodeTemplate = {
      label: 'Document code',
      field: 'documentCode',
      type: fieldTypes.ALPHABETIC
    };
    const nationalityTemplate = {
      label: 'Nationality',
      field: 'nationality',
      parser: parseState,
      type: fieldTypes.ALPHABETIC
    };
    const sexTemplate = {
      label: 'Sex',
      field: 'sex',
      parser: parseSex,
      type: fieldTypes.ALPHABETIC
    };
    const expirationDateTemplate = {
      label: 'Expiration date',
      field: 'expirationDate',
      parser: parseDate,
      type: fieldTypes.NUMERIC
    };
    const expirationDateCheckDigitTemplate = {
      label: 'Expiration date check digit',
      field: 'expirationDateCheckDigit',
      parser: parseCheckDigit,
      type: fieldTypes.NUMERIC
    };
    const compositeCheckDigitTemplate = {
      label: 'Composite check digit',
      field: 'compositeCheckDigit',
      parser: parseCompositeCheckDigit,
      type: fieldTypes.NUMERIC
    };
    const birthDateTemplate = {
      label: 'Birth date',
      field: 'birthDate',
      parser: parseDate,
      type: fieldTypes.NUMERIC
    };
    const birthDateCheckDigitTemplate = {
      label: 'Birth date check digit',
      field: 'birthDateCheckDigit',
      parser: parseCheckDigit,
      type: fieldTypes.NUMERIC
    };
    const issueDateTemplate = {
      label: 'Issue date',
      field: 'issueDate',
      parser: parseDate,
      type: fieldTypes.NUMERIC
    };
    const firstNameTemplate = {
      label: 'First name',
      field: 'firstName',
      parser: parseFirstName,
      type: fieldTypes.ALPHABETIC
    };
    const lastNameTemplate = {
      label: 'Last name',
      field: 'lastName',
      parser: parseLastName,
      type: fieldTypes.ALPHABETIC
    };
    const issuingStateTemplate = {
      label: 'Issuing state',
      field: 'issuingState',
      parser: parseState,
      type: fieldTypes.ALPHABETIC
    };

    var frenchNationalIdFields = [{
      ...documentCodeTemplate,
      line: 0,
      start: 0,
      end: 2,
      parser: parseDocumentCodeId
    }, {
      ...issuingStateTemplate,
      line: 0,
      start: 2,
      end: 5
    }, {
      ...lastNameTemplate,
      line: 0,
      start: 5,
      end: 30,
      parser: parseAlpha
    }, {
      label: 'Administrative code',
      field: 'administrativeCode',
      line: 0,
      start: 30,
      end: 36,
      parser: parseOptional
    }, {
      ...issueDateTemplate,
      line: 1,
      start: 0,
      end: 4
    }, {
      label: 'Administrative code 2',
      field: 'administrativeCode2',
      line: 1,
      start: 4,
      end: 7,
      parser: parseOptional
    }, {
      ...documentNumberTemplate,
      line: 1,
      start: 7,
      end: 12
    }, {
      ...documentNumberCheckDigitTemplate,
      line: 1,
      start: 12,
      end: 13,
      related: [{
        line: 1,
        start: 0,
        end: 12
      }]
    }, {
      ...firstNameTemplate,
      line: 1,
      start: 13,
      end: 27,
      parser: parseAlpha
    }, {
      ...birthDateTemplate,
      line: 1,
      start: 27,
      end: 33
    }, {
      ...birthDateCheckDigitTemplate,
      line: 1,
      start: 33,
      end: 34,
      related: [{
        line: 1,
        start: 27,
        end: 33
      }]
    }, {
      ...sexTemplate,
      line: 1,
      start: 34,
      end: 35
    }, {
      ...compositeCheckDigitTemplate,
      line: 1,
      start: 35,
      end: 36,
      related: [{
        line: 0,
        start: 0,
        end: 36
      }, {
        line: 1,
        start: 0,
        end: 35
      }]
    }].map(createFieldParser);

    function getDetails(lines, fieldParsers, autocorrectArray) {
      const details = [];
      fieldParsers.forEach((_ref, i) => {
        let {
          parser
        } = _ref;
        details.push(parser(lines, autocorrectArray[i]));
      });
      return details;
    }
    function getFields(details) {
      const fields = {};
      let valid = true;
      for (const detail of details) {
        if (!detail.valid) valid = false;
        if (detail.field) {
          fields[detail.field] = detail.value;
        }
      }
      return {
        fields,
        valid
      };
    }
    function getCorrection(lines, fieldParsers, autocorrect) {
      let corrected = lines;
      const autocorrectArray = [];
      if (autocorrect) {
        fieldParsers.forEach(_ref2 => {
          let {
            autocorrector
          } = _ref2;
          const result = autocorrector(corrected);
          autocorrectArray.push(result.autocorrect);
          corrected = result.correctedLines;
        });
      }
      return {
        corrected,
        autocorrectArray
      };
    }
    function getResult(format, lines, fieldParsers, options) {
      const {
        autocorrect = false
      } = options;
      const {
        corrected,
        autocorrectArray
      } = getCorrection(lines, fieldParsers, autocorrect);
      const details = getDetails(corrected, fieldParsers, autocorrectArray);
      const fields = getFields(details);
      const result = {
        format,
        details,
        fields: fields.fields,
        valid: fields.valid
      };
      return result;
    }

    const FRENCH_NATIONAL_ID = formats.FRENCH_NATIONAL_ID;
    function parseFrenchNationalId(lines, options) {
      if (lines.length !== 2) {
        throw new Error(`invalid number of lines: ${lines.length}: Must be 2 for ${FRENCH_NATIONAL_ID}`);
      }
      lines.forEach((line, index) => {
        if (line.length !== 36) {
          throw new Error(`invalid number of characters for line ${index + 1}: ${line.length}. Must be 36 for ${FRENCH_NATIONAL_ID}`);
        }
      });
      return getResult(FRENCH_NATIONAL_ID, lines, frenchNationalIdFields, options);
    }

    function parseNumber(source) {
      if (!source.match(/^[0-9]+$/)) {
        throw new Error(`invalid number: ${source}`);
      }
      return source;
    }

    function checkSeparator(source) {
      if (!source.match(/^<*$/)) {
        throw new Error(`invalid separator: ${source}. Must be composed only of "<"`);
      }
      return source;
    }

    function parseDocumentCode(source) {
      if (source !== 'FA') {
        throw new Error(`invalid document code: ${source}. Must be FA`);
      }
      return source;
    }

    function parseLanguageCode(languageCode) {
      switch (languageCode) {
        case 'D':
        case 'F':
        case 'I':
        case 'R':
          return languageCode;
        default:
          throw new Error(`invalid languageCode code: ${languageCode}. Must be D, F, I or R`);
      }
    }

    function parseDocumentNumber(source) {
      // swiss driving license number
      const first = source.substring(0, 3);
      const second = source.substring(3, 6);
      const languageCode = source.charAt(6);
      const end = source.substring(7);
      if (!first.match(/^[A-Z0-9]{3}$/)) {
        throw new Error(`invalid document number: ${source}. Must start with three alphanumeric digits`);
      }
      if (!second.match(/^[0-9]{3}$/)) {
        throw new Error(`invalid document number: ${source}. Must have numeric digits in positions 4, 5 and 6`);
      }
      if (end !== '<<') {
        throw new Error(`invalid document number: ${source}. Must end with <<`);
      }
      // calling this method to throw if languageCode invalid
      parseLanguageCode(languageCode);
      return {
        value: source.substring(0, 7),
        start: 0,
        end: 7
      };
    }

    function parseIssuingState(source) {
      if (source !== 'CHE' && source !== 'LIE') {
        throw new Error(`invalid state code: ${source}. Must be CHE or LIE`);
      }
      return source;
    }

    var swissDrivingLicenseFields = [{
      ...documentNumberTemplate,
      line: 0,
      start: 0,
      end: 9,
      parser: parseDocumentNumber
    }, {
      label: 'Language code',
      field: 'languageCode',
      line: 0,
      start: 6,
      end: 7,
      parser: parseLanguageCode,
      type: fieldTypes.ALPHABETIC
    }, {
      ...documentCodeTemplate,
      line: 1,
      start: 0,
      end: 2,
      parser: parseDocumentCode
    }, {
      ...issuingStateTemplate,
      line: 1,
      start: 2,
      end: 5,
      parser: parseIssuingState
    }, {
      label: 'PIN code',
      field: 'pinCode',
      line: 1,
      start: 5,
      end: 14,
      parser: parseNumber,
      type: fieldTypes.NUMERIC
    }, {
      label: 'Version number',
      field: 'versionNumber',
      line: 1,
      start: 14,
      end: 17,
      parser: parseNumber,
      type: fieldTypes.NUMERIC
    }, {
      label: 'Separator 1',
      field: null,
      line: 1,
      start: 17,
      end: 19,
      parser: checkSeparator
    }, {
      ...birthDateTemplate,
      line: 1,
      start: 19,
      end: 25
    }, {
      label: 'Separator 2',
      field: null,
      line: 1,
      start: 25,
      end: 30,
      parser: checkSeparator
    }, {
      ...lastNameTemplate,
      line: 2,
      start: 0,
      end: 30
    }, {
      ...firstNameTemplate,
      line: 2,
      start: 0,
      end: 30
    }].map(createFieldParser);

    const SWISS_DRIVING_LICENSE = formats.SWISS_DRIVING_LICENSE;
    function parseSwissDrivingLicense(lines, options) {
      if (lines.length !== 3) {
        throw new Error(`invalid number of lines: ${lines.length}: Must be 3 for ${SWISS_DRIVING_LICENSE}`);
      }
      if (lines[0].length !== 9) {
        throw new Error(`invalid number of characters for line 1: ${lines[0].length}. Must be 9 for ${SWISS_DRIVING_LICENSE}`);
      }
      if (lines[1].length !== 30) {
        throw new Error(`invalid number of characters for line 2: ${lines[1].length}. Must be 30 for ${SWISS_DRIVING_LICENSE}`);
      }
      if (lines[2].length !== 30) {
        throw new Error(`invalid number of characters for line 3: ${lines[2].length}. Must be 30 for ${SWISS_DRIVING_LICENSE}`);
      }
      return getResult(SWISS_DRIVING_LICENSE, lines, swissDrivingLicenseFields, options);
    }

    function parseDocumentNumberOptional(optional, checkDigit) {
      if (checkDigit === '<') {
        const firstFiller = optional.indexOf('<');
        const value = parseText(optional.substring(firstFiller + 1));
        return {
          value,
          start: firstFiller + 1,
          end: firstFiller + 1 + value.length
        };
      } else {
        const value = parseText(optional);
        return {
          value,
          start: 0,
          end: value.length
        };
      }
    }

    var TD1Fields = [{
      ...documentCodeTemplate,
      line: 0,
      start: 0,
      end: 2,
      parser: parseDocumentCodeId
    }, {
      ...issuingStateTemplate,
      line: 0,
      start: 2,
      end: 5
    }, {
      ...documentNumberTemplate,
      line: 0,
      start: 5,
      end: 14,
      related: [{
        line: 0,
        start: 14,
        end: 15
      }, {
        line: 0,
        start: 15,
        end: 30
      }]
    }, {
      ...documentNumberCheckDigitTemplate,
      line: 0,
      start: 14,
      end: 15,
      related: [{
        line: 0,
        start: 5,
        end: 14
      }, {
        line: 0,
        start: 15,
        end: 30
      }]
    }, {
      label: 'Optional field 1',
      field: 'optional1',
      line: 0,
      start: 15,
      end: 30,
      related: [{
        line: 0,
        start: 5,
        end: 14
      }, {
        line: 0,
        start: 14,
        end: 15
      }],
      parser: parseDocumentNumberOptional
    }, {
      ...birthDateTemplate,
      start: 0,
      end: 6,
      line: 1
    }, {
      ...birthDateCheckDigitTemplate,
      line: 1,
      start: 6,
      end: 7,
      related: [{
        line: 1,
        start: 0,
        end: 6
      }]
    }, {
      ...sexTemplate,
      line: 1,
      start: 7,
      end: 8
    }, {
      ...expirationDateTemplate,
      line: 1,
      start: 8,
      end: 14
    }, {
      ...expirationDateCheckDigitTemplate,
      line: 1,
      start: 14,
      end: 15,
      related: [{
        line: 1,
        start: 8,
        end: 14
      }]
    }, {
      ...nationalityTemplate,
      line: 1,
      start: 15,
      end: 18
    }, {
      label: 'Optional field 2',
      field: 'optional2',
      line: 1,
      start: 18,
      end: 29,
      parser: parseOptional
    }, {
      ...compositeCheckDigitTemplate,
      line: 1,
      start: 29,
      end: 30,
      related: [{
        line: 0,
        start: 5,
        end: 30
      }, {
        line: 1,
        start: 0,
        end: 7
      }, {
        line: 1,
        start: 8,
        end: 15
      }, {
        line: 1,
        start: 18,
        end: 29
      }]
    }, {
      ...lastNameTemplate,
      line: 2,
      start: 0,
      end: 30
    }, {
      ...firstNameTemplate,
      line: 2,
      start: 0,
      end: 30
    }].map(createFieldParser);

    const TD1 = formats.TD1;
    function parseTD1(lines, options) {
      if (lines.length !== 3) {
        throw new Error(`invalid number of lines: ${lines.length}: Must be 3 for ${TD1}`);
      }
      lines.forEach((line, index) => {
        if (line.length !== 30) {
          throw new Error(`invalid number of characters for line ${index + 1}: ${line.length}. Must be 30 for ${TD1}`);
        }
      });
      return getResult(TD1, lines, TD1Fields, options);
    }

    var TD2Fields = [{
      ...documentCodeTemplate,
      line: 0,
      start: 0,
      end: 2,
      parser: parseDocumentCodeId
    }, {
      ...issuingStateTemplate,
      line: 0,
      start: 2,
      end: 5
    }, {
      ...lastNameTemplate,
      line: 0,
      start: 5,
      end: 36
    }, {
      ...firstNameTemplate,
      line: 0,
      start: 5,
      end: 36
    }, {
      ...documentNumberTemplate,
      line: 1,
      start: 0,
      end: 9,
      related: [{
        line: 1,
        start: 9,
        end: 10
      }, {
        line: 1,
        start: 28,
        end: 35
      }]
    }, {
      ...documentNumberCheckDigitTemplate,
      line: 1,
      start: 9,
      end: 10,
      related: [{
        line: 1,
        start: 0,
        end: 9
      }, {
        line: 1,
        start: 28,
        end: 35
      }]
    }, {
      ...nationalityTemplate,
      line: 1,
      start: 10,
      end: 13
    }, {
      ...birthDateTemplate,
      line: 1,
      start: 13,
      end: 19
    }, {
      ...birthDateCheckDigitTemplate,
      line: 1,
      start: 19,
      end: 20,
      related: [{
        line: 1,
        start: 13,
        end: 19
      }]
    }, {
      ...sexTemplate,
      line: 1,
      start: 20,
      end: 21
    }, {
      ...expirationDateTemplate,
      line: 1,
      start: 21,
      end: 27
    }, {
      ...expirationDateCheckDigitTemplate,
      line: 1,
      start: 27,
      end: 28,
      related: [{
        line: 1,
        start: 21,
        end: 27
      }]
    }, {
      label: 'Optional field',
      field: 'optional',
      line: 1,
      start: 28,
      end: 35,
      parser: parseOptional
    }, {
      ...compositeCheckDigitTemplate,
      line: 1,
      start: 35,
      end: 36,
      related: [{
        line: 1,
        start: 0,
        end: 10
      }, {
        line: 1,
        start: 13,
        end: 20
      }, {
        line: 1,
        start: 21,
        end: 35
      }]
    }].map(createFieldParser);

    const TD2 = formats.TD2;
    function parseTD2(lines, options) {
      if (lines.length !== 2) {
        throw new Error(`invalid number of lines: ${lines.length}: Must be 2 for ${TD2}`);
      }
      lines.forEach((line, index) => {
        if (line.length !== 36) {
          throw new Error(`invalid number of characters for line ${index + 1}: ${line.length}. Must be 36 for TD2`);
        }
      });
      return getResult(TD2, lines, TD2Fields, options);
    }

    function parseDocumentCodePassport(source) {
      const first = source.charAt(0);
      if (first !== 'P') {
        throw new Error(`invalid document code: ${source}. First character must be P`);
      }
      const second = source.charAt(1);
      if (!second.match(/[A-Z<]/)) {
        throw new Error(`invalid document code: ${source}. Second character must be a letter or <`);
      }
      if (second === '<') {
        return {
          value: first,
          start: 0,
          end: 1
        };
      } else {
        return source;
      }
    }

    function parsePersonalNumber(source) {
      const value = parseText(source, /^[A-Z0-9<]+<*$/);
      return {
        value,
        start: 0,
        end: value.length
      };
    }

    function parsePersonalNumberCheckDigit(checkDigit, personalNumber) {
      const cleanNumber = cleanText(personalNumber);
      if (cleanNumber === '') {
        if (checkDigit !== '<' && checkDigit !== '0') {
          throw new Error(`invalid check digit ${checkDigit}: must be 0 or <`);
        } else {
          return checkDigit;
        }
      }
      check(personalNumber, checkDigit);
      return checkDigit;
    }

    var TD3Fields = [{
      ...documentCodeTemplate,
      line: 0,
      start: 0,
      end: 2,
      parser: parseDocumentCodePassport
    }, {
      ...issuingStateTemplate,
      line: 0,
      start: 2,
      end: 5
    }, {
      ...lastNameTemplate,
      line: 0,
      start: 5,
      end: 44
    }, {
      ...firstNameTemplate,
      line: 0,
      start: 5,
      end: 44
    }, {
      ...documentNumberTemplate,
      line: 1,
      start: 0,
      end: 9
    }, {
      ...documentNumberCheckDigitTemplate,
      line: 1,
      start: 9,
      end: 10,
      related: [{
        line: 1,
        start: 0,
        end: 9
      }]
    }, {
      ...nationalityTemplate,
      line: 1,
      start: 10,
      end: 13
    }, {
      ...birthDateTemplate,
      line: 1,
      start: 13,
      end: 19
    }, {
      ...birthDateCheckDigitTemplate,
      line: 1,
      start: 19,
      end: 20,
      related: [{
        line: 1,
        start: 13,
        end: 19
      }]
    }, {
      ...sexTemplate,
      line: 1,
      start: 20,
      end: 21
    }, {
      ...expirationDateTemplate,
      line: 1,
      start: 21,
      end: 27
    }, {
      ...expirationDateCheckDigitTemplate,
      line: 1,
      start: 27,
      end: 28,
      related: [{
        line: 1,
        start: 21,
        end: 27
      }]
    }, {
      label: 'Personal number',
      field: 'personalNumber',
      line: 1,
      start: 28,
      end: 42,
      parser: parsePersonalNumber
    }, {
      label: 'Personal number check digit',
      field: 'personalNumberCheckDigit',
      line: 1,
      start: 42,
      end: 43,
      related: [{
        line: 1,
        start: 28,
        end: 42
      }],
      parser: parsePersonalNumberCheckDigit
    }, {
      ...compositeCheckDigitTemplate,
      line: 1,
      start: 43,
      end: 44,
      related: [{
        line: 1,
        start: 0,
        end: 10
      }, {
        line: 1,
        start: 13,
        end: 20
      }, {
        line: 1,
        start: 21,
        end: 43
      }]
    }].map(createFieldParser);

    const TD3 = formats.TD3;
    function parseTD3(lines, options) {
      if (lines.length !== 2) {
        throw new Error(`invalid number of lines: ${lines.length}: Must be 2 for ${TD3}`);
      }
      lines.forEach((line, index) => {
        if (line.length !== 44) {
          throw new Error(`invalid number of characters for line ${index + 1}: ${line.length}. Must be 44 for TD3`);
        }
      });
      return getResult(TD3, lines, TD3Fields, options);
    }

    const parsers = {
      td1: parseTD1,
      td2: parseTD2,
      td3: parseTD3,
      swissDrivingLicense: parseSwissDrivingLicense,
      frenchNationalId: parseFrenchNationalId
    };

    function parseMRZ(inputLines) {
      let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      const lines = checkLines(inputLines);
      switch (lines.length) {
        case 2:
        case 3:
          {
            switch (lines[0].length) {
              case 30:
                return parsers.td1(lines, options);
              case 36:
                {
                  const endLine1 = lines[0].substring(30, 66);
                  if (endLine1.match(/[0-9]/)) {
                    return parsers.frenchNationalId(lines, options);
                  } else {
                    return parsers.td2(lines, options);
                  }
                }
              case 44:
                return parsers.td3(lines, options);
              case 9:
                return parsers.swissDrivingLicense(lines, options);
              default:
                throw new Error(`unrecognized document format. First line of input must have 30 (TD1), 36 (TD2 or French National Id), 44 (TD3) or 9 (Swiss Driving License) characters and it has a length of ${lines[0].length}`);
            }
          }
        default:
          if ((lines.length === 1) && (lines[0].length === 30) && lines[0].charAt(0) === 'D') {
            // Driving license case
          } else {
            throw new Error(`unrecognized document format. Input must have two or three lines, found ${lines.length}`);
          }
      }
    }

    exports.formats = formats;
    exports.parse = parseMRZ;
    exports.states = STATES;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=mrz.js.map
