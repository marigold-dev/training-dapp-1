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
exports.CompositeForger = exports.UnspecifiedForgerError = exports.ForgingMismatchError = void 0;
/**
 *  @category Error
 *  @description Error that indicates a value mismatch when forging
 */
class ForgingMismatchError extends Error {
    constructor(results) {
        super('Forging mismatch error');
        this.results = results;
        this.name = 'ForgingMismatchError';
    }
}
exports.ForgingMismatchError = ForgingMismatchError;
/**
 *  @category Error
 *  @description Error that indicates a forger not being specified in TezosToolkit
 */
class UnspecifiedForgerError extends Error {
    constructor() {
        super('At least one forger must be specified');
        this.name = 'UnspecifiedForgerError';
    }
}
exports.UnspecifiedForgerError = UnspecifiedForgerError;
class CompositeForger {
    constructor(forgers) {
        this.forgers = forgers;
        if (forgers.length === 0) {
            throw new UnspecifiedForgerError();
        }
    }
    forge({ branch, contents }) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield Promise.all(this.forgers.map((forger) => {
                return forger.forge({ branch, contents });
            }));
            if (results.length === 0) {
                throw new UnspecifiedForgerError();
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            let lastResult = results.pop(); // Assumed to be more than one since we
            while (results.length) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const currentResult = results.pop();
                if (currentResult !== lastResult) {
                    throw new ForgingMismatchError([lastResult, currentResult]);
                }
                lastResult = currentResult;
            }
            return lastResult;
        });
    }
}
exports.CompositeForger = CompositeForger;
//# sourceMappingURL=composite-forger.js.map