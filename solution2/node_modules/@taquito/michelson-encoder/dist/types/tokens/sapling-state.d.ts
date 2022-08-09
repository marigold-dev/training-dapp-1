import { SaplingStateTokenSchema } from '../schema/types';
import { Semantic, SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';
export declare class SaplingStateValidationError extends TokenValidationError {
    value: any;
    token: SaplingStateToken;
    name: string;
    constructor(value: any, token: SaplingStateToken, message: string);
}
export declare class SaplingStateToken extends Token {
    protected val: {
        prim: string;
        args: any[];
        annots: any[];
    };
    protected idx: number;
    protected fac: TokenFactory;
    static prim: 'sapling_state';
    constructor(val: {
        prim: string;
        args: any[];
        annots: any[];
    }, idx: number, fac: TokenFactory);
    private isValid;
    Execute(val: {
        int: string;
    }, semantic?: Semantic): any;
    Encode(args: any[]): any;
    EncodeObject(val: any, semantic?: SemanticEncoding): any;
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema(): {
        sapling_state: {
            'memo-size': number;
        };
    };
    generateSchema(): SaplingStateTokenSchema;
    findAndReturnTokens(tokenToFind: string, tokens: Token[]): Token[];
}
