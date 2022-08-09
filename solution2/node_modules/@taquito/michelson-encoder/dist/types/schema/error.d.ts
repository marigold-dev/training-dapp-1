/**
 *  @category Error
 *  @description Error that indicates a failure when encoding (transforming JS parameter into JSON Michelson)the parameter of the view
 */
export declare class ViewEncodingError extends Error {
    smartContractViewName: string;
    originalError: any;
    name: string;
    constructor(smartContractViewName: string, originalError: any);
}
/**
 *  @category Error
 *  @description Error that indicates an invalid on-chain view found on the script
 */
export declare class InvalidScriptError extends Error {
    message: string;
    name: string;
    constructor(message: string);
}
/**
 *  @category Error
 *  @description Error that indicates an invalid RPC response being passed or used
 */
export declare class InvalidRpcResponseError extends Error {
    script: any;
    name: string;
    constructor(script: any);
}
/**
 *  @category Error
 *  @description Error that indicates a failure that occurred during encoding
 */
export declare class ParameterEncodingError extends Error {
    message: string;
    args: any;
    originalError: any;
    name: string;
    constructor(message: string, args: any, originalError: any);
}
/**
 *  @category Error
 *  @description Error that indicates an invalid big map schema being passed or used
 */
export declare class InvalidBigMapSchema extends Error {
    message: string;
    name: string;
    constructor(message: string);
}
/**
 *  @category Error
 *  @description Error that indicates an invalid big map diff being passed or used
 */
export declare class InvalidBigMapDiff extends Error {
    message: string;
    name: string;
    constructor(message: string);
}
/**
 *  @category Error
 *  @description Error that indicates a failure when trying to encode big maps
 */
export declare class BigMapEncodingError extends Error {
    private obj;
    details: any;
    name: string;
    constructor(obj: string, details: any);
}
/**
 *  @category Error
 *  @description Error that indicates a failure when trying to encode storage
 */
export declare class StorageEncodingError extends Error {
    private obj;
    details: any;
    name: string;
    constructor(obj: string, details: any);
}
/**
 *  @category Error
 *  @description General error that indicates a function not being passed a necessary argument
 */
export declare class MissingArgumentError extends Error {
    message: string;
    name: string;
    constructor(message: string);
}
