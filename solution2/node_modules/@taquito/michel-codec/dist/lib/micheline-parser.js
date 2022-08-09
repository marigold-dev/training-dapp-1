"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = exports.JSONParseError = exports.MichelineParseError = void 0;
const scan_1 = require("./scan");
const micheline_1 = require("./micheline");
const macros_1 = require("./macros");
const global_constants_1 = require("./global-constants");
/**
 *  @category Error
 *  @description Error indicating a failure when parsing Micheline expressions
 */
class MichelineParseError extends Error {
    /**
     * @param token A token caused the error
     * @param message An error message
     */
    constructor(token, message) {
        super(message);
        this.token = token;
        Object.setPrototypeOf(this, MichelineParseError.prototype);
    }
}
exports.MichelineParseError = MichelineParseError;
/**
 *  @category Error
 *  @description Error that inidicates a failure when parsing Micheline JSON
 */
class JSONParseError extends Error {
    /**
     * @param node A node caused the error
     * @param message An error message
     */
    constructor(node, message) {
        super(message);
        this.node = node;
        Object.setPrototypeOf(this, JSONParseError.prototype);
    }
}
exports.JSONParseError = JSONParseError;
const errEOF = new MichelineParseError(null, 'Unexpected EOF');
function isAnnotation(tok) {
    return tok.t === scan_1.Literal.Ident && (tok.v[0] === '@' || tok.v[0] === '%' || tok.v[0] === ':');
}
const intRe = new RegExp('^-?[0-9]+$');
const bytesRe = new RegExp('^([0-9a-fA-F]{2})*$');
/**
 * Converts and validates Michelson expressions between JSON-based Michelson and Micheline
 *
 * Pretty Print a Michelson Smart Contract:
 * ```
 * const contract = await Tezos.contract.at("KT1Vsw3kh9638gqWoHTjvHCoHLPKvCbMVbCg");
 * const p = new Parser();
 *
 * const michelsonCode = p.parseJSON(contract.script.code);
 * const storage = p.parseJSON(contract.script.storage);
 *
 * console.log("Pretty print Michelson smart contract:");
 * console.log(emitMicheline(michelsonCode, {indent:"    ", newline: "\n",}));
 *
 * console.log("Pretty print Storage:");
 * console.log(emitMicheline(storage, {indent:"    ", newline: "\n",}));
 * ```
 *
 * Encode a Michelson expression for inital storage of a smart contract
 * ```
 * const src = `(Pair (Pair { Elt 1
 *                (Pair (Pair "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")
 *                      0x0501000000026869) }
 *          10000000)
 *    (Pair 2 333))`;
 *
 * const p = new Parser();
 *
 * const exp = p.parseMichelineExpression(src);
 * console.log(JSON.stringify(exp));
 * ```
 */
class Parser {
    constructor(opt) {
        this.opt = opt;
    }
    expand(ex) {
        var _a, _b, _c;
        if (((_a = this.opt) === null || _a === void 0 ? void 0 : _a.expandGlobalConstant) !== undefined && ex.prim === 'constant') {
            const ret = global_constants_1.expandGlobalConstants(ex, this.opt.expandGlobalConstant);
            if (ret !== ex) {
                ret[micheline_1.sourceReference] = Object.assign(Object.assign({}, (ex[micheline_1.sourceReference] || { first: 0, last: 0 })), { globalConstant: ex });
            }
            return ret;
        }
        if (((_b = this.opt) === null || _b === void 0 ? void 0 : _b.expandMacros) !== undefined ? (_c = this.opt) === null || _c === void 0 ? void 0 : _c.expandMacros : true) {
            const ret = macros_1.expandMacros(ex, this.opt);
            if (ret !== ex) {
                ret[micheline_1.sourceReference] = Object.assign(Object.assign({}, (ex[micheline_1.sourceReference] || { first: 0, last: 0 })), { macro: ex });
            }
            return ret;
        }
        else {
            return ex;
        }
    }
    parseListExpr(scanner, start) {
        var _a;
        const ref = {
            first: start.first,
            last: start.last,
        };
        const expectBracket = start.t === '(';
        let tok;
        if (expectBracket) {
            tok = scanner.next();
            if (tok.done) {
                throw errEOF;
            }
            ref.last = tok.value.last;
        }
        else {
            tok = { value: start };
        }
        if (tok.value.t !== scan_1.Literal.Ident) {
            throw new MichelineParseError(tok.value, `not an identifier: ${tok.value.v}`);
        }
        const ret = {
            prim: tok.value.v,
            [micheline_1.sourceReference]: ref,
        };
        for (;;) {
            const tok = scanner.next();
            if (tok.done) {
                if (expectBracket) {
                    throw errEOF;
                }
                break;
            }
            else if (tok.value.t === ')') {
                if (!expectBracket) {
                    throw new MichelineParseError(tok.value, 'unexpected closing bracket');
                }
                ref.last = tok.value.last;
                break;
            }
            else if (isAnnotation(tok.value)) {
                ret.annots = ret.annots || [];
                ret.annots.push(tok.value.v);
                ref.last = tok.value.last;
            }
            else {
                ret.args = ret.args || [];
                const arg = this.parseExpr(scanner, tok.value);
                ref.last = ((_a = arg[micheline_1.sourceReference]) === null || _a === void 0 ? void 0 : _a.last) || ref.last;
                ret.args.push(arg);
            }
        }
        return this.expand(ret);
    }
    parseArgs(scanner, start) {
        var _a;
        // Identifier with arguments
        const ref = {
            first: start.first,
            last: start.last,
        };
        const p = {
            prim: start.v,
            [micheline_1.sourceReference]: ref,
        };
        for (;;) {
            const t = scanner.next();
            if (t.done || t.value.t === '}' || t.value.t === ';') {
                return [p, t];
            }
            if (isAnnotation(t.value)) {
                ref.last = t.value.last;
                p.annots = p.annots || [];
                p.annots.push(t.value.v);
            }
            else {
                const arg = this.parseExpr(scanner, t.value);
                ref.last = ((_a = arg[micheline_1.sourceReference]) === null || _a === void 0 ? void 0 : _a.last) || ref.last;
                p.args = p.args || [];
                p.args.push(arg);
            }
        }
    }
    parseSequenceExpr(scanner, start) {
        var _a, _b;
        const ref = {
            first: start.first,
            last: start.last,
        };
        const seq = [];
        seq[micheline_1.sourceReference] = ref;
        const expectBracket = start.t === '{';
        let tok = start.t === '{' ? null : { value: start };
        for (;;) {
            if (tok === null) {
                tok = scanner.next();
                if (!tok.done) {
                    ref.last = tok.value.last;
                }
            }
            if (tok.done) {
                if (expectBracket) {
                    throw errEOF;
                }
                else {
                    return seq;
                }
            }
            if (tok.value.t === '}') {
                if (!expectBracket) {
                    throw new MichelineParseError(tok.value, 'unexpected closing bracket');
                }
                else {
                    return seq;
                }
            }
            else if (tok.value.t === scan_1.Literal.Ident) {
                // Identifier with arguments
                const [itm, n] = this.parseArgs(scanner, tok.value);
                ref.last = ((_a = itm[micheline_1.sourceReference]) === null || _a === void 0 ? void 0 : _a.last) || ref.last;
                seq.push(this.expand(itm));
                tok = n;
            }
            else {
                // Other
                const ex = this.parseExpr(scanner, tok.value);
                ref.last = ((_b = ex[micheline_1.sourceReference]) === null || _b === void 0 ? void 0 : _b.last) || ref.last;
                seq.push(ex);
                tok = null;
            }
            if (tok === null) {
                tok = scanner.next();
                if (!tok.done) {
                    ref.last = tok.value.last;
                }
            }
            if (!tok.done && tok.value.t === ';') {
                tok = null;
            }
        }
    }
    parseExpr(scanner, tok) {
        switch (tok.t) {
            case scan_1.Literal.Ident:
                return this.expand({
                    prim: tok.v,
                    [micheline_1.sourceReference]: { first: tok.first, last: tok.last },
                });
            case scan_1.Literal.Number:
                return { int: tok.v, [micheline_1.sourceReference]: { first: tok.first, last: tok.last } };
            case scan_1.Literal.String:
                return {
                    string: JSON.parse(tok.v),
                    [micheline_1.sourceReference]: { first: tok.first, last: tok.last },
                };
            case scan_1.Literal.Bytes:
                return { bytes: tok.v.slice(2), [micheline_1.sourceReference]: { first: tok.first, last: tok.last } };
            case '{':
                return this.parseSequenceExpr(scanner, tok);
            default:
                return this.parseListExpr(scanner, tok);
        }
    }
    /**
     * Parses a Micheline sequence expression, such as smart contract source. Enclosing curly brackets may be omitted.
     * @param src A Micheline sequence `{parameter ...; storage int; code { DUP ; ...};}` or `parameter ...; storage int; code { DUP ; ...};`
     */
    parseSequence(src) {
        if (typeof src !== 'string') {
            throw new TypeError(`string type was expected, got ${typeof src} instead`);
        }
        const scanner = scan_1.scan(src);
        const tok = scanner.next();
        if (tok.done) {
            return null;
        }
        return this.parseSequenceExpr(scanner, tok.value);
    }
    /**
     * Parse a Micheline sequence expression. Enclosing curly brackets may be omitted.
     * @param src A Michelson list expression such as `(Pair {Elt "0" 0} 0)` or `Pair {Elt "0" 0} 0`
     * @returns An AST node or null for empty document.
     */
    parseList(src) {
        if (typeof src !== 'string') {
            throw new TypeError(`string type was expected, got ${typeof src} instead`);
        }
        const scanner = scan_1.scan(src);
        const tok = scanner.next();
        if (tok.done) {
            return null;
        }
        return this.parseListExpr(scanner, tok.value);
    }
    /**
     * Parse any Michelson expression
     * @param src A Michelson expression such as `(Pair {Elt "0" 0} 0)` or `{parameter ...; storage int; code { DUP ; ...};}`
     * @returns An AST node or null for empty document.
     */
    parseMichelineExpression(src) {
        if (typeof src !== 'string') {
            throw new TypeError(`string type was expected, got ${typeof src} instead`);
        }
        const scanner = scan_1.scan(src);
        const tok = scanner.next();
        if (tok.done) {
            return null;
        }
        return this.parseExpr(scanner, tok.value);
    }
    /**
     * Parse a Micheline sequence expression, such as smart contract source. Enclosing curly brackets may be omitted.
     * An alias for `parseSequence`
     * @param src A Micheline sequence `{parameter ...; storage int; code { DUP ; ...};}` or `parameter ...; storage int; code { DUP ; ...};`
     */
    parseScript(src) {
        return this.parseSequence(src);
    }
    /**
     * Parse a Micheline sequence expression. Enclosing curly brackets may be omitted.
     * An alias for `parseList`
     * @param src A Michelson list expression such as `(Pair {Elt "0" 0} 0)` or `Pair {Elt "0" 0} 0`
     * @returns An AST node or null for empty document.
     */
    parseData(src) {
        return this.parseList(src);
    }
    /**
     * Takes a JSON-encoded Michelson, validates it, strips away unneeded properties and optionally expands macros (See {@link ParserOptions}).
     * @param src An object containing JSON-encoded Michelson, usually returned by `JSON.parse()`
     */
    parseJSON(src) {
        if (typeof src !== 'object') {
            throw new TypeError(`object type was expected, got ${typeof src} instead`);
        }
        if (Array.isArray(src)) {
            const ret = [];
            for (const n of src) {
                if (n === null || typeof n !== 'object') {
                    throw new JSONParseError(n, `unexpected sequence element: ${n}`);
                }
                ret.push(this.parseJSON(n));
            }
            return ret;
        }
        else if ('prim' in src) {
            const p = src;
            if (typeof p.prim === 'string' &&
                (p.annots === undefined || Array.isArray(p.annots)) &&
                (p.args === undefined || Array.isArray(p.args))) {
                const ret = {
                    prim: p.prim,
                };
                if (p.annots !== undefined) {
                    for (const a of p.annots) {
                        if (typeof a !== 'string') {
                            throw new JSONParseError(a, `string expected: ${a}`);
                        }
                    }
                    ret.annots = p.annots;
                }
                if (p.args !== undefined) {
                    ret.args = [];
                    for (const a of p.args) {
                        if (a === null || typeof a !== 'object') {
                            throw new JSONParseError(a, `unexpected argument: ${a}`);
                        }
                        ret.args.push(this.parseJSON(a));
                    }
                }
                return this.expand(ret);
            }
            throw new JSONParseError(src, `malformed prim expression: ${src}`);
        }
        else if ('string' in src) {
            if (typeof src.string === 'string') {
                return { string: src.string };
            }
            throw new JSONParseError(src, `malformed string literal: ${src}`);
        }
        else if ('int' in src) {
            if (typeof src.int === 'string' && intRe.test(src.int)) {
                return { int: src.int };
            }
            throw new JSONParseError(src, `malformed int literal: ${src}`);
        }
        else if ('bytes' in src) {
            if (typeof src.bytes === 'string' &&
                bytesRe.test(src.bytes)) {
                return { bytes: src.bytes };
            }
            throw new JSONParseError(src, `malformed bytes literal: ${src}`);
        }
        else {
            throw new JSONParseError(src, `unexpected object: ${src}`);
        }
    }
}
exports.Parser = Parser;
//# sourceMappingURL=micheline-parser.js.map