"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntToken = exports.IntValidationError = void 0;
const token_1 = require("../token");
const bignumber_js_1 = require("bignumber.js");
class IntValidationError extends token_1.TokenValidationError {
    constructor(value, token, message) {
        super(value, token, message);
        this.value = value;
        this.token = token;
        this.name = 'IntValidationError';
    }
}
exports.IntValidationError = IntValidationError;
class IntToken extends token_1.ComparableToken {
    constructor(val, idx, fac) {
        super(val, idx, fac);
        this.val = val;
        this.idx = idx;
        this.fac = fac;
    }
    Execute(val) {
        return new bignumber_js_1.default(val[Object.keys(val)[0]]);
    }
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema() {
        return IntToken.prim;
    }
    generateSchema() {
        return {
            __michelsonType: IntToken.prim,
            schema: IntToken.prim,
        };
    }
    isValid(val) {
        const bigNumber = new bignumber_js_1.default(val);
        if (bigNumber.isNaN()) {
            return new IntValidationError(val, this, `Value is not a number: ${val}`);
        }
        else {
            return null;
        }
    }
    Encode(args) {
        const val = args.pop();
        const err = this.isValid(val);
        if (err) {
            throw err;
        }
        return { int: new bignumber_js_1.default(val).toFixed() };
    }
    EncodeObject(val, semantic) {
        const err = this.isValid(val);
        if (err) {
            throw err;
        }
        if (semantic && semantic[IntToken.prim]) {
            return semantic[IntToken.prim](val);
        }
        return { int: new bignumber_js_1.default(val).toFixed() };
    }
    ToBigMapKey(val) {
        return {
            key: { int: String(val) },
            type: { prim: IntToken.prim },
        };
    }
    ToKey({ int }) {
        return int;
    }
    compare(int1, int2) {
        const o1 = Number(int1);
        const o2 = Number(int2);
        if (o1 === o2) {
            return 0;
        }
        return o1 < o2 ? -1 : 1;
    }
    findAndReturnTokens(tokenToFind, tokens) {
        if (IntToken.prim === tokenToFind) {
            tokens.push(this);
        }
        return tokens;
    }
}
exports.IntToken = IntToken;
IntToken.prim = 'int';
//# sourceMappingURL=int.js.map