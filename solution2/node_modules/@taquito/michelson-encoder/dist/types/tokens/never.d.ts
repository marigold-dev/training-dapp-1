import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';
export declare class NeverTokenError extends TokenValidationError {
    value: any;
    token: NeverToken;
    name: string;
    constructor(value: any, token: NeverToken, message: string);
}
export declare class NeverToken extends Token {
    protected val: {
        prim: string;
        args: any[];
        annots: any[];
    };
    protected idx: number;
    protected fac: TokenFactory;
    static prim: 'never';
    constructor(val: {
        prim: string;
        args: any[];
        annots: any[];
    }, idx: number, fac: TokenFactory);
    Encode(args: any[]): any;
    EncodeObject(val: any, semantic?: SemanticEncoding): any;
    Execute(val: any): void;
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema(): "never";
    generateSchema(): BaseTokenSchema;
    findAndReturnTokens(tokenToFind: string, tokens: Token[]): Token[];
}
