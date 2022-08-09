import { HttpResponseError } from '@taquito/http-utils';
import { MichelsonV1Expression } from '@taquito/rpc';
/**
 *  @category Error
 *  @description Error that indicates invalid smart contract parameters being passed or used
 */
export declare class InvalidParameterError extends Error {
    smartContractMethodName: string;
    sigs: any[];
    args: any[];
    name: string;
    constructor(smartContractMethodName: string, sigs: any[], args: any[]);
}
/**
 *  @category Error
 *  @description Error that indicates an invalid delegation source contract address being passed or used
 */
export declare class InvalidDelegationSource extends Error {
    source: string;
    name: string;
    constructor(source: string);
}
/**
 *  @category Error
 *  @description Error that indicates an invalid smart contract code parameter being passed or used
 */
export declare class InvalidCodeParameter extends Error {
    message: string;
    readonly data: any;
    name: string;
    constructor(message: string, data: any);
}
/**
 *  @category Error
 *  @description Error that indicates invalid smart contract init parameter being passed or used
 */
export declare class InvalidInitParameter extends Error {
    message: string;
    readonly data: any;
    name: string;
    constructor(message: string, data: any);
}
/**
 *  @category Error
 *  @description Error that indicates invalid view parameter of a smart contract
 */
export declare class InvalidViewParameterError extends Error {
    smartContractViewName: string;
    sigs: any;
    args: any;
    originalError: any;
    name: string;
    cause: any;
    constructor(smartContractViewName: string, sigs: any, args: any, originalError: any);
}
/**
 *  @category Error
 *  @description Error that indicates a failure when conducting a view simulation
 */
export declare class ViewSimulationError extends Error {
    message: string;
    viewName: string;
    failWith?: import("@taquito/rpc").MichelsonV1ExpressionBase | import("@taquito/rpc").MichelsonV1ExpressionExtended | MichelsonV1Expression[] | undefined;
    originalError?: any;
    name: string;
    constructor(message: string, viewName: string, failWith?: import("@taquito/rpc").MichelsonV1ExpressionBase | import("@taquito/rpc").MichelsonV1ExpressionExtended | MichelsonV1Expression[] | undefined, originalError?: any);
}
export declare const validateAndExtractFailwith: (error: HttpResponseError) => MichelsonV1Expression | undefined;
/**
 *  @category Error
 *  @description Error that indicates invalid or unconfigured context when executing a view
 */
export declare class InvalidViewSimulationContext extends Error {
    info: string;
    name: string;
    constructor(info: string);
}
/**
 *  @category Error
 *  @description Error that indicates a mistake happening during the reveal operation
 */
export declare class RevealOperationError extends Error {
    message: string;
    name: string;
    constructor(message: string);
}
/**
 *  @category Error
 *  @description Error that indicates a mistake in the parameters in the preparation of an Origination operation
 */
export declare class OriginationParameterError extends Error {
    message: string;
    name: string;
    constructor(message: string);
}
