import { MichelsonV1ExpressionBase, OperationResultDelegation, OperationResultOrigination, OperationResultRegisterGlobalConstant, OperationResultReveal, OperationResultTransaction, PreapplyResponse, TezosGenericOperationError } from '@taquito/rpc';
export interface TezosOperationErrorWithMessage extends TezosGenericOperationError {
    with: MichelsonV1ExpressionBase;
}
/**
 *  @category Error
 *  @description Generic tezos error that will be thrown when a mistake occurs when doing an operation; more details here https://tezos.gitlab.io/api/errors.html
 */
export declare class TezosOperationError extends Error {
    errors: TezosGenericOperationError[];
    errorDetails?: string | undefined;
    name: string;
    id: string;
    kind: string;
    constructor(errors: TezosGenericOperationError[], errorDetails?: string | undefined);
}
/**
 *  @category Error
 *  @description Tezos error that will be thrown when a mistake happens during the preapply stage
 */
export declare class TezosPreapplyFailureError extends Error {
    result: any;
    name: string;
    constructor(result: any);
}
export declare type MergedOperationResult = OperationResultDelegation & OperationResultOrigination & OperationResultTransaction & OperationResultRegisterGlobalConstant & OperationResultReveal & {
    fee?: string;
};
export declare const flattenOperationResult: (response: PreapplyResponse | PreapplyResponse[]) => MergedOperationResult[];
/***
 * @description Flatten all error from preapply response (including internal error)
 */
export declare const flattenErrors: (response: PreapplyResponse | PreapplyResponse[], status?: string) => TezosGenericOperationError[];
/**
 *  @category Error
 *  @description Error that indicates a general failure happening during an origination operation
 */
export declare class OriginationOperationError extends Error {
    message: string;
    name: string;
    constructor(message: string);
}
