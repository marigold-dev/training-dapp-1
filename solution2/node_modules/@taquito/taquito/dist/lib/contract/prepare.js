"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTxRollupBatchOperation = exports.createTxRollupOriginationOperation = exports.createRegisterGlobalConstantOperation = exports.createRevealOperation = exports.createRegisterDelegateOperation = exports.createSetDelegateOperation = exports.createTransferOperation = exports.createOriginationOperation = void 0;
const michelson_encoder_1 = require("@taquito/michelson-encoder");
const rpc_1 = require("@taquito/rpc");
const constants_1 = require("../constants");
const format_1 = require("../format");
const errors_1 = require("./errors");
const createOriginationOperation = ({ code, init, balance = '0', delegate, storage, fee = constants_1.DEFAULT_FEE.ORIGINATION, gasLimit = constants_1.DEFAULT_GAS_LIMIT.ORIGINATION, storageLimit = constants_1.DEFAULT_STORAGE_LIMIT.ORIGINATION, mutez = false, }) => __awaiter(void 0, void 0, void 0, function* () {
    if (storage !== undefined && init !== undefined) {
        throw new errors_1.OriginationParameterError('Storage and Init cannot be set a the same time. Please either use storage or init but not both.');
    }
    if (!Array.isArray(code)) {
        throw new errors_1.InvalidCodeParameter('Wrong code parameter type, expected an array', code);
    }
    let contractStorage;
    if (storage !== undefined) {
        const storageType = code.find((p) => 'prim' in p && p.prim === 'storage');
        if ((storageType === null || storageType === void 0 ? void 0 : storageType.args) === undefined) {
            throw new errors_1.InvalidCodeParameter('The storage section is missing from the script', code);
        }
        const schema = new michelson_encoder_1.Schema(storageType.args[0]); // TODO
        contractStorage = schema.Encode(storage);
    }
    else if (init !== undefined && typeof init === 'object') {
        contractStorage = init;
    }
    else {
        throw new errors_1.InvalidInitParameter('Wrong init parameter type, expected JSON Michelson', init);
    }
    const script = {
        code,
        storage: contractStorage,
    };
    const operation = {
        kind: rpc_1.OpKind.ORIGINATION,
        fee,
        gas_limit: gasLimit,
        storage_limit: storageLimit,
        balance: mutez ? balance.toString() : format_1.format('tz', 'mutez', balance).toString(),
        script,
    };
    if (delegate) {
        operation.delegate = delegate;
    }
    return operation;
});
exports.createOriginationOperation = createOriginationOperation;
const createTransferOperation = ({ to, amount, parameter, fee = constants_1.DEFAULT_FEE.TRANSFER, gasLimit = constants_1.DEFAULT_GAS_LIMIT.TRANSFER, storageLimit = constants_1.DEFAULT_STORAGE_LIMIT.TRANSFER, mutez = false, }) => __awaiter(void 0, void 0, void 0, function* () {
    const operation = {
        kind: rpc_1.OpKind.TRANSACTION,
        fee,
        gas_limit: gasLimit,
        storage_limit: storageLimit,
        amount: mutez ? amount.toString() : format_1.format('tz', 'mutez', amount).toString(),
        destination: to,
        parameters: parameter,
    };
    return operation;
});
exports.createTransferOperation = createTransferOperation;
const createSetDelegateOperation = ({ delegate, source, fee = constants_1.DEFAULT_FEE.DELEGATION, gasLimit = constants_1.DEFAULT_GAS_LIMIT.DELEGATION, storageLimit = constants_1.DEFAULT_STORAGE_LIMIT.DELEGATION, }) => __awaiter(void 0, void 0, void 0, function* () {
    const operation = {
        kind: rpc_1.OpKind.DELEGATION,
        source,
        fee,
        gas_limit: gasLimit,
        storage_limit: storageLimit,
        delegate,
    };
    return operation;
});
exports.createSetDelegateOperation = createSetDelegateOperation;
const createRegisterDelegateOperation = ({ fee = constants_1.DEFAULT_FEE.DELEGATION, gasLimit = constants_1.DEFAULT_GAS_LIMIT.DELEGATION, storageLimit = constants_1.DEFAULT_STORAGE_LIMIT.DELEGATION, }, source) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        kind: rpc_1.OpKind.DELEGATION,
        fee,
        gas_limit: gasLimit,
        storage_limit: storageLimit,
        delegate: source,
    };
});
exports.createRegisterDelegateOperation = createRegisterDelegateOperation;
const createRevealOperation = ({ fee = constants_1.DEFAULT_FEE.REVEAL, gasLimit = constants_1.DEFAULT_GAS_LIMIT.REVEAL, storageLimit = constants_1.DEFAULT_STORAGE_LIMIT.REVEAL, }, source, publicKey) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        kind: rpc_1.OpKind.REVEAL,
        fee,
        public_key: publicKey,
        source,
        gas_limit: gasLimit,
        storage_limit: storageLimit,
    };
});
exports.createRevealOperation = createRevealOperation;
const createRegisterGlobalConstantOperation = ({ value, source, fee, gasLimit, storageLimit, }) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        kind: rpc_1.OpKind.REGISTER_GLOBAL_CONSTANT,
        value,
        fee,
        gas_limit: gasLimit,
        storage_limit: storageLimit,
        source,
    };
});
exports.createRegisterGlobalConstantOperation = createRegisterGlobalConstantOperation;
const createTxRollupOriginationOperation = ({ source, fee, gasLimit, storageLimit, }) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        kind: rpc_1.OpKind.TX_ROLLUP_ORIGINATION,
        fee,
        gas_limit: gasLimit,
        storage_limit: storageLimit,
        source,
        tx_rollup_origination: {},
    };
});
exports.createTxRollupOriginationOperation = createTxRollupOriginationOperation;
const createTxRollupBatchOperation = ({ content, rollup, source, fee, gasLimit, storageLimit, }) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        kind: rpc_1.OpKind.TX_ROLLUP_SUBMIT_BATCH,
        fee,
        gas_limit: gasLimit,
        storage_limit: storageLimit,
        source,
        content,
        rollup,
    };
});
exports.createTxRollupBatchOperation = createTxRollupBatchOperation;
//# sourceMappingURL=prepare.js.map