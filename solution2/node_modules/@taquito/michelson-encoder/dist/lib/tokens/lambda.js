"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LambdaToken = void 0;
const token_1 = require("./token");
class LambdaToken extends token_1.Token {
    constructor(val, idx, fac) {
        super(val, idx, fac);
        this.val = val;
        this.idx = idx;
        this.fac = fac;
    }
    get paramSchema() {
        return this.createToken(this.val.args[0], this.idx);
    }
    get returnSchema() {
        return this.createToken(this.val.args[1], this.idx + 1);
    }
    Execute(val) {
        if (val.string) {
            return val.string;
        }
        else {
            return val;
        }
    }
    Encode(args) {
        const val = args.pop();
        return val;
    }
    EncodeObject(val, semantic) {
        if (semantic && semantic[LambdaToken.prim]) {
            return semantic[LambdaToken.prim](val);
        }
        return val;
    }
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema() {
        return {
            [LambdaToken.prim]: {
                parameters: this.paramSchema.ExtractSchema(),
                returns: this.returnSchema.ExtractSchema(),
            },
        };
    }
    generateSchema() {
        return {
            __michelsonType: LambdaToken.prim,
            schema: {
                parameters: this.paramSchema.generateSchema(),
                returns: this.returnSchema.generateSchema(),
            },
        };
    }
    findAndReturnTokens(tokenToFind, tokens) {
        if (LambdaToken.prim === tokenToFind) {
            tokens.push(this);
        }
        this.createToken(this.val.args[0], this.idx).findAndReturnTokens(tokenToFind, tokens);
        this.createToken(this.val.args[1], this.idx).findAndReturnTokens(tokenToFind, tokens);
        return tokens;
    }
}
exports.LambdaToken = LambdaToken;
LambdaToken.prim = 'lambda';
//# sourceMappingURL=lambda.js.map