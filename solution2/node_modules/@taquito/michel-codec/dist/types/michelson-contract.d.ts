import { MichelsonContract, MichelsonContractSection, MichelsonType, MichelsonData, MichelsonCode, MichelsonReturnType } from './michelson-types';
import { InstructionTrace } from './michelson-typecheck';
import { ParserOptions } from './micheline-parser';
export interface ContractOptions extends ParserOptions {
    traceCallback?: (t: InstructionTrace) => void;
}
export declare class Contract {
    readonly contract: MichelsonContract;
    private ctx;
    readonly output: MichelsonReturnType;
    constructor(contract: MichelsonContract, opt?: ContractOptions);
    static parse(src: string | object, opt?: ContractOptions): Contract;
    static parseTypeExpression(src: string | object, opt?: ParserOptions): MichelsonType;
    static parseDataExpression(src: string | object, opt?: ParserOptions): MichelsonData;
    section<T extends 'parameter' | 'storage' | 'code'>(section: T): MichelsonContractSection<T>;
    entryPoints(): [string, MichelsonType][];
    entryPoint(ep?: string): MichelsonType | null;
    assertDataValid(d: MichelsonData, t: MichelsonType): void;
    isDataValid(d: MichelsonData, t: MichelsonType): boolean;
    assertParameterValid(ep: string | null, d: MichelsonData): void;
    isParameterValid(ep: string | null, d: MichelsonData): boolean;
    functionType(inst: MichelsonCode, stack: MichelsonType[]): MichelsonReturnType;
}
export declare const dummyContract: Contract;
