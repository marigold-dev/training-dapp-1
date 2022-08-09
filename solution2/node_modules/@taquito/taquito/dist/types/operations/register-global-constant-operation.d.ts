import { OperationContentsAndResult } from '@taquito/rpc';
import { Context } from '../context';
import { Operation } from './operations';
import { FeeConsumingOperation, ForgedBytes, GasConsumingOperation, RPCRegisterGlobalConstantOperation, StorageConsumingOperation } from './types';
/**
 * @description RegisterGlobalConstantOperation provides utility functions to fetch a newly issued operation of kind register_global_constant
 */
export declare class RegisterGlobalConstantOperation extends Operation implements GasConsumingOperation, StorageConsumingOperation, FeeConsumingOperation {
    private readonly params;
    readonly source: string;
    /**
     * @description Hash (index) of the newly registered constant
     */
    readonly globalConstantHash?: string;
    constructor(hash: string, params: RPCRegisterGlobalConstantOperation, source: string, raw: ForgedBytes, results: OperationContentsAndResult[], context: Context);
    get operationResults(): import("@taquito/rpc").OperationResultRegisterGlobalConstant | undefined;
    get status(): "applied" | "failed" | "skipped" | "backtracked" | "unknown";
    get registeredExpression(): import("@taquito/rpc").MichelsonV1Expression;
    get fee(): number;
    get gasLimit(): number;
    get storageLimit(): number;
    get errors(): import("@taquito/rpc").TezosGenericOperationError[] | undefined;
}
