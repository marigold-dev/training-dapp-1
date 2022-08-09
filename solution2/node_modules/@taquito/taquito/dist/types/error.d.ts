/**
 *  @category Error
 *  @description Error that indicates invalid confirmation count has been passed or configured
 */
export declare class InvalidConfirmationCountError extends Error {
    message: string;
    name: string;
    constructor(message: string);
}
/**
 *  @category Error
 *  @description Error that indicates undefined confirmation has not been specified or configured
 */
export declare class ConfirmationUndefinedError extends Error {
    message: string;
    name: string;
    constructor(message: string);
}
/**
 *  @category Error
 *  @description Error that indicates an invalid filter expression being passed or used
 */
export declare class InvalidFilterExpressionError extends Error {
    message: string;
    name: string;
    constructor(message: string);
}
