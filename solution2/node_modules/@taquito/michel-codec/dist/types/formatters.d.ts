import { InstructionTrace } from './michelson-typecheck';
import { MichelsonError } from './utils';
import { MichelsonReturnType } from './michelson-types';
export declare function formatStack(s: MichelsonReturnType): string;
export declare function traceDumpFunc(blocks: boolean, cb: (s: string) => void): (v: InstructionTrace) => void;
export declare function formatError(err: MichelsonError): string;
