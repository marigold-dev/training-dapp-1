import { Prefix } from './constants';
export declare enum ValidationResult {
    NO_PREFIX_MATCHED = 0,
    INVALID_CHECKSUM = 1,
    INVALID_LENGTH = 2,
    VALID = 3
}
export declare function isValidPrefix(value: unknown): value is Prefix;
/**
 * @description Used to check if an address or a contract address is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateAddress } from '@taquito/utils';
 * const pkh = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx'
 * const validation = validateAddress(pkh)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export declare function validateAddress(value: string): ValidationResult;
/**
 * @description Used to check if a chain id is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateChain } from '@taquito/utils';
 * const chainId = 'NetXdQprcVkpaWU'
 * const validation = validateChain(chainId)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export declare function validateChain(value: string): ValidationResult;
/**
 * @description Used to check if a contract address is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateContractAddress } from '@taquito/utils';
 * const contractAddress = 'KT1JVErLYTgtY8uGGZ4mso2npTSxqVLDRVbC'
 * const validation = validateContractAddress(contractAddress)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export declare function validateContractAddress(value: string): ValidationResult;
/**
 * @description Used to check if a key hash is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateKeyHash } from '@taquito/utils';
 * const keyHashWithoutPrefix = '1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx'
 * const validation = validateKeyHash(keyHashWithoutPrefix)
 * console.log(validation)
 * // This example return 0 which correspond to NO_PREFIX_MATCHED
 * ```
 */
export declare function validateKeyHash(value: string): ValidationResult;
/**
 * @description Used to check if a signature is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateSignature } from '@taquito/utils';
 * const signature = 'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg'
 * const validation = validateSignature(signature)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export declare function validateSignature(value: string): ValidationResult;
/**
 * @description Used to check if a public key is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validatePublicKey } from '@taquito/utils';
 * const publicKey = 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g'
 * const validation = validatePublicKey(publicKey)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export declare function validatePublicKey(value: string): ValidationResult;
/**
 * @description Used to check if an operation hash is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateOperation } from '@taquito/utils';
 * const operationHash = 'oo6JPEAy8VuMRGaFuMmLNFFGdJgiaKfnmT1CpHJfKP3Ye5ZahiP'
 * const validation = validateOperation(operationHash)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export declare function validateOperation(value: string): ValidationResult;
/**
 * @description Used to check if a protocol hash is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateProtocol } from '@taquito/utils';
 * const protocolHash = 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx'
 * const validation = validateProtocol(protocolHash)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export declare function validateProtocol(value: string): ValidationResult;
/**
 * @description Used to check if a block hash is valid.
 *
 * @returns
 * 0 (NO_PREFIX_MATCHED), 1 (INVALID_CHECKSUM), 2 (INVALID_LENGTH) or 3 (VALID).
 *
 * @example
 * ```
 * import { validateBlock } from '@taquito/utils';
 * const blockHash = 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx'
 * const validation = validateBlock(blockHash)
 * console.log(validation)
 * // This example return 3 which correspond to VALID
 * ```
 */
export declare function validateBlock(value: string): ValidationResult;
