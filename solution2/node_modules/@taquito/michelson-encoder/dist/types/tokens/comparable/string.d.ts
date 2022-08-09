import { BaseTokenSchema } from '../../schema/types';
import { Token, TokenFactory, ComparableToken, SemanticEncoding } from '../token';
export declare class StringToken extends ComparableToken {
    protected val: {
        prim: string;
        args: any[];
        annots: any[];
    };
    protected idx: number;
    protected fac: TokenFactory;
    static prim: 'string';
    constructor(val: {
        prim: string;
        args: any[];
        annots: any[];
    }, idx: number, fac: TokenFactory);
    Execute(val: any): string;
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema(): "string";
    generateSchema(): BaseTokenSchema;
    Encode(args: any[]): any;
    EncodeObject(val: any, semantic?: SemanticEncoding): any;
    ToKey({ string }: any): any;
    ToBigMapKey(val: string): {
        key: {
            string: string;
        };
        type: {
            prim: "string";
        };
    };
    findAndReturnTokens(tokenToFind: string, tokens: Token[]): Token[];
}
