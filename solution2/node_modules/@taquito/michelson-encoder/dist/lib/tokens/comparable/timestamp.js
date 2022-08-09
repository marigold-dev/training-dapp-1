"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimestampToken = void 0;
const token_1 = require("../token");
class TimestampToken extends token_1.ComparableToken {
    constructor(val, idx, fac) {
        super(val, idx, fac);
        this.val = val;
        this.idx = idx;
        this.fac = fac;
    }
    Execute(val) {
        if (val.string && /^\d+$/.test(val.string)) {
            return new Date(Number(val.string) * 1000).toISOString();
        }
        else if (val.string) {
            return new Date(val.string).toISOString();
        }
        else if (val.int) {
            return new Date(Number(val.int) * 1000).toISOString();
        }
    }
    Encode(args) {
        const val = args.pop();
        return { string: val };
    }
    EncodeObject(val, semantic) {
        if (semantic && semantic[TimestampToken.prim]) {
            return semantic[TimestampToken.prim](val);
        }
        return { string: val };
    }
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema() {
        return TimestampToken.prim;
    }
    generateSchema() {
        return {
            __michelsonType: TimestampToken.prim,
            schema: TimestampToken.prim,
        };
    }
    ToKey({ string }) {
        return string;
    }
    ToBigMapKey(val) {
        return {
            key: { string: val },
            type: { prim: TimestampToken.prim },
        };
    }
    findAndReturnTokens(tokenToFind, tokens) {
        if (TimestampToken.prim === tokenToFind) {
            tokens.push(this);
        }
        return tokens;
    }
}
exports.TimestampToken = TimestampToken;
TimestampToken.prim = 'timestamp';
//# sourceMappingURL=timestamp.js.map