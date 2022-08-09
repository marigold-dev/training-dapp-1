/**
 * @packageDocumentation
 * @module @taquito/taquito
 */
import { RpcClientInterface } from '@taquito/rpc';
import { Forger } from '@taquito/local-forging';
import { RPCBatchProvider } from './batch/rpc-batch-provider';
import { Protocols } from './constants';
import { ConfigConfirmation, TaquitoProvider } from './context';
import { ContractProvider } from './contract/interface';
import { Extension } from './extension/extension';
import { format } from './format';
import { GlobalConstantsProvider } from './global-constants/interface-global-constants-provider';
import { Packer } from './packer/interface';
import { TzReadProvider } from './read-provider/interface';
import { Signer } from './signer/interface';
import { SubscribeProvider } from './subscribe/interface';
import { TzProvider } from './tz/interface';
import { Wallet, WalletProvider } from './wallet';
import { OperationFactory } from './wallet/operation-factory';
import { EstimationProvider } from './estimate/estimate-provider-interface';
export { MichelsonMap, UnitValue } from '@taquito/michelson-encoder';
export { Forger, ForgeParams, ForgeResponse } from '@taquito/local-forging';
export * from './constants';
export * from './context';
export { TaquitoProvider } from './context';
export * from './contract';
export * from './contract/big-map';
export { CompositeForger } from './forger/composite-forger';
export { RpcForger } from './forger/rpc-forger';
export * from './operations';
export { OperationBatch } from './batch/rpc-batch-provider';
export * from './signer/interface';
export * from './subscribe/interface';
export { SubscribeProvider } from './subscribe/interface';
export { PollingSubscribeProvider } from './subscribe/polling-subcribe-provider';
export { ObservableSubscription } from './subscribe/observable-subscription';
export * from './tz/interface';
export * from './wallet';
export { Extension } from './extension/extension';
export * from './parser/interface';
export * from './parser/michel-codec-parser';
export * from './parser/noop-parser';
export * from './packer/interface';
export * from './packer/michel-codec-packer';
export * from './packer/rpc-packer';
export * from './global-constants/default-global-constants-provider';
export * from './global-constants/error';
export * from './global-constants/interface-global-constants-provider';
export { BigMapQuery, SaplingStateQuery, BlockIdentifier, TzReadProvider, } from './read-provider/interface';
export { RpcReadAdapter } from './read-provider/rpc-read-adapter';
export * from './estimate';
export { TaquitoLocalForger } from './forger/taquito-local-forger';
export interface SetProviderOptions {
    forger?: Forger;
    wallet?: WalletProvider;
    rpc?: string | RpcClientInterface;
    readProvider?: TzReadProvider;
    stream?: string | SubscribeProvider;
    signer?: Signer;
    protocol?: Protocols;
    config?: Partial<ConfigConfirmation>;
    packer?: Packer;
    globalConstantsProvider?: GlobalConstantsProvider;
}
export interface VersionInfo {
    commitHash: string;
    version: string;
}
/**
 * @description Facade class that surfaces all of the libraries capability and allow it's configuration
 *
 * @param _rpc The RPC server to use
 */
export declare class TezosToolkit {
    private _rpc;
    private _options;
    private _rpcClient;
    private _wallet;
    private _context;
    /**
     * @deprecated TezosToolkit.batch has been deprecated in favor of TezosToolkit.contract.batch
     *
     */
    batch: RPCBatchProvider['batch'];
    readonly format: typeof format;
    constructor(_rpc: RpcClientInterface | string);
    /**
     * @description Sets configuration on the Tezos Taquito instance. Allows user to choose which signer, rpc client, rpc url, forger and so forth
     *
     * @param options rpc url or rpcClient to use to interact with the Tezos network
     *
     * @example Tezos.setProvider({rpc: 'https://mainnet.api.tez.ie/', signer: new InMemorySigner.fromSecretKey(“edsk...”)})
     * @example Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: 300 }})
     *
     */
    setProvider({ rpc, stream, signer, protocol, config, forger, wallet, packer, globalConstantsProvider, readProvider, }: SetProviderOptions): void;
    /**
     * @description Sets signer provider on the Tezos Taquito instance.
     *
     * @param options signer to use to interact with the Tezos network
     *
     * @example Tezos.setSignerProvider(new InMemorySigner.fromSecretKey('edsk...'))
     *
     */
    setSignerProvider(signer?: SetProviderOptions['signer']): void;
    /**
     * @description Sets rpc provider on the Tezos Taquito instance
     *
     * @param options rpc url or rpcClient to use to interact with the Tezos network
     *
     * @example Tezos.setRpcProvider('https://mainnet.api.tez.ie/')
     *
     */
    setRpcProvider(rpc?: SetProviderOptions['rpc']): void;
    /**
     * @description Sets forger provider on the Tezos Taquito instance
     * The `LocalForger` from `@taquito/local-forging` is set by default.
     *
     * @param options forger to use to interact with the Tezos network
     *
     * @example Tezos.setForgerProvider(this.getFactory(RpcForger)())
     *
     */
    setForgerProvider(forger?: SetProviderOptions['forger']): void;
    /**
     * @description Sets stream provider on the Tezos Taquito instance
     *
     * @param options stream to use to interact with the Tezos network
     *
     * @example Tezos.setStreamProvider(...)
     *
     */
    setStreamProvider(stream?: SetProviderOptions['stream']): void;
    /**
     * @description Sets wallet provider on the Tezos Taquito instance
     *
     * @param options wallet to use to interact with the Tezos network
     *
     * @example Tezos.setWalletProvider(...)
     *
     */
    setWalletProvider(wallet?: SetProviderOptions['wallet']): void;
    /**
     * @description Sets Packer provider on the Tezos Taquito instance
     *
     * @param options packer to use to interact with the Tezos network
     *
     * @example Tezos.setPackerProvider(new MichelCodecPacker())
     *
     */
    setPackerProvider(packer?: SetProviderOptions['packer']): void;
    /**
     * @description Sets global constants provider on the Tezos Taquito instance
     *
     * @param options globalConstantsProvider to use to interact with the Tezos network
     *
     * @example
     * ```
     * const globalConst = new DefaultGlobalConstantsProvider();
     * globalConst.loadGlobalConstant({
     *  "expruu5BTdW7ajqJ9XPTF3kgcV78pRiaBW3Gq31mgp3WSYjjUBYxre": { prim: "int" },
     *  // ...
     * })
     * Tezos.setGlobalConstantsProvider(globalConst);
     * ```
     *
     */
    setGlobalConstantsProvider(globalConstantsProvider?: SetProviderOptions['globalConstantsProvider']): void;
    /**
     * @description Sets read provider on the Tezos Taquito instance
     * By default reads are done from the RPC usign the RpcReadAdapter class, this can be overridden to read from an indexer that implements the TzReadProvider interface
     *
     * @param options TzReadProvider to use to interact with the Tezos network
     *
     */
    setReadProvider(readProvider?: SetProviderOptions['readProvider']): void;
    /**
     * @description Provide access to tezos account management
     */
    get tz(): TzProvider;
    /**
     * @description Provide access to smart contract utilities
     */
    get contract(): ContractProvider;
    get wallet(): Wallet;
    get operation(): OperationFactory;
    /**
     * @description Provide access to operation estimation utilities
     */
    get estimate(): EstimationProvider;
    /**
     * @description Provide access to streaming utilities backed by an streamer implementation
     */
    get stream(): SubscribeProvider;
    /**
     * @description Provide access to the currently used rpc client
     */
    get rpc(): RpcClientInterface;
    /**
     * @description Provide access to the currently used signer
     */
    get signer(): Signer;
    /**
     * @description Provide access to the currently used globalConstantsProvider
     */
    get globalConstants(): GlobalConstantsProvider;
    /**
     * @description Allow to add a module to the TezosToolkit instance. This method adds the appropriate Providers(s) required by the module to the internal context.
     *
     * @param module extension to add to the TezosToolkit instance
     *
     * @example Tezos.addExtension(new Tzip16Module());
     */
    addExtension(module: Extension | Extension[]): void;
    getFactory<T, K extends Array<any>>(ctor: TaquitoProvider<T, K>): (...args: K) => T;
    /**
     * @description Gets an object containing the version of Taquito library and git sha of the commit this library is compiled from
     */
    getVersionInfo(): VersionInfo;
}
