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
exports.OperationFactory = exports.createNewPollingBasedHeadObservable = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const create_observable_from_subscription_1 = require("../subscribe/create-observable-from-subscription");
const batch_operation_1 = require("./batch-operation");
const delegation_operation_1 = require("./delegation-operation");
const operation_1 = require("./operation");
const origination_operation_1 = require("./origination-operation");
const transaction_operation_1 = require("./transaction-operation");
const createNewPollingBasedHeadObservable = (sharedHeadOb, context, scheduler) => {
    return sharedHeadOb.pipe(operators_1.timeoutWith(context.config.confirmationPollingTimeoutSecond * 1000, rxjs_1.throwError(new Error('Confirmation polling timed out')), scheduler), operators_1.shareReplay({
        refCount: true,
        scheduler,
    }));
};
exports.createNewPollingBasedHeadObservable = createNewPollingBasedHeadObservable;
class OperationFactory {
    constructor(context) {
        this.context = context;
        // Cache the last block for one second across all operations
        this.sharedHeadObs = rxjs_1.defer(() => {
            return create_observable_from_subscription_1.createObservableFromSubscription(this.context.stream.subscribeBlock('head'));
        });
    }
    createNewHeadObservable() {
        return __awaiter(this, void 0, void 0, function* () {
            return exports.createNewPollingBasedHeadObservable(this.sharedHeadObs, this.context);
        });
    }
    createPastBlockWalker(startBlock, count = 1) {
        return rxjs_1.from(this.context.readProvider.getBlock(startBlock)).pipe(operators_1.switchMap((block) => {
            if (count === 1) {
                return rxjs_1.of(block);
            }
            return rxjs_1.range(block.header.level, count - 1).pipe(operators_1.startWith(block), operators_1.concatMap((level) => __awaiter(this, void 0, void 0, function* () {
                return this.context.readProvider.getBlock(typeof level === 'number' ? level : level.header.level);
            })));
        }));
    }
    createHeadObservableFromConfig({ blockIdentifier }) {
        return __awaiter(this, void 0, void 0, function* () {
            const observableSequence = [];
            if (blockIdentifier) {
                observableSequence.push(this.createPastBlockWalker(blockIdentifier));
            }
            observableSequence.push(yield this.createNewHeadObservable());
            return rxjs_1.concat(...observableSequence);
        });
    }
    createOperation(hash, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return new operation_1.WalletOperation(hash, this.context.clone(), yield this.createHeadObservableFromConfig(config));
        });
    }
    createBatchOperation(hash, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return new batch_operation_1.BatchWalletOperation(hash, this.context.clone(), yield this.createHeadObservableFromConfig(config));
        });
    }
    createTransactionOperation(hash, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return new transaction_operation_1.TransactionWalletOperation(hash, this.context.clone(), yield this.createHeadObservableFromConfig(config));
        });
    }
    createDelegationOperation(hash, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return new delegation_operation_1.DelegationWalletOperation(hash, this.context.clone(), yield this.createHeadObservableFromConfig(config));
        });
    }
    createOriginationOperation(hash, config = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return new origination_operation_1.OriginationWalletOperation(hash, this.context.clone(), yield this.createHeadObservableFromConfig(config));
        });
    }
}
exports.OperationFactory = OperationFactory;
//# sourceMappingURL=operation-factory.js.map