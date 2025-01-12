function check(val, ref) {
    if (val === ref) {
        console.log("Error: " + val + " is " + ref);
        return -1;
    }
    return 0;
}

class OpenPace {
    /**
     * send EF.card access data and length.
     * openpace will parse the data and fetch OID and
     * parameterID to initialize PICC EAC context.
     */
    efCardAccess(data, length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            const buffer = Module._malloc(length);
            if (check (buffer, null) === -1)
                return -1;
            Module.HEAPU8.set(data, buffer);
            var ret = Module["_ef_cardaccess_parsing"](buffer, length);
            Module._free(buffer);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    getPaceParameterId() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            return Module["_Pace_get_parameter_id"](1);
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Collect generated mapping data from openpace.
    getCaEphemeralPubKey(length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var ca_ephemeral_pubKey = Module.cwrap('Ca_get_ephemeral_pubkey', 'number', [])
            var ptr_from_wasm = ca_ephemeral_pubKey(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }


    // Get CA algorithm.
    getCaAlgorithmId() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var algId = Module["_Ca_get_alg_id"](1);
            return algId;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Get CA OID.
    getCaOid() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var oid = Module["_Ca_get_oid"](1);
            return oid;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Set SSC for CA.
    setCaSsc() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var result = Module["_Ca_init_secure_channel"](1);
            return result;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }


    /**
     * Send secret CAN or PIN value, size, secret type, encrypt nonce and length.
     * openpace will generate secret key from given Secret value and initialize the EAC context.
     * openpace will decrypt the given encrypted nonce.
     * generate mapping data and send to the card.
     */
    initPace(secret, size, type, encnonce, length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            const bufferSecret = Module._malloc(size);
            if (check (bufferSecret, null) === -1)
                return -1;
            Module.HEAPU8.set(secret, bufferSecret);
            const bufferEncNonce = Module._malloc(length);
            if (check (bufferEncNonce, null) === -1)
                return -1;
            Module.HEAPU8.set(encnonce, bufferEncNonce);
            var ret = Module["_Pace_init"](bufferSecret, size, type, bufferEncNonce, length);
            Module._free(bufferSecret);
            Module._free(bufferEncNonce);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Collect generated mapping data from openpace.
    getPaceMapData(length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var bufferMappingData = Module.cwrap('Pace_get_mapping_data', 'number', [])
            var ptr_from_wasm = bufferMappingData(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Collect mapping generator value.
    getPaceMapGenerator(mapPiccData, length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            const bufferMapGeneratorData = Module._malloc(length);
            if (check (bufferMapGeneratorData, null) === -1)
                return -1;
            Module.HEAPU8.set(mapPiccData, bufferMapGeneratorData);
            var ret = Module["_Pace_generate_ephemeral_key"](bufferMapGeneratorData, length);
            Module._free(bufferMapGeneratorData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Collect ephemeral pubKey from openpace.
    getPaceEphemeralPubKeyPcdData(length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var bufferEphemeralPubKey = Module.cwrap('Pace_get_ephemeral_key', 'number', [])
            var ptr_from_wasm = bufferEphemeralPubKey(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Compute shared secret.
    computeSharedSecret(sharedSecret, length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            const bufferSharedSecretData = Module._malloc(length);
            if (check (bufferSharedSecretData, null) === -1)
                return -1;
            Module.HEAPU8.set(sharedSecret, bufferSharedSecretData);
            var ret = Module["_Pace_compute_authentication_token"](bufferSharedSecretData, length);
            Module._free(bufferSharedSecretData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    doPaceCam(aic, efCardSecurity) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            const bufferAicData = Module._malloc(aic.length);
            if (check (bufferAicData, null) === -1)
                return -1;
            Module.HEAPU8.set(aic, bufferAicData);
            const bufferEfCardSecurityData = Module._malloc(efCardSecurity.length);
            if (check (bufferEfCardSecurityData, null) === -1)
                return -1;
            Module.HEAPU8.set(efCardSecurity, bufferEfCardSecurityData);
            var ret = Module["_Pace_perform_paceCam"](bufferAicData, aic.length, bufferEfCardSecurityData, efCardSecurity.length)
            Module._free(bufferAicData);
            Module._free(bufferEfCardSecurityData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    doPassiveAuthentication(efSodBuffer, cscaCertBuffer, dsCertBuffer) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            this.startTime = new Date().getTime();
            var bufferEfSodData, bufferCscaCertData, bufferDsCertData;
            var bufferEfSodLength = 0, bufferCscaCertLength = 0, bufferDsCertLength = 0;

            if (efSodBuffer != null) {
                bufferEfSodLength = efSodBuffer.length;
                bufferEfSodData = Module._malloc(bufferEfSodLength);
                if (check (bufferEfSodData, null) === -1)
                    return -1;
                Module.HEAPU8.set(efSodBuffer, bufferEfSodData);
            }
            if (cscaCertBuffer != null) {
                bufferCscaCertLength = cscaCertBuffer.length;
                bufferCscaCertData = Module._malloc(bufferCscaCertLength);
                if (check (bufferCscaCertData, null) === -1)
                    return -1;
                Module.HEAPU8.set(cscaCertBuffer, bufferCscaCertData);
            }
            if (dsCertBuffer != null) {
                bufferDsCertLength = dsCertBuffer.length;
                bufferDsCertData = Module._malloc(bufferDsCertLength);
                if (check (bufferDsCertData, null) === -1)
                    return -1;
                Module.HEAPU8.set(dsCertBuffer, bufferDsCertData);
            }
            var ret = Module["_Pa_perform_passive_auth"](bufferEfSodData, bufferEfSodLength,
                                                     bufferCscaCertData, bufferCscaCertLength,
                                                     bufferDsCertData, bufferDsCertLength);
            Module._free(bufferEfSodData);
            Module._free(bufferCscaCertData);
            Module._free(bufferDsCertData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    doHashVerification(dsData, dgNum) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            const bufferDgData = Module._malloc(dsData.length);
            if (check (bufferDgData, null) === -1)
                return -1;
            Module.HEAPU8.set(dsData, bufferDgData);
            var ret = Module["_Pa_verify_hash"](bufferDgData, dsData.length, dgNum);
            Module._free(bufferDgData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    /*
     * Perform chip authentication data
     */
    doChipAuthentication(data, length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            const buffer = Module._malloc(length);
            if (check (buffer, null) === -1)
                return -1;
            Module.HEAPU8.set(data, buffer);
            var ret = Module["_Perform_Chip_Auth"](buffer, length);
            Module._free(buffer);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    doPsoVerifyCertificate (certBuffer, certId) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var bufferCertData, bufferCertLength;
            if (certBuffer != null) {
                bufferCertLength = certBuffer.length;
                bufferCertData = Module._malloc(bufferCertLength);
                if (check (bufferCertData, null) === -1)
                    return -1;
                Module.HEAPU8.set(certBuffer, bufferCertData);
            }
            var ret = Module["_Ta_perform_pso_verify_certificate"](bufferCertData, bufferCertLength, certId);
            Module._free(bufferCertData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    getcvcBodyLength() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var cvcBodyLength = Module["_Ta_get_cvc_body_length"](1);
            return cvcBodyLength;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    getcvcsignatureLength() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var cvcsignatureLength = Module["_Ta_get_cvc_signature_length"](1);
            return cvcsignatureLength;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    getcvcChrLength() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var cvcchrLength = Module["_Ta_get_cvc_chr_length"](1);
            return cvcchrLength;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    getTaSignedDataLength () {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var signedDataLength = Module["_Ta_get_signed_data_Length"](1);
            console.log("signedDataLength ", signedDataLength);
            return signedDataLength;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    getCvcBody (length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var buffercvcBodyData = Module.cwrap('Ta_get_cvc_body', 'number', []);
            var ptr_from_wasm = buffercvcBodyData(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    getCvcSignature (length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var bufferCvcSignatureData = Module.cwrap('Ta_get_cvc_signature', 'number', []);
            var ptr_from_wasm = bufferCvcSignatureData(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    getCvcChr (length){
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var bufferCvcChrData = Module.cwrap('Ta_get_cvc_chr', 'number', []);
            var ptr_from_wasm = bufferCvcChrData(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    taSignData (pksc_cert, nonceBuffer, is_cert) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var bufferPkscData, bufferPkscLength,bufferNonceData, bufferNonceLength, bufferIsData, bufferIsLength;
            if (pksc_cert != null) {
                bufferPkscLength = pksc_cert.length;
                bufferPkscData = Module._malloc(bufferPkscLength);
                if (check (bufferPkscData, null) === -1)
                    return -1;
                Module.HEAPU8.set(pksc_cert, bufferPkscData);    
            }
            if (nonceBuffer != null) {
                bufferNonceLength = nonceBuffer.length;
                bufferNonceData = Module._malloc(bufferNonceLength);
                if (check (bufferNonceData, null) === -1)
                    return -1;
                Module.HEAPU8.set(nonceBuffer, bufferNonceData);
            }
            if (is_cert != null) {
                bufferIsLength = is_cert.length;
                bufferIsData = Module._malloc(bufferIsLength);
                if (check (bufferIsData, null) === -1)
                    return -1;
                Module.HEAPU8.set(is_cert, bufferIsData);
            }
            var ret = Module["_Ta_sign_data"](bufferPkscData, bufferPkscLength,
                                              bufferNonceData, bufferNonceLength,
                                              bufferIsData, bufferIsLength
                                             );
            Module._free(bufferPkscData);
            Module._free(bufferNonceData);
            Module._free(bufferIsData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }   
    }

    getTaSignedData (length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var bufferSignedData = Module.cwrap('Ta_get_signed_data', 'number', []);
            var ptr_from_wasm = bufferSignedData(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Generate random from IFD
    getIfdRnd() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var length = 8;
            var bufferIfdRndeData = Module.cwrap('Get_ifd_rnd', 'number', []);
            var ptr_from_wasm = bufferIfdRndeData(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Check if AA - ECDSA is required
    getAaEcdsaStatus() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var bufferDg15Data, bufferDg15Length;
           if (dg15Data != null) {
               bufferDg15Length = dg15Data.length;
               bufferDg15Data = Module._malloc(bufferDg15Length);
               if (check (bufferDg15Data, null) === -1)
                   return -1;
               Module.HEAPU8.set(dg15Data, bufferDg15Data);
           }
           var ret = Module["_Aa_get_ecdsa_status"](bufferDg15Data, bufferDg15Length);
           Module._free(bufferDg15Data);
           return ret;
       } catch (e) {
           console.log(e);
           return -1;
       }
    }

    // Perform ActiveAuth.
    performActiveAuth(dg14Data, dg15Data, SignedData) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var bufferDg14Data, bufferDg15Data, bufferSignedData, bufferDg14Length = 0, bufferDg15Length, bufferSignedLength;
            if (dg14Data != null) {
                bufferDg14Length = dg14Data.length;
                bufferDg14Data = Module._malloc(bufferDg14Length);
                if (check (bufferDg14Data, null) === -1)
                    return -1;
                Module.HEAPU8.set(dg14Data, bufferDg14Data);
            }
            if (dg15Data != null) {
                bufferDg15Length = dg15Data.length;
                bufferDg15Data = Module._malloc(bufferDg15Length);
                if (check (bufferDg15Data, null) === -1)
                    return -1;
                Module.HEAPU8.set(dg15Data, bufferDg15Data);
            }
            if (SignedData != null) {
                bufferSignedLength = SignedData.length;
                bufferSignedData = Module._malloc(bufferSignedLength);
                if (check (bufferSignedData, null) === -1)
                    return -1;
                Module.HEAPU8.set(SignedData, bufferSignedData);
            }
            var ret = Module["_Perform_Active_auth"](bufferDg14Data, bufferDg14Length,
                                                        bufferDg15Data, bufferDg15Length,
                                                        bufferSignedData, bufferSignedLength);
            Module._free(bufferDg14Data);
            Module._free(bufferDg15Data);
            Module._free(bufferSignedData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Collect mutual authenticate token.
    getPaceAuthenticateToken(length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var token = Module.cwrap('Pace_get_authenticate_token', 'number', [])
            var ptr_from_wasm = token(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Openpace will encrypt the given buffer and length.
    encrypt(plainData, length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            const bufferPlainData = Module._malloc(length);
            if (check (bufferPlainData, null) === -1)
                return -1;
            Module.HEAPU8.set(plainData, bufferPlainData);
            var ret = Module["_Eac_encrypt"](bufferPlainData, length);
            Module._free(bufferPlainData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Collect encrypted data.
    getPaceEncryptedData(length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var bufferEncBuffer = Module.cwrap('Eac_get_encrypted_data', 'number', [])
            var ptr_from_wasm = bufferEncBuffer(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Authenticate the given buffer.
    authenticate(plainData, length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            const bufferPlainData = Module._malloc(length);
            if (check (bufferPlainData, null) === -1)
                return -1;
            Module.HEAPU8.set(plainData, bufferPlainData);
            var ret = Module["_Eac_authenticate"](bufferPlainData, length);
            Module._free(bufferPlainData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Collect authenticated data.
    getAuthenticatedData(length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var authenticatedBuffer = Module.cwrap('Eac_get_mac_data', 'number', [])
            var ptr_from_wasm = authenticatedBuffer(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Add padding to given buffer
    addPadding(plainData, length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            const bufferPlainData = Module._malloc(length);
            if (check (bufferPlainData, null) === -1)
                return -1;
            Module.HEAPU8.set(plainData, bufferPlainData);
            var ret = Module["_Eac_addpad"](bufferPlainData, length);
            Module._free(bufferPlainData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Collect padded buffer from openpace.
    getPaddedData(length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var bufferPaddedData = Module.cwrap('Eac_padded_data', 'number', [])
            var ptr_from_wasm = bufferPaddedData(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Decrypt the given buffer.
    decrypt(encryptedData, length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            const bufferEncryptedData = Module._malloc(length);
            if (check (bufferEncryptedData, null) === -1)
                return -1;
            Module.HEAPU8.set(encryptedData, bufferEncryptedData);
            var ret = Module["_Eac_decrypt"](bufferEncryptedData, length);
            Module._free(bufferEncryptedData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Collect decrypted buffer.
    getDecryptedData(length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var bufferDecryptedData = Module.cwrap('Eac_get_decrypted_data', 'number', []);
            var ptr_from_wasm = bufferDecryptedData(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Input values are no longer used,
    // It is automatically incremented by openpace.
    incrementSsc(value) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var ret = Module["_Eac_increment_ssc"](value);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Initialize BAC 
    initBac() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var ret = Module["_Bac_init"](1);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Get challenge for the given buffer.
    getChallenge(encryptedData, length, secret, size, auth) {
        try {
            const AUTH_BAC_ID = 1;
            const AUTH_BAP_ID = 2;
            var authId = (auth == AUTH_BAP) ? AUTH_BAP_ID : AUTH_BAC_ID;
            if (check (Module, undefined) === -1)
                return -1;
            const bufferData = Module._malloc(length);
            if (check (bufferData, null) === -1)
                return -1;
            Module.HEAPU8.set(encryptedData, bufferData);
            const mrzData = Module._malloc(size);
            if (check (mrzData, null) === -1)
                return -1;
            Module.HEAPU8.set(secret, mrzData);
            var ret = Module["_Bac_get_challenge"](bufferData, length, mrzData, size, authId);
            Module._free(bufferData);
            Module._free(mrzData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Collect external authenticate buffer.
    getExternalAuthenticateData(length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var bufferExternalAuthenticateData = Module.cwrap('Bac_get_ext_auth_command_data', 'number', []);
            var ptr_from_wasm = bufferExternalAuthenticateData(length);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + length);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Decrypt cryptogram in the given buffer.
    decryptCryptogram(encryptedData, length) {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            const bufferEncryptedData = Module._malloc(length);
            if (check (bufferEncryptedData, null) === -1)
                return -1;
            Module.HEAPU8.set(encryptedData, bufferEncryptedData);
            var ret = Module["_Bac_verify_and_decrypt_cryptogram"](bufferEncryptedData, length);
            Module._free(bufferEncryptedData);
            return ret;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Get PACE OID.
    getPaceOid() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var algorithm = Module["_Pace_get_oid"](1);
            return algorithm;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Get PACE algorithm.
    getPaceMappingId() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var algorithm = Module["_Pace_get_mapping_id"](1);
            return algorithm;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Get OpenPACE version.
    getOpenpaceVersion() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            var ret = Module.cwrap('Eac_openPACE_version', 'number', []);
            var ptr_from_wasm = ret(5);
            var js_array = Module.HEAPU8.subarray(ptr_from_wasm, ptr_from_wasm + 5);
            return js_array;
        } catch (e) {
            console.log(e);
            return -1;
        }
    }

    // Cleanup memory of openpace library.
    cleanup() {
        try {
            if (check (Module, undefined) === -1)
                return -1;
            Module["_Eac_deinit"](1);
            return util.reloadOpenPaceModule();
        } catch (e) {
            console.log(e);
            return -1;
        }
    }
}
