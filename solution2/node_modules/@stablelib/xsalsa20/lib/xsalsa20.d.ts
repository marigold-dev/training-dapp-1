/**
 * Encrypt src with Salsa20/20 stream generated for the given 32-byte key
 * and 24-byte and write the result into dst and return it.
 *
 * dst and src may be the same, but otherwise must not overlap.
 *
 * Never use the same key and nonce to encrypt more than one message.
 */
export declare function streamXOR(key: Uint8Array, nonce: Uint8Array, src: Uint8Array, dst: Uint8Array, nonceInplaceCounterLength?: number): Uint8Array;
/**
 * Generate Salsa20/20 stream for the given 32-byte key and
 * 24-byte nonce and write it into dst and return it.
 *
 * Never use the same key and nonce to generate more than one stream.
 *
 * stream is like streamXOR with all-zero src.
 */
export declare function stream(key: Uint8Array, nonce: Uint8Array, dst: Uint8Array, nonceInplaceCounterLength?: number): Uint8Array;
/**
 * HSalsa20 is a one-way function used in XSalsa20 to extend nonce,
 * and in NaCl to hash X25519 shared keys. It takes 32-byte key and
 * 16-byte src and writes 32-byte result into dst and returns it.
 */
export declare function hsalsa(key: Uint8Array, src: Uint8Array, dst: Uint8Array): Uint8Array;
