import { Token, TokenFactory, ComparableToken, TokenValidationError, SemanticEncoding } from '../token';
import BigNumber from 'bignumber.js';
import { BaseTokenSchema } from '../../schema/types';
export declare class NatValidationError extends TokenValidationError {
    value: any;
    token: NatToken;
    name: string;
    constructor(value: any, token: NatToken, message: string);
}
export declare class NatToken extends ComparableToken {
    protected val: {
        prim: string;
        args: any[];
        annots: any[];
    };
    protected idx: number;
    protected fac: TokenFactory;
    static prim: 'nat';
    constructor(val: {
        prim: string;
        args: any[];
        annots: any[];
    }, idx: number, fac: TokenFactory);
    Execute(val: any): {
        [key: string]: any;
    };
    Encode(args: any[]): any;
    private isValid;
    EncodeObject(val: any, semantic?: SemanticEncoding): any;
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema(): "nat";
    generateSchema(): BaseTokenSchema;
    ToBigMapKey(val: string | number): {
        key: {
            int: string;
        };
        type: {
            prim: "nat";
        };
    };
    ToKey({ int }: any): BigNumber;
    compare(nat1: string | number, nat2: string | number): 0 | 1 | -1;
    findAndReturnTokens(tokenToFind: string, tokens: Token[]): Token[];
}
