import { BaseTokenSchema } from '../../schema/types';
import { TokenFactory, ComparableToken, TokenValidationError, Token, SemanticEncoding } from '../token';
export declare class BytesValidationError extends TokenValidationError {
    value: any;
    token: BytesToken;
    name: string;
    constructor(value: any, token: BytesToken, message: string);
}
export declare class BytesToken extends ComparableToken {
    protected val: {
        prim: string;
        args: any[];
        annots: any[];
    };
    protected idx: number;
    protected fac: TokenFactory;
    static prim: 'bytes';
    constructor(val: {
        prim: string;
        args: any[];
        annots: any[];
    }, idx: number, fac: TokenFactory);
    ToBigMapKey(val: string): {
        key: {
            bytes: string;
        };
        type: {
            prim: "bytes";
        };
    };
    private isValid;
    private convertUint8ArrayToHexString;
    Encode(args: any[]): any;
    EncodeObject(val: string | Uint8Array, semantic?: SemanticEncoding): import("@taquito/rpc").MichelsonV1Expression;
    Execute(val: any): string;
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema(): "bytes";
    generateSchema(): BaseTokenSchema;
    ToKey({ bytes, string }: any): any;
    findAndReturnTokens(tokenToFind: string, tokens: Token[]): Token[];
}
