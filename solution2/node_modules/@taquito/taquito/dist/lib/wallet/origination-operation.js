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
exports.OriginationWalletOperation = void 0;
const rpc_1 = require("@taquito/rpc");
const types_1 = require("../operations/types");
const operation_1 = require("./operation");
class OriginationWalletOperation extends operation_1.WalletOperation {
    constructor(opHash, context, newHead$) {
        super(opHash, context, newHead$);
        this.opHash = opHash;
        this.context = context;
    }
    originationOperation() {
        return __awaiter(this, void 0, void 0, function* () {
            const operationResult = yield this.operationResults();
            return types_1.findWithKind(operationResult, rpc_1.OpKind.ORIGINATION);
        });
    }
    revealOperation() {
        return __awaiter(this, void 0, void 0, function* () {
            const operationResult = yield this.operationResults();
            return types_1.findWithKind(operationResult, rpc_1.OpKind.REVEAL);
        });
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._included) {
                return 'pending';
            }
            const op = yield this.originationOperation();
            if (!op) {
                return 'unknown';
            }
            return op.metadata.operation_result.status;
        });
    }
    contract() {
        return __awaiter(this, void 0, void 0, function* () {
            const op = yield this.originationOperation();
            const address = ((op === null || op === void 0 ? void 0 : op.metadata.operation_result.originated_contracts) || [])[0];
            return this.context.wallet.at(address);
        });
    }
}
exports.OriginationWalletOperation = OriginationWalletOperation;
//# sourceMappingURL=origination-operation.js.map