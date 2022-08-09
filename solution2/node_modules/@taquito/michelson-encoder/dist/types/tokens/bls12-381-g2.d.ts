import { BaseTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';
export declare class Bls12381g2ValidationError extends TokenValidationError {
    value: any;
    token: Bls12381g2Token;
    name: string;
    constructor(value: any, token: Bls12381g2Token, message: string);
}
export declare class Bls12381g2Token extends Token {
    protected val: {
        prim: string;
        args: any[];
        annots: any[];
    };
    protected idx: number;
    protected fac: TokenFactory;
    static prim: 'bls12_381_g2';
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
    ExtractSchema(): "bls12_381_g2";
    generateSchema(): BaseTokenSchema;
    findAndReturnTokens(tokenToFind: string, tokens: Token[]): Token[];
}
