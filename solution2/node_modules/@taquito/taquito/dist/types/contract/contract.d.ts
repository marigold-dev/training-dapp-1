import { ParameterSchema, Schema, ViewSchema } from '@taquito/michelson-encoder';
import { EntrypointsResponse, RpcClientInterface, ScriptResponse } from '@taquito/rpc';
import { ChainIds } from '../constants';
import { TzReadProvider } from '../read-provider/interface';
import { Wallet } from '../wallet';
import { ContractMethod } from './contract-methods/contract-method-flat-param';
import { ContractMethodObject } from './contract-methods/contract-method-object-param';
import { OnChainView } from './contract-methods/contract-on-chain-view';
import { ContractProvider, StorageProvider } from './interface';
export declare const DEFAULT_SMART_CONTRACT_METHOD_NAME = "default";
/**
 * @description Utility class to retrieve data from a smart contract's storage without incurring fees via a contract's view method
 */
export declare class ContractView {
    private currentContract;
    private name;
    private callbackParametersSchema;
    private parameterSchema;
    private args;
    private rpc;
    private readProvider;
    constructor(currentContract: ContractAbstraction<ContractProvider | Wallet>, name: string, callbackParametersSchema: ParameterSchema, parameterSchema: ParameterSchema, args: any[], rpc: RpcClientInterface, readProvider: TzReadProvider);
    read(chainId?: ChainIds): Promise<any>;
}
export declare type Contract = ContractAbstraction<ContractProvider>;
export declare type WalletContract = ContractAbstraction<Wallet>;
declare type DefaultMethods<T extends ContractProvider | Wallet> = Record<string, (...args: any[]) => ContractMethod<T>>;
declare type DefaultMethodsObject<T extends ContractProvider | Wallet> = Record<string, (args?: any) => ContractMethodObject<T>>;
declare type DefaultViews = Record<string, (...args: any[]) => ContractView>;
declare type DefaultContractViews = Record<string, (args?: any) => OnChainView>;
declare type DefaultStorage = unknown;
declare type PromiseReturnType<T extends (...args: any) => any> = T extends (...args: any) => Promise<infer R> ? R : any;
export declare type ContractStorageType<T extends ContractAbstraction<ContractProvider | Wallet>> = PromiseReturnType<T['storage']>;
export declare type DefaultContractType = ContractAbstraction<ContractProvider>;
export declare type DefaultWalletType = ContractAbstraction<Wallet>;
/**
 * @description Smart contract abstraction
 */
export declare class ContractAbstraction<T extends ContractProvider | Wallet, TMethods extends DefaultMethods<T> = DefaultMethods<T>, TMethodsObject extends DefaultMethodsObject<T> = DefaultMethodsObject<T>, TViews extends DefaultViews = DefaultViews, TContractViews extends DefaultContractViews = DefaultContractViews, TStorage extends DefaultStorage = DefaultStorage> {
    readonly address: string;
    readonly script: ScriptResponse;
    private storageProvider;
    readonly entrypoints: EntrypointsResponse;
    private rpc;
    private readProvider;
    private contractMethodFactory;
    /**
     * @description Contains methods that are implemented by the target Tezos Smart Contract, and offers the user to call the Smart Contract methods as if they were native TS/JS methods.
     * NB: if the contract contains annotation it will include named properties; if not it will be indexed by a number.
     *
     */
    methods: TMethods;
    /**
     * @description Contains methods that are implemented by the target Tezos Smart Contract, and offers the user to call the Smart Contract methods as if they were native TS/JS methods.
     * `methodsObject` serves the exact same purpose as the `methods` member. The difference is that it allows passing the parameter in an object format when calling the smart contract method (instead of the flattened representation)
     * NB: if the contract contains annotation it will include named properties; if not it will be indexed by a number.
     *
     */
    methodsObject: TMethodsObject;
    /**
     * @description Contains lamda views (tzip4) that are implemented by the target Tezos Smart Contract, and offers the user to call the lambda views as if they were native TS/JS methods.
     * NB: These are the view defined in the tzip4 standard, not the views introduced by the Hangzhou protocol.
     */
    views: TViews;
    /**
     * @description Contains on-chain views that are defined by the target Tezos Smart Contract, and offers the user to simulate the views execution as if they were native TS/JS methods.
     * NB: the expected format for the parameter when calling a smart contract view is the object format (same format as for the storage) and not the flattened representation.
     *
     */
    contractViews: TContractViews;
    readonly schema: Schema;
    readonly parameterSchema: ParameterSchema;
    readonly viewSchema: ViewSchema[];
    constructor(address: string, script: ScriptResponse, provider: T, storageProvider: StorageProvider, entrypoints: EntrypointsResponse, rpc: RpcClientInterface, readProvider: TzReadProvider);
    private _initializeMethods;
    private _initializeOnChainViews;
    /**
     * @description Return a friendly representation of the smart contract storage
     */
    storage<T extends TStorage = TStorage>(): Promise<T>;
    /**
     *
     * @description Return a friendly representation of the smart contract big map value
     *
     * @param key BigMap key to fetch
     *
     * @deprecated getBigMapKey has been deprecated in favor of getBigMapKeyByID
     *
     * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-context-contracts-contract-id-big-map-get
     */
    bigMap(key: string): Promise<unknown>;
}
export {};
