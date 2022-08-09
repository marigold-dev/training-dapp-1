"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitMicheline = void 0;
const micheline_1 = require("./micheline");
class Formatter {
    constructor(opt, lev = 0) {
        this.opt = opt;
        this.lev = lev;
    }
    indent(n = 0) {
        var _a;
        let ret = '';
        if (((_a = this.opt) === null || _a === void 0 ? void 0 : _a.indent) !== undefined) {
            for (let i = this.lev + n; i > 0; i--) {
                ret += this.opt.indent;
            }
        }
        return ret;
    }
    get lf() {
        var _a;
        return ((_a = this.opt) === null || _a === void 0 ? void 0 : _a.newline) || '';
    }
    get lfsp() {
        var _a;
        return ((_a = this.opt) === null || _a === void 0 ? void 0 : _a.newline) || ' ';
    }
    down(n) {
        return new Formatter(this.opt, this.lev + n);
    }
}
function hasArgs(node) {
    return ('prim' in node &&
        ((node.annots !== undefined && node.annots.length !== 0) ||
            (node.args !== undefined && node.args.length !== 0)));
}
function isMultiline(node) {
    if (node.args !== undefined) {
        for (const a of node.args) {
            if (Array.isArray(a) || hasArgs(a)) {
                return true;
            }
        }
    }
    return false;
}
function emitExpr(node, f, foldMacros) {
    var _a;
    const macro = (_a = node[micheline_1.sourceReference]) === null || _a === void 0 ? void 0 : _a.macro;
    if (foldMacros && macro) {
        return emitExpr(macro, f, foldMacros);
    }
    if (Array.isArray(node)) {
        return emitSeq(node, f, foldMacros);
    }
    else if ('string' in node) {
        return JSON.stringify(node.string);
    }
    else if ('int' in node) {
        return node.int;
    }
    else if ('bytes' in node) {
        return '0x' + node.bytes;
    }
    else {
        if ((node.annots === undefined || node.annots.length === 0) &&
            (node.args === undefined || node.args.length === 0)) {
            return node.prim;
        }
        let ret = '(' + node.prim;
        if (node.annots !== undefined) {
            for (const a of node.annots) {
                ret += ' ' + a;
            }
        }
        if (node.args !== undefined) {
            const multiline = isMultiline(node);
            for (const a of node.args) {
                if (multiline) {
                    ret += f.lfsp + f.indent(1) + emitExpr(a, f.down(1), foldMacros);
                }
                else {
                    ret += ' ' + emitExpr(a, f, foldMacros);
                }
            }
        }
        return ret + ')';
    }
}
function emitSeq(node, f, foldMacros) {
    let ret = '{' + f.lf;
    let i = node.length;
    for (const el of node) {
        ret += f.indent(1);
        if ('prim' in el) {
            ret += el.prim;
            if (el.annots !== undefined) {
                for (const a of el.annots) {
                    ret += ' ' + a;
                }
            }
            if (el.args !== undefined) {
                const multiline = isMultiline(el);
                for (const a of el.args) {
                    if (multiline) {
                        ret += f.lfsp + f.indent(2) + emitExpr(a, f.down(2), foldMacros);
                    }
                    else {
                        ret += ' ' + emitExpr(a, f, foldMacros);
                    }
                }
            }
        }
        else {
            ret += emitExpr(el, f.down(1), foldMacros);
        }
        ret += i > 1 ? ';' + f.lfsp : f.lf;
        i--;
    }
    return ret + f.indent() + '}';
}
/**
 * Formats Micheline expression
 * @param expr An AST node
 * @param opt Options
 */
function emitMicheline(expr, opt, foldMacros = false) {
    if (typeof expr !== 'object') {
        throw new TypeError(`object type was expected, got ${typeof expr} instead`);
    }
    return emitExpr(expr, new Formatter(opt), foldMacros);
}
exports.emitMicheline = emitMicheline;
//# sourceMappingURL=micheline-emitter.js.map