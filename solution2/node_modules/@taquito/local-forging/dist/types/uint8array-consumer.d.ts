export declare class Uint8ArrayConsumer {
    private readonly arr;
    private offset;
    static fromHexString(hex: string): Uint8ArrayConsumer;
    constructor(arr: Uint8Array, offset?: number);
    consume(count: number): Uint8Array;
    get(idx: number): number;
    length(): number;
}
