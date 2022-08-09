import { RandomSource } from "@stablelib/random";
export declare function secretBox(key: Uint8Array, nonce: Uint8Array, data: Uint8Array): Uint8Array;
export declare function openSecretBox(key: Uint8Array, nonce: Uint8Array, box: Uint8Array): Uint8Array | null;
/** Generates a 32-byte random secret key.  */
export declare function generateKey(prng?: RandomSource): Uint8Array;
