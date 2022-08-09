"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObservableSubscription = exports.UnsupportedEventError = void 0;
/* eslint-disable no-dupe-class-members */
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
/**
 *  @category Error
 *  @description Error that indicates an unsupported event being passed or used
 */
class UnsupportedEventError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'UnsupportedEventError';
    }
}
exports.UnsupportedEventError = UnsupportedEventError;
class ObservableSubscription {
    constructor(obs, shouldRetry = false, operatorFunction = operators_1.retry()) {
        this.shouldRetry = shouldRetry;
        this.operatorFunction = operatorFunction;
        this.errorListeners = [];
        this.messageListeners = [];
        this.closeListeners = [];
        this.completed$ = new rxjs_1.Subject();
        obs
            .pipe(operators_1.takeUntil(this.completed$), operators_1.tap((data) => {
            this.call(this.messageListeners, data);
        }, (error) => {
            this.call(this.errorListeners, error);
        }, () => {
            this.call(this.closeListeners);
        }), this.shouldRetry ? operatorFunction : operators_1.tap(), operators_1.catchError(() => rxjs_1.NEVER))
            .subscribe();
    }
    call(listeners, value) {
        for (const l of listeners) {
            try {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                l(value);
            }
            catch (ex) {
                console.error(ex);
            }
        }
    }
    remove(listeners, value) {
        const idx = listeners.indexOf(value);
        if (idx !== -1) {
            listeners.splice(idx, 1);
        }
    }
    on(type, cb) {
        switch (type) {
            case 'data':
                this.messageListeners.push(cb);
                break;
            case 'error':
                this.errorListeners.push(cb);
                break;
            case 'close':
                this.closeListeners.push(cb);
                break;
            default:
                throw new UnsupportedEventError(`Trying to register on an unsupported event: ${type}`);
        }
    }
    off(type, cb) {
        switch (type) {
            case 'data':
                this.remove(this.messageListeners, cb);
                break;
            case 'error':
                this.remove(this.errorListeners, cb);
                break;
            case 'close':
                this.remove(this.closeListeners, cb);
                break;
            default:
                throw new UnsupportedEventError(`Trying to unregister on an unsupported event: ${type}`);
        }
    }
    close() {
        this.completed$.next();
    }
}
exports.ObservableSubscription = ObservableSubscription;
//# sourceMappingURL=observable-subscription.js.map