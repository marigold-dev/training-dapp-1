"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compose = void 0;
function compose(functioncomposer1, functioncomposer2) {
    return (contractAbstraction, context) => functioncomposer2(functioncomposer1(contractAbstraction, context), context);
}
exports.compose = compose;
//# sourceMappingURL=compose.js.map