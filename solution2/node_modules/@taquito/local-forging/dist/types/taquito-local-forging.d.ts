/**
 * @packageDocumentation
 * @module @taquito/local-forging
 */
import { ForgeParams, Forger } from './interface';
import { CODEC } from './constants';
import { ProtocolsHash } from './protocols';
export { CODEC } from './constants';
export * from './decoder';
export * from './encoder';
export * from './uint8array-consumer';
export * from './interface';
export { VERSION } from './version';
export { ProtocolsHash } from './protocols';
export declare function getCodec(codec: CODEC, proto: ProtocolsHash): {
    encoder: import("./encoder").Encoder<any>;
    decoder: (hex: string) => any;
};
export declare class LocalForger implements Forger {
    readonly protocolHash: ProtocolsHash;
    constructor(protocolHash?: ProtocolsHash);
    private codec;
    forge(params: ForgeParams): Promise<string>;
    parse(hex: string): Promise<ForgeParams>;
}
export declare const localForger: LocalForger;
