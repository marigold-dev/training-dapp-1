import { TransactionOperation } from '../../operations/transaction-operation';
import { TransferParams } from '../../operations/types';
import { ContractProvider } from '../interface';
import { TransactionWalletOperation, Wallet } from '../../wallet';
import { ParameterSchema } from "@taquito/michelson-encoder";
import { ContractMethodInterface, SendParams } from './contract-method-interface';
/**
 * @description Utility class to send smart contract operation
 * The format for the arguments is the object representation
 */
export declare class ContractMethodObject<T extends ContractProvider | Wallet> implements ContractMethodInterface {
    private provider;
    private address;
    private parameterSchema;
    private name;
    private args;
    private isMultipleEntrypoint;
    private isAnonymous;
    constructor(provider: T, address: string, parameterSchema: ParameterSchema, name: string, args?: any, isMultipleEntrypoint?: boolean, isAnonymous?: boolean);
    /**
     * @description Get the signature of the smart contract method
     */
    getSignature(): any;
    /**
     *
     * @description Send the smart contract operation
     *
     * @param Options generic operation parameter
     */
    send(params?: Partial<SendParams>): Promise<T extends Wallet ? TransactionWalletOperation : TransactionOperation>;
    /**
     *
     * @description Create transfer params to be used with TezosToolkit.contract.transfer methods
     *
     * @param Options generic transfer operation parameters
     */
    toTransferParams({ fee, gasLimit, storageLimit, source, amount, mutez, }?: Partial<SendParams>): TransferParams;
}
