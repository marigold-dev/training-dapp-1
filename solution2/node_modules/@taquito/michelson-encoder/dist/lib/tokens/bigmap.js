"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BigMapToken = exports.BigMapValidationError = void 0;
const michelson_map_1 = require("../michelson-map");
const token_1 = require("./token");
/**
 *  @category Error
 *  @description Error that indicates a failure happening when parsing encoding/executing Big Map types
 */
class BigMapValidationError extends token_1.TokenValidationError {
    constructor(value, token, message) {
        super(value, token, message);
        this.value = value;
        this.token = token;
        this.name = 'BigMapValidationError';
    }
}
exports.BigMapValidationError = BigMapValidationError;
class BigMapToken extends token_1.Token {
    constructor(val, idx, fac) {
        super(val, idx, fac);
        this.val = val;
        this.idx = idx;
        this.fac = fac;
    }
    get ValueSchema() {
        return this.createToken(this.val.args[1], 0);
    }
    get KeySchema() {
        return this.createToken(this.val.args[0], 0);
    }
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema() {
        return {
            big_map: {
                key: this.KeySchema.ExtractSchema(),
                value: this.ValueSchema.ExtractSchema(),
            },
        };
    }
    generateSchema() {
        return {
            __michelsonType: BigMapToken.prim,
            schema: {
                key: this.KeySchema.generateSchema(),
                value: this.ValueSchema.generateSchema(),
            },
        };
    }
    isValid(value) {
        if (michelson_map_1.MichelsonMap.isMichelsonMap(value)) {
            return null;
        }
        return new BigMapValidationError(value, this, 'Value must be a MichelsonMap');
    }
    objLitToMichelsonMap(val) {
        if (val instanceof michelson_map_1.MichelsonMap)
            return val;
        if (typeof val === 'object') {
            if (Object.keys(val).length === 0) {
                return new michelson_map_1.MichelsonMap();
            }
            else {
                return michelson_map_1.MichelsonMap.fromLiteral(val);
            }
        }
        return val;
    }
    Encode(args) {
        const val = this.objLitToMichelsonMap(args.pop());
        const err = this.isValid(val);
        if (err) {
            throw err;
        }
        return Array.from(val.keys())
            .sort((a, b) => this.KeySchema.compare(a, b))
            .map((key) => {
            return {
                prim: 'Elt',
                args: [this.KeySchema.EncodeObject(key), this.ValueSchema.EncodeObject(val.get(key))],
            };
        });
    }
    EncodeObject(args, semantic) {
        const val = this.objLitToMichelsonMap(args);
        const err = this.isValid(val);
        if (err) {
            throw err;
        }
        if (semantic && semantic[BigMapToken.prim]) {
            return semantic[BigMapToken.prim](val, this.val);
        }
        return Array.from(val.keys())
            .sort((a, b) => this.KeySchema.compare(a, b))
            .map((key) => {
            return {
                prim: 'Elt',
                args: [this.KeySchema.EncodeObject(key), this.ValueSchema.EncodeObject(val.get(key))],
            };
        });
    }
    Execute(val, semantic) {
        if (semantic && semantic[BigMapToken.prim]) {
            return semantic[BigMapToken.prim](val, this.val);
        }
        if (Array.isArray(val)) {
            // Athens is returning an empty array for big map in storage
            // Internal: In taquito v5 it is still used to decode big map diff (as if they were a regular map)
            const map = new michelson_map_1.MichelsonMap(this.val);
            val.forEach((current) => {
                map.set(this.KeySchema.ToKey(current.args[0]), this.ValueSchema.Execute(current.args[1]));
            });
            return map;
        }
        else if ('int' in val) {
            // Babylon is returning an int with the big map id in contract storage
            return val.int;
        }
        else {
            throw new BigMapValidationError(val, this, `Big map is expecting either an array (Athens) or an object with an int property (Babylon). Got ${JSON.stringify(val)}`);
        }
    }
    findAndReturnTokens(tokenToFind, tokens) {
        if (BigMapToken.prim === tokenToFind) {
            tokens.push(this);
        }
        this.KeySchema.findAndReturnTokens(tokenToFind, tokens);
        this.ValueSchema.findAndReturnTokens(tokenToFind, tokens);
        return tokens;
    }
}
exports.BigMapToken = BigMapToken;
BigMapToken.prim = 'big_map';
//# sourceMappingURL=bigmap.js.map