
import { ContractAbstractionFromContractType, WalletContractAbstractionFromContractType } from './type-utils';
import {  } from './type-aliases';

type Storage = {
    
};

type Methods = {
    
};

type MethodsObject = {
    
};

type contractTypes = { methods: Methods, methodsObject: MethodsObject, storage: Storage, code: { __type: 'PokeGameParameterDefaultParameterCode', protocol: string, code: object[] } };
export type PokeGameParameterDefaultParameterContractType = ContractAbstractionFromContractType<contractTypes>;
export type PokeGameParameterDefaultParameterWalletType = WalletContractAbstractionFromContractType<contractTypes>;
