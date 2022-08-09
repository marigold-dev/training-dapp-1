"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidFilterExpressionError = exports.ConfirmationUndefinedError = exports.InvalidConfirmationCountError = void 0;
/**
 *  @category Error
 *  @description Error that indicates invalid confirmation count has been passed or configured
 */
class InvalidConfirmationCountError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'InvalidConfirmationCountError';
    }
}
exports.InvalidConfirmationCountError = InvalidConfirmationCountError;
/**
 *  @category Error
 *  @description Error that indicates undefined confirmation has not been specified or configured
 */
class ConfirmationUndefinedError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'ConfirmationUndefinedError';
    }
}
exports.ConfirmationUndefinedError = ConfirmationUndefinedError;
/**
 *  @category Error
 *  @description Error that indicates an invalid filter expression being passed or used
 */
class InvalidFilterExpressionError extends Error {
    constructor(message) {
        super(message);
        this.message = message;
        this.name = 'InvalidFilterExpressionError';
    }
}
exports.InvalidFilterExpressionError = InvalidFilterExpressionError;
//# sourceMappingURL=error.js.map