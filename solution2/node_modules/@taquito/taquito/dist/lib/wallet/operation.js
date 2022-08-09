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
exports.WalletOperation = exports.MissedBlockDuringConfirmationError = void 0;
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const receipt_1 = require("./receipt");
const utils_1 = require("@taquito/utils");
const error_1 = require("../error");
/**
 *  @category Error
 *  @description Error that indicates a missed block when polling to retrieve new head block. This may happen when the polling interval is greater than the time between blocks.
 */
class MissedBlockDuringConfirmationError extends Error {
    constructor() {
        super('Taquito missed a block while waiting for operation confirmation and was not able to find the operation');
        this.name = 'MissedBlockDuringConfirmationError';
    }
}
exports.MissedBlockDuringConfirmationError = MissedBlockDuringConfirmationError;
const MAX_BRANCH_ANCESTORS = 60;
/**
 * @description WalletOperation allows to monitor operation inclusion on chains and surface information related to the operation
 */
class WalletOperation {
    /**
     *
     * @param opHash Operation hash
     * @param raw Raw operation that was injected
     * @param context Taquito context allowing access to rpc and signer
     */
    constructor(opHash, context, _newHead$) {
        this.opHash = opHash;
        this.context = context;
        this._newHead$ = _newHead$;
        this._operationResult = new rxjs_1.ReplaySubject(1);
        this._includedInBlock = new rxjs_1.ReplaySubject(1);
        this._included = false;
        this.newHead$ = this._newHead$.pipe(operators_1.tap((newHead) => {
            if (!this._included &&
                this.lastHead &&
                newHead.header.level - this.lastHead.header.level > 1) {
                throw new MissedBlockDuringConfirmationError();
            }
            this.lastHead = newHead;
        }), operators_1.shareReplay({ bufferSize: 1, refCount: true }));
        // Observable that emit once operation is seen in a block
        this.confirmed$ = this.newHead$.pipe(operators_1.map((head) => {
            for (const opGroup of head.operations) {
                for (const op of opGroup) {
                    if (op.hash === this.opHash) {
                        this._included = true;
                        this._includedInBlock.next(head);
                        this._operationResult.next(op.contents);
                        // Return the block where the operation was found
                        return head;
                    }
                }
            }
        }), operators_1.filter((x) => {
            return typeof x !== 'undefined';
        }), operators_1.first(), operators_1.shareReplay({ bufferSize: 1, refCount: true }));
        if (utils_1.validateOperation(this.opHash) !== utils_1.ValidationResult.VALID) {
            throw new utils_1.InvalidOperationHashError(this.opHash);
        }
        this.confirmed$
            .pipe(operators_1.first(), operators_1.catchError(() => rxjs_1.of(undefined)))
            .subscribe();
    }
    operationResults() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._operationResult.pipe(operators_1.first()).toPromise();
        });
    }
    /**
     * @description Receipt expose the total amount of tezos token burn and spent on fees
     * The promise returned by receipt will resolve only once the transaction is included
     */
    receipt() {
        return __awaiter(this, void 0, void 0, function* () {
            return receipt_1.receiptFromOperation(yield this.operationResults());
        });
    }
    getCurrentConfirmation() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._included) {
                return 0;
            }
            return rxjs_1.combineLatest([this._includedInBlock, rxjs_1.from(this.context.readProvider.getBlock('head'))])
                .pipe(operators_1.map(([foundAtBlock, head]) => {
                return head.header.level - foundAtBlock.header.level + 1;
            }), operators_1.first())
                .toPromise();
        });
    }
    isInCurrentBranch(tipBlockIdentifier = 'head') {
        return __awaiter(this, void 0, void 0, function* () {
            // By default it is assumed that the operation is in the current branch
            if (!this._included) {
                return true;
            }
            const tipBlockHeaderLevel = yield this.context.readProvider.getBlockLevel(tipBlockIdentifier);
            const inclusionBlock = yield this._includedInBlock.pipe(operators_1.first()).toPromise();
            const levelDiff = tipBlockHeaderLevel - inclusionBlock.header.level;
            // Block produced before the operation is included are assumed to be part of the current branch
            if (levelDiff <= 0) {
                return true;
            }
            const tipBlockLevel = Math.min(inclusionBlock.header.level + levelDiff, inclusionBlock.header.level + MAX_BRANCH_ANCESTORS);
            const blocks = new Set(yield this.context.readProvider.getLiveBlocks(tipBlockLevel));
            return blocks.has(inclusionBlock.hash);
        });
    }
    confirmationObservable(confirmations) {
        if (typeof confirmations !== 'undefined' && confirmations < 1) {
            throw new error_1.InvalidConfirmationCountError('Confirmation count must be at least 1');
        }
        const { defaultConfirmationCount } = this.context.config;
        const conf = confirmations !== undefined ? confirmations : defaultConfirmationCount;
        if (conf === undefined) {
            throw new error_1.ConfirmationUndefinedError('Default confirmation count can not be undefined!');
        }
        return rxjs_1.combineLatest([this._includedInBlock, this.newHead$]).pipe(operators_1.distinctUntilChanged(([, previousHead], [, newHead]) => {
            return previousHead.hash === newHead.hash;
        }), operators_1.map(([foundAtBlock, head]) => {
            return {
                block: head,
                expectedConfirmation: conf,
                currentConfirmation: head.header.level - foundAtBlock.header.level + 1,
                completed: head.header.level - foundAtBlock.header.level >= conf - 1,
                isInCurrentBranch: () => this.isInCurrentBranch(head.hash),
            };
        }), operators_1.takeWhile(({ completed }) => !completed, true));
    }
    /**
     *
     * @param confirmations [0] Number of confirmation to wait for
     */
    confirmation(confirmations) {
        return this.confirmationObservable(confirmations).toPromise();
    }
}
exports.WalletOperation = WalletOperation;
//# sourceMappingURL=operation.js.map