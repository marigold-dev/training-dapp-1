"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PairToken = exports.TokenComparisonError = exports.TokenArgumentValidationError = void 0;
const token_1 = require("./token");
const or_1 = require("./or");
/**
 *  @category Error
 *  @description Error that indicates in invalid token argument being passed
 */
class TokenArgumentValidationError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'TokenArgumentValidationError';
    }
}
exports.TokenArgumentValidationError = TokenArgumentValidationError;
/**
 *  @category Error
 *  @description Error that indicates a failure occurring when doing a comparison of tokens
 */
class TokenComparisonError extends Error {
    constructor(val1, val2) {
        super(`Tokens ${val1} and ${val2} are not comparable`);
        this.val1 = val1;
        this.val2 = val2;
        this.name = 'TokenComparisonError';
    }
}
exports.TokenComparisonError = TokenComparisonError;
// collapse comb pair
function collapse(val, prim = PairToken.prim) {
    if (Array.isArray(val)) {
        return collapse({
            prim: prim,
            args: val,
        }, prim);
    }
    if (val.args === undefined) {
        throw new TokenArgumentValidationError('Encountered an invalid PairToken with no arguments, a pair must have two or more arguments');
    }
    if (val.args.length > 2) {
        return [
            val.args[0],
            {
                prim: prim,
                args: val.args.slice(1),
            },
        ];
    }
    return [val.args[0], val.args[1]];
}
class PairToken extends token_1.ComparableToken {
    constructor(val, idx, fac) {
        super(Array.isArray(val)
            ? {
                prim: PairToken.prim,
                args: val,
            }
            : val.prim ? val : {
                prim: PairToken.prim,
                args: val,
            }, idx, fac);
    }
    args() {
        // collapse comb pair
        return collapse(this.val);
    }
    tokens() {
        let cnt = 0;
        return this.args().map((a) => {
            const tok = this.createToken(a, this.idx + cnt);
            if (tok instanceof PairToken) {
                cnt += Object.keys(tok.ExtractSchema()).length;
            }
            else {
                cnt++;
            }
            return tok;
        });
    }
    Encode(args) {
        return {
            prim: 'Pair',
            args: this.tokens().map((t) => t.Encode(args)),
        };
    }
    ExtractSignature() {
        const args = this.args();
        const leftToken = this.createToken(args[0], this.idx);
        let keyCount = 1;
        if (leftToken instanceof or_1.OrToken) {
            keyCount = Object.keys(leftToken.ExtractSchema()).length;
        }
        const rightToken = this.createToken(args[1], this.idx + keyCount);
        const newSig = [];
        for (const leftSig of leftToken.ExtractSignature()) {
            for (const rightSig of rightToken.ExtractSignature()) {
                newSig.push([...leftSig, ...rightSig]);
            }
        }
        return newSig;
    }
    ToBigMapKey(val) {
        return {
            key: this.EncodeObject(val),
            type: this.typeWithoutAnnotations(),
        };
    }
    ToKey(val) {
        return this.Execute(val);
    }
    EncodeObject(args, semantic) {
        const [leftToken, rightToken] = this.tokens();
        let leftValue;
        if (leftToken instanceof PairToken && !leftToken.hasAnnotations()) {
            leftValue = args;
        }
        else {
            leftValue = args[leftToken.annot()];
        }
        let rightValue;
        if (rightToken instanceof PairToken && !rightToken.hasAnnotations()) {
            rightValue = args;
        }
        else {
            rightValue = args[rightToken.annot()];
        }
        return {
            prim: 'Pair',
            args: [
                leftToken.EncodeObject(leftValue, semantic),
                rightToken.EncodeObject(rightValue, semantic),
            ],
        };
    }
    traversal(getLeftValue, getRightValue) {
        const args = this.args();
        const leftToken = this.createToken(args[0], this.idx);
        let keyCount = 1;
        let leftValue;
        if (leftToken instanceof PairToken) {
            keyCount = Object.keys(leftToken.ExtractSchema()).length;
        }
        if (leftToken instanceof PairToken && !leftToken.hasAnnotations()) {
            leftValue = getLeftValue(leftToken);
        }
        else {
            leftValue = { [leftToken.annot()]: getLeftValue(leftToken) };
        }
        const rightToken = this.createToken(args[1], this.idx + keyCount);
        let rightValue;
        if (rightToken instanceof PairToken && !rightToken.hasAnnotations()) {
            rightValue = getRightValue(rightToken);
        }
        else {
            rightValue = { [rightToken.annot()]: getRightValue(rightToken) };
        }
        const res = Object.assign(Object.assign({}, leftValue), rightValue);
        return res;
    }
    Execute(val, semantics) {
        const args = collapse(val, 'Pair');
        return this.traversal((leftToken) => leftToken.Execute(args[0], semantics), (rightToken) => rightToken.Execute(args[1], semantics));
    }
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema() {
        return this.traversal((leftToken) => leftToken.ExtractSchema(), (rightToken) => rightToken.ExtractSchema());
    }
    generateSchema() {
        return {
            __michelsonType: PairToken.prim,
            schema: this.traversal((leftToken) => {
                if (leftToken instanceof PairToken && !leftToken.hasAnnotations()) {
                    return leftToken.generateSchema().schema;
                }
                else {
                    return leftToken.generateSchema();
                }
            }, (rightToken) => {
                if (rightToken instanceof PairToken && !rightToken.hasAnnotations()) {
                    return rightToken.generateSchema().schema;
                }
                else {
                    return rightToken.generateSchema();
                }
            }),
        };
    }
    compare(val1, val2) {
        const [leftToken, rightToken] = this.tokens();
        const getValue = (token, args) => {
            if (token instanceof PairToken && !token.hasAnnotations()) {
                return args;
            }
            else {
                return args[token.annot()];
            }
        };
        if (leftToken instanceof token_1.ComparableToken && rightToken instanceof token_1.ComparableToken) {
            const result = leftToken.compare(getValue(leftToken, val1), getValue(leftToken, val2));
            if (result === 0) {
                return rightToken.compare(getValue(rightToken, val1), getValue(rightToken, val2));
            }
            return result;
        }
        throw new TokenComparisonError(val1, val2);
    }
    findAndReturnTokens(tokenToFind, tokens) {
        if (PairToken.prim === tokenToFind) {
            tokens.push(this);
        }
        this.tokens().map((t) => t.findAndReturnTokens(tokenToFind, tokens));
        return tokens;
    }
}
exports.PairToken = PairToken;
PairToken.prim = 'pair';
//# sourceMappingURL=pair.js.map