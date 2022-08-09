"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodePublicKeyBytes = exports.decodePublicKeyHashBytes = exports.decodeAddressBytes = exports.unpackDataBytes = exports.unpackData = exports.packDataBytes = exports.packData = void 0;
const michelson_validator_1 = require("./michelson-validator");
const utils_1 = require("./utils");
const primitives = [
    'parameter',
    'storage',
    'code',
    'False',
    'Elt',
    'Left',
    'None',
    'Pair',
    'Right',
    'Some',
    'True',
    'Unit',
    'PACK',
    'UNPACK',
    'BLAKE2B',
    'SHA256',
    'SHA512',
    'ABS',
    'ADD',
    'AMOUNT',
    'AND',
    'BALANCE',
    'CAR',
    'CDR',
    'CHECK_SIGNATURE',
    'COMPARE',
    'CONCAT',
    'CONS',
    'CREATE_ACCOUNT',
    'CREATE_CONTRACT',
    'IMPLICIT_ACCOUNT',
    'DIP',
    'DROP',
    'DUP',
    'EDIV',
    'EMPTY_MAP',
    'EMPTY_SET',
    'EQ',
    'EXEC',
    'FAILWITH',
    'GE',
    'GET',
    'GT',
    'HASH_KEY',
    'IF',
    'IF_CONS',
    'IF_LEFT',
    'IF_NONE',
    'INT',
    'LAMBDA',
    'LE',
    'LEFT',
    'LOOP',
    'LSL',
    'LSR',
    'LT',
    'MAP',
    'MEM',
    'MUL',
    'NEG',
    'NEQ',
    'NIL',
    'NONE',
    'NOT',
    'NOW',
    'OR',
    'PAIR',
    'PUSH',
    'RIGHT',
    'SIZE',
    'SOME',
    'SOURCE',
    'SENDER',
    'SELF',
    'STEPS_TO_QUOTA',
    'SUB',
    'SWAP',
    'TRANSFER_TOKENS',
    'SET_DELEGATE',
    'UNIT',
    'UPDATE',
    'XOR',
    'ITER',
    'LOOP_LEFT',
    'ADDRESS',
    'CONTRACT',
    'ISNAT',
    'CAST',
    'RENAME',
    'bool',
    'contract',
    'int',
    'key',
    'key_hash',
    'lambda',
    'list',
    'map',
    'big_map',
    'nat',
    'option',
    'or',
    'pair',
    'set',
    'signature',
    'string',
    'bytes',
    'mutez',
    'timestamp',
    'unit',
    'operation',
    'address',
    'SLICE',
    'DIG',
    'DUG',
    'EMPTY_BIG_MAP',
    'APPLY',
    'chain_id',
    'CHAIN_ID',
    'LEVEL',
    'SELF_ADDRESS',
    'never',
    'NEVER',
    'UNPAIR',
    'VOTING_POWER',
    'TOTAL_VOTING_POWER',
    'KECCAK',
    'SHA3',
    'PAIRING_CHECK',
    'bls12_381_g1',
    'bls12_381_g2',
    'bls12_381_fr',
    'sapling_state',
    'sapling_transaction',
    'SAPLING_EMPTY_STATE',
    'SAPLING_VERIFY_UPDATE',
    'ticket',
    'TICKET',
    'READ_TICKET',
    'SPLIT_TICKET',
    'JOIN_TICKETS',
    'GET_AND_UPDATE',
    'chest',
    'chest_key',
    'OPEN_CHEST',
    'VIEW',
    'view',
    'constant',
    'SUB_MUTEZ',
];
const primTags = Object.assign({}, ...primitives.map((v, i) => ({ [v]: i })));
var Tag;
(function (Tag) {
    Tag[Tag["Int"] = 0] = "Int";
    Tag[Tag["String"] = 1] = "String";
    Tag[Tag["Sequence"] = 2] = "Sequence";
    Tag[Tag["Prim0"] = 3] = "Prim0";
    Tag[Tag["Prim0Annot"] = 4] = "Prim0Annot";
    Tag[Tag["Prim1"] = 5] = "Prim1";
    Tag[Tag["Prim1Annot"] = 6] = "Prim1Annot";
    Tag[Tag["Prim2"] = 7] = "Prim2";
    Tag[Tag["Prim2Annot"] = 8] = "Prim2Annot";
    Tag[Tag["Prim"] = 9] = "Prim";
    Tag[Tag["Bytes"] = 10] = "Bytes";
})(Tag || (Tag = {}));
class Writer {
    constructor() {
        this.buffer = [];
    }
    get length() {
        return this.buffer.length;
    }
    writeBytes(val) {
        this.buffer.push(...val.map((v) => v & 0xff));
    }
    writeUint8(val) {
        const v = val | 0;
        this.buffer.push(v & 0xff);
    }
    writeUint16(val) {
        const v = val | 0;
        this.buffer.push((v >> 8) & 0xff);
        this.buffer.push(v & 0xff);
    }
    writeUint32(val) {
        const v = val | 0;
        this.buffer.push((v >> 24) & 0xff);
        this.buffer.push((v >> 16) & 0xff);
        this.buffer.push((v >> 8) & 0xff);
        this.buffer.push(v & 0xff);
    }
    writeInt8(val) {
        this.writeUint8(val);
    }
    writeInt16(val) {
        this.writeUint16(val);
    }
    writeInt32(val) {
        this.writeUint32(val);
    }
}
const boundsErr = new Error('bounds out of range');
class Reader {
    constructor(buffer, idx = 0, cap = buffer.length) {
        this.buffer = buffer;
        this.idx = idx;
        this.cap = cap;
    }
    /** Remaining length */
    get length() {
        return this.cap - this.idx;
    }
    readBytes(len) {
        if (this.cap - this.idx < len) {
            throw boundsErr;
        }
        const ret = this.buffer.slice(this.idx, this.idx + len);
        this.idx += len;
        return ret;
    }
    reader(len) {
        if (this.cap - this.idx < len) {
            throw boundsErr;
        }
        const ret = new Reader(this.buffer, this.idx, this.idx + len);
        this.idx += len;
        return ret;
    }
    copy() {
        return new Reader(this.buffer, this.idx, this.cap);
    }
    readUint8() {
        if (this.cap - this.idx < 1) {
            throw boundsErr;
        }
        return this.buffer[this.idx++] >>> 0;
    }
    readUint16() {
        if (this.cap - this.idx < 2) {
            throw boundsErr;
        }
        const x0 = this.buffer[this.idx++];
        const x1 = this.buffer[this.idx++];
        return ((x0 << 8) | x1) >>> 0;
    }
    readUint32() {
        if (this.cap - this.idx < 4) {
            throw boundsErr;
        }
        const x0 = this.buffer[this.idx++];
        const x1 = this.buffer[this.idx++];
        const x2 = this.buffer[this.idx++];
        const x3 = this.buffer[this.idx++];
        return ((x0 << 24) | (x1 << 16) | (x2 << 8) | x3) >>> 0;
    }
    readInt8() {
        if (this.cap - this.idx < 1) {
            throw boundsErr;
        }
        const x = this.buffer[this.idx++];
        return (x << 24) >> 24;
    }
    readInt16() {
        if (this.cap - this.idx < 2) {
            throw boundsErr;
        }
        const x0 = this.buffer[this.idx++];
        const x1 = this.buffer[this.idx++];
        return (((x0 << 8) | x1) << 16) >> 16;
    }
    readInt32() {
        if (this.cap - this.idx < 4) {
            throw boundsErr;
        }
        const x0 = this.buffer[this.idx++];
        const x1 = this.buffer[this.idx++];
        const x2 = this.buffer[this.idx++];
        const x3 = this.buffer[this.idx++];
        return (x0 << 24) | (x1 << 16) | (x2 << 8) | x3;
    }
}
var ContractID;
(function (ContractID) {
    ContractID[ContractID["Implicit"] = 0] = "Implicit";
    ContractID[ContractID["Originated"] = 1] = "Originated";
})(ContractID || (ContractID = {}));
var PublicKeyHashID;
(function (PublicKeyHashID) {
    PublicKeyHashID[PublicKeyHashID["ED25519"] = 0] = "ED25519";
    PublicKeyHashID[PublicKeyHashID["SECP256K1"] = 1] = "SECP256K1";
    PublicKeyHashID[PublicKeyHashID["P256"] = 2] = "P256";
})(PublicKeyHashID || (PublicKeyHashID = {}));
function readPublicKeyHash(rd) {
    let type;
    const tag = rd.readUint8();
    switch (tag) {
        case PublicKeyHashID.ED25519:
            type = 'ED25519PublicKeyHash';
            break;
        case PublicKeyHashID.SECP256K1:
            type = 'SECP256K1PublicKeyHash';
            break;
        case PublicKeyHashID.P256:
            type = 'P256PublicKeyHash';
            break;
        default:
            throw new Error(`unknown public key hash tag: ${tag}`);
    }
    return { type, hash: rd.readBytes(20) };
}
function readAddress(rd) {
    let address;
    const tag = rd.readUint8();
    switch (tag) {
        case ContractID.Implicit:
            address = readPublicKeyHash(rd);
            break;
        case ContractID.Originated:
            address = {
                type: 'ContractHash',
                hash: rd.readBytes(20),
            };
            rd.readBytes(1);
            break;
        default:
            throw new Error(`unknown address tag: ${tag}`);
    }
    if (rd.length !== 0) {
        // entry point
        const dec = new TextDecoder();
        address.entryPoint = dec.decode(new Uint8Array(rd.readBytes(rd.length)));
    }
    return address;
}
function writePublicKeyHash(a, w) {
    let tag;
    switch (a.type) {
        case 'ED25519PublicKeyHash':
            tag = PublicKeyHashID.ED25519;
            break;
        case 'SECP256K1PublicKeyHash':
            tag = PublicKeyHashID.SECP256K1;
            break;
        case 'P256PublicKeyHash':
            tag = PublicKeyHashID.P256;
            break;
        default:
            throw new Error(`unexpected address type: ${a.type}`);
    }
    w.writeUint8(tag);
    w.writeBytes(Array.from(a.hash));
}
function writeAddress(a, w) {
    if (a.type === 'ContractHash') {
        w.writeUint8(ContractID.Originated);
        w.writeBytes(Array.from(a.hash));
        w.writeUint8(0);
    }
    else {
        w.writeUint8(ContractID.Implicit);
        writePublicKeyHash(a, w);
    }
    if (a.entryPoint !== undefined && a.entryPoint !== '' && a.entryPoint !== 'default') {
        const enc = new TextEncoder();
        const bytes = enc.encode(a.entryPoint);
        w.writeBytes(Array.from(bytes));
    }
}
var PublicKeyID;
(function (PublicKeyID) {
    PublicKeyID[PublicKeyID["ED25519"] = 0] = "ED25519";
    PublicKeyID[PublicKeyID["SECP256K1"] = 1] = "SECP256K1";
    PublicKeyID[PublicKeyID["P256"] = 2] = "P256";
})(PublicKeyID || (PublicKeyID = {}));
function readPublicKey(rd) {
    let ln;
    let type;
    const tag = rd.readUint8();
    switch (tag) {
        case PublicKeyID.ED25519:
            type = 'ED25519PublicKey';
            ln = 32;
            break;
        case PublicKeyID.SECP256K1:
            type = 'SECP256K1PublicKey';
            ln = 33;
            break;
        case PublicKeyID.P256:
            type = 'P256PublicKey';
            ln = 33;
            break;
        default:
            throw new Error(`unknown public key tag: ${tag}`);
    }
    return { type, publicKey: rd.readBytes(ln) };
}
function writePublicKey(pk, w) {
    let tag;
    switch (pk.type) {
        case 'ED25519PublicKey':
            tag = PublicKeyID.ED25519;
            break;
        case 'SECP256K1PublicKey':
            tag = PublicKeyID.SECP256K1;
            break;
        case 'P256PublicKey':
            tag = PublicKeyID.P256;
            break;
        default:
            throw new Error(`unexpected public key type: ${pk.type}`);
    }
    w.writeUint8(tag);
    w.writeBytes(Array.from(pk.publicKey));
}
function writeExpr(expr, wr, tf) {
    var _a, _b;
    const [e, args] = tf(expr);
    if (Array.isArray(e)) {
        const w = new Writer();
        for (const v of e) {
            const a = args.next();
            if (a.done) {
                throw new Error('REPORT ME: iterator is done');
            }
            writeExpr(v, w, a.value);
        }
        wr.writeUint8(Tag.Sequence);
        wr.writeUint32(w.length);
        wr.writeBytes(w.buffer);
        return;
    }
    if ('string' in e) {
        const enc = new TextEncoder();
        const bytes = enc.encode(e.string);
        wr.writeUint8(Tag.String);
        wr.writeUint32(bytes.length);
        wr.writeBytes(Array.from(bytes));
        return;
    }
    if ('int' in e) {
        wr.writeUint8(Tag.Int);
        let val = BigInt(e.int);
        const sign = val < 0;
        if (sign) {
            val = -val;
        }
        let i = 0;
        do {
            const bits = i === 0 ? BigInt(6) : BigInt(7);
            let byte = val & ((BigInt(1) << bits) - BigInt(1));
            val >>= bits;
            if (val) {
                byte |= BigInt(0x80);
            }
            if (i === 0 && sign) {
                byte |= BigInt(0x40);
            }
            wr.writeUint8(Number(byte));
            i++;
        } while (val);
        return;
    }
    if ('bytes' in e) {
        const bytes = utils_1.parseHex(e.bytes);
        wr.writeUint8(Tag.Bytes);
        wr.writeUint32(bytes.length);
        wr.writeBytes(bytes);
        return;
    }
    const prim = primTags[e.prim];
    if (prim === undefined) {
        throw new TypeError(`Can't encode primary: ${e.prim}`);
    }
    const tag = (((_a = e.args) === null || _a === void 0 ? void 0 : _a.length) || 0) < 3
        ? Tag.Prim0 +
            (((_b = e.args) === null || _b === void 0 ? void 0 : _b.length) || 0) * 2 +
            (e.annots === undefined || e.annots.length === 0 ? 0 : 1)
        : Tag.Prim;
    wr.writeUint8(tag);
    wr.writeUint8(prim);
    if (e.args !== undefined) {
        if (e.args.length < 3) {
            for (const v of e.args) {
                const a = args.next();
                if (a.done) {
                    throw new Error('REPORT ME: iterator is done');
                }
                writeExpr(v, wr, a.value);
            }
        }
        else {
            const w = new Writer();
            for (const v of e.args) {
                const a = args.next();
                if (a.done) {
                    throw new Error('REPORT ME: iterator is done');
                }
                writeExpr(v, w, a.value);
            }
            wr.writeUint32(w.length);
            wr.writeBytes(w.buffer);
        }
    }
    if (e.annots !== undefined && e.annots.length !== 0) {
        const enc = new TextEncoder();
        const bytes = enc.encode(e.annots.join(' '));
        wr.writeUint32(bytes.length);
        wr.writeBytes(Array.from(bytes));
    }
    else if (e.args !== undefined && e.args.length >= 3) {
        wr.writeUint32(0);
    }
}
function readExpr(rd, tf) {
    function* passThrough() {
        while (true) {
            yield readPassThrough;
        }
    }
    const [args, tr] = tf;
    const tag = rd.readUint8();
    switch (tag) {
        case Tag.Int: {
            const buf = [];
            let byte;
            do {
                byte = rd.readInt8();
                buf.push(byte);
            } while ((byte & 0x80) !== 0);
            let val = BigInt(0);
            let sign = false;
            for (let i = buf.length - 1; i >= 0; i--) {
                const bits = i === 0 ? BigInt(6) : BigInt(7);
                const byte = BigInt(buf[i]);
                val <<= bits;
                val |= byte & ((BigInt(1) << bits) - BigInt(1));
                if (i === 0) {
                    sign = !!(byte & BigInt(0x40));
                }
            }
            if (sign) {
                val = -val;
            }
            return tr({ int: String(val) });
        }
        case Tag.String: {
            const length = rd.readUint32();
            const bytes = rd.readBytes(length);
            const dec = new TextDecoder();
            return tr({ string: dec.decode(new Uint8Array(bytes)) });
        }
        case Tag.Bytes: {
            const length = rd.readUint32();
            const bytes = rd.readBytes(length);
            const hex = utils_1.hexBytes(Array.from(bytes));
            return tr({ bytes: hex });
        }
        case Tag.Sequence: {
            const length = rd.readUint32();
            let res = [];
            let savedrd = rd.copy();
            // make two passes
            let it = passThrough();
            for (let n = 0; n < 2; n++) {
                const r = savedrd.reader(length);
                res = [];
                while (r.length > 0) {
                    const a = it.next();
                    if (a.done) {
                        throw new Error('REPORT ME: iterator is done');
                    }
                    res.push(readExpr(r, a.value));
                }
                // make a second pass with injected side effects
                it = args(res);
                savedrd = rd;
            }
            return tr(res);
        }
        default: {
            if (tag > 9) {
                throw new Error(`Unknown tag: ${tag}`);
            }
            const p = rd.readUint8();
            if (p >= primitives.length) {
                throw new Error(`Unknown primitive tag: ${p}`);
            }
            const prim = primitives[p];
            const argn = (tag - 3) >> 1;
            let res = { prim };
            // make two passes
            let it = passThrough();
            let savedrd = rd.copy();
            for (let n = 0; n < 2; n++) {
                res = { prim };
                if (argn < 3) {
                    for (let i = 0; i < argn; i++) {
                        const a = it.next();
                        if (a.done) {
                            throw new Error('REPORT ME: iterator is done');
                        }
                        res.args = res.args || [];
                        res.args.push(readExpr(savedrd, a.value));
                    }
                }
                else {
                    res.args = res.args || [];
                    const length = savedrd.readUint32();
                    const r = savedrd.reader(length);
                    while (r.length > 0) {
                        const a = it.next();
                        if (a.done) {
                            throw new Error('REPORT ME: iterator is done');
                        }
                        res.args.push(readExpr(r, a.value));
                    }
                }
                // make a second pass with injected side effects
                it = args(res);
                savedrd = rd;
            }
            if (((tag - 3) & 1) === 1 || argn === 3) {
                // read annotations
                const length = rd.readUint32();
                if (length !== 0) {
                    const bytes = rd.readBytes(length);
                    const dec = new TextDecoder();
                    res.annots = dec.decode(new Uint8Array(bytes)).split(' ');
                }
            }
            return tr(res);
        }
    }
}
const isOrData = (e) => 'prim' in e && (e.prim === 'Left' || e.prim === 'Right');
const isOptionData = (e) => 'prim' in e && (e.prim === 'Some' || e.prim === 'None');
const getWriteTransformFunc = (t) => {
    if (utils_1.isPairType(t)) {
        return (d) => {
            if (!utils_1.isPairData(d)) {
                throw new utils_1.MichelsonTypeError(t, d, `pair expected: ${JSON.stringify(d)}`);
            }
            michelson_validator_1.assertDataListIfAny(d);
            // combs aren't used in pack format
            const tc = utils_1.unpackComb('pair', t);
            const dc = utils_1.unpackComb('Pair', d);
            return [
                dc,
                (function* () {
                    for (const a of tc.args) {
                        yield getWriteTransformFunc(a);
                    }
                })(),
            ];
        };
    }
    switch (t.prim) {
        case 'or':
            return (d) => {
                if (!isOrData(d)) {
                    throw new utils_1.MichelsonTypeError(t, d, `or expected: ${JSON.stringify(d)}`);
                }
                return [
                    d,
                    (function* () {
                        yield getWriteTransformFunc(t.args[d.prim === 'Left' ? 0 : 1]);
                    })(),
                ];
            };
        case 'option':
            return (d) => {
                if (!isOptionData(d)) {
                    throw new utils_1.MichelsonTypeError(t, d, `option expected: ${JSON.stringify(d)}`);
                }
                return [
                    d,
                    (function* () {
                        const dd = d;
                        if (dd.prim === 'Some') {
                            yield getWriteTransformFunc(t.args[0]);
                        }
                    })(),
                ];
            };
        case 'list':
        case 'set':
            return (d) => {
                if (!Array.isArray(d)) {
                    throw new utils_1.MichelsonTypeError(t, d, `${t.prim} expected: ${JSON.stringify(d)}`);
                }
                return [
                    d,
                    (function* () {
                        for (const _v of d) {
                            yield getWriteTransformFunc(t.args[0]);
                        }
                    })(),
                ];
            };
        case 'map':
            return (d) => {
                if (!Array.isArray(d)) {
                    throw new utils_1.MichelsonTypeError(t, d, `map expected: ${JSON.stringify(d)}`);
                }
                return [
                    d,
                    (function* () {
                        for (const _elt of d) {
                            yield (elt) => {
                                if (!('prim' in elt) || elt.prim !== 'Elt') {
                                    throw new utils_1.MichelsonTypeError(t, elt, `map element expected: ${JSON.stringify(elt)}`);
                                }
                                return [
                                    elt,
                                    (function* () {
                                        for (const a of t.args) {
                                            yield getWriteTransformFunc(a);
                                        }
                                    })(),
                                ];
                            };
                        }
                    })(),
                ];
            };
        case 'chain_id':
            return (d) => {
                if (!('bytes' in d) && !('string' in d)) {
                    throw new utils_1.MichelsonTypeError(t, d, `chain id expected: ${JSON.stringify(d)}`);
                }
                let bytes;
                if ('string' in d) {
                    const id = utils_1.checkDecodeTezosID(d.string, 'ChainID');
                    if (id === null) {
                        throw new utils_1.MichelsonTypeError(t, d, `chain id base58 expected: ${d.string}`);
                    }
                    bytes = { bytes: utils_1.hexBytes(id[1]) };
                }
                else {
                    bytes = d;
                }
                return [bytes, [][Symbol.iterator]()];
            };
        case 'signature':
            return (d) => {
                if (!('bytes' in d) && !('string' in d)) {
                    throw new utils_1.MichelsonTypeError(t, d, `signature expected: ${JSON.stringify(d)}`);
                }
                let bytes;
                if ('string' in d) {
                    const sig = utils_1.checkDecodeTezosID(d.string, 'ED25519Signature', 'SECP256K1Signature', 'P256Signature', 'GenericSignature');
                    if (sig === null) {
                        throw new utils_1.MichelsonTypeError(t, d, `signature base58 expected: ${d.string}`);
                    }
                    bytes = { bytes: utils_1.hexBytes(sig[1]) };
                }
                else {
                    bytes = d;
                }
                return [bytes, [][Symbol.iterator]()];
            };
        case 'key_hash':
            return (d) => {
                if (!('bytes' in d) && !('string' in d)) {
                    throw new utils_1.MichelsonTypeError(t, d, `key hash expected: ${JSON.stringify(d)}`);
                }
                let bytes;
                if ('string' in d) {
                    const pkh = utils_1.checkDecodeTezosID(d.string, 'ED25519PublicKeyHash', 'SECP256K1PublicKeyHash', 'P256PublicKeyHash');
                    if (pkh === null) {
                        throw new utils_1.MichelsonTypeError(t, d, `key hash base58 expected: ${d.string}`);
                    }
                    const w = new Writer();
                    writePublicKeyHash({ type: pkh[0], hash: pkh[1] }, w);
                    bytes = { bytes: utils_1.hexBytes(w.buffer) };
                }
                else {
                    bytes = d;
                }
                return [bytes, [][Symbol.iterator]()];
            };
        case 'key':
            return (d) => {
                if (!('bytes' in d) && !('string' in d)) {
                    throw new utils_1.MichelsonTypeError(t, d, `public key expected: ${JSON.stringify(d)}`);
                }
                let bytes;
                if ('string' in d) {
                    const key = utils_1.checkDecodeTezosID(d.string, 'ED25519PublicKey', 'SECP256K1PublicKey', 'P256PublicKey');
                    if (key === null) {
                        throw new utils_1.MichelsonTypeError(t, d, `public key base58 expected: ${d.string}`);
                    }
                    const w = new Writer();
                    writePublicKey({ type: key[0], publicKey: key[1] }, w);
                    bytes = { bytes: utils_1.hexBytes(w.buffer) };
                }
                else {
                    bytes = d;
                }
                return [bytes, [][Symbol.iterator]()];
            };
        case 'address':
            return (d) => {
                if (!('bytes' in d) && !('string' in d)) {
                    throw new utils_1.MichelsonTypeError(t, d, `address expected: ${JSON.stringify(d)}`);
                }
                let bytes;
                if ('string' in d) {
                    const s = d.string.split('%');
                    const address = utils_1.checkDecodeTezosID(s[0], 'ED25519PublicKeyHash', 'SECP256K1PublicKeyHash', 'P256PublicKeyHash', 'ContractHash');
                    if (address === null) {
                        throw new utils_1.MichelsonTypeError(t, d, `address base58 expected: ${d.string}`);
                    }
                    const w = new Writer();
                    writeAddress({ type: address[0], hash: address[1], entryPoint: s.length > 1 ? s[1] : undefined }, w);
                    bytes = { bytes: utils_1.hexBytes(w.buffer) };
                }
                else {
                    bytes = d;
                }
                return [bytes, [][Symbol.iterator]()];
            };
        case 'timestamp':
            return (d) => {
                if (!('string' in d) && !('int' in d)) {
                    throw new utils_1.MichelsonTypeError(t, d, `timestamp expected: ${JSON.stringify(d)}`);
                }
                let int;
                if ('string' in d) {
                    const p = utils_1.parseDate(d);
                    if (p === null) {
                        throw new utils_1.MichelsonTypeError(t, d, `can't parse date: ${d.string}`);
                    }
                    int = { int: String(Math.floor(p.getTime() / 1000)) };
                }
                else {
                    int = d;
                }
                return [int, [][Symbol.iterator]()];
            };
        default:
            return writePassThrough;
    }
};
const isPushInstruction = (e) => 'prim' in e && e.prim === 'PUSH';
const writePassThrough = (e) => {
    if (isPushInstruction(e)) {
        michelson_validator_1.assertMichelsonInstruction(e);
        // capture inlined type definition
        return [
            e,
            (function* () {
                yield writePassThrough;
                yield getWriteTransformFunc(e.args[0]);
            })(),
        ];
    }
    return [
        e,
        (function* () {
            while (true) {
                yield writePassThrough;
            }
        })(),
    ];
};
/**
 * Serializes any value of packable type to its optimized binary representation
 * identical to the one used by PACK and UNPACK Michelson instructions.
 * Without a type definition (not recommended) the data will be encoded as a binary form of a generic Michelson expression.
 * Type definition allows some types like `timestamp` and `address` and other base58 representable types to be encoded to
 * corresponding optimized binary forms borrowed from the Tezos protocol
 *
 * ```typescript
 * const data: MichelsonData = {
 *     string: "KT1RvkwF4F7pz1gCoxkyZrG1RkrxQy3gmFTv%foo"
 * };
 *
 * const typ: MichelsonType = {
 *     prim: "address"
 * };
 *
 * const packed = packData(data, typ);
 *
 * // 050a0000001901be41ee922ddd2cf33201e49d32da0afec571dce300666f6f
 * ```
 *
 * Without a type definition the base58 encoded address will be treated as a string
 * ```typescript
 * const data: MichelsonData = {
 *     string: "KT1RvkwF4F7pz1gCoxkyZrG1RkrxQy3gmFTv%foo"
 * };
 *
 * const packed = packData(data);
 *
 * // 0501000000284b543152766b7746344637707a3167436f786b795a724731526b7278517933676d46547625666f6f
 * ```
 * @param d Data object
 * @param t Optional type definition
 * @returns Binary representation as numeric array
 */
function packData(d, t) {
    const w = new Writer();
    w.writeUint8(5);
    writeExpr(d, w, t !== undefined ? getWriteTransformFunc(t) : writePassThrough);
    return w.buffer;
}
exports.packData = packData;
/**
 * Serializes any value of packable type to its optimized binary representation
 * identical to the one used by PACK and UNPACK Michelson instructions.
 * Same as {@link packData} but returns a `bytes` Michelson data literal instead of an array
 *
 * ```typescript
 * const data: MichelsonData = {
 *     string: "2019-09-26T10:59:51Z"
 * };
 *
 * const typ: MichelsonType = {
 *     prim: "timestamp"
 * };
 *
 * const packed = packDataBytes(data, typ);
 *
 * // { bytes: "0500a7e8e4d80b" }
 * ```
 * @param d Data object
 * @param t Optional type definition
 * @returns Binary representation as a bytes literal
 */
function packDataBytes(d, t) {
    return { bytes: utils_1.hexBytes(packData(d, t)) };
}
exports.packDataBytes = packDataBytes;
const getReadTransformFuncs = (t) => {
    if (utils_1.isPairType(t)) {
        const args = Array.isArray(t) ? t : t.args;
        return [
            (d) => {
                if (!utils_1.isPairData(d)) {
                    throw new utils_1.MichelsonTypeError(t, d, `pair expected: ${JSON.stringify(d)}`);
                }
                return (function* () {
                    for (const a of args) {
                        yield getReadTransformFuncs(a);
                    }
                })();
            },
            (d) => d,
        ];
    }
    switch (t.prim) {
        case 'or':
            return [
                (d) => {
                    if (!isOrData(d)) {
                        throw new utils_1.MichelsonTypeError(t, d, `or expected: ${JSON.stringify(d)}`);
                    }
                    return (function* () {
                        yield getReadTransformFuncs(t.args[d.prim === 'Left' ? 0 : 1]);
                    })();
                },
                (d) => d,
            ];
        case 'option':
            return [
                (d) => {
                    if (!isOptionData(d)) {
                        throw new utils_1.MichelsonTypeError(t, d, `option expected: ${JSON.stringify(d)}`);
                    }
                    return (function* () {
                        if (d.prim === 'Some') {
                            yield getReadTransformFuncs(t.args[0]);
                        }
                    })();
                },
                (d) => d,
            ];
        case 'list':
        case 'set':
            return [
                (d) => {
                    if (!Array.isArray(d)) {
                        throw new utils_1.MichelsonTypeError(t, d, `${t.prim} expected: ${JSON.stringify(d)}`);
                    }
                    return (function* () {
                        while (true) {
                            yield getReadTransformFuncs(t.args[0]);
                        }
                    })();
                },
                (d) => d,
            ];
        case 'map':
            return [
                (d) => {
                    if (!Array.isArray(d)) {
                        throw new utils_1.MichelsonTypeError(t, d, `map expected: ${JSON.stringify(d)}`);
                    }
                    return (function* () {
                        while (true) {
                            yield [
                                (elt) => {
                                    if (!('prim' in elt) || elt.prim !== 'Elt') {
                                        throw new utils_1.MichelsonTypeError(t, elt, `map element expected: ${JSON.stringify(elt)}`);
                                    }
                                    return (function* () {
                                        for (const a of t.args) {
                                            yield getReadTransformFuncs(a);
                                        }
                                    })();
                                },
                                (elt) => elt,
                            ];
                        }
                    })();
                },
                (d) => d,
            ];
        case 'chain_id':
            return [
                () => [][Symbol.iterator](),
                (d) => {
                    if (!('bytes' in d) && !('string' in d)) {
                        throw new utils_1.MichelsonTypeError(t, d, `chain id expected: ${JSON.stringify(d)}`);
                    }
                    if ('string' in d) {
                        return d;
                    }
                    const bytes = utils_1.parseBytes(d.bytes);
                    if (bytes === null) {
                        throw new utils_1.MichelsonTypeError(t, d, `can't parse bytes: ${d.bytes}`);
                    }
                    return { string: utils_1.encodeTezosID('ChainID', bytes) };
                },
            ];
        case 'signature':
            return [
                () => [][Symbol.iterator](),
                (d) => {
                    if (!('bytes' in d) && !('string' in d)) {
                        throw new utils_1.MichelsonTypeError(t, d, `signature expected: ${JSON.stringify(d)}`);
                    }
                    if ('string' in d) {
                        return d;
                    }
                    const bytes = utils_1.parseBytes(d.bytes);
                    if (bytes === null) {
                        throw new utils_1.MichelsonTypeError(t, d, `can't parse bytes: ${d.bytes}`);
                    }
                    return { string: utils_1.encodeTezosID('GenericSignature', bytes) };
                },
            ];
        case 'key_hash':
            return [
                () => [][Symbol.iterator](),
                (d) => {
                    if (!('bytes' in d) && !('string' in d)) {
                        throw new utils_1.MichelsonTypeError(t, d, `key hash expected: ${JSON.stringify(d)}`);
                    }
                    if ('string' in d) {
                        return d;
                    }
                    const bytes = utils_1.parseBytes(d.bytes);
                    if (bytes === null) {
                        throw new utils_1.MichelsonTypeError(t, d, `can't parse bytes: ${d.bytes}`);
                    }
                    const rd = new Reader(new Uint8Array(bytes));
                    const addr = readPublicKeyHash(rd);
                    return {
                        string: utils_1.encodeTezosID(addr.type, addr.hash) + (addr.entryPoint ? '%' + addr.entryPoint : ''),
                    };
                },
            ];
        case 'key':
            return [
                () => [][Symbol.iterator](),
                (d) => {
                    if (!('bytes' in d) && !('string' in d)) {
                        throw new utils_1.MichelsonTypeError(t, d, `public key expected: ${JSON.stringify(d)}`);
                    }
                    if ('string' in d) {
                        return d;
                    }
                    const bytes = utils_1.parseBytes(d.bytes);
                    if (bytes === null) {
                        throw new utils_1.MichelsonTypeError(t, d, `can't parse bytes: ${d.bytes}`);
                    }
                    const rd = new Reader(new Uint8Array(bytes));
                    const pk = readPublicKey(rd);
                    return { string: utils_1.encodeTezosID(pk.type, pk.publicKey) };
                },
            ];
        case 'address':
            return [
                () => [][Symbol.iterator](),
                (d) => {
                    if (!('bytes' in d) && !('string' in d)) {
                        throw new utils_1.MichelsonTypeError(t, d, `address expected: ${JSON.stringify(d)}`);
                    }
                    if ('string' in d) {
                        return d;
                    }
                    const bytes = utils_1.parseBytes(d.bytes);
                    if (bytes === null) {
                        throw new utils_1.MichelsonTypeError(t, d, `can't parse bytes: ${d.bytes}`);
                    }
                    const rd = new Reader(new Uint8Array(bytes));
                    const addr = readAddress(rd);
                    return {
                        string: utils_1.encodeTezosID(addr.type, addr.hash) + (addr.entryPoint ? '%' + addr.entryPoint : ''),
                    };
                },
            ];
        case 'timestamp':
            return [
                () => [][Symbol.iterator](),
                (d) => {
                    if (!('int' in d) && !('string' in d)) {
                        throw new utils_1.MichelsonTypeError(t, d, `address expected: ${JSON.stringify(d)}`);
                    }
                    if ('string' in d) {
                        return d;
                    }
                    const date = new Date(parseInt(d.int, 10) * 1000);
                    return { string: date.toISOString().slice(0, 19) + 'Z' };
                },
            ];
        default:
            return readPassThrough;
    }
};
const readPassThrough = [
    (e) => {
        if (isPushInstruction(e)) {
            michelson_validator_1.assertMichelsonInstruction(e);
            // capture inlined type definition
            return (function* () {
                yield readPassThrough;
                yield getReadTransformFuncs(e.args[0]);
            })();
        }
        return (function* () {
            while (true) {
                yield readPassThrough;
            }
        })();
    },
    (e) => e,
];
/**
 * Deserialize a byte array into the corresponding Michelson value.
 * Without a type definition (not recommended) the binary data will be treated as a binary form of a generic Michelson expression and returned as is.
 * Type definition allows some types like `timestamp` and `address` and other types usually encoded in optimized binary forms to be transformed
 * back to their string representations like base58 and ISO timestamps.
 *
 * ```typescript
 * const src = [0x05, 0x00, 0xa7, 0xe8, 0xe4, 0xd8, 0x0b];
 *
 * const typ: MichelsonType = {
 *     prim: "timestamp"
 * };
 *
 * const data = unpackData(src, typ);
 *
 * // { string: "2019-09-26T10:59:51Z" }
 * ```
 *
 * Same binary data without a type definition
 * ```typescript
 * const src = [0x05, 0x00, 0xa7, 0xe8, 0xe4, 0xd8, 0x0b];
 *
 * const data = unpackData(src);
 *
 * // { int: "1569495591" }
 * ```
 * @param src Byte array
 * @param t Optional type definition
 * @returns Deserialized data
 */
function unpackData(src, t) {
    const r = new Reader(src);
    if (r.readUint8() !== 5) {
        throw new Error('incorrect packed data magic number');
    }
    const ex = readExpr(r, t !== undefined ? getReadTransformFuncs(t) : readPassThrough);
    if (michelson_validator_1.assertMichelsonData(ex)) {
        return ex;
    }
    throw new Error(); // never
}
exports.unpackData = unpackData;
/**
 * Deserialize a byte array into the corresponding Michelson value.
 * Same as {@link unpackData} but takes a `bytes` Michelson data literal instead of an array
 *
 * ```typescript
 * const src = { bytes: "0500a7e8e4d80b" };
 *
 * const typ: MichelsonType = {
 *     prim: "timestamp"
 * };
 *
 * const data = unpackDataBytes(src, typ);
 *
 * // { string: "2019-09-26T10:59:51Z" }
 * ```
 * @param src Bytes object
 * @param t Optional type definition
 * @returns Deserialized data
 */
function unpackDataBytes(src, t) {
    const bytes = utils_1.parseBytes(src.bytes);
    if (bytes === null) {
        throw new Error(`can't parse bytes: "${src.bytes}"`);
    }
    return unpackData(bytes, t);
}
exports.unpackDataBytes = unpackDataBytes;
// helper functions also used by validator
function decodeAddressBytes(b) {
    const bytes = utils_1.parseBytes(b.bytes);
    if (bytes === null) {
        throw new Error(`can't parse bytes: "${b.bytes}"`);
    }
    const rd = new Reader(new Uint8Array(bytes));
    return readAddress(rd);
}
exports.decodeAddressBytes = decodeAddressBytes;
function decodePublicKeyHashBytes(b) {
    const bytes = utils_1.parseBytes(b.bytes);
    if (bytes === null) {
        throw new Error(`can't parse bytes: "${b.bytes}"`);
    }
    const rd = new Reader(new Uint8Array(bytes));
    return readPublicKeyHash(rd);
}
exports.decodePublicKeyHashBytes = decodePublicKeyHashBytes;
function decodePublicKeyBytes(b) {
    const bytes = utils_1.parseBytes(b.bytes);
    if (bytes === null) {
        throw new Error(`can't parse bytes: "${b.bytes}"`);
    }
    const rd = new Reader(new Uint8Array(bytes));
    return readPublicKey(rd);
}
exports.decodePublicKeyBytes = decodePublicKeyBytes;
//# sourceMappingURL=binary.js.map