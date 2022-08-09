"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationToken = void 0;
const token_1 = require("./token");
class OperationToken extends token_1.Token {
    constructor(val, idx, fac) {
        super(val, idx, fac);
        this.val = val;
        this.idx = idx;
        this.fac = fac;
    }
    Execute(val) {
        return val.string;
    }
    Encode(...args) {
        const val = args.pop();
        return { string: val };
    }
    EncodeObject(val, semantic) {
        if (semantic && semantic[OperationToken.prim]) {
            return semantic[OperationToken.prim](val);
        }
        return { string: val };
    }
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema() {
        return OperationToken.prim;
    }
    generateSchema() {
        return {
            __michelsonType: OperationToken.prim,
            schema: OperationToken.prim,
        };
    }
    findAndReturnTokens(tokenToFind, tokens) {
        if (OperationToken.prim === tokenToFind) {
            tokens.push(this);
        }
        return tokens;
    }
}
exports.OperationToken = OperationToken;
OperationToken.prim = 'operation';
//# sourceMappingURL=operation.js.map