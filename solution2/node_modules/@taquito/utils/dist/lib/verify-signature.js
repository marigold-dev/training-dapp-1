"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePkAndExtractPrefix = exports.verifySignature = void 0;
const ed25519_1 = require("@stablelib/ed25519");
const blake2b_1 = require("@stablelib/blake2b");
const taquito_utils_1 = require("./taquito-utils");
const elliptic_1 = require("elliptic");
const typedarray_to_buffer_1 = require("typedarray-to-buffer");
const errors_1 = require("./errors");
/**
 * @description Verify signature of a payload
 *
 * @param messageBytes The forged message including the magic byte (11 for block,
 *        12 for preendorsement, 13 for endorsement, 3 for generic, 5 for the PACK format of michelson)
 * @param publicKey The public key to verify the signature against
 * @param signature The signature to verify
 * @returns A boolean indicating if the signature matches
 *
 * @example
 * ```
 * const message = '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
 * const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
 * const sig = 'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx'
 *
 * const response = verifySignature(message, pk, sig);
 * ```
 *
 */
function verifySignature(messageBytes, publicKey, signature) {
    const pkPrefix = validatePkAndExtractPrefix(publicKey);
    const sigPrefix = validateSigAndExtractPrefix(signature);
    const decodedPublicKey = taquito_utils_1.b58cdecode(publicKey, taquito_utils_1.prefix[pkPrefix]);
    const decodedSig = taquito_utils_1.b58cdecode(signature, taquito_utils_1.prefix[sigPrefix]);
    const bytesHash = blake2b_1.hash(taquito_utils_1.hex2buf(validateMessageNotEmpty(messageBytes)), 32);
    if (pkPrefix === taquito_utils_1.Prefix.EDPK) {
        return verifyEdSignature(decodedSig, bytesHash, decodedPublicKey);
    }
    else if (pkPrefix === taquito_utils_1.Prefix.SPPK) {
        return verifySpSignature(decodedSig, bytesHash, decodedPublicKey);
    }
    else if (pkPrefix === taquito_utils_1.Prefix.P2PK) {
        return verifyP2Signature(decodedSig, bytesHash, decodedPublicKey);
    }
    else {
        return false;
    }
}
exports.verifySignature = verifySignature;
function validateMessageNotEmpty(message) {
    if (message === '') {
        throw new errors_1.InvalidMessageError(message, 'The message provided for verifying signature cannot be empty.');
    }
    return message;
}
function validatePkAndExtractPrefix(publicKey) {
    if (publicKey === '') {
        throw new errors_1.InvalidPublicKeyError(publicKey, 'Public key cannot be empty');
    }
    const pkPrefix = publicKey.substring(0, 4);
    const validation = taquito_utils_1.validatePublicKey(publicKey);
    if (validation !== taquito_utils_1.ValidationResult.VALID) {
        if (validation === taquito_utils_1.ValidationResult.INVALID_CHECKSUM) {
            throw new errors_1.InvalidPublicKeyError(publicKey, 'The public key provided has an invalid checksum');
        }
        else if (validation === taquito_utils_1.ValidationResult.INVALID_LENGTH) {
            throw new errors_1.InvalidPublicKeyError(publicKey, 'The public key provided has an invalid length');
        }
        else if (validation === taquito_utils_1.ValidationResult.NO_PREFIX_MATCHED) {
            throw new errors_1.InvalidPublicKeyError(publicKey, `The public key provided has an unsupported prefix: ${pkPrefix}`);
        }
    }
    return pkPrefix;
}
exports.validatePkAndExtractPrefix = validatePkAndExtractPrefix;
function validateSigAndExtractPrefix(signature) {
    const signaturePrefix = signature.startsWith('sig')
        ? signature.substr(0, 3)
        : signature.substr(0, 5);
    const validation = taquito_utils_1.validateSignature(signature);
    if (validation !== taquito_utils_1.ValidationResult.VALID) {
        if (validation === taquito_utils_1.ValidationResult.INVALID_CHECKSUM) {
            throw new errors_1.InvalidSignatureError(signature, `invalid checksum`);
        }
        else if (validation === taquito_utils_1.ValidationResult.INVALID_LENGTH) {
            throw new errors_1.InvalidSignatureError(signature, 'invalid length');
        }
        else if (validation === taquito_utils_1.ValidationResult.NO_PREFIX_MATCHED) {
            throw new errors_1.InvalidSignatureError(signaturePrefix, 'unsupported prefix');
        }
    }
    return signaturePrefix;
}
function verifyEdSignature(decodedSig, bytesHash, decodedPublicKey) {
    try {
        return ed25519_1.verify(decodedPublicKey, bytesHash, decodedSig);
    }
    catch (e) {
        return false;
    }
}
function verifySpSignature(decodedSig, bytesHash, decodedPublicKey) {
    const key = new elliptic_1.default.ec('secp256k1').keyFromPublic(decodedPublicKey);
    return verifySpOrP2Sig(decodedSig, bytesHash, key);
}
function verifyP2Signature(decodedSig, bytesHash, decodedPublicKey) {
    const key = new elliptic_1.default.ec('p256').keyFromPublic(decodedPublicKey);
    return verifySpOrP2Sig(decodedSig, bytesHash, key);
}
function verifySpOrP2Sig(decodedSig, bytesHash, key) {
    const hexSig = taquito_utils_1.buf2hex(typedarray_to_buffer_1.default(decodedSig));
    const match = hexSig.match(/([a-f\d]{64})/gi);
    if (match) {
        try {
            const [r, s] = match;
            return key.verify(bytesHash, { r, s });
        }
        catch (e) {
            return false;
        }
    }
    return false;
}
//# sourceMappingURL=verify-signature.js.map