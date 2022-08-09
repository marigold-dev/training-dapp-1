import { OptionTokenSchema } from '../schema/types';
import { Token, TokenFactory, Semantic, ComparableToken, SemanticEncoding } from './token';
export declare class OptionToken extends ComparableToken {
    protected val: {
        prim: string;
        args: any[];
        annots: any[];
    };
    protected idx: number;
    protected fac: TokenFactory;
    static prim: 'option';
    constructor(val: {
        prim: string;
        args: any[];
        annots: any[];
    }, idx: number, fac: TokenFactory);
    subToken(): Token;
    schema(): Token;
    annot(): string;
    Encode(args: any): any;
    EncodeObject(args: any, semantic?: SemanticEncoding): any;
    Execute(val: any, semantics?: Semantic): any;
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema(): any;
    generateSchema(): OptionTokenSchema;
    ExtractSignature(): any[][];
    get KeySchema(): ComparableToken;
    compare(val1: any, val2: any): number;
    ToKey(val: any): any;
    ToBigMapKey(val: any): {
        key: any;
        type: Pick<import("@taquito/rpc").MichelsonV1ExpressionExtended, "prim" | "args">;
    };
    findAndReturnTokens(tokenToFind: string, tokens: Token[]): Token[];
}
