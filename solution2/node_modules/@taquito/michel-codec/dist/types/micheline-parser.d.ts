import { Token } from './scan';
import { Expr } from './micheline';
import { ProtocolOptions } from './michelson-types';
/**
 *  @category Error
 *  @description Error indicating a failure when parsing Micheline expressions
 */
export declare class MichelineParseError extends Error {
    token: Token | null;
    /**
     * @param token A token caused the error
     * @param message An error message
     */
    constructor(token: Token | null, message?: string);
}
/**
 *  @category Error
 *  @description Error that inidicates a failure when parsing Micheline JSON
 */
export declare class JSONParseError extends Error {
    node: unknown;
    /**
     * @param node A node caused the error
     * @param message An error message
     */
    constructor(node: unknown, message?: string);
}
export interface GlobalConstantHashAndValue {
    [globalConstantHash: string]: Expr;
}
export interface ParserOptions extends ProtocolOptions {
    /**
     * Expand [Michelson macros](https://tezos.gitlab.io/whitedoc/michelson.html#macros) during parsing.
     */
    expandMacros?: boolean;
    /**
     * Expand global constants during parsing.
     * `expandGlobalConstant` expects an object where the keys are global constant hashes and the values are the corresponding JSON Micheline expressions.
     * @example
     * ```
     * const parserOptions: ParserOptions = {
     *  expandGlobalConstant: {
     *      'expr...': { prim: 'DROP', args: [{ int: '2' }] }
     *  }
     * }
     *
     * const p = new Parser(parserOptions);
     * ```
     */
    expandGlobalConstant?: GlobalConstantHashAndValue;
}
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
export declare class Parser {
    private opt?;
    constructor(opt?: ParserOptions | undefined);
    private expand;
    private parseListExpr;
    private parseArgs;
    private parseSequenceExpr;
    private parseExpr;
    /**
     * Parses a Micheline sequence expression, such as smart contract source. Enclosing curly brackets may be omitted.
     * @param src A Micheline sequence `{parameter ...; storage int; code { DUP ; ...};}` or `parameter ...; storage int; code { DUP ; ...};`
     */
    parseSequence(src: string): Expr[] | null;
    /**
     * Parse a Micheline sequence expression. Enclosing curly brackets may be omitted.
     * @param src A Michelson list expression such as `(Pair {Elt "0" 0} 0)` or `Pair {Elt "0" 0} 0`
     * @returns An AST node or null for empty document.
     */
    parseList(src: string): Expr | null;
    /**
     * Parse any Michelson expression
     * @param src A Michelson expression such as `(Pair {Elt "0" 0} 0)` or `{parameter ...; storage int; code { DUP ; ...};}`
     * @returns An AST node or null for empty document.
     */
    parseMichelineExpression(src: string): Expr | null;
    /**
     * Parse a Micheline sequence expression, such as smart contract source. Enclosing curly brackets may be omitted.
     * An alias for `parseSequence`
     * @param src A Micheline sequence `{parameter ...; storage int; code { DUP ; ...};}` or `parameter ...; storage int; code { DUP ; ...};`
     */
    parseScript(src: string): Expr[] | null;
    /**
     * Parse a Micheline sequence expression. Enclosing curly brackets may be omitted.
     * An alias for `parseList`
     * @param src A Michelson list expression such as `(Pair {Elt "0" 0} 0)` or `Pair {Elt "0" 0} 0`
     * @returns An AST node or null for empty document.
     */
    parseData(src: string): Expr | null;
    /**
     * Takes a JSON-encoded Michelson, validates it, strips away unneeded properties and optionally expands macros (See {@link ParserOptions}).
     * @param src An object containing JSON-encoded Michelson, usually returned by `JSON.parse()`
     */
    parseJSON(src: object): Expr;
}
