import { MichelsonV1Expression, ScriptResponse } from '@taquito/rpc';
import { BigMapKeyType, Semantic, SemanticEncoding, Token } from '../tokens/token';
import { RpcTransaction } from './model';
import { TokenSchema } from './types';
declare const schemaTypeSymbol: unique symbol;
/**
 * @warn Our current smart contract abstraction feature is currently in preview. It's API is not final, and it may not cover every use case (yet). We will greatly appreciate any feedback on this feature.
 */
export declare class Schema {
    readonly val: MichelsonV1Expression;
    private root;
    [schemaTypeSymbol]: boolean;
    static isSchema(obj: Schema): boolean;
    private bigMap?;
    static fromRPCResponse(val: {
        script: ScriptResponse;
    }): Schema;
    private isExpressionExtended;
    constructor(val: MichelsonV1Expression);
    private removeTopLevelAnnotation;
    Execute(val: any, semantics?: Semantic): any;
    Typecheck(val: any): boolean;
    ExecuteOnBigMapDiff(diff: any[], semantics?: Semantic): any;
    ExecuteOnBigMapValue(key: any, semantics?: Semantic): any;
    EncodeBigMapKey(key: BigMapKeyType): {
        key: {
            [key: string]: string | object[];
        };
        type: {
            prim: string;
            args?: object[] | undefined;
        };
    };
    Encode(value?: any, semantics?: SemanticEncoding): any;
    /**
     * @deprecated ExtractSchema has been deprecated in favor of generateSchema
     *
     */
    ExtractSchema(): any;
    /**
     * @description Produce a representation of the storage schema.
     * Note: Provide guidance on how to write the storage object for the origination operation with Taquito.
     */
    generateSchema(): TokenSchema;
    /**
     * @deprecated
     */
    ComputeState(tx: RpcTransaction[], state: any): any;
    /**
     * @description Look up in top-level pairs of the storage to find a value matching the specified type
     *
     * @returns The first value found that match the type or `undefined` if no value is found
     *
     * @param storage storage to parse to find the value
     * @param valueType type of value to look for
     *
     */
    FindFirstInTopLevelPair<T extends MichelsonV1Expression>(storage: any, valueType: any): T | undefined;
    private findValue;
    /**
     * @description Look up the schema to find any occurrence of a particular token.
     *
     * @returns an array of tokens of the specified kind or an empty array if no token was found
     *
     * @param tokenToFind string representing the prim property of the token to find
     *
     * @example
     * ```
     * Useful to find all global constants in a script, an array of GlobalConstantToken is returned:
     *
     * const schema = new Schema(script);
     * const allGlobalConstantTokens = schema.findToken('constant');
     * ```
     *
     */
    findToken(tokenToFind: string): Array<Token>;
}
export {};
