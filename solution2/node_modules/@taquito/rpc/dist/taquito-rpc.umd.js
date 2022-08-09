(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@taquito/http-utils'), require('bignumber.js'), require('@taquito/utils')) :
    typeof define === 'function' && define.amd ? define(['exports', '@taquito/http-utils', 'bignumber.js', '@taquito/utils'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.taquitoRpc = {}, global.httpUtils, global.BigNumber, global.utils));
})(this, (function (exports, httpUtils, BigNumber, utils) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var BigNumber__default = /*#__PURE__*/_interopDefaultLegacy(BigNumber);

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    const defaultChain = 'main';
    const defaultRPCOptions = { block: 'head' };
    var RPCMethodName;
    (function (RPCMethodName) {
        RPCMethodName["GET_BAKING_RIGHTS"] = "getBakingRights";
        RPCMethodName["GET_BALLOTS"] = "getBallots";
        RPCMethodName["GET_BALLOT_LIST"] = "getBallotList";
        RPCMethodName["GET_BIG_MAP_KEY"] = "getBigMapKey";
        RPCMethodName["GET_BIG_MAP_EXPR"] = "getBigMapExpr";
        RPCMethodName["GET_BLOCK_HASH"] = "getBlockHash";
        RPCMethodName["GET_BLOCK"] = "getBlock";
        RPCMethodName["GET_BLOCK_HEADER"] = "getBlockHeader";
        RPCMethodName["GET_BLOCK_METADATA"] = "getBlockMetadata";
        RPCMethodName["GET_BALANCE"] = "getBalance";
        RPCMethodName["GET_CHAIN_ID"] = "getChainId";
        RPCMethodName["GET_CONSTANTS"] = "getConstants";
        RPCMethodName["GET_CONTRACT"] = "getContract";
        RPCMethodName["GET_CURRENT_PERIOD"] = "getCurrentPeriod";
        RPCMethodName["GET_CURRENT_PROPOSAL"] = "getCurrentProposal";
        RPCMethodName["GET_CURRENT_QUORUM"] = "getCurrentQuorum";
        RPCMethodName["GET_DELEGATE"] = "getDelegate";
        RPCMethodName["GET_DELEGATES"] = "getDelegates";
        RPCMethodName["GET_ENDORSING_RIGHTS"] = "getEndorsingRights";
        RPCMethodName["GET_ENTRYPOINTS"] = "getEntrypoints";
        RPCMethodName["GET_LIVE_BLOCKS"] = "getLiveBlocks";
        RPCMethodName["GET_MANAGER_KEY"] = "getManagerKey";
        RPCMethodName["GET_NORMALIZED_SCRIPT"] = "getNormalizedScript";
        RPCMethodName["GET_PROPOSALS"] = "getProposals";
        RPCMethodName["GET_PROTOCOLS"] = "getProtocols";
        RPCMethodName["GET_SAPLING_DIFF_BY_CONTRACT"] = "getSaplingDiffByContract";
        RPCMethodName["GET_SAPLING_DIFF_BY_ID"] = "getSaplingDiffById";
        RPCMethodName["GET_SCRIPT"] = "getScript";
        RPCMethodName["GET_STORAGE"] = "getStorage";
        RPCMethodName["GET_SUCCESSOR_PERIOD"] = "getSuccessorPeriod";
        RPCMethodName["GET_TX_ROLLUP_INBOX"] = "getTxRollupInbox";
        RPCMethodName["GET_TX_ROLLUP_STATE"] = "getTxRollupState";
        RPCMethodName["GET_VOTES_LISTINGS"] = "getVotesListings";
        RPCMethodName["PACK_DATA"] = "packData";
    })(RPCMethodName || (RPCMethodName = {}));

    /**
     * Casts object/array items to BigNumber
     * @param data input object or array
     * @param keys keys for processing or all items if not defined
     *
     */
    function castToBigNumber(data, keys) {
        const returnArray = Array.isArray(data);
        if (typeof keys === 'undefined') {
            keys = Object.keys(data);
        }
        const response = returnArray ? [] : {};
        keys.forEach((key) => {
            const item = data[key];
            let res;
            if (typeof item === 'undefined') {
                return;
            }
            if (Array.isArray(item)) {
                res = castToBigNumber(item);
                response[key] = res;
                return;
            }
            res = new BigNumber__default["default"](item);
            response[key] = res;
        });
        return response;
    }

    const defaultTtl = 1000;
    /***
     * @description RpcClientCache acts as a decorator over the RpcClient instance by caching responses for the period defined by the ttl.
     */
    class RpcClientCache {
        /**
         *
         * @param rpcClient rpcClient responsible of the interaction with Tezos network through an rpc node
         * @param ttl number representing the time to live (default 1000 milliseconds)
         *
         * @example new RpcClientCache(new RpcClient('https://mainnet.api.tez.ie/'))
         */
        constructor(rpcClient, ttl = defaultTtl) {
            this.rpcClient = rpcClient;
            this.ttl = ttl;
            this._cache = {};
        }
        getAllCachedData() {
            return this._cache;
        }
        /**
         * @description Remove all the data in the cache.
         *
         */
        deleteAllCachedData() {
            for (const key in this._cache) {
                delete this._cache[key];
            }
        }
        formatCacheKey(rpcUrl, rpcMethodName, rpcMethodParams, rpcMethodData) {
            let paramsToString = '';
            rpcMethodParams.forEach((param) => {
                paramsToString =
                    typeof param === 'object'
                        ? paramsToString + JSON.stringify(param) + '/'
                        : paramsToString + param + '/';
            });
            return rpcMethodData
                ? `${rpcUrl}/${rpcMethodName}/${paramsToString}/${JSON.stringify(rpcMethodData)}`
                : `${rpcUrl}/${rpcMethodName}/${paramsToString}`;
        }
        has(key) {
            return key in this._cache;
        }
        get(key) {
            return this._cache[key].response;
        }
        put(key, response) {
            const handle = setTimeout(() => {
                return this.remove(key);
            }, this.ttl);
            Object.assign(this._cache, { [key]: { handle, response } });
        }
        remove(key) {
            if (key in this._cache) {
                delete this._cache[key];
            }
        }
        validateAddress(address) {
            if (utils.validateAddress(address) !== utils.ValidationResult.VALID) {
                throw new utils.InvalidAddressError(address);
            }
        }
        validateContract(address) {
            if (utils.validateContractAddress(address) !== utils.ValidationResult.VALID) {
                throw new utils.InvalidContractAddressError(address);
            }
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description Get the block's hash, its unique identifier.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-hash
         */
        getBlockHash({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BLOCK_HASH, [
                    block,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getBlockHash({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description List the ancestors of the given block which, if referred to as the branch in an operation header, are recent enough for that operation to be included in the current block.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-live-blocks
         */
        getLiveBlocks({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_LIVE_BLOCKS, [
                    block,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getLiveBlocks({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param address address from which we want to retrieve the balance
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the balance of a contract.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-balance
         */
        getBalance(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateAddress(address);
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BALANCE, [
                    block,
                    address,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getBalance(address, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve the storage
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the data of the contract.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-storage
         */
        getStorage(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateContract(address);
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_STORAGE, [
                    block,
                    address,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getStorage(address, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve the script
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the code and data of the contract.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-script
         */
        getScript(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateContract(address);
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_SCRIPT, [
                    block,
                    address,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getScript(address, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve the script
         * @param unparsingMode default is { unparsing_mode: "Readable" }
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the script of the contract and normalize it using the requested unparsing mode.
         *
         */
        getNormalizedScript(address, unparsingMode = { unparsing_mode: 'Readable' }, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateContract(address);
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_NORMALIZED_SCRIPT, [block, address, unparsingMode]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getNormalizedScript(address, unparsingMode, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the complete status of a contract.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id
         */
        getContract(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateAddress(address);
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_CONTRACT, [
                    block,
                    address,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getContract(address, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve the manager
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the manager key of a contract.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-manager-key
         */
        getManagerKey(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateAddress(address);
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_MANAGER_KEY, [
                    block,
                    address,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getManagerKey(address, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve the delegate (baker)
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the delegate of a contract, if any.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-delegate
         */
        getDelegate(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateAddress(address);
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_DELEGATE, [
                    block,
                    address,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getDelegate(address, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve the big map key
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the value associated with a key in the big map storage of the contract.
         *
         * @deprecated Deprecated in favor of getBigMapKeyByID
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-context-contracts-contract-id-big-map-get
         */
        getBigMapKey(address, key, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateAddress(address);
                const keyUrl = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BIG_MAP_KEY, [
                    block,
                    address,
                    key,
                ]);
                if (this.has(keyUrl)) {
                    return this.get(keyUrl);
                }
                else {
                    const response = this.rpcClient.getBigMapKey(address, key, { block });
                    this.put(keyUrl, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param id Big Map ID
         * @param expr Expression hash to query (A b58check encoded Blake2b hash of the expression (The expression can be packed using the pack_data method))
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the value associated with a key in a big map.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-big-maps-big-map-id-script-expr
         */
        getBigMapExpr(id, expr, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BIG_MAP_EXPR, [
                    block,
                    id,
                    expr,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getBigMapExpr(id, expr, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param address delegate address which we want to retrieve
         * @param options contains generic configuration for rpc calls
         *
         * @description Fetches information about a delegate from RPC.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-delegates-pkh
         */
        getDelegates(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateAddress(address);
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_DELEGATES, [
                    block,
                    address,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getDelegates(address, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description All constants
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-constants
         */
        getConstants({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_CONSTANTS, [
                    block,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getConstants({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls. See examples for various available sytaxes.
         *
         * @description All the information about a block
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id
         * @example getBlock() will default to /main/chains/block/head.
         * @example getBlock({ block: head~2 }) will return an offset of 2 blocks.
         * @example getBlock({ block: BL8fTiWcSxWCjiMVnDkbh6EuhqVPZzgWheJ2dqwrxYRm9AephXh~2 }) will return an offset of 2 blocks from given block hash..
         */
        getBlock({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BLOCK, [block]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getBlock({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description The whole block header
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-header
         */
        getBlockHeader({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BLOCK_HEADER, [
                    block,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getBlockHeader({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description All the metadata associated to the block
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-metadata
         */
        getBlockMetadata({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BLOCK_METADATA, [
                    block,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getBlockMetadata({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param args contains optional query arguments
         * @param options contains generic configuration for rpc calls
         *
         * @description Retrieves the list of delegates allowed to bake a block.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-helpers-baking-rights
         */
        getBakingRights(args = {}, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BAKING_RIGHTS, [
                    block,
                    args,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getBakingRights(args, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param args contains optional query arguments
         * @param options contains generic configuration for rpc calls
         *
         * @description Retrieves the list of delegates allowed to bake a block.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-helpers-endorsing-rights
         */
        getEndorsingRights(args = {}, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_ENDORSING_RIGHTS, [block, args]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getEndorsingRights(args, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         * @param options contains generic configuration for rpc calls
         *
         * @description Ballots casted so far during a voting period
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-ballot-list
         */
        getBallotList({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BALLOT_LIST, [
                    block,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getBallotList({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description Sum of ballots casted so far during a voting period.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-ballots
         */
        getBallots({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BALLOTS, [block]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getBallots({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description Current proposal under evaluation.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-current-proposal
         */
        getCurrentProposal({ block, } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_CURRENT_PROPOSAL, [block]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getCurrentProposal({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description Current expected quorum.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-current-quorum
         */
        getCurrentQuorum({ block, } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_CURRENT_QUORUM, [
                    block,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getCurrentQuorum({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description List of delegates with their voting weight, in number of rolls.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-listings
         */
        getVotesListings({ block, } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_VOTES_LISTINGS, [
                    block,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getVotesListings({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description List of proposals with number of supporters.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-proposals
         */
        getProposals({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_PROPOSALS, [
                    block,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getProposals({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param data operation contents to forge
         * @param options contains generic configuration for rpc calls
         *
         * @description Forge an operation returning the unsigned bytes
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-forge-operations
         */
        forgeOperations(data, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.rpcClient.forgeOperations(data, { block });
            });
        }
        /**
         *
         * @param signedOpBytes signed bytes to inject
         *
         * @description Inject an operation in node and broadcast it. Returns the ID of the operation. The `signedOperationContents` should be constructed using a contextual RPCs from the latest block and signed by the client. By default, the RPC will wait for the operation to be (pre-)validated before answering. See RPCs under /blocks/prevalidation for more details on the prevalidation context.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-injection-operation
         */
        injectOperation(signedOpBytes) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.rpcClient.injectOperation(signedOpBytes);
            });
        }
        /**
         *
         * @param ops Operations to apply
         * @param options contains generic configuration for rpc calls
         *
         * @description Simulate the validation of an operation
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-preapply-operations
         */
        preapplyOperations(ops, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.rpcClient.preapplyOperations(ops, { block });
            });
        }
        /**
         *
         * @param contract address of the contract we want to get the entrypoints of
         *
         * @description Return the list of entrypoints of the contract
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-entrypoints
         *
         * @version 005_PsBABY5H
         */
        getEntrypoints(contract, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateContract(contract);
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_ENTRYPOINTS, [
                    block,
                    contract,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getEntrypoints(contract, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         * @param op Operation to run
         * @param options contains generic configuration for rpc calls
         *
         * @description Run an operation without signature checks
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-scripts-run-operation
         */
        runOperation(op, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.rpcClient.runOperation(op, { block });
            });
        }
        /**
         * @param code Code to run
         * @param options contains generic configuration for rpc calls
         *
         * @description Run a piece of code in the current context
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-scripts-run-code
         */
        runCode(code, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.rpcClient.runCode(code, { block });
            });
        }
        /**
         * @param viewParams Parameters of the view to run
         * @param options contains generic configuration for rpc calls
         *
         * @description Simulate a call to a view following the TZIP-4 standard. See https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-4/tzip-4.md#view-entrypoints.
         *
         */
        runView(_a, { block } = defaultRPCOptions) {
            var { unparsing_mode = 'Readable' } = _a, rest = __rest(_a, ["unparsing_mode"]);
            return __awaiter(this, void 0, void 0, function* () {
                return this.rpcClient.runView(Object.assign({ unparsing_mode }, rest), { block });
            });
        }
        getChainId() {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_CHAIN_ID, []);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getChainId();
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param data Data to pack
         * @param options contains generic configuration for rpc calls
         *
         * @description Computes the serialized version of a data expression using the same algorithm as script instruction PACK
         *
         * @example packData({ data: { string: "test" }, type: { prim: "string" } })
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-scripts-pack-data
         */
        packData(data, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.PACK_DATA, [
                    block,
                    data,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.packData(data, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @description Return rpc root url
         */
        getRpcUrl() {
            return this.rpcClient.getRpcUrl();
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description Voting period of current block.
         *
         * @example getCurrentPeriod() will default to current voting period for /main/chains/block/head.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-current-period
         */
        getCurrentPeriod({ block, } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_CURRENT_PERIOD, [
                    block,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getCurrentPeriod({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description Voting period of next block.
         *
         * @example getSuccessorPeriod() will default to successor voting period for /main/chains/block/head.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-successor-period
         */
        getSuccessorPeriod({ block, } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_SUCCESSOR_PERIOD, [block]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getSuccessorPeriod({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param id Sapling state ID
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the value associated with a sapling state ID.
         *
         * @see https://tezos.gitlab.io/active/rpc.html#get-block-id-context-sapling-sapling-state-id-get-diff
         */
        getSaplingDiffById(id, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_SAPLING_DIFF_BY_ID, [block, id]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getSaplingDiffById(id, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        /**
         *
         * @param contract address of the contract we want to get the sapling diff
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the value associated with a sapling state.
         *
         * @see https://tezos.gitlab.io/active/rpc.html#get-block-id-context-contracts-contract-id-single-sapling-get-diff
         */
        getSaplingDiffByContract(contract, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_SAPLING_DIFF_BY_CONTRACT, [block, contract]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getSaplingDiffByContract(contract, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        getProtocols({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_PROTOCOLS, [
                    block,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getProtocols({ block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        getTxRollupState(txRollupId, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_TX_ROLLUP_STATE, [
                    block,
                    txRollupId,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getTxRollupState(txRollupId, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
        getTxRollupInbox(txRollupId, blockLevel, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_TX_ROLLUP_INBOX, [
                    block,
                    txRollupId,
                    blockLevel,
                ]);
                if (this.has(key)) {
                    return this.get(key);
                }
                else {
                    const response = this.rpcClient.getTxRollupInbox(txRollupId, blockLevel, { block });
                    this.put(key, response);
                    return response;
                }
            });
        }
    }

    exports.OPERATION_METADATA = void 0;
    (function (OPERATION_METADATA) {
        OPERATION_METADATA["TOO_LARGE"] = "too large";
    })(exports.OPERATION_METADATA || (exports.OPERATION_METADATA = {}));
    exports.METADATA_BALANCE_UPDATES_CATEGORY = void 0;
    (function (METADATA_BALANCE_UPDATES_CATEGORY) {
        METADATA_BALANCE_UPDATES_CATEGORY["BAKING_REWARDS"] = "baking rewards";
        METADATA_BALANCE_UPDATES_CATEGORY["REWARDS"] = "rewards";
        METADATA_BALANCE_UPDATES_CATEGORY["FEES"] = "fees";
        METADATA_BALANCE_UPDATES_CATEGORY["DEPOSITS"] = "deposits";
        METADATA_BALANCE_UPDATES_CATEGORY["LEGACY_REWARDS"] = "legacy_rewards";
        METADATA_BALANCE_UPDATES_CATEGORY["LEGACY_FEES"] = "legacy_fees";
        METADATA_BALANCE_UPDATES_CATEGORY["LEGACY_DEPOSITS"] = "legacy_deposits";
        METADATA_BALANCE_UPDATES_CATEGORY["BLOCK_FEES"] = "block fees";
        METADATA_BALANCE_UPDATES_CATEGORY["NONCE_REVELATION_REWARDS"] = "nonce revelation rewards";
        METADATA_BALANCE_UPDATES_CATEGORY["DOUBLE_SIGNING_EVIDENCE_REWARDS"] = "double signing evidence rewards";
        METADATA_BALANCE_UPDATES_CATEGORY["ENDORSING_REWARDS"] = "endorsing rewards";
        METADATA_BALANCE_UPDATES_CATEGORY["BAKING_BONUSES"] = "baking bonuses";
        METADATA_BALANCE_UPDATES_CATEGORY["STORAGE_FEES"] = "storage fees";
        METADATA_BALANCE_UPDATES_CATEGORY["PUNISHMENTS"] = "punishments";
        METADATA_BALANCE_UPDATES_CATEGORY["LOST_ENDORSING_REWARDS"] = "lost endorsing rewards";
        METADATA_BALANCE_UPDATES_CATEGORY["SUBSIDY"] = "subsidy";
        METADATA_BALANCE_UPDATES_CATEGORY["BURNED"] = "burned";
        METADATA_BALANCE_UPDATES_CATEGORY["COMMITMENT"] = "commitment";
        METADATA_BALANCE_UPDATES_CATEGORY["BOOTSTRAP"] = "bootstrap";
        METADATA_BALANCE_UPDATES_CATEGORY["INVOICE"] = "invoice";
        METADATA_BALANCE_UPDATES_CATEGORY["MINTED"] = "minted";
        METADATA_BALANCE_UPDATES_CATEGORY["TX_ROLLUP_REJECTION_REWARDS"] = "tx_rollup_rejection_rewards";
        METADATA_BALANCE_UPDATES_CATEGORY["TX_ROLLUP_REJECTION_PUNISHMENTS"] = "tx_rollup_rejection_punishments";
        METADATA_BALANCE_UPDATES_CATEGORY["BONDS"] = "bonds";
    })(exports.METADATA_BALANCE_UPDATES_CATEGORY || (exports.METADATA_BALANCE_UPDATES_CATEGORY = {}));

    exports.OpKind = void 0;
    (function (OpKind) {
        OpKind["ORIGINATION"] = "origination";
        OpKind["DELEGATION"] = "delegation";
        OpKind["REVEAL"] = "reveal";
        OpKind["TRANSACTION"] = "transaction";
        OpKind["ACTIVATION"] = "activate_account";
        OpKind["ENDORSEMENT"] = "endorsement";
        OpKind["PREENDORSEMENT"] = "preendorsement";
        OpKind["SET_DEPOSITS_LIMIT"] = "set_deposits_limit";
        OpKind["DOUBLE_PREENDORSEMENT_EVIDENCE"] = "double_preendorsement_evidence";
        OpKind["ENDORSEMENT_WITH_SLOT"] = "endorsement_with_slot";
        OpKind["SEED_NONCE_REVELATION"] = "seed_nonce_revelation";
        OpKind["DOUBLE_ENDORSEMENT_EVIDENCE"] = "double_endorsement_evidence";
        OpKind["DOUBLE_BAKING_EVIDENCE"] = "double_baking_evidence";
        OpKind["PROPOSALS"] = "proposals";
        OpKind["BALLOT"] = "ballot";
        OpKind["FAILING_NOOP"] = "failing_noop";
        OpKind["REGISTER_GLOBAL_CONSTANT"] = "register_global_constant";
        OpKind["TX_ROLLUP_ORIGINATION"] = "tx_rollup_origination";
        OpKind["TX_ROLLUP_SUBMIT_BATCH"] = "tx_rollup_submit_batch";
        OpKind["TX_ROLLUP_COMMIT"] = "tx_rollup_commit";
        OpKind["TX_ROLLUP_RETURN_BOND"] = "tx_rollup_return_bond";
        OpKind["TX_ROLLUP_FINALIZE_COMMITMENT"] = "tx_rollup_finalize_commitment";
        OpKind["TX_ROLLUP_REMOVE_COMMITMENT"] = "tx_rollup_remove_commitment";
        OpKind["TX_ROLLUP_REJECTION"] = "tx_rollup_rejection";
        OpKind["TX_ROLLUP_DISPATCH_TICKETS"] = "tx_rollup_dispatch_tickets";
        OpKind["TRANSFER_TICKET"] = "transfer_ticket";
    })(exports.OpKind || (exports.OpKind = {}));

    // IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
    const VERSION = {
        "commitHash": "6d90b3d5e616a6e9b9ad9dd8453b5068e7396fff",
        "version": "13.0.1"
    };

    /***
     * @description RpcClient allows interaction with Tezos network through an rpc node
     */
    class RpcClient {
        /**
         *
         * @param url rpc root url
         * @param chain chain (default main)
         * @param httpBackend Http backend that issue http request.
         * You can override it by providing your own if you which to hook in the request/response
         *
         * @example new RpcClient('https://mainnet.api.tez.ie/', 'main') this will use https://mainnet.api.tez.ie//chains/main
         */
        constructor(url, chain = defaultChain, httpBackend = new httpUtils.HttpBackend()) {
            this.url = url;
            this.chain = chain;
            this.httpBackend = httpBackend;
        }
        createURL(path) {
            // Trim trailing slashes because it is assumed to be included in path
            return `${this.url.replace(/\/+$/g, '')}${path}`;
        }
        validateAddress(address) {
            if (utils.validateAddress(address) !== utils.ValidationResult.VALID) {
                throw new utils.InvalidAddressError(address);
            }
        }
        validateContract(address) {
            if (utils.validateContractAddress(address) !== utils.ValidationResult.VALID) {
                throw new utils.InvalidAddressError(address);
            }
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description Get the block's hash, its unique identifier.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-hash
         */
        getBlockHash({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const hash = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/hash`),
                    method: 'GET',
                });
                return hash;
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description List the ancestors of the given block which, if referred to as the branch in an operation header, are recent enough for that operation to be included in the current block.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-live-blocks
         */
        getLiveBlocks({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const blocks = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/live_blocks`),
                    method: 'GET',
                });
                return blocks;
            });
        }
        /**
         *
         * @param address address from which we want to retrieve the balance
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the balance of a contract.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-balance
         */
        getBalance(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateAddress(address);
                const balance = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/contracts/${address}/balance`),
                    method: 'GET',
                });
                return new BigNumber__default["default"](balance);
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve the storage
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the data of the contract.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-storage
         */
        getStorage(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateContract(address);
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/contracts/${address}/storage`),
                    method: 'GET',
                });
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve the script
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the code and data of the contract.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-script
         */
        getScript(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateContract(address);
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/contracts/${address}/script`),
                    method: 'GET',
                });
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve the script
         * @param unparsingMode default is { unparsing_mode: "Readable" }
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the script of the contract and normalize it using the requested unparsing mode.
         *
         */
        getNormalizedScript(address, unparsingMode = { unparsing_mode: 'Readable' }, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateContract(address);
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/contracts/${address}/script/normalized`),
                    method: 'POST',
                }, unparsingMode);
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the complete status of a contract.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id
         */
        getContract(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateAddress(address);
                const contractResponse = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/contracts/${address}`),
                    method: 'GET',
                });
                return Object.assign(Object.assign({}, contractResponse), { balance: new BigNumber__default["default"](contractResponse.balance) });
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve the manager
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the manager key of a contract.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-manager-key
         */
        getManagerKey(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateAddress(address);
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/contracts/${address}/manager_key`),
                    method: 'GET',
                });
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve the delegate (baker)
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the delegate of a contract, if any.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-delegate
         */
        getDelegate(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateAddress(address);
                let delegate;
                try {
                    delegate = yield this.httpBackend.createRequest({
                        url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/contracts/${address}/delegate`),
                        method: 'GET',
                    });
                }
                catch (ex) {
                    if (ex instanceof httpUtils.HttpResponseError && ex.status === httpUtils.STATUS_CODE.NOT_FOUND) {
                        delegate = null;
                    }
                    else {
                        throw ex;
                    }
                }
                return delegate;
            });
        }
        /**
         *
         * @param address contract address from which we want to retrieve the big map key
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the value associated with a key in the big map storage of the contract.
         *
         * @deprecated Deprecated in favor of getBigMapKeyByID
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-context-contracts-contract-id-big-map-get
         */
        getBigMapKey(address, key, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateAddress(address);
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/contracts/${address}/big_map_get`),
                    method: 'POST',
                }, key);
            });
        }
        /**
         *
         * @param id Big Map ID
         * @param expr Expression hash to query (A b58check encoded Blake2b hash of the expression (The expression can be packed using the pack_data method))
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the value associated with a key in a big map.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-big-maps-big-map-id-script-expr
         */
        getBigMapExpr(id, expr, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/big_maps/${id}/${expr}`),
                    method: 'GET',
                });
            });
        }
        /**
         *
         * @param address delegate address which we want to retrieve
         * @param options contains generic configuration for rpc calls
         *
         * @description Fetches information about a delegate from RPC.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-delegates-pkh
         */
        getDelegates(address, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateAddress(address);
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/delegates/${address}`),
                    method: 'GET',
                });
                const castedResponse = castToBigNumber(response, [
                    'balance',
                    'full_balance',
                    'current_frozen_deposits',
                    'frozen_deposits',
                    'frozen_balance',
                    'frozen_deposits_limit',
                    'staking_balance',
                    'delegated_balance',
                    'voting_power',
                ]);
                return Object.assign(Object.assign(Object.assign({}, response), castedResponse), { frozen_balance_by_cycle: response.frozen_balance_by_cycle
                        ? response.frozen_balance_by_cycle.map((_a) => {
                            var { deposit, deposits, fees, rewards } = _a, rest = __rest(_a, ["deposit", "deposits", "fees", "rewards"]);
                            const castedToBigNumber = castToBigNumber({ deposit, deposits, fees, rewards }, [
                                'deposit',
                                'deposits',
                                'fees',
                                'rewards',
                            ]);
                            return Object.assign(Object.assign({}, rest), { deposit: castedToBigNumber.deposit, deposits: castedToBigNumber.deposits, fees: castedToBigNumber.fees, rewards: castedToBigNumber.rewards });
                        })
                        : undefined });
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description All constants
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-constants
         */
        getConstants({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/constants`),
                    method: 'GET',
                });
                const castedResponse = castToBigNumber(response, [
                    'time_between_blocks',
                    'hard_gas_limit_per_operation',
                    'hard_gas_limit_per_block',
                    'proof_of_work_threshold',
                    'tokens_per_roll',
                    'seed_nonce_revelation_tip',
                    'block_security_deposit',
                    'endorsement_security_deposit',
                    'block_reward',
                    'endorsement_reward',
                    'cost_per_byte',
                    'hard_storage_limit_per_operation',
                    'test_chain_duration',
                    'baking_reward_per_endorsement',
                    'delay_per_missing_endorsement',
                    'minimal_block_delay',
                    'liquidity_baking_subsidy',
                    'cache_layout',
                    'baking_reward_fixed_portion',
                    'baking_reward_bonus_per_slot',
                    'endorsing_reward_per_slot',
                    'double_baking_punishment',
                    'delay_increment_per_round',
                    'tx_rollup_commitment_bond',
                ]);
                return Object.assign(Object.assign({}, response), castedResponse);
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls. See examples for various available sytaxes.
         *
         * @description All the information about a block
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id
         * @example getBlock() will default to /main/chains/block/head.
         * @example getBlock({ block: head~2 }) will return an offset of 2 blocks.
         * @example getBlock({ block: BL8fTiWcSxWCjiMVnDkbh6EuhqVPZzgWheJ2dqwrxYRm9AephXh~2 }) will return an offset of 2 blocks from given block hash..
         */
        getBlock({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}`),
                    method: 'GET',
                });
                return response;
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description The whole block header
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-header
         */
        getBlockHeader({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/header`),
                    method: 'GET',
                });
                return response;
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description All the metadata associated to the block
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-metadata
         */
        getBlockMetadata({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/metadata`),
                    method: 'GET',
                });
                return response;
            });
        }
        /**
         *
         * @param args contains optional query arguments
         * @param options contains generic configuration for rpc calls
         *
         * @description Retrieves the list of delegates allowed to bake a block.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-helpers-baking-rights
         */
        getBakingRights(args = {}, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/baking_rights`),
                    method: 'GET',
                    query: args,
                });
                return response;
            });
        }
        /**
         *
         * @param args contains optional query arguments
         * @param options contains generic configuration for rpc calls
         *
         * @description Retrieves the list of delegates allowed to bake a block.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-helpers-endorsing-rights
         */
        getEndorsingRights(args = {}, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/endorsing_rights`),
                    method: 'GET',
                    query: args,
                });
                return response;
            });
        }
        /**
         * @param options contains generic configuration for rpc calls
         *
         * @description Ballots casted so far during a voting period
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-ballot-list
         */
        getBallotList({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/ballot_list`),
                    method: 'GET',
                });
                return response;
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description Sum of ballots casted so far during a voting period.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-ballots
         */
        getBallots({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/ballots`),
                    method: 'GET',
                });
                const casted = castToBigNumber(response, ['yay', 'nay', 'pass']);
                return casted;
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description Current proposal under evaluation.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-current-proposal
         */
        getCurrentProposal({ block, } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/current_proposal`),
                    method: 'GET',
                });
                return response;
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description Current expected quorum.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-current-quorum
         */
        getCurrentQuorum({ block, } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/current_quorum`),
                    method: 'GET',
                });
                return response;
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description List of delegates with their voting weight, in number of rolls.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-listings
         */
        getVotesListings({ block, } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/listings`),
                    method: 'GET',
                });
                response.map((item) => {
                    if (item.voting_power) {
                        item.voting_power = new BigNumber__default["default"](item.voting_power);
                    }
                    return item;
                });
                return response;
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description List of proposals with number of supporters.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-proposals
         */
        getProposals({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/proposals`),
                    method: 'GET',
                });
                response.map((item) => {
                    return (item[1] = new BigNumber__default["default"](item[1]));
                });
                return response;
            });
        }
        /**
         *
         * @param data operation contents to forge
         * @param options contains generic configuration for rpc calls
         *
         * @description Forge an operation returning the unsigned bytes
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-forge-operations
         */
        forgeOperations(data, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/forge/operations`),
                    method: 'POST',
                }, data);
            });
        }
        /**
         *
         * @param signedOpBytes signed bytes to inject
         *
         * @description Inject an operation in node and broadcast it. Returns the ID of the operation. The `signedOperationContents` should be constructed using a contextual RPCs from the latest block and signed by the client. By default, the RPC will wait for the operation to be (pre-)validated before answering. See RPCs under /blocks/prevalidation for more details on the prevalidation context.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-injection-operation
         */
        injectOperation(signedOpBytes) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.httpBackend.createRequest({
                    url: this.createURL(`/injection/operation`),
                    method: 'POST',
                }, signedOpBytes);
            });
        }
        /**
         *
         * @param ops Operations to apply
         * @param options contains generic configuration for rpc calls
         *
         * @description Simulate the validation of an operation
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-preapply-operations
         */
        preapplyOperations(ops, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/preapply/operations`),
                    method: 'POST',
                }, ops);
                return response;
            });
        }
        /**
         *
         * @param contract address of the contract we want to get the entrypoints of
         *
         * @description Return the list of entrypoints of the contract
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-entrypoints
         *
         * @version 005_PsBABY5H
         */
        getEntrypoints(contract, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                this.validateContract(contract);
                const contractResponse = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/contracts/${contract}/entrypoints`),
                    method: 'GET',
                });
                return contractResponse;
            });
        }
        /**
         * @param op Operation to run
         * @param options contains generic configuration for rpc calls
         *
         * @description Run an operation without signature checks
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-scripts-run-operation
         */
        runOperation(op, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/scripts/run_operation`),
                    method: 'POST',
                }, op);
                return response;
            });
        }
        /**
         * @param code Code to run
         * @param options contains generic configuration for rpc calls
         *
         * @description Run a piece of code in the current context
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-scripts-run-code
         */
        runCode(code, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/scripts/run_code`),
                    method: 'POST',
                }, code);
                return response;
            });
        }
        /**
         * @param viewParams Parameters of the view to run
         * @param options contains generic configuration for rpc calls
         *
         * @description Simulate a call to a view following the TZIP-4 standard. See https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-4/tzip-4.md#view-entrypoints.
         *
         */
        runView(_a, { block } = defaultRPCOptions) {
            var { unparsing_mode = 'Readable' } = _a, rest = __rest(_a, ["unparsing_mode"]);
            return __awaiter(this, void 0, void 0, function* () {
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/scripts/run_view`),
                    method: 'POST',
                }, Object.assign({ unparsing_mode }, rest));
            });
        }
        getChainId() {
            return __awaiter(this, void 0, void 0, function* () {
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/chain_id`),
                    method: 'GET',
                });
            });
        }
        /**
         *
         * @param data Data to pack
         * @param options contains generic configuration for rpc calls
         *
         * @description Computes the serialized version of a data expression using the same algorithm as script instruction PACK
         * Note: You should always verify the packed bytes before signing or requesting that they be signed when using the the RPC to pack.
         * This precaution helps protect you and your applications users from RPC nodes that have been compromised.
         * A node that is operated by a bad actor, or compromised by a bad actor could return a fully formed operation that does not correspond to the input provided to the RPC endpoint.
         * A safer solution to pack and sign data would be to use the `packDataBytes` function available in the `@taquito/michel-codec` package.
         *
         * @example packData({ data: { string: "test" }, type: { prim: "string" } })
         *
         *
         * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-scripts-pack-data
         */
        packData(data, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const _a = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/scripts/pack_data`),
                    method: 'POST',
                }, data), { gas } = _a, rest = __rest(_a, ["gas"]);
                let formattedGas = gas;
                const tryBigNumber = new BigNumber__default["default"](gas || '');
                if (!tryBigNumber.isNaN()) {
                    formattedGas = tryBigNumber;
                }
                return Object.assign({ gas: formattedGas }, rest);
            });
        }
        /**
         *
         * @description Return rpc root url
         */
        getRpcUrl() {
            return this.url;
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description Voting period of current block.
         *
         * @example getCurrentPeriod() will default to current voting period for /main/chains/block/head.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-current-period
         */
        getCurrentPeriod({ block, } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/current_period`),
                    method: 'GET',
                });
                return response;
            });
        }
        /**
         *
         * @param options contains generic configuration for rpc calls
         *
         * @description Voting period of next block.
         *
         * @example getSuccessorPeriod() will default to successor voting period for /main/chains/block/head.
         *
         * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-successor-period
         */
        getSuccessorPeriod({ block, } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                const response = yield this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/successor_period`),
                    method: 'GET',
                });
                return response;
            });
        }
        /**
         *
         * @param id Sapling state ID
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the value associated with a sapling state ID.
         *
         * @see https://tezos.gitlab.io/active/rpc.html#get-block-id-context-sapling-sapling-state-id-get-diff
         */
        getSaplingDiffById(id, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/sapling/${id}/get_diff`),
                    method: 'GET',
                });
            });
        }
        /**
         *
         * @param contract address of the contract we want to get the sapling diff
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the value associated with a sapling state.
         *
         * @see https://tezos.gitlab.io/active/rpc.html#get-block-id-context-contracts-contract-id-single-sapling-get-diff
         */
        getSaplingDiffByContract(contract, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/contracts/${contract}/single_sapling_get_diff`),
                    method: 'GET',
                });
            });
        }
        getProtocols({ block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/protocols`),
                    method: 'GET',
                });
            });
        }
        /**
         *
         * @param tx_rollup_id the transaction rollup ID
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the state of a rollup
         *
         * @see https://tezos.gitlab.io/jakarta/rpc.html#get-block-id-context-tx-rollup-tx-rollup-id-state
         */
        getTxRollupState(txRollupId, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/tx_rollup/${txRollupId}/state`),
                    method: 'GET',
                });
            });
        }
        /**
         *
         * @param tx_rollup_id the transaction rollup ID
         * @param block_level the block level
         * @param options contains generic configuration for rpc calls
         *
         * @description Access the inbox of a transaction rollup
         *
         * @see https://tezos.gitlab.io/jakarta/rpc.html#get-block-id-context-tx-rollup-tx-rollup-id-inbox-block-level
         */
        getTxRollupInbox(txRollupId, blockLevel, { block } = defaultRPCOptions) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.httpBackend.createRequest({
                    url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/tx_rollup/${txRollupId}/inbox/${blockLevel}`),
                    method: 'GET',
                });
            });
        }
    }

    exports.RpcClient = RpcClient;
    exports.RpcClientCache = RpcClientCache;
    exports.VERSION = VERSION;
    exports.castToBigNumber = castToBigNumber;
    exports.defaultChain = defaultChain;
    exports.defaultRPCOptions = defaultRPCOptions;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=taquito-rpc.umd.js.map
