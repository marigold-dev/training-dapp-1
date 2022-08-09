import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';
export declare class ChestValidationError extends TokenValidationError {
    value: any;
    token: ChestToken;
    name: string;
    constructor(value: any, token: ChestToken, message: string);
}
export declare class ChestToken extends Token {
    protected val: {
        prim: string;
        args: any[];
        annots: any[];
    };
    protected idx: number;
    protected fac: TokenFactory;
    static prim: 'chest';
    constructor(val: {
        prim: string;
        args: any[];
        annots: any[];
    }, idx: number, fac: TokenFactory);
    private isValid;
    private convertUint8ArrayToHexString;
    Encode(args: any[]): {
        bytes: any;
    };
    EncodeObject(val: string | Uint8Array, semantic?: SemanticEncoding): import("@taquito/rpc").MichelsonV1ExpressionExtended | import("@taquito/rpc").MichelsonV1ExpressionBase | import("@taquito/rpc").MichelsonV1Expression[] | {
        bytes: string | Uint8Array;
    };
    Execute(val: any): string;
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema(): "chest";
    generateSchema(): BaseTokenSchema;
    findAndReturnTokens(tokenToFind: string, tokens: Token[]): Token[];
}
