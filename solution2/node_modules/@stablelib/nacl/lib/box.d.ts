export { generateKeyPair } from "@stablelib/x25519";
export declare function precomputeSharedKey(theirPublicKey: Uint8Array, mySecretKey: Uint8Array): Uint8Array;
export declare function box(theirPublicKey: Uint8Array, mySecretKey: Uint8Array, nonce: Uint8Array, data: Uint8Array): Uint8Array;
export declare function openBox(theirPublicKey: Uint8Array, mySecretKey: Uint8Array, nonce: Uint8Array, data: Uint8Array): Uint8Array | null;
