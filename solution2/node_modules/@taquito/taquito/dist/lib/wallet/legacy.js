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
exports.LegacyWalletProvider = void 0;
const types_1 = require("../operations/types");
class LegacyWalletProvider {
    constructor(context) {
        this.context = context;
    }
    getPKH() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.context.signer.publicKeyHash();
        });
    }
    mapTransferParamsToWalletParams(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return types_1.attachKind(yield params(), types_1.OpKind.TRANSACTION);
        });
    }
    mapOriginateParamsToWalletParams(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return types_1.attachKind(yield params(), types_1.OpKind.ORIGINATION);
        });
    }
    mapDelegateParamsToWalletParams(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return types_1.attachKind(yield params(), types_1.OpKind.DELEGATION);
        });
    }
    sendOperations(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const op = yield this.context.batch.batch(params).send();
            return op.hash;
        });
    }
}
exports.LegacyWalletProvider = LegacyWalletProvider;
//# sourceMappingURL=legacy.js.map