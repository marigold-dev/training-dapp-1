"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalConstantToken = exports.GlobalConstantDecodingError = exports.GlobalConstantEncodingError = void 0;
const token_1 = require("./token");
class GlobalConstantEncodingError extends token_1.TokenValidationError {
    constructor(value, token, message) {
        super(value, token, message);
        this.value = value;
        this.token = token;
        this.name = 'GlobalConstantEncodingError';
    }
}
exports.GlobalConstantEncodingError = GlobalConstantEncodingError;
class GlobalConstantDecodingError extends token_1.TokenValidationError {
    constructor(value, token, message) {
        super(value, token, message);
        this.value = value;
        this.token = token;
        this.name = 'GlobalConstantDecodingError';
    }
}
exports.GlobalConstantDecodingError = GlobalConstantDecodingError;
class GlobalConstantToken extends token_1.Token {
    constructor(val, idx, fac) {
        super(val, idx, fac);
        this.val = val;
        this.idx = idx;
        this.fac = fac;
    }
    Execute(val, semantic) {
        if (semantic && semantic[GlobalConstantToken.prim]) {
            return semantic[GlobalConstantToken.prim](val, this.val);
        }
        else {
            throw new GlobalConstantDecodingError(val, this, `Unable to decode a value represented by a global constants. Please provide an expanded script to the Michelson-Encoder or semantics for the decoding. The following global constant hash was encountered: ${this.val.args[0]['string']}.`);
        }
    }
    Encode(args) {
        throw new GlobalConstantEncodingError(args, this, `Unable to encode a script containing global constants. Please provide an expanded script to the Michelson-Encoder. The following global constant hash was encountered: ${this.val.args[0]['string']}.`);
    }
    EncodeObject(val, semantic) {
        if (semantic && semantic[GlobalConstantToken.prim]) {
            return semantic[GlobalConstantToken.prim](val);
        }
        throw new GlobalConstantEncodingError(val, this, `Unable to encode a script containing global constants. Please provide an expanded script to the Michelson-Encoder. The following global constant hash was encountered: ${this.val.args[0]['string']}.`);
    }
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema() {
        return GlobalConstantToken.prim;
    }
    generateSchema() {
        return {
            __michelsonType: GlobalConstantToken.prim,
            schema: {
                hash: this.val.args[0]['string'],
            },
        };
    }
    findAndReturnTokens(tokenToFind, tokens) {
        if (GlobalConstantToken.prim === tokenToFind) {
            tokens.push(this);
        }
        return tokens;
    }
}
exports.GlobalConstantToken = GlobalConstantToken;
GlobalConstantToken.prim = 'constant';
//# sourceMappingURL=constant.js.map