import { BlockResponse, OperationContentsAndResult, OperationResultStatusEnum } from '@taquito/rpc';
import { Observable, ReplaySubject } from 'rxjs';
import { Context } from '../context';
import { Receipt } from './receipt';
import { BlockIdentifier } from '../read-provider/interface';
export declare type OperationStatus = 'pending' | 'unknown' | OperationResultStatusEnum;
/**
 *  @category Error
 *  @description Error that indicates a missed block when polling to retrieve new head block. This may happen when the polling interval is greater than the time between blocks.
 */
export declare class MissedBlockDuringConfirmationError extends Error {
    name: string;
    constructor();
}
/**
 * @description WalletOperation allows to monitor operation inclusion on chains and surface information related to the operation
 */
export declare class WalletOperation {
    readonly opHash: string;
    protected readonly context: Context;
    private _newHead$;
    protected _operationResult: ReplaySubject<OperationContentsAndResult[]>;
    protected _includedInBlock: ReplaySubject<BlockResponse>;
    protected _included: boolean;
    private lastHead;
    protected newHead$: Observable<BlockResponse>;
    private confirmed$;
    operationResults(): Promise<OperationContentsAndResult[]>;
    /**
     * @description Receipt expose the total amount of tezos token burn and spent on fees
     * The promise returned by receipt will resolve only once the transaction is included
     */
    receipt(): Promise<Receipt>;
    /**
     *
     * @param opHash Operation hash
     * @param raw Raw operation that was injected
     * @param context Taquito context allowing access to rpc and signer
     */
    constructor(opHash: string, context: Context, _newHead$: Observable<BlockResponse>);
    getCurrentConfirmation(): Promise<number>;
    isInCurrentBranch(tipBlockIdentifier?: BlockIdentifier): Promise<boolean>;
    confirmationObservable(confirmations?: number): Observable<{
        block: BlockResponse;
        expectedConfirmation: number;
        currentConfirmation: number;
        completed: boolean;
        isInCurrentBranch: () => Promise<boolean>;
    }>;
    /**
     *
     * @param confirmations [0] Number of confirmation to wait for
     */
    confirmation(confirmations?: number): Promise<{
        block: BlockResponse;
        expectedConfirmation: number;
        currentConfirmation: number;
        completed: boolean;
        isInCurrentBranch: () => Promise<boolean>;
    }>;
}
