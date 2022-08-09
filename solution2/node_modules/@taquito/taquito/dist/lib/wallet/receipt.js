"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptFromOperation = void 0;
const bignumber_js_1 = require("bignumber.js");
const operation_errors_1 = require("../operations/operation-errors");
const receiptFromOperation = (op, { ALLOCATION_BURN, ORIGINATION_BURN } = {
    ALLOCATION_BURN: 257,
    ORIGINATION_BURN: 257,
}) => {
    const operationResults = operation_errors_1.flattenOperationResult({ contents: op });
    let totalGas = new bignumber_js_1.default(0);
    let totalStorage = new bignumber_js_1.default(0);
    let totalFee = new bignumber_js_1.default(0);
    let totalOriginationBurn = new bignumber_js_1.default(0);
    let totalAllocationBurn = new bignumber_js_1.default(0);
    let totalPaidStorageDiff = new bignumber_js_1.default(0);
    operationResults.forEach(result => {
        totalFee = totalFee.plus(result.fee || 0);
        totalOriginationBurn = totalOriginationBurn.plus(Array.isArray(result.originated_contracts)
            ? result.originated_contracts.length * ORIGINATION_BURN
            : 0);
        totalAllocationBurn = totalAllocationBurn.plus('allocated_destination_contract' in result ? ALLOCATION_BURN : 0);
        totalGas = totalGas.plus(result.consumed_gas || 0);
        totalPaidStorageDiff = totalPaidStorageDiff.plus('paid_storage_size_diff' in result ? Number(result.paid_storage_size_diff) || 0 : 0);
    });
    totalStorage = totalStorage
        .plus(totalAllocationBurn)
        .plus(totalOriginationBurn)
        .plus(totalPaidStorageDiff);
    return {
        totalFee,
        totalGas,
        totalStorage,
        totalAllocationBurn,
        totalOriginationBurn,
        totalPaidStorageDiff,
        totalStorageBurn: new bignumber_js_1.default(totalStorage.multipliedBy(1000)),
    };
};
exports.receiptFromOperation = receiptFromOperation;
//# sourceMappingURL=receipt.js.map