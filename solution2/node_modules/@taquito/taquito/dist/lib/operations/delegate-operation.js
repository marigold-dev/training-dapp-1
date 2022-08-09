"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelegateOperation = void 0;
const operations_1 = require("./operations");
/**
 * @description Delegation operation provide utility function to fetch newly issued delegation
 *
 * @warn Currently support only one delegation per operation
 */
class DelegateOperation extends operations_1.Operation {
    constructor(hash, params, source, raw, results, context) {
        super(hash, raw, results, context);
        this.params = params;
        this.source = source;
    }
    get operationResults() {
        const delegationOp = Array.isArray(this.results) &&
            this.results.find(op => op.kind === 'delegation');
        const result = delegationOp && delegationOp.metadata && delegationOp.metadata.operation_result;
        return result ? result : undefined;
    }
    get status() {
        const operationResults = this.operationResults;
        if (operationResults) {
            return operationResults.status;
        }
        else {
            return 'unknown';
        }
    }
    get delegate() {
        return this.delegate;
    }
    get isRegisterOperation() {
        return this.delegate === this.source;
    }
    get fee() {
        return this.params.fee;
    }
    get gasLimit() {
        return this.params.gas_limit;
    }
    get storageLimit() {
        return this.params.storage_limit;
    }
    get consumedGas() {
        const consumedGas = this.operationResults && this.operationResults.consumed_gas;
        return consumedGas ? consumedGas : undefined;
    }
    get errors() {
        return this.operationResults && this.operationResults.errors;
    }
}
exports.DelegateOperation = DelegateOperation;
//# sourceMappingURL=delegate-operation.js.map