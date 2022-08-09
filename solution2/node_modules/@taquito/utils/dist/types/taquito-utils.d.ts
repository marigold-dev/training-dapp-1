/**
 * @packageDocumentation
 * @module @taquito/utils
 */
import { Buffer } from 'buffer';
export * from './validators';
export { VERSION } from './version';
export { prefix, Prefix, prefixLength } from './constants';
export { verifySignature, validatePkAndExtractPrefix } from './verify-signature';
export * from './errors';
/**
 *
 * @description Hash a string using the BLAKE2b algorithm, base58 encode the hash obtained and appends the prefix 'expr' to it
 *
 * @param value Value in hex
 */
export declare function encodeExpr(value: string): string;
/**
 *
 * @description Return the operation hash of a signed operation
 * @param value Value in hex of a signed operation
 */
export declare function encodeOpHash(value: string): string;
/**
 *
 * @description Base58 encode a string or a Uint8Array and append a prefix to it
 *
 * @param value Value to base58 encode
 * @param prefix prefix to append to the encoded string
 */
export declare function b58cencode(value: string | Uint8Array, prefix: Uint8Array): string;
/**
 *
 * @description Base58 decode a string and remove the prefix from it
 *
 * @param value Value to base58 decode
 * @param prefix prefix to remove from the decoded string
 */
export declare const b58cdecode: (enc: string, prefixArg: Uint8Array) => Uint8Array;
/**
 *
 * @description Base58 decode a string with predefined prefix
 *
 * @param value Value to base58 decode
 */
export declare function b58decode(payload: string): string;
/**
 *
 * @description b58 decode a string without predefined prefix
 * @param value
 * @returns string of bytes
 */
export declare function b58decodeL2Address(payload: string): string;
/**
 *
 * @description Base58 encode an address using predefined prefix
 *
 * @param value Address to base58 encode (tz1, tz2, tz3 or KT1)
 */
export declare function encodePubKey(value: string): string;
/**
 *
 * @description Base58 encode an address without predefined prefix
 * @param value Address to base58 encode (tz4) hex dec
 * @returns return address
 */
export declare function encodeL2Address(value: string): string;
/**
 *
 * @description Base58 encode a key according to its prefix
 *
 * @param value Key to base58 encode
 */
export declare function encodeKey(value: string): string | undefined;
/**
 *
 * @description Base58 encode a key hash according to its prefix
 *
 * @param value Key hash to base58 encode
 */
export declare function encodeKeyHash(value: string): string | undefined;
/**
 *
 * @description Convert an hex string to a Uint8Array
 *
 * @param hex Hex string to convert
 */
export declare const hex2buf: (hex: string) => Uint8Array;
/**
 *
 * @description Merge 2 buffers together
 *
 * @param b1 First buffer
 * @param b2 Second buffer
 */
export declare const mergebuf: (b1: Uint8Array, b2: Uint8Array) => Uint8Array;
/**
 *
 * @description Flatten a michelson json representation to an array
 *
 * @param s michelson json
 */
export declare const mic2arr: (s: any) => any;
/**
 *
 * @description Convert a buffer to an hex string
 *
 * @param buffer Buffer to convert
 */
export declare const buf2hex: (buffer: Buffer) => string;
/**
 *
 *  @description Gets Tezos address (PKH) from Public Key
 *
 *  @param publicKey Public Key
 *  @returns A string of the Tezos address (PKH) that was derived from the given Public Key
 */
export declare const getPkhfromPk: (publicKey: string) => string;
/**
 *
 * @description Convert a string to bytes
 *
 * @param str String to convert
 */
export declare function char2Bytes(str: string): string;
/**
 *
 * @description Convert bytes to a string
 *
 * @param str Bytes to convert
 */
export declare function bytes2Char(hex: string): string;
