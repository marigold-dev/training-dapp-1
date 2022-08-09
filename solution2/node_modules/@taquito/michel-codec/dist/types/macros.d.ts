import { Prim, Expr } from './micheline';
import { ProtocolOptions } from './michelson-types';
/**
 *  @category Error
 *  @description Indicates that an error has occurred preventing macros from being expanded in a plain Michelson input
 */
export declare class MacroError extends Error {
    prim: Prim;
    constructor(prim: Prim, message?: string);
}
export declare function expandMacros(ex: Prim, opt?: ProtocolOptions): Expr;
