
import { ContractAbstractionFromContractType, WalletContractAbstractionFromContractType } from './type-utils';
import { address } from './type-aliases';

export type Storage = Array<address>;

type Methods = {
    default: () => Promise<void>;
};

type MethodsObject = {
    default: () => Promise<void>;
};

type contractTypes = { methods: Methods, methodsObject: MethodsObject, storage: Storage, code: { __type: 'PokeGameCode', protocol: string, code: object[] } };
export type PokeGameContractType = ContractAbstractionFromContractType<contractTypes>;
export type PokeGameWalletType = WalletContractAbstractionFromContractType<contractTypes>;
