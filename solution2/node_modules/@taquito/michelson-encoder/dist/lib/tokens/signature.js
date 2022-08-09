"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignatureToken = exports.SignatureValidationError = void 0;
const token_1 = require("./token");
const utils_1 = require("@taquito/utils");
class SignatureValidationError extends token_1.TokenValidationError {
    constructor(value, token, message) {
        super(value, token, message);
        this.value = value;
        this.token = token;
        this.name = 'SignatureValidationError';
    }
}
exports.SignatureValidationError = SignatureValidationError;
class SignatureToken extends token_1.ComparableToken {
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
        // TODO decode the signature
        return val.bytes;
    }
    isValid(value) {
        if (utils_1.validateSignature(value) !== utils_1.ValidationResult.VALID) {
            return new SignatureValidationError(value, this, 'Signature is not valid');
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
        if (semantic && semantic[SignatureToken.prim]) {
            return semantic[SignatureToken.prim](val);
        }
        return { string: val };
    }
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema() {
        return SignatureToken.prim;
    }
    generateSchema() {
        return {
            __michelsonType: SignatureToken.prim,
            schema: SignatureToken.prim,
        };
    }
    ToKey(val) {
        return this.Execute(val);
    }
    ToBigMapKey(val) {
        return {
            key: { string: val },
            type: { prim: SignatureToken.prim },
        };
    }
    findAndReturnTokens(tokenToFind, tokens) {
        if (SignatureToken.prim === tokenToFind) {
            tokens.push(this);
        }
        return tokens;
    }
}
exports.SignatureToken = SignatureToken;
SignatureToken.prim = 'signature';
//# sourceMappingURL=signature.js.map