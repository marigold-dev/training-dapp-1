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
exports.DefaultGlobalConstantsProvider = void 0;
const error_1 = require("./error");
class DefaultGlobalConstantsProvider {
    constructor() {
        this._globalConstantsLibrary = {};
    }
    /**
     *
     * @description Allows to load global constant hashes and their corresponding Michelson JSON values
     */
    loadGlobalConstant(globalConstant) {
        for (const hash in globalConstant) {
            Object.assign(this._globalConstantsLibrary, {
                [hash]: globalConstant[hash],
            });
        }
    }
    /**
     *
     * @description Retrieve the Michelson value of a global constant based on its hash
     *
     * @param hash a string representing the global constant hash
     * @returns Expr, the JSON Michelson value
     */
    getGlobalConstantByHash(hash) {
        return __awaiter(this, void 0, void 0, function* () {
            const value = this._globalConstantsLibrary[hash];
            if (!value) {
                throw new error_1.GlobalConstantNotFound(hash);
            }
            return value;
        });
    }
}
exports.DefaultGlobalConstantsProvider = DefaultGlobalConstantsProvider;
//# sourceMappingURL=default-global-constants-provider.js.map