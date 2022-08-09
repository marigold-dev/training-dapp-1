import { Signer } from './interface';
/**
 *  @category Error
 *  @description Error that indicates the signer has been unconfigured in the TezosToolkit instance
 */
export declare class UnconfiguredSignerError extends Error {
    name: string;
    constructor();
}
/**
 * @description Default signer implementation which does nothing and produce invalid signature
 */
export declare class NoopSigner implements Signer {
    publicKey(): Promise<string>;
    publicKeyHash(): Promise<string>;
    secretKey(): Promise<string>;
    sign(_bytes: string, _watermark?: Uint8Array): Promise<any>;
}
