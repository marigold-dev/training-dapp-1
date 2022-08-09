import { ContractTokenSchema } from '../schema/types';
import { SemanticEncoding, Token, TokenFactory, TokenValidationError } from './token';
export declare class ContractValidationError extends TokenValidationError {
    value: any;
    token: ContractToken;
    name: string;
    constructor(value: any, token: ContractToken, message: string);
}
export declare class ContractToken extends Token {
    protected val: {
        prim: string;
        args: any[];
        annots: any[];
    };
    protected idx: number;
    protected fac: TokenFactory;
    static prim: 'contract';
    constructor(val: {
        prim: string;
        args: any[];
        annots: any[];
    }, idx: number, fac: TokenFactory);
    private isValid;
    Execute(val: {
        bytes: string;
        string: string;
    }): string;
    Encode(args: any[]): any;
    EncodeObject(val: any, semantic?: SemanticEncoding): any;
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema(): "contract";
    generateSchema(): ContractTokenSchema;
    findAndReturnTokens(tokenToFind: string, tokens: Token[]): Token[];
}
