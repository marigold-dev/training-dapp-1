import { Decoder } from '../decoder';
import { Uint8ArrayConsumer } from '../uint8array-consumer';
import { Encoder } from '../taquito-local-forging';
export declare type PrimValue = {
    prim: string;
    args?: MichelsonValue[];
    annots?: string[];
};
export declare type BytesValue = {
    bytes: string;
};
export declare type StringValue = {
    string: string;
};
export declare type IntValue = {
    int: string;
};
export declare type MichelsonValue = PrimValue | BytesValue | StringValue | IntValue | (PrimValue | BytesValue | StringValue | IntValue)[];
export declare const isPrim: (value: MichelsonValue) => value is PrimValue;
export declare const isBytes: (value: MichelsonValue) => value is BytesValue;
export declare const isString: (value: MichelsonValue) => value is StringValue;
export declare const isInt: (value: MichelsonValue) => value is IntValue;
export declare const scriptEncoder: Encoder<{
    code: MichelsonValue;
    storage: MichelsonValue;
}>;
export declare const scriptDecoder: Decoder;
export declare const valueEncoder: Encoder<MichelsonValue>;
export declare const valueDecoder: Decoder;
export declare const extractRequiredLen: (value: Uint8ArrayConsumer, bytesLength?: number) => Uint8Array;
export declare const bytesEncoder: Encoder<BytesValue>;
export declare const bytesDecoder: Decoder;
export declare const stringEncoder: Encoder<StringValue>;
export declare const stringDecoder: Decoder;
export declare const intEncoder: Encoder<IntValue>;
export declare const intDecoder: (value: Uint8ArrayConsumer) => IntValue;
export declare const primEncoder: Encoder<PrimValue>;
export declare const primDecoder: (value: Uint8ArrayConsumer, preamble: Uint8Array) => Partial<PrimValue>;
export declare const primViewDecoder: (value: Uint8ArrayConsumer, result: Partial<PrimValue>) => Partial<PrimValue>;
export declare const decodeCombPair: Decoder;
export declare const encodeAnnots: Encoder<string[]>;
export declare const decodeAnnots: Decoder;
