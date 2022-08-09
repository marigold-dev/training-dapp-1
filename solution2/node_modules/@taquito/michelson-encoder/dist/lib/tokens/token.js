"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComparableToken = exports.Token = exports.TokenValidationError = void 0;
/**
 *  @category Error
 *  @description Error that indicates a failure when encoding invalid or incorrect data (e.g. if an address is expected but a number is received)
 */
class TokenValidationError extends Error {
    constructor(value, token, baseMessage) {
        super();
        this.value = value;
        this.token = token;
        this.name = 'ValidationError';
        const annot = this.token.annot();
        const annotText = annot ? `[${annot}] ` : '';
        this.message = `${annotText}${baseMessage}`;
    }
}
exports.TokenValidationError = TokenValidationError;
class Token {
    constructor(val, idx, fac) {
        this.val = val;
        this.idx = idx;
        this.fac = fac;
        this.createToken = this.fac;
    }
    typeWithoutAnnotations() {
        const handleMichelsonExpression = (val) => {
            if (typeof val === 'object') {
                if (Array.isArray(val)) {
                    const array = val;
                    return array.map((item) => handleMichelsonExpression(item));
                }
                const extended = val;
                if (extended.args) {
                    return {
                        prim: extended.prim,
                        args: extended.args.map((x) => handleMichelsonExpression(x)),
                    };
                }
                else {
                    return {
                        prim: extended.prim,
                    };
                }
            }
            return val;
        };
        const handleMichelsonExtended = (val) => {
            if (val.args) {
                return {
                    prim: val.prim,
                    args: val.args.map((x) => handleMichelsonExpression(x)),
                };
            }
            else {
                return {
                    prim: val.prim,
                };
            }
        };
        return handleMichelsonExtended(this.val);
    }
    annot() {
        return (Array.isArray(this.val.annots) && this.val.annots.length > 0
            ? this.val.annots[0]
            : String(this.idx)).replace(/(%|:)(_Liq_entry_)?/, '');
    }
    hasAnnotations() {
        return Array.isArray(this.val.annots) && this.val.annots.length;
    }
    get tokenVal() {
        return this.val;
    }
    ExtractSignature() {
        return [[this.ExtractSchema()]];
    }
}
exports.Token = Token;
class ComparableToken extends Token {
    compare(o1, o2) {
        if (o1 === o2) {
            return 0;
        }
        return o1 < o2 ? -1 : 1;
    }
}
exports.ComparableToken = ComparableToken;
//# sourceMappingURL=token.js.map