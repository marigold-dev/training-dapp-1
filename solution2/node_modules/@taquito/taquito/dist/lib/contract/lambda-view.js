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
const operation_errors_1 = require("../operations/operation-errors");
/**
 *
 * @deprecated LambdaView has been deprecated in favor of rpc.runView to simulate calls to views following the TZIP-4 standard
 */
class LambdaView {
    constructor(lambdaContract, viewContract, viewMethod = 'default', contractParameter = { prim: 'Unit' }) {
        this.lambdaContract = lambdaContract;
        this.viewContract = viewContract;
        this.viewMethod = viewMethod;
        this.contractParameter = contractParameter;
        this.voidLambda = this.createVoidLambda();
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.lambdaContract.methods.default(this.voidLambda).send();
            }
            catch (ex) {
                if (ex instanceof operation_errors_1.TezosOperationError) {
                    const lastError = ex.errors[ex.errors.length - 1];
                    const failedWith = lastError.with;
                    return failedWith;
                }
                else {
                    throw ex;
                }
            }
        });
    }
    createVoidLambda() {
        const [parameter, callback] = this.getView();
        let contractArgs = [
            {
                prim: 'pair',
                args: [parameter, { prim: 'contract', args: [callback] }],
            },
        ];
        if (this.viewMethod === 'default') {
            contractArgs = [{ string: '%default' }].concat(contractArgs);
        }
        return [
            { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
            { prim: 'NONE', args: [{ prim: 'key_hash' }] },
            {
                prim: 'CREATE_CONTRACT',
                args: [
                    [
                        { prim: 'parameter', args: [callback] },
                        { prim: 'storage', args: [{ prim: 'unit' }] },
                        {
                            prim: 'code',
                            args: [[{ prim: 'CAR' }, { prim: 'FAILWITH' }]],
                        },
                    ],
                ],
            },
            {
                prim: 'DIP',
                args: [
                    [
                        {
                            prim: 'DIP',
                            args: [
                                [
                                    {
                                        prim: 'LAMBDA',
                                        args: [
                                            {
                                                prim: 'pair',
                                                args: [{ prim: 'address' }, { prim: 'unit' }],
                                            },
                                            {
                                                prim: 'pair',
                                                args: [{ prim: 'list', args: [{ prim: 'operation' }] }, { prim: 'unit' }],
                                            },
                                            [
                                                { prim: 'CAR' },
                                                { prim: 'CONTRACT', args: [callback] },
                                                {
                                                    prim: 'IF_NONE',
                                                    args: [
                                                        [
                                                            {
                                                                prim: 'PUSH',
                                                                args: [{ prim: 'string' }, { string: `Callback type unmatched` }],
                                                            },
                                                            { prim: 'FAILWITH' },
                                                        ],
                                                        [],
                                                    ],
                                                },
                                                {
                                                    prim: 'PUSH',
                                                    args: [parameter, this.contractParameter],
                                                },
                                                { prim: 'PAIR' },
                                                {
                                                    prim: 'DIP',
                                                    args: [
                                                        [
                                                            {
                                                                prim: 'PUSH',
                                                                args: [
                                                                    { prim: 'address' },
                                                                    { string: `${this.viewContract.address}%${this.viewMethod}` },
                                                                ],
                                                            },
                                                            { prim: 'DUP' },
                                                            { prim: 'CONTRACT', args: contractArgs },
                                                            {
                                                                prim: 'IF_NONE',
                                                                args: [
                                                                    [
                                                                        {
                                                                            prim: 'PUSH',
                                                                            args: [
                                                                                { prim: 'string' },
                                                                                { string: `Contract does not exist` },
                                                                            ],
                                                                        },
                                                                        { prim: 'FAILWITH' },
                                                                    ],
                                                                    [{ prim: 'DIP', args: [[{ prim: 'DROP' }]] }],
                                                                ],
                                                            },
                                                            {
                                                                prim: 'PUSH',
                                                                args: [{ prim: 'mutez' }, { int: '0' }],
                                                            },
                                                        ],
                                                    ],
                                                },
                                                { prim: 'TRANSFER_TOKENS' },
                                                {
                                                    prim: 'DIP',
                                                    args: [[{ prim: 'NIL', args: [{ prim: 'operation' }] }]],
                                                },
                                                { prim: 'CONS' },
                                                { prim: 'DIP', args: [[{ prim: 'UNIT' }]] },
                                                { prim: 'PAIR' },
                                            ],
                                        ],
                                    },
                                ],
                            ],
                        },
                        { prim: 'APPLY' },
                        {
                            prim: 'DIP',
                            args: [
                                [
                                    {
                                        prim: 'PUSH',
                                        args: [{ prim: 'address' }, { string: this.lambdaContract.address }],
                                    },
                                    { prim: 'DUP' },
                                    {
                                        prim: 'CONTRACT',
                                        args: [
                                            {
                                                prim: 'lambda',
                                                args: [
                                                    { prim: 'unit' },
                                                    {
                                                        prim: 'pair',
                                                        args: [
                                                            { prim: 'list', args: [{ prim: 'operation' }] },
                                                            { prim: 'unit' },
                                                        ],
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        prim: 'IF_NONE',
                                        args: [
                                            [
                                                {
                                                    prim: 'PUSH',
                                                    args: [{ prim: 'string' }, { string: `Contract does not exists` }],
                                                },
                                                { prim: 'FAILWITH' },
                                            ],
                                            [{ prim: 'DIP', args: [[{ prim: 'DROP' }]] }],
                                        ],
                                    },
                                    { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
                                ],
                            ],
                        },
                        { prim: 'TRANSFER_TOKENS' },
                        {
                            prim: 'DIP',
                            args: [[{ prim: 'NIL', args: [{ prim: 'operation' }] }]],
                        },
                        { prim: 'CONS' },
                    ],
                ],
            },
            { prim: 'CONS' },
            { prim: 'DIP', args: [[{ prim: 'UNIT' }]] },
            { prim: 'PAIR' },
        ];
    }
    getView() {
        const entrypoints = this.viewContract.entrypoints.entrypoints;
        const entrypoint = entrypoints[this.viewMethod];
        if (!entrypoint) {
            throw Error(`Contract at ${this.viewContract.address} does not have entrypoint: ${this.viewMethod}`);
        }
        if (!('prim' in entrypoint) || !entrypoint.args) {
            // TODO: Enhance this error message to be more descriptive
            throw Error('Entrypoint args undefined');
        }
        const args = Array.from(entrypoint.args);
        const [parameter, callbackContract] = args;
        if ('annots' in parameter) {
            delete parameter['annots'];
        }
        if (!('prim' in callbackContract) || !callbackContract.args) {
            // TODO: Enhance this error message to be more descriptive
            throw Error('Callback contract args undefined');
        }
        let message;
        if (entrypoint.prim !== 'pair') {
            message = `Expected {'prim': 'pair', ..} but found {'prim': ${entrypoint.prim}, ..}`;
        }
        else if (args.length !== 2) {
            message = `Expected an Array of length 2, but found: ${args}`;
        }
        else if (callbackContract.prim !== 'contract') {
            message = `Expected a {prim: 'contract', ...}, but found: ${callbackContract.prim}`;
        }
        else if (callbackContract.args && callbackContract.args.length !== 1) {
            message = `Expected a single argument to 'contract', but found: ${callbackContract.args}`;
        }
        if (message)
            throw Error(message);
        return [parameter, callbackContract.args[0]];
    }
}
exports.default = LambdaView;
//# sourceMappingURL=lambda-view.js.map