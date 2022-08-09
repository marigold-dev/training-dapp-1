"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoolToken = void 0;
const token_1 = require("../token");
class BoolToken extends token_1.ComparableToken {
    constructor(val, idx, fac) {
        super(val, idx, fac);
        this.val = val;
        this.idx = idx;
        this.fac = fac;
    }
    Execute(val) {
        return String(val.prim).toLowerCase() === 'true' ? true : false;
    }
    Encode(args) {
        const val = args.pop();
        return { prim: val ? 'True' : 'False' };
    }
    EncodeObject(val, semantic) {
        if (semantic && semantic[BoolToken.prim]) {
            return semantic[BoolToken.prim](val);
        }
        return { prim: val ? 'True' : 'False' };
    }
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema() {
        return BoolToken.prim;
    }
    generateSchema() {
        return {
            __michelsonType: BoolToken.prim,
            schema: BoolToken.prim,
        };
    }
    ToBigMapKey(val) {
        return {
            key: this.EncodeObject(val),
            type: { prim: BoolToken.prim },
        };
    }
    ToKey(val) {
        return this.EncodeObject(val);
    }
    compare(val1, val2) {
        if ((val1 && val2) || (!val1 && !val2)) {
            return 0;
        }
        else if (val1) {
            return 1;
        }
        else {
            return -1;
        }
    }
    findAndReturnTokens(tokenToFind, tokens) {
        if (BoolToken.prim === tokenToFind) {
            tokens.push(this);
        }
        return tokens;
    }
}
exports.BoolToken = BoolToken;
BoolToken.prim = 'bool';
//# sourceMappingURL=bool.js.map