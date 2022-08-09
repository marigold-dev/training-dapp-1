"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MichelCodecParser = void 0;
const michel_codec_1 = require("@taquito/michel-codec");
const errors_1 = require("../contract/errors");
const michelson_encoder_1 = require("@taquito/michelson-encoder");
class MichelCodecParser {
    constructor(context) {
        this.context = context;
    }
    getNextProto() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.context.proto) {
                const nextProto = yield this.context.readProvider.getNextProtocol('head');
                this.context.proto = nextProto;
            }
            return this.context.proto;
        });
    }
    parseScript(src) {
        return __awaiter(this, void 0, void 0, function* () {
            const parser = new michel_codec_1.Parser({ protocol: yield this.getNextProto() });
            return parser.parseScript(src);
        });
    }
    parseMichelineExpression(src) {
        return __awaiter(this, void 0, void 0, function* () {
            const parser = new michel_codec_1.Parser({ protocol: yield this.getNextProto() });
            return parser.parseMichelineExpression(src);
        });
    }
    parseJSON(src) {
        return __awaiter(this, void 0, void 0, function* () {
            const parser = new michel_codec_1.Parser({ protocol: yield this.getNextProto() });
            return parser.parseJSON(src);
        });
    }
    prepareCodeOrigination(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const parsedParams = params;
            parsedParams.code = yield this.formatCodeParam(params.code);
            if (params.init) {
                parsedParams.init = yield this.formatInitParam(params.init);
            }
            else if (params.storage) {
                const storageType = parsedParams.code.find((p) => 'prim' in p && p.prim === 'storage');
                if (!(storageType === null || storageType === void 0 ? void 0 : storageType.args)) {
                    throw new errors_1.InvalidCodeParameter('The storage section is missing from the script', params.code);
                }
                const schema = new michelson_encoder_1.Schema(storageType.args[0]);
                const globalconstantsHashAndValue = yield this.findGlobalConstantsHashAndValue(schema);
                if (Object.keys(globalconstantsHashAndValue).length !== 0) {
                    // If there are global constants in the storage part of the contract code,
                    // they need to be locally expanded in order to encode the storage arguments
                    const p = new michel_codec_1.Parser({ expandGlobalConstant: globalconstantsHashAndValue });
                    const storageTypeNoGlobalConst = p.parseJSON(storageType.args[0]);
                    const schemaNoGlobalConst = new michelson_encoder_1.Schema(storageTypeNoGlobalConst);
                    parsedParams.init = schemaNoGlobalConst.Encode(params.storage);
                }
                else {
                    parsedParams.init = schema.Encode(params.storage);
                }
                delete parsedParams.storage;
            }
            return parsedParams;
        });
    }
    formatCodeParam(code) {
        return __awaiter(this, void 0, void 0, function* () {
            let parsedCode;
            if (typeof code === 'string') {
                const c = yield this.parseScript(code);
                if (c === null) {
                    throw new errors_1.InvalidCodeParameter('Invalid code parameter', code);
                }
                parsedCode = c;
            }
            else {
                const c = yield this.parseJSON(code);
                const order = ['parameter', 'storage', 'code'];
                // Ensure correct ordering for RPC
                parsedCode = c.sort((a, b) => order.indexOf(a.prim) - order.indexOf(b.prim));
            }
            return parsedCode;
        });
    }
    formatInitParam(init) {
        return __awaiter(this, void 0, void 0, function* () {
            let parsedInit;
            if (typeof init === 'string') {
                const c = yield this.parseMichelineExpression(init);
                if (c === null) {
                    throw new errors_1.InvalidInitParameter('Invalid init parameter', init);
                }
                parsedInit = c;
            }
            else {
                parsedInit = yield this.parseJSON(init);
            }
            return parsedInit;
        });
    }
    findGlobalConstantsHashAndValue(schema) {
        return __awaiter(this, void 0, void 0, function* () {
            const globalConstantTokens = schema.findToken('constant');
            const globalConstantsHashAndValue = {};
            if (globalConstantTokens.length !== 0) {
                for (const token of globalConstantTokens) {
                    const tokenArgs = token.tokenVal.args;
                    if (tokenArgs) {
                        const expression = tokenArgs[0];
                        if (expression.string) {
                            const hash = expression.string;
                            const michelineValue = yield this.context.globalConstantsProvider.getGlobalConstantByHash(hash);
                            Object.assign(globalConstantsHashAndValue, {
                                [hash]: michelineValue,
                            });
                        }
                    }
                }
            }
            return globalConstantsHashAndValue;
        });
    }
}
exports.MichelCodecParser = MichelCodecParser;
//# sourceMappingURL=michel-codec-parser.js.map