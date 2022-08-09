"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchOperation = void 0;
const rpc_batch_provider_1 = require("../batch/rpc-batch-provider");
const operation_errors_1 = require("./operation-errors");
const operations_1 = require("./operations");
const types_1 = require("./types");
class BatchOperation extends operations_1.Operation {
    constructor(hash, params, source, raw, results, context) {
        super(hash, raw, results, context);
        this.params = params;
        this.source = source;
    }
    sumProp(arr, prop) {
        return arr.reduce((prev, current) => {
            return prop in current ? Number(current[prop]) + prev : prev;
        }, 0);
    }
    get status() {
        return (this.results
            .filter((result) => rpc_batch_provider_1.BATCH_KINDS.indexOf(result.kind) !== -1)
            .map((result) => {
            if (types_1.hasMetadataWithResult(result)) {
                return result.metadata.operation_result.status;
            }
            else {
                return 'unknown';
            }
        })[0] || 'unknown');
    }
    get fee() {
        return this.sumProp(this.params, 'fee');
    }
    get gasLimit() {
        return this.sumProp(this.params, 'gas_limit');
    }
    get storageLimit() {
        return this.sumProp(this.params, 'storage_limit');
    }
    get consumedGas() {
        return String(this.sumProp(operation_errors_1.flattenOperationResult({ contents: this.results }), 'consumed_gas'));
    }
    get storageDiff() {
        return String(this.sumProp(operation_errors_1.flattenOperationResult({ contents: this.results }), 'paid_storage_size_diff'));
    }
    get errors() {
        return operation_errors_1.flattenErrors({ contents: this.results });
    }
}
exports.BatchOperation = BatchOperation;
//# sourceMappingURL=batch-operation.js.map