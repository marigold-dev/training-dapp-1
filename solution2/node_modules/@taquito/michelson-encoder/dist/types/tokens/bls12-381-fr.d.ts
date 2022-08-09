import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';
export declare class Bls12381frValidationError extends TokenValidationError {
    value: any;
    token: Bls12381frToken;
    name: string;
    constructor(value: any, token: Bls12381frToken, message: string);
}
export declare class Bls12381frToken extends Token {
    protected val: {
        prim: string;
        args: any[];
        annots: any[];
    };
    protected idx: number;
    protected fac: TokenFactory;
    static prim: 'bls12_381_fr';
    constructor(val: {
        prim: string;
        args: any[];
        annots: any[];
    }, idx: number, fac: TokenFactory);
    private isValid;
    private convertUint8ArrayToHexString;
    Encode(args: any[]): {
        int: string;
        bytes?: undefined;
    } | {
        bytes: any;
        int?: undefined;
    };
    EncodeObject(val: string | Uint8Array | number, semantic?: SemanticEncoding): import("@taquito/rpc").MichelsonV1ExpressionExtended | import("@taquito/rpc").MichelsonV1ExpressionBase | import("@taquito/rpc").MichelsonV1Expression[] | {
        bytes: string | number | Uint8Array;
    };
    Execute(val: any): string;
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema(): "bls12_381_fr";
    generateSchema(): BaseTokenSchema;
    findAndReturnTokens(tokenToFind: string, tokens: Token[]): Token[];
}
