"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyHashToken = exports.KeyHashValidationError = void 0;
const token_1 = require("../token");
const utils_1 = require("@taquito/utils");
class KeyHashValidationError extends token_1.TokenValidationError {
    constructor(value, token, message) {
        super(value, token, message);
        this.value = value;
        this.token = token;
        this.name = 'KeyHashValidationError';
    }
}
exports.KeyHashValidationError = KeyHashValidationError;
class KeyHashToken extends token_1.ComparableToken {
    constructor(val, idx, fac) {
        super(val, idx, fac);
        this.val = val;
        this.idx = idx;
        this.fac = fac;
    }
    Execute(val) {
        if (val.string) {
            return val.string;
        }
        return utils_1.encodeKeyHash(val.bytes);
    }
    isValid(value) {
        if (utils_1.validateKeyHash(value) !== utils_1.ValidationResult.VALID) {
            return new KeyHashValidationError(value, this, `KeyHash is not valid: ${value}`);
        }
        return null;
    }
    Encode(args) {
        const val = args.pop();
        const err = this.isValid(val);
        if (err) {
            throw err;
        }
        return { string: val };
    }
    EncodeObject(val, semantic) {
        const err = this.isValid(val);
        if (err) {
            throw err;
        }
        if (semantic && semantic[KeyHashToken.prim]) {
            return semantic[KeyHashToken.prim](val);
        }
        return { string: val };
    }
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema() {
        return KeyHashToken.prim;
    }
    generateSchema() {
        return {
            __michelsonType: KeyHashToken.prim,
            schema: KeyHashToken.prim,
        };
    }
    ToKey({ string, bytes }) {
        if (string) {
            return string;
        }
        return utils_1.encodeKeyHash(bytes);
    }
    ToBigMapKey(val) {
        return {
            key: { string: val },
            type: { prim: KeyHashToken.prim },
        };
    }
    findAndReturnTokens(tokenToFind, tokens) {
        if (KeyHashToken.prim === tokenToFind) {
            tokens.push(this);
        }
        return tokens;
    }
}
exports.KeyHashToken = KeyHashToken;
KeyHashToken.prim = 'key_hash';
//# sourceMappingURL=key_hash.js.map