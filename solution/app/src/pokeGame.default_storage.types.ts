
import { ContractAbstractionFromContractType, WalletContractAbstractionFromContractType } from './type-utils';
import {  } from './type-aliases';

type Storage = {
    
};

type Methods = {
    
};

type MethodsObject = {
    
};

type contractTypes = { methods: Methods, methodsObject: MethodsObject, storage: Storage, code: { __type: 'PokeGameDefaultStorageCode', protocol: string, code: object[] } };
export type PokeGameDefaultStorageContractType = ContractAbstractionFromContractType<contractTypes>;
export type PokeGameDefaultStorageWalletType = WalletContractAbstractionFromContractType<contractTypes>;
