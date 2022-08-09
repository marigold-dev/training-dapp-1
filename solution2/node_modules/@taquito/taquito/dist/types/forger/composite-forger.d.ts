import { Forger, ForgeParams, ForgeResponse } from '@taquito/local-forging';
/**
 *  @category Error
 *  @description Error that indicates a value mismatch when forging
 */
export declare class ForgingMismatchError extends Error {
    results: string[];
    name: string;
    constructor(results: string[]);
}
/**
 *  @category Error
 *  @description Error that indicates a forger not being specified in TezosToolkit
 */
export declare class UnspecifiedForgerError extends Error {
    name: string;
    constructor();
}
export declare class CompositeForger implements Forger {
    private forgers;
    constructor(forgers: Forger[]);
    forge({ branch, contents }: ForgeParams): Promise<ForgeResponse>;
}
