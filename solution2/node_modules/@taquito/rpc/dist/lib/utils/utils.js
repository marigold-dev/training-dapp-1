"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.castToString = exports.castToBigNumber = void 0;
const bignumber_js_1 = require("bignumber.js");
/**
 * Casts object/array items to BigNumber
 * @param data input object or array
 * @param keys keys for processing or all items if not defined
 *
 */
function castToBigNumber(data, keys) {
    const returnArray = Array.isArray(data);
    if (typeof keys === 'undefined') {
        keys = Object.keys(data);
    }
    const response = returnArray ? [] : {};
    keys.forEach((key) => {
        const item = data[key];
        let res;
        if (typeof item === 'undefined') {
            return;
        }
        if (Array.isArray(item)) {
            res = castToBigNumber(item);
            response[key] = res;
            return;
        }
        res = new bignumber_js_1.default(item);
        response[key] = res;
    });
    return response;
}
exports.castToBigNumber = castToBigNumber;
/**
 * Casts object/array BigNumber items to strings for readability
 * @param data input object or array
 * @param keys keys for processing or all items if not defined
 *
 */
function castToString(data, keys) {
    const returnArray = Array.isArray(data);
    if (typeof keys === 'undefined') {
        keys = Object.keys(data);
    }
    const response = returnArray ? [] : {};
    keys.forEach((key) => {
        const item = data[key];
        if (typeof item === 'undefined') {
            return;
        }
        if (Array.isArray(item)) {
            response[key] = castToString(item);
            return;
        }
        if (!bignumber_js_1.default.isBigNumber(item)) {
            response[key] = item;
            return;
        }
        response[key] = item.toString();
    });
    return response;
}
exports.castToString = castToString;
//# sourceMappingURL=utils.js.map