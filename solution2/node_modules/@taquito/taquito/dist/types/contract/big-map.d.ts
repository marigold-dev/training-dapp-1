import { Schema, BigMapKeyType } from '@taquito/michelson-encoder';
import BigNumber from 'bignumber.js';
import { ContractProvider } from './interface';
export declare class BigMapAbstraction {
    private id;
    private schema;
    private provider;
    constructor(id: BigNumber, schema: Schema, provider: ContractProvider);
    /**
     *
     * @description Fetch one value in a big map
     *
     * @param keysToEncode Key to query (will be encoded properly according to the schema)
     * @param block optional block level to fetch the values from (head will be use by default)
     * @returns Return a well formatted json object of a big map value or undefined if the key is not found in the big map
     *
     */
    get<T>(keyToEncode: BigMapKeyType, block?: number): Promise<T | undefined>;
    /**
     *
     * @description Fetch multiple values in a big map
     * All values will be fetched on the same block level. If a block is specified in the request, the values will be fetched at it.
     * Otherwise, a first request will be done to the node to fetch the level of the head and all values will be fetched at this level.
     * If one of the keys does not exist in the big map, its value will be set to undefined.
     *
     * @param keysToEncode Array of keys to query (will be encoded properly according to the schema)
     * @param block optional block level to fetch the values from
     * @param batchSize optional batch size representing the number of requests to execute in parallel
     * @returns A MichelsonMap containing the keys queried in the big map and their value in a well-formatted JSON object format
     *
     */
    getMultipleValues<T>(keysToEncode: Array<BigMapKeyType>, block?: number, batchSize?: number): Promise<import("@taquito/michelson-encoder").MichelsonMap<import("@taquito/michelson-encoder").MichelsonMapKey, T | undefined>>;
    toJSON(): string;
    toString(): string;
}
