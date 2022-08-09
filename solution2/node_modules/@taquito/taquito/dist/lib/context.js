"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = exports.defaultConfigConfirmation = void 0;
const rpc_1 = require("@taquito/rpc");
const rpc_injector_1 = require("./injector/rpc-injector");
const noop_1 = require("./signer/noop");
const operation_factory_1 = require("./wallet/operation-factory");
const rpc_tz_provider_1 = require("./tz/rpc-tz-provider");
const rpc_estimate_provider_1 = require("./estimate/rpc-estimate-provider");
const rpc_contract_provider_1 = require("./contract/rpc-contract-provider");
const rpc_batch_provider_1 = require("./batch/rpc-batch-provider");
const wallet_1 = require("./wallet");
const michel_codec_parser_1 = require("./parser/michel-codec-parser");
const rpc_packer_1 = require("./packer/rpc-packer");
const rxjs_1 = require("rxjs");
const noop_global_constants_provider_1 = require("./global-constants/noop-global-constants-provider");
const rpc_read_adapter_1 = require("./read-provider/rpc-read-adapter");
const polling_subcribe_provider_1 = require("./subscribe/polling-subcribe-provider");
const taquito_local_forger_1 = require("./forger/taquito-local-forger");
exports.defaultConfigConfirmation = {
    defaultConfirmationCount: 1,
    confirmationPollingTimeoutSecond: 180,
};
/**
 * @description Encapsulate common service used throughout different part of the library
 */
class Context {
    constructor(_rpc, _signer = new noop_1.NoopSigner(), _proto, _config = new rxjs_1.BehaviorSubject(Object.assign({}, exports.defaultConfigConfirmation)), forger, injector, packer, wallet, parser, globalConstantsProvider, readProvider, stream) {
        this._rpc = _rpc;
        this._signer = _signer;
        this._proto = _proto;
        this._config = _config;
        this.providerDecorator = [];
        this.tz = new rpc_tz_provider_1.RpcTzProvider(this);
        this.estimate = new rpc_estimate_provider_1.RPCEstimateProvider(this);
        this.contract = new rpc_contract_provider_1.RpcContractProvider(this, this.estimate);
        this.batch = new rpc_batch_provider_1.RPCBatchProvider(this, this.estimate);
        this.wallet = new wallet_1.Wallet(this);
        /**
         * @description Applies the decorators on a cloned instance of the context and returned this cloned instance.
         * The decorators are functions that inject logic into the context.
         * They are provided by the extensions set on the TezosToolkit by calling the registerProviderDecorator method.
         */
        this.withExtensions = () => {
            let clonedContext = this.clone();
            this.providerDecorator.forEach((decorator) => {
                clonedContext = decorator(clonedContext);
            });
            return clonedContext;
        };
        if (typeof this._rpc === 'string') {
            this._rpcClient = new rpc_1.RpcClient(this._rpc);
        }
        else {
            this._rpcClient = this._rpc;
        }
        this._forger = forger ? forger : new taquito_local_forger_1.TaquitoLocalForger(this);
        this._injector = injector ? injector : new rpc_injector_1.RpcInjector(this);
        this.operationFactory = new operation_factory_1.OperationFactory(this);
        this._walletProvider = wallet ? wallet : new wallet_1.LegacyWalletProvider(this);
        this._parser = parser ? parser : new michel_codec_parser_1.MichelCodecParser(this);
        this._packer = packer ? packer : new rpc_packer_1.RpcPacker(this);
        this._globalConstantsProvider = globalConstantsProvider
            ? globalConstantsProvider
            : new noop_global_constants_provider_1.NoopGlobalConstantsProvider();
        this._readProvider = readProvider ? readProvider : new rpc_read_adapter_1.RpcReadAdapter(this);
        this._stream = stream ? stream : new polling_subcribe_provider_1.PollingSubscribeProvider(this);
    }
    get config() {
        return this._config.getValue();
    }
    set config(value) {
        this._config.next(Object.assign({}, value));
    }
    setPartialConfig(value) {
        this._config.next(Object.assign(Object.assign({}, this._config.getValue()), value));
    }
    get rpc() {
        return this._rpcClient;
    }
    set rpc(value) {
        this._rpcClient = value;
    }
    get injector() {
        return this._injector;
    }
    set injector(value) {
        this._injector = value;
    }
    get forger() {
        return this._forger;
    }
    set forger(value) {
        this._forger = value;
    }
    get signer() {
        return this._signer;
    }
    set signer(value) {
        this._signer = value;
    }
    get walletProvider() {
        return this._walletProvider;
    }
    set walletProvider(value) {
        this._walletProvider = value;
    }
    set proto(value) {
        this._proto = value;
    }
    get proto() {
        return this._proto;
    }
    get parser() {
        return this._parser;
    }
    set parser(value) {
        this._parser = value;
    }
    get packer() {
        return this._packer;
    }
    set packer(value) {
        this._packer = value;
    }
    get globalConstantsProvider() {
        return this._globalConstantsProvider;
    }
    set globalConstantsProvider(value) {
        this._globalConstantsProvider = value;
    }
    get readProvider() {
        return this._readProvider;
    }
    set readProvider(value) {
        this._readProvider = value;
    }
    get stream() {
        return this._stream;
    }
    set stream(value) {
        this._stream = value;
    }
    isAnyProtocolActive(protocol = []) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._proto) {
                return protocol.includes(this._proto);
            }
            else {
                const next_protocol = yield this.readProvider.getNextProtocol('head');
                return protocol.includes(next_protocol);
            }
        });
    }
    isAnySignerConfigured() {
        return !(this.signer instanceof noop_1.NoopSigner);
    }
    /**
     * @description Create a copy of the current context. Useful when you have long running operation and you do not want a context change to affect the operation
     */
    clone() {
        return new Context(this.rpc, this.signer, this.proto, this._config, this.forger, this._injector, this.packer, this._walletProvider, this._parser, this._globalConstantsProvider, this._readProvider, this._stream);
    }
    /**
     * @description Allows extensions set on the TezosToolkit to inject logic into the context
     */
    registerProviderDecorator(fx) {
        this.providerDecorator.push(fx);
    }
}
exports.Context = Context;
//# sourceMappingURL=context.js.map