"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bls12381g1Token = exports.Bls12381g1ValidationError = void 0;
const token_1 = require("./token");
class Bls12381g1ValidationError extends token_1.TokenValidationError {
    constructor(value, token, message) {
        super(value, token, message);
        this.value = value;
        this.token = token;
        this.name = 'Bls12381g1ValidationError';
    }
}
exports.Bls12381g1ValidationError = Bls12381g1ValidationError;
class Bls12381g1Token extends token_1.Token {
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
            return new Bls12381g1ValidationError(val, this, `Invalid bytes: ${val}`);
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
        if (semantic && semantic[Bls12381g1Token.prim]) {
            return semantic[Bls12381g1Token.prim](val);
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
        return Bls12381g1Token.prim;
    }
    generateSchema() {
        return {
            __michelsonType: Bls12381g1Token.prim,
            schema: Bls12381g1Token.prim,
        };
    }
    findAndReturnTokens(tokenToFind, tokens) {
        if (Bls12381g1Token.prim === tokenToFind) {
            tokens.push(this);
        }
        return tokens;
    }
}
exports.Bls12381g1Token = Bls12381g1Token;
// A point on the BLS12-381 curve G1
// See https://tezos.gitlab.io/michelson-reference/#type-bls12_381_g1
Bls12381g1Token.prim = 'bls12_381_g1';
//# sourceMappingURL=bls12-381-g1.js.map