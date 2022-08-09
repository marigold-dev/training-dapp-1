/**
 *  @category Error
 *  @description Error that indicates a failure when decoding a base58 encoding
 */
export declare class Base58DecodingError extends Error {
    message: string;
    name: string;
    constructor(message: string);
}
/**
 *  @category Error
 *  @description
 */
export declare class InvalidMessageError extends Error {
    message: string;
    name: string;
    constructor(message: string);
}
export declare function decodeBase58(src: string): number[];
export declare function encodeBase58(src: number[] | Uint8Array): string;
export declare function decodeBase58Check(src: string): number[];
export declare function encodeBase58Check(src: number[] | Uint8Array): string;
