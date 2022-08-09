"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChestToken = exports.ChestValidationError = void 0;
const token_1 = require("./token");
class ChestValidationError extends token_1.TokenValidationError {
    constructor(value, token, message) {
        super(value, token, message);
        this.value = value;
        this.token = token;
        this.name = 'ChestValidationError';
    }
}
exports.ChestValidationError = ChestValidationError;
class ChestToken extends token_1.Token {
    constructor(val, idx, fac) {
        super(val, idx, fac);
        this.val = val;
        this.idx = idx;
        this.fac = fac;
    }
    isValid(val) {
        if (/^[0-9a-fA-F]*$/.test(val) && val.length % 2 === 0) {
            return null;
        }
        else {
            return new ChestValidationError(val, this, `Invalid bytes: ${val}`);
        }
    }
    convertUint8ArrayToHexString(val) {
        return val.constructor === Uint8Array ? Buffer.from(val).toString('hex') : val;
    }
    Encode(args) {
        let val = args.pop();
        val = this.convertUint8ArrayToHexString(val);
        const err = this.isValid(val);
        if (err) {
            throw err;
        }
        return { bytes: val };
    }
    EncodeObject(val, semantic) {
        val = this.convertUint8ArrayToHexString(val);
        const err = this.isValid(val);
        if (err) {
            throw err;
        }
        if (semantic && semantic[ChestToken.prim]) {
            return semantic[ChestToken.prim](val);
        }
        return { bytes: val };
    }
    Execute(val) {
        return val.bytes;
    }
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema() {
        return ChestToken.prim;
    }
    generateSchema() {
        return {
            __michelsonType: ChestToken.prim,
            schema: ChestToken.prim,
        };
    }
    findAndReturnTokens(tokenToFind, tokens) {
        if (ChestToken.prim === tokenToFind) {
            tokens.push(this);
        }
        return tokens;
    }
}
exports.ChestToken = ChestToken;
ChestToken.prim = 'chest';
//# sourceMappingURL=chest.js.map