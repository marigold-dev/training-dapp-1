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
exports.RpcTzProvider = void 0;
const operation_emitter_1 = require("../operations/operation-emitter");
const operations_1 = require("../operations/operations");
const rpc_1 = require("@taquito/rpc");
const utils_1 = require("@taquito/utils");
class RpcTzProvider extends operation_emitter_1.OperationEmitter {
    constructor(context) {
        super(context);
    }
    getBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.validateAddress(address) !== utils_1.ValidationResult.VALID) {
                throw new utils_1.InvalidAddressError(address);
            }
            return this.context.readProvider.getBalance(address, 'head');
        });
    }
    getDelegate(address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.validateAddress(address) !== utils_1.ValidationResult.VALID) {
                throw new utils_1.InvalidAddressError(address);
            }
            return this.context.readProvider.getDelegate(address, 'head');
        });
    }
    activate(pkh, secret) {
        return __awaiter(this, void 0, void 0, function* () {
            if (utils_1.validateKeyHash(pkh) !== utils_1.ValidationResult.VALID) {
                throw new utils_1.InvalidKeyHashError(pkh);
            }
            const operation = {
                kind: rpc_1.OpKind.ACTIVATION,
                pkh,
                secret,
            };
            const prepared = yield this.prepareOperation({ operation: [operation], source: pkh });
            const forgedBytes = yield this.forge(prepared);
            const bytes = `${forgedBytes.opbytes}00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000`;
            return new operations_1.Operation(yield this.rpc.injectOperation(bytes), Object.assign(Object.assign({}, forgedBytes), { opbytes: bytes }), [], this.context.clone());
        });
    }
}
exports.RpcTzProvider = RpcTzProvider;
//# sourceMappingURL=rpc-tz-provider.js.map