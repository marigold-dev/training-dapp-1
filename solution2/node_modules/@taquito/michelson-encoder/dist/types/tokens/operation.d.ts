import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory } from './token';
export declare class OperationToken extends Token {
    protected val: {
        prim: string;
        args: any[];
        annots: any[];
    };
    protected idx: number;
    protected fac: TokenFactory;
    static prim: 'operation';
    constructor(val: {
        prim: string;
        args: any[];
        annots: any[];
    }, idx: number, fac: TokenFactory);
    Execute(val: any): {
        [key: string]: any;
    };
    Encode(...args: any[]): any;
    EncodeObject(val: any, semantic?: SemanticEncoding): any;
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema(): "operation";
    generateSchema(): BaseTokenSchema;
    findAndReturnTokens(tokenToFind: string, tokens: Token[]): Token[];
}
