"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OriginationParameterError = exports.RevealOperationError = exports.InvalidViewSimulationContext = exports.validateAndExtractFailwith = exports.ViewSimulationError = exports.InvalidViewParameterError = exports.InvalidInitParameter = exports.InvalidCodeParameter = exports.InvalidDelegationSource = exports.InvalidParameterError = void 0;
/**
 *  @category Error
 *  @description Error that indicates invalid smart contract parameters being passed or used
 */
class InvalidParameterError extends Error {
    constructor(smartContractMethodName, sigs, args) {
        super(`${smartContractMethodName} Received ${args.length} arguments while expecting one of the following signatures (${JSON.stringify(sigs)})`);
        this.smartContractMethodName = smartContractMethodName;
        this.sigs = sigs;
        this.args = args;
        this.name = 'Invalid parameters error';
    }
}
exports.InvalidParameterError = InvalidParameterError;
/**
 *  @category Error
 *  @description Error that indicates an invalid delegation source contract address being passed or used
 */
class InvalidDelegationSource extends Error {
    constructor(source) {
        super(`Since Babylon delegation source can no longer be a contract address ${source}. Please use the smart contract abstraction to set your delegate.`);
        this.source = source;
        this.name = 'Invalid delegation source error';
    }
}
exports.InvalidDelegationSource = InvalidDelegationSource;
/**
 *  @category Error
 *  @description Error that indicates an invalid smart contract code parameter being passed or used
 */
class InvalidCodeParameter extends Error {
    constructor(message, data) {
        super(message);
        this.message = message;
        this.data = data;
        this.name = 'InvalidCodeParameter';
    }
}
exports.InvalidCodeParameter = InvalidCodeParameter;
/**
 *  @category Error
 *  @description Error that indicates invalid smart contract init parameter being passed or used
 */
class InvalidInitParameter extends Error {
    constructor(message, data) {
        super(message);
        this.message = message;
        this.data = data;
        this.name = 'InvalidInitParameter';
    }
}
exports.InvalidInitParameter = InvalidInitParameter;
/**
 *  @category Error
 *  @description Error that indicates invalid view parameter of a smart contract
 */
class InvalidViewParameterError extends Error {
    constructor(smartContractViewName, sigs, args, originalError) {
        super(`Unable to encode the parameter of the view: ${smartContractViewName}. Received ${args} as parameter while expecting one of the following signatures (${JSON.stringify(sigs)})`);
        this.smartContractViewName = smartContractViewName;
        this.sigs = sigs;
        this.args = args;
        this.originalError = originalError;
        this.name = 'Invalid view parameters error';
        this.cause = originalError;
    }
}
exports.InvalidViewParameterError = InvalidViewParameterError;
/**
 *  @category Error
 *  @description Error that indicates a failure when conducting a view simulation
 */
class ViewSimulationError extends Error {
    constructor(message, viewName, failWith, originalError) {
        super(message);
        this.message = message;
        this.viewName = viewName;
        this.failWith = failWith;
        this.originalError = originalError;
        this.name = 'ViewSimulationError';
    }
}
exports.ViewSimulationError = ViewSimulationError;
const validateAndExtractFailwith = (error) => {
    if (isJsonString(error.body)) {
        const parsedError = JSON.parse(error.body);
        if (Array.isArray(parsedError) && 'with' in parsedError[parsedError.length - 1]) {
            return parsedError[parsedError.length - 1].with;
        }
    }
};
exports.validateAndExtractFailwith = validateAndExtractFailwith;
const isJsonString = (str) => {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
};
/**
 *  @category Error
 *  @description Error that indicates invalid or unconfigured context when executing a view
 */
class InvalidViewSimulationContext extends Error {
    constructor(info) {
        super(`${info} Please configure the context of the view execution in the executeView method.`);
        this.info = info;
        this.name = 'InvalidViewSimulationContext';
    }
}
exports.InvalidViewSimulationContext = InvalidViewSimulationContext;
/**
 *  @category Error
 *  @description Error that indicates a mistake happening during the reveal operation
 */
class RevealOperationError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'RevealOperationError';
    }
}
exports.RevealOperationError = RevealOperationError;
/**
 *  @category Error
 *  @description Error that indicates a mistake in the parameters in the preparation of an Origination operation
 */
class OriginationParameterError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'OriginationParameterError';
    }
}
exports.OriginationParameterError = OriginationParameterError;
//# sourceMappingURL=errors.js.map