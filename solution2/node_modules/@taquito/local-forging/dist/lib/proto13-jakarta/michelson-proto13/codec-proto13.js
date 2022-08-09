"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeCombPair = exports.primViewDecoderProto13 = exports.primDecoderProto13 = exports.primEncoderProto13 = exports.valueDecoderProto13 = exports.valueEncoderProto13 = exports.scriptDecoderProto13 = exports.scriptEncoderProto13 = void 0;
const utils_1 = require("../../utils");
const codec_1 = require("../../michelson/codec");
const uint8array_consumer_1 = require("../../uint8array-consumer");
const constants_proto13_1 = require("../constants-proto13");
const error_1 = require("../../error");
const scriptEncoderProto13 = (script) => {
    const code = exports.valueEncoderProto13(script.code);
    const storage = exports.valueEncoderProto13(script.storage);
    return `${utils_1.pad(code.length / 2, 8)}${code}${utils_1.pad(storage.length / 2, 8)}${storage}`;
};
exports.scriptEncoderProto13 = scriptEncoderProto13;
const scriptDecoderProto13 = (value) => {
    const code = codec_1.extractRequiredLen(value);
    const storage = codec_1.extractRequiredLen(value);
    return {
        code: exports.valueDecoderProto13(new uint8array_consumer_1.Uint8ArrayConsumer(code)),
        storage: exports.valueDecoderProto13(new uint8array_consumer_1.Uint8ArrayConsumer(storage)),
    };
};
exports.scriptDecoderProto13 = scriptDecoderProto13;
const valueEncoderProto13 = (value) => {
    if (Array.isArray(value)) {
        const encoded = value.map((x) => exports.valueEncoderProto13(x)).join('');
        const len = encoded.length / 2;
        return `02${utils_1.pad(len)}${encoded}`;
    }
    else if (codec_1.isPrim(value)) {
        return exports.primEncoderProto13(value);
    }
    else if (codec_1.isBytes(value)) {
        return codec_1.bytesEncoder(value);
    }
    else if (codec_1.isString(value)) {
        return codec_1.stringEncoder(value);
    }
    else if (codec_1.isInt(value)) {
        return codec_1.intEncoder(value);
    }
    throw new error_1.UnexpectedMichelsonValueError('Unexpected value');
};
exports.valueEncoderProto13 = valueEncoderProto13;
const valueDecoderProto13 = (value) => {
    const preamble = value.consume(1);
    switch (preamble[0]) {
        case 0x0a:
            return codec_1.bytesDecoder(value);
        case 0x01:
            return codec_1.stringDecoder(value);
        case 0x00:
            return codec_1.intDecoder(value);
        case 0x02: {
            const val = new uint8array_consumer_1.Uint8ArrayConsumer(codec_1.extractRequiredLen(value));
            const results = [];
            while (val.length() > 0) {
                results.push(exports.valueDecoderProto13(val));
            }
            return results;
        }
        default:
            return exports.primDecoderProto13(value, preamble);
    }
};
exports.valueDecoderProto13 = valueDecoderProto13;
const primEncoderProto13 = (value) => {
    const hasAnnot = +Array.isArray(value.annots);
    const argsCount = Array.isArray(value.args) ? value.args.length : 0;
    // Specify the number of args max is 3 without annotation
    const preamble = utils_1.pad(Math.min(2 * argsCount + hasAnnot + 0x03, 9), 2);
    const op = constants_proto13_1.opMappingReverseProto13[value.prim];
    let encodedArgs = (value.args || []).map((arg) => exports.valueEncoderProto13(arg)).join('');
    const encodedAnnots = Array.isArray(value.annots) ? codec_1.encodeAnnots(value.annots) : '';
    if (value.prim === 'LAMBDA' && argsCount) {
        encodedArgs = utils_1.pad(encodedArgs.length / 2) + encodedArgs + utils_1.pad(0);
    }
    if ((value.prim === 'pair' || value.prim === 'Pair') && argsCount > 2) {
        encodedArgs =
            encodedAnnots === ''
                ? utils_1.pad(encodedArgs.length / 2) + encodedArgs + utils_1.pad(0)
                : utils_1.pad(encodedArgs.length / 2) + encodedArgs;
    }
    if (value.prim === 'view' && value.args) {
        encodedArgs = utils_1.pad(encodedArgs.length / 2) + encodedArgs + utils_1.pad(0);
    }
    return `${preamble}${op}${encodedArgs}${encodedAnnots}`;
};
exports.primEncoderProto13 = primEncoderProto13;
const primDecoderProto13 = (value, preamble) => {
    const hasAnnot = (preamble[0] - 0x03) % 2 === 1;
    let argsCount = Math.floor((preamble[0] - 0x03) / 2);
    const op = value.consume(1)[0].toString(16).padStart(2, '0');
    const result = {
        prim: constants_proto13_1.opMappingProto13[op],
    };
    if (constants_proto13_1.opMappingProto13[op] === 'LAMBDA') {
        value.consume(4);
    }
    if (constants_proto13_1.opMappingProto13[op] === 'view') {
        if (argsCount != 0) {
            return exports.primViewDecoderProto13(value, result);
        }
        else {
            return result;
        }
    }
    let combPairArgs;
    let combPairAnnots;
    if ((constants_proto13_1.opMappingProto13[op] === 'pair' || constants_proto13_1.opMappingProto13[op] === 'Pair') && argsCount > 2) {
        combPairArgs = exports.decodeCombPair(value);
        argsCount = 0;
        combPairAnnots = codec_1.decodeAnnots(value);
    }
    const args = new Array(argsCount).fill(0).map(() => exports.valueDecoderProto13(value));
    if (constants_proto13_1.opMappingProto13[op] === 'LAMBDA') {
        value.consume(4);
    }
    if (combPairArgs) {
        result['args'] = combPairArgs;
    }
    else if (args.length) {
        result['args'] = args;
    }
    if (combPairAnnots && combPairAnnots[0] !== '') {
        result['annots'] = combPairAnnots;
    }
    else if (hasAnnot) {
        result['annots'] = codec_1.decodeAnnots(value);
    }
    return result;
};
exports.primDecoderProto13 = primDecoderProto13;
const primViewDecoderProto13 = (value, result) => {
    value.consume(4);
    result['args'] = new Array(4).fill(0).map(() => exports.valueDecoderProto13(value));
    value.consume(4);
    return result;
};
exports.primViewDecoderProto13 = primViewDecoderProto13;
const decodeCombPair = (val) => {
    const array = new uint8array_consumer_1.Uint8ArrayConsumer(codec_1.extractRequiredLen(val));
    const args = [];
    while (array.length() > 0) {
        args.push(exports.valueDecoderProto13(array));
    }
    return args;
};
exports.decodeCombPair = decodeCombPair;
//# sourceMappingURL=codec-proto13.js.map