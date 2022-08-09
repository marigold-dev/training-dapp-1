import { Prim, Expr, StringLiteral } from './micheline';
import { MichelsonError } from './utils';
import { MichelsonCode, MichelsonType, MichelsonData, MichelsonContract, MichelsonInstruction, InstructionList } from './michelson-types';
export declare const instructionIDs: Record<MichelsonInstruction['prim'], true>;
export declare class MichelsonValidationError extends MichelsonError {
    val: Expr;
    /**
     * @param val Value of a node caused the error
     * @param message An error message
     */
    constructor(val: Expr, message?: string);
}
/**
 * Checks if the node is a valid Michelson code (sequence of instructions).
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export declare function assertMichelsonInstruction(ex: Expr): ex is MichelsonCode;
export declare function assertMichelsonComparableType(ex: Expr): ex is MichelsonType;
export declare function assertMichelsonPackableType(ex: Expr): ex is MichelsonType;
export declare function assertMichelsonPushableType(ex: Expr): ex is MichelsonType;
export declare function assertMichelsonStorableType(ex: Expr): ex is MichelsonType;
export declare function assertMichelsonPassableType(ex: Expr): ex is MichelsonType;
export declare function assertMichelsonBigMapStorableType(ex: Expr): ex is MichelsonType;
export declare function assertViewNameValid(name: StringLiteral): void;
/**
 * Checks if the node is a valid Michelson type expression.
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export declare function assertMichelsonType(ex: Expr): ex is MichelsonType;
/**
 * Checks if the node is a valid Michelson data literal such as `(Pair {Elt "0" 0} 0)`.
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export declare function assertMichelsonData(ex: Expr): ex is MichelsonData;
/**
 * Checks if the node is a valid Michelson smart contract source containing all required and valid properties such as `parameter`, `storage` and `code`.
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export declare function assertMichelsonContract(ex: Expr): ex is MichelsonContract;
/**
 * Checks if the node is a valid Michelson smart contract source containing all required and valid properties such as `parameter`, `storage` and `code`.
 * @param ex An AST node
 */
export declare function isMichelsonScript(ex: Expr): ex is MichelsonContract;
/**
 * Checks if the node is a valid Michelson data literal such as `(Pair {Elt "0" 0} 0)`.
 * @param ex An AST node
 */
export declare function isMichelsonData(ex: Expr): ex is MichelsonData;
/**
 * Checks if the node is a valid Michelson code (sequence of instructions).
 * @param ex An AST node
 */
export declare function isMichelsonCode(ex: Expr): ex is InstructionList;
/**
 * Checks if the node is a valid Michelson type expression.
 * @param ex An AST node
 */
export declare function isMichelsonType(ex: Expr): ex is MichelsonType;
export declare function isInstruction(p: Prim): p is MichelsonInstruction;
export declare function assertDataListIfAny(d: MichelsonData): d is MichelsonData[];
