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
exports.PollingSubscribeProvider = exports.defaultConfigStreamer = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const filters_1 = require("./filters");
const observable_subscription_1 = require("./observable-subscription");
const bignumber_js_1 = require("bignumber.js");
exports.defaultConfigStreamer = {
    shouldObservableSubscriptionRetry: false,
    observableSubscriptionRetryFunction: operators_1.retry(),
};
const getLastBlock = (context) => {
    return rxjs_1.from(context.rpc.getBlock()).pipe(operators_1.first());
};
const applyFilter = (filter) => operators_1.concatMap((block) => {
    return new rxjs_1.Observable((sub) => {
        for (const ops of block.operations) {
            for (const op of ops) {
                for (const content of op.contents) {
                    if (filters_1.evaluateFilter(Object.assign({ hash: op.hash }, content), filter)) {
                        sub.next(Object.assign({ hash: op.hash }, content));
                    }
                }
            }
        }
        sub.complete();
    });
});
class PollingSubscribeProvider {
    constructor(context, config = {}) {
        this.context = context;
        this._config$ = new rxjs_1.BehaviorSubject(Object.assign(Object.assign({}, exports.defaultConfigStreamer), config));
        this.timer$ = this._config$.pipe(operators_1.pluck('pollingIntervalMilliseconds'), operators_1.switchMap((pollingIntervalMilliseconds) => {
            if (!pollingIntervalMilliseconds) {
                return rxjs_1.from(this.getConfirmationPollingInterval()).pipe(operators_1.switchMap((interval) => {
                    return rxjs_1.timer(0, interval);
                }));
            }
            else {
                return rxjs_1.timer(0, pollingIntervalMilliseconds);
            }
        }));
        this.newBlock$ = this.timer$.pipe(operators_1.switchMap(() => getLastBlock(this.context)), operators_1.distinctUntilKeyChanged('hash'), operators_1.publish(), operators_1.refCount());
    }
    get config() {
        return this._config$.getValue();
    }
    getConfirmationPollingInterval() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.config.pollingIntervalMilliseconds) {
                const defaultIntervalTestnetsMainnet = 5000;
                const defaultIntervalSandbox = 1000;
                try {
                    const constants = yield this.context.readProvider.getProtocolConstants('head');
                    const blockTime = constants.minimal_block_delay
                        ? constants.minimal_block_delay.multipliedBy(1000)
                        : constants.time_between_blocks
                            ? constants.time_between_blocks[0].multipliedBy(1000)
                            : new bignumber_js_1.default(defaultIntervalTestnetsMainnet);
                    const confirmationPollingInterval = blockTime.dividedBy(3);
                    this.config.pollingIntervalMilliseconds =
                        confirmationPollingInterval.toNumber() === 0
                            ? defaultIntervalSandbox
                            : confirmationPollingInterval.toNumber();
                }
                catch (exception) {
                    return defaultIntervalTestnetsMainnet;
                }
            }
            return this.config.pollingIntervalMilliseconds;
        });
    }
    subscribeBlock(_filter) {
        return new observable_subscription_1.ObservableSubscription(this.newBlock$, this.config.shouldObservableSubscriptionRetry, this.config.observableSubscriptionRetryFunction);
    }
    subscribe(_filter) {
        return new observable_subscription_1.ObservableSubscription(this.newBlock$.pipe(operators_1.pluck('hash')), this.config.shouldObservableSubscriptionRetry, this.config.observableSubscriptionRetryFunction);
    }
    subscribeOperation(filter) {
        return new observable_subscription_1.ObservableSubscription(this.newBlock$.pipe(applyFilter(filter)), this.config.shouldObservableSubscriptionRetry, this.config.observableSubscriptionRetryFunction);
    }
}
exports.PollingSubscribeProvider = PollingSubscribeProvider;
//# sourceMappingURL=polling-subcribe-provider.js.map