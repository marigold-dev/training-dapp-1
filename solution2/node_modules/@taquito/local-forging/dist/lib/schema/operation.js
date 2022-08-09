"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemaDecoder = exports.schemaEncoder = exports.operationDecoder = exports.operationEncoder = exports.RegisterGlobalConstantSchema = exports.ProposalsSchema = exports.SeedNonceRevelationSchema = exports.EndorsementSchema = exports.BallotSchema = exports.OriginationSchema = exports.TransactionSchema = exports.DelegationSchema = exports.RevealSchema = exports.ActivationSchema = exports.ManagerOperationSchema = void 0;
const constants_1 = require("../constants");
const utils_1 = require("@taquito/utils");
const error_1 = require("../error");
exports.ManagerOperationSchema = {
    branch: constants_1.CODEC.BRANCH,
    contents: [constants_1.CODEC.OPERATION],
};
exports.ActivationSchema = {
    pkh: constants_1.CODEC.TZ1,
    secret: constants_1.CODEC.SECRET,
};
exports.RevealSchema = {
    source: constants_1.CODEC.PKH,
    fee: constants_1.CODEC.ZARITH,
    counter: constants_1.CODEC.ZARITH,
    gas_limit: constants_1.CODEC.ZARITH,
    storage_limit: constants_1.CODEC.ZARITH,
    public_key: constants_1.CODEC.PUBLIC_KEY,
};
exports.DelegationSchema = {
    source: constants_1.CODEC.PKH,
    fee: constants_1.CODEC.ZARITH,
    counter: constants_1.CODEC.ZARITH,
    gas_limit: constants_1.CODEC.ZARITH,
    storage_limit: constants_1.CODEC.ZARITH,
    delegate: constants_1.CODEC.DELEGATE,
};
exports.TransactionSchema = {
    source: constants_1.CODEC.PKH,
    fee: constants_1.CODEC.ZARITH,
    counter: constants_1.CODEC.ZARITH,
    gas_limit: constants_1.CODEC.ZARITH,
    storage_limit: constants_1.CODEC.ZARITH,
    amount: constants_1.CODEC.ZARITH,
    destination: constants_1.CODEC.ADDRESS,
    parameters: constants_1.CODEC.PARAMETERS,
};
exports.OriginationSchema = {
    source: constants_1.CODEC.PKH,
    fee: constants_1.CODEC.ZARITH,
    counter: constants_1.CODEC.ZARITH,
    gas_limit: constants_1.CODEC.ZARITH,
    storage_limit: constants_1.CODEC.ZARITH,
    balance: constants_1.CODEC.ZARITH,
    delegate: constants_1.CODEC.DELEGATE,
    script: constants_1.CODEC.SCRIPT,
};
exports.BallotSchema = {
    source: constants_1.CODEC.PKH,
    period: constants_1.CODEC.INT32,
    proposal: constants_1.CODEC.PROPOSAL,
    ballot: constants_1.CODEC.BALLOT_STATEMENT,
};
exports.EndorsementSchema = {
    slot: constants_1.CODEC.INT16,
    level: constants_1.CODEC.INT32,
    round: constants_1.CODEC.INT32,
    block_payload_hash: constants_1.CODEC.BLOCK_PAYLOAD_HASH,
};
exports.SeedNonceRevelationSchema = {
    level: constants_1.CODEC.INT32,
    nonce: constants_1.CODEC.RAW,
};
exports.ProposalsSchema = {
    source: constants_1.CODEC.PKH,
    period: constants_1.CODEC.INT32,
    proposals: constants_1.CODEC.PROPOSAL_ARR,
};
exports.RegisterGlobalConstantSchema = {
    source: constants_1.CODEC.PKH,
    fee: constants_1.CODEC.ZARITH,
    counter: constants_1.CODEC.ZARITH,
    gas_limit: constants_1.CODEC.ZARITH,
    storage_limit: constants_1.CODEC.ZARITH,
    value: constants_1.CODEC.VALUE,
};
const operationEncoder = (encoders) => (operation) => {
    if (!(operation.kind in encoders) || !(operation.kind in constants_1.kindMappingReverse)) {
        throw new utils_1.InvalidOperationKindError(operation.kind);
    }
    return constants_1.kindMappingReverse[operation.kind] + encoders[operation.kind](operation);
};
exports.operationEncoder = operationEncoder;
const operationDecoder = (decoders) => (value) => {
    const op = value.consume(1);
    const operationName = constants_1.kindMapping[op[0]];
    if (operationName === undefined) {
        throw new error_1.UnsupportedOperationError(op[0].toString());
    }
    const decodedObj = decoders[operationName](value);
    if (typeof decodedObj !== 'object') {
        throw new error_1.OperationDecodingError('Decoded invalid operation');
    }
    return Object.assign({ kind: operationName }, decodedObj);
};
exports.operationDecoder = operationDecoder;
const schemaEncoder = (encoders) => (schema) => (value) => {
    const keys = Object.keys(schema);
    return keys.reduce((prev, key) => {
        const valueToEncode = schema[key];
        if (value && Array.isArray(valueToEncode)) {
            const encoder = encoders[valueToEncode[0]];
            const values = value[key];
            if (!Array.isArray(values)) {
                throw new error_1.OperationEncodingError(`Expected value to be Array ${JSON.stringify(values)}`);
            }
            return prev + values.reduce((prevBytes, current) => prevBytes + encoder(current), '');
        }
        else {
            const encoder = encoders[valueToEncode];
            return prev + encoder(value[key]);
        }
    }, '');
};
exports.schemaEncoder = schemaEncoder;
const schemaDecoder = (decoders) => (schema) => (value) => {
    const keys = Object.keys(schema);
    return keys.reduce((prev, key) => {
        const valueToEncode = schema[key];
        if (Array.isArray(valueToEncode)) {
            const decoder = decoders[valueToEncode[0]];
            const decoded = [];
            const lastLength = value.length();
            while (value.length() > 0) {
                decoded.push(decoder(value));
                if (lastLength === value.length()) {
                    throw new error_1.OperationDecodingError('Unable to decode value');
                }
            }
            return Object.assign(Object.assign({}, prev), { [key]: decoded });
        }
        else {
            const decoder = decoders[valueToEncode];
            const result = decoder(value);
            if (typeof result !== 'undefined') {
                return Object.assign(Object.assign({}, prev), { [key]: result });
            }
            else {
                return Object.assign({}, prev);
            }
        }
    }, {});
};
exports.schemaDecoder = schemaDecoder;
//# sourceMappingURL=operation.js.map