"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.format = void 0;
const bignumber_js_1 = require("bignumber.js");
const TZ_DECIMALS = 6;
const MTZ_DECIMALS = 3;
function getDecimal(format) {
    switch (format) {
        case 'tz':
            return TZ_DECIMALS;
        case 'mtz':
            return MTZ_DECIMALS;
        case 'mutez':
        default:
            return 0;
    }
}
function format(from = 'mutez', to = 'mutez', amount) {
    const bigNum = new bignumber_js_1.default(amount);
    if (bigNum.isNaN()) {
        return amount;
    }
    return bigNum
        .multipliedBy(Math.pow(10, getDecimal(from)))
        .dividedBy(Math.pow(10, getDecimal(to)));
}
exports.format = format;
//# sourceMappingURL=format.js.map