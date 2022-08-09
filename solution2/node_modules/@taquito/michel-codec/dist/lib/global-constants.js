"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandGlobalConstants = void 0;
function expandGlobalConstants(ex, hashAndValue) {
    if (ex.args !== undefined &&
        ex.args.length === 1 &&
        'string' in ex.args[0] &&
        ex.args[0].string in hashAndValue) {
        return hashAndValue[ex.args[0].string];
    }
    return ex;
}
exports.expandGlobalConstants = expandGlobalConstants;
//# sourceMappingURL=global-constants.js.map