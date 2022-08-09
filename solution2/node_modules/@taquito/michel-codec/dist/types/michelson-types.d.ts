import { Prim, Expr, IntLiteral, StringLiteral, BytesLiteral, List, Node } from './micheline';
interface Prim0<PT extends string = string> extends Prim<PT> {
    args?: never;
}
interface PrimX<PT extends string = string, AT extends Expr[] = Expr[]> extends Prim<PT, AT> {
    args: AT;
}
declare type MichelsonNoArgInstructionID = 'ABS' | 'ADD' | 'ADDRESS' | 'AMOUNT' | 'AND' | 'APPLY' | 'BALANCE' | 'BLAKE2B' | 'CAR' | 'CDR' | 'CHAIN_ID' | 'CHECK_SIGNATURE' | 'COMPARE' | 'CONCAT' | 'CONS' | 'EDIV' | 'EQ' | 'EXEC' | 'FAILWITH' | 'GE' | 'GET_AND_UPDATE' | 'GT' | 'HASH_KEY' | 'IMPLICIT_ACCOUNT' | 'INT' | 'ISNAT' | 'JOIN_TICKETS' | 'KECCAK' | 'LE' | 'LEVEL' | 'LSL' | 'LSR' | 'LT' | 'MEM' | 'MUL' | 'NEG' | 'NEQ' | 'NEVER' | 'NOT' | 'NOW' | 'OR' | 'PACK' | 'PAIRING_CHECK' | 'READ_TICKET' | 'SAPLING_VERIFY_UPDATE' | 'SELF' | 'SELF_ADDRESS' | 'SENDER' | 'SET_DELEGATE' | 'SHA256' | 'SHA3' | 'SHA512' | 'SIZE' | 'SLICE' | 'SOME' | 'SOURCE' | 'SPLIT_TICKET' | 'SUB' | 'SUB_MUTEZ' | 'SWAP' | 'TICKET' | 'TOTAL_VOTING_POWER' | 'TRANSFER_TOKENS' | 'UNIT' | 'VOTING_POWER' | 'XOR' | 'RENAME' | 'OPEN_CHEST' | 'MIN_BLOCK_TIME';
declare type MichelsonRegularInstructionID = 'CONTRACT' | 'CREATE_CONTRACT' | 'DIG' | 'DIP' | 'DROP' | 'DUG' | 'DUP' | 'EMPTY_BIG_MAP' | 'EMPTY_MAP' | 'EMPTY_SET' | 'GET' | 'IF' | 'IF_CONS' | 'IF_LEFT' | 'IF_NONE' | 'ITER' | 'LAMBDA' | 'LEFT' | 'LOOP' | 'LOOP_LEFT' | 'MAP' | 'NIL' | 'NONE' | 'PAIR' | 'PUSH' | 'RIGHT' | 'SAPLING_EMPTY_STATE' | 'UNPACK' | 'UNPAIR' | 'UPDATE' | 'CAST' | 'VIEW' | 'CREATE_ACCOUNT' | 'STEPS_TO_QUOTA';
export declare type MichelsonInstructionID = MichelsonNoArgInstructionID | MichelsonRegularInstructionID;
declare type InstrPrim<PT extends MichelsonInstructionID, AT extends Expr[]> = Prim<PT, AT>;
declare type Instr0<PT extends MichelsonNoArgInstructionID> = Prim0<PT>;
declare type InstrX<PT extends MichelsonRegularInstructionID, AT extends Expr[]> = PrimX<PT, AT>;
export declare type MichelsonCode = InstructionList | MichelsonInstruction;
export interface InstructionList extends List<MichelsonCode> {
}
export declare type MichelsonNoArgInstruction = Instr0<MichelsonNoArgInstructionID>;
export declare type MichelsonInstruction = MichelsonNoArgInstruction | InstrX<'DIG' | 'DUG' | 'SAPLING_EMPTY_STATE', [IntLiteral]> | InstrX<'NONE' | 'LEFT' | 'RIGHT' | 'NIL' | 'CAST', [MichelsonType]> | InstrX<'IF_NONE' | 'IF_LEFT' | 'IF_CONS' | 'IF', [InstructionList, InstructionList]> | InstrX<'MAP' | 'ITER' | 'LOOP' | 'LOOP_LEFT' | 'DIP', [InstructionList]> | InstrX<'UNPACK', [MichelsonType]> | InstrX<'CONTRACT', [MichelsonType]> | InstrX<'CREATE_CONTRACT', [MichelsonContract]> | InstrX<'PUSH', [MichelsonType, MichelsonData]> | InstrX<'EMPTY_SET', [MichelsonType]> | InstrX<'EMPTY_MAP', [MichelsonType, MichelsonType]> | InstrX<'EMPTY_BIG_MAP', [MichelsonType, MichelsonType]> | InstrX<'LAMBDA', [MichelsonType, MichelsonType, InstructionList]> | InstrX<'DIP', [IntLiteral, InstructionList] | [InstructionList]> | InstrX<'VIEW', [StringLiteral, MichelsonType]> | InstrPrim<'DROP' | 'PAIR' | 'UNPAIR' | 'DUP' | 'GET' | 'UPDATE', [IntLiteral]>;
export declare type MichelsonSimpleComparableTypeID = 'string' | 'nat' | 'int' | 'bytes' | 'bool' | 'mutez' | 'key_hash' | 'address' | 'timestamp' | 'never' | 'key' | 'unit' | 'signature' | 'chain_id' | 'tx_rollup_l2_address';
export declare type MichelsonTypeID = MichelsonSimpleComparableTypeID | 'option' | 'list' | 'set' | 'contract' | 'operation' | 'pair' | 'or' | 'lambda' | 'map' | 'big_map' | 'sapling_transaction' | 'sapling_state' | 'ticket' | 'bls12_381_g1' | 'bls12_381_g2' | 'bls12_381_fr' | 'chest_key' | 'chest';
declare type Type0<PT extends MichelsonTypeID> = Prim0<PT>;
declare type TypeX<PT extends MichelsonTypeID, AT extends Expr[]> = PrimX<PT, AT>;
export declare const refContract: unique symbol;
export interface MichelsonTypeAddress extends Type0<'address'> {
    [refContract]?: MichelsonTypeContract<MichelsonType>;
}
export declare type MichelsonTypeInt = Type0<'int'>;
export declare type MichelsonTypeNat = Type0<'nat'>;
export declare type MichelsonTypeString = Type0<'string'>;
export declare type MichelsonTypeBytes = Type0<'bytes'>;
export declare type MichelsonTypeMutez = Type0<'mutez'>;
export declare type MichelsonTypeBool = Type0<'bool'>;
export declare type MichelsonTypeKeyHash = Type0<'key_hash'>;
export declare type MichelsonTypeTimestamp = Type0<'timestamp'>;
export declare type MichelsonTypeKey = Type0<'key'>;
export declare type MichelsonTypeUnit = Type0<'unit'>;
export declare type MichelsonTypeSignature = Type0<'signature'>;
export declare type MichelsonTypeOperation = Type0<'operation'>;
export declare type MichelsonTypeChainID = Type0<'chain_id'>;
export declare type MichelsonTypeNever = Type0<'never'>;
export declare type MichelsonTypeBLS12_381_G1 = Type0<'bls12_381_g1'>;
export declare type MichelsonTypeBLS12_381_G2 = Type0<'bls12_381_g2'>;
export declare type MichelsonTypeBLS12_381_FR = Type0<'bls12_381_fr'>;
export declare type MichelsonTypeChestKey = Type0<'chest_key'>;
export declare type MichelsonTypeChest = Type0<'chest'>;
declare type TypeList<T extends MichelsonType[]> = T & Node;
export declare type MichelsonTypePair<T extends MichelsonType[]> = TypeX<'pair', T> | TypeList<T>;
export interface MichelsonTypeOption<T extends MichelsonType> extends TypeX<'option', [T]> {
}
export interface MichelsonTypeList<T extends MichelsonType> extends TypeX<'list', [T]> {
}
export interface MichelsonTypeContract<T extends MichelsonType> extends TypeX<'contract', [T]> {
}
export interface MichelsonTypeOr<T extends [MichelsonType, MichelsonType]> extends TypeX<'or', T> {
}
export interface MichelsonTypeLambda<Arg extends MichelsonType, Ret extends MichelsonType> extends TypeX<'lambda', [Arg, Ret]> {
}
export interface MichelsonTypeSet<T extends MichelsonType> extends TypeX<'set', [T]> {
}
export interface MichelsonTypeMap<K extends MichelsonType, V extends MichelsonType> extends TypeX<'map', [K, V]> {
}
export interface MichelsonTypeBigMap<K extends MichelsonType, V extends MichelsonType> extends TypeX<'big_map', [K, V]> {
}
export interface MichelsonTypeSaplingState<S extends string = string> extends TypeX<'sapling_state', [IntLiteral<S>]> {
}
export interface MichelsonTypeSaplingTransaction<S extends string = string> extends TypeX<'sapling_transaction', [IntLiteral<S>]> {
}
export interface MichelsonTypeTicket<T extends MichelsonType> extends TypeX<'ticket', [T]> {
}
export declare type MichelsonType<T extends MichelsonTypeID = MichelsonTypeID> = T extends 'int' ? MichelsonTypeInt : T extends 'nat' ? MichelsonTypeNat : T extends 'string' ? MichelsonTypeString : T extends 'bytes' ? MichelsonTypeBytes : T extends 'mutez' ? MichelsonTypeMutez : T extends 'bool' ? MichelsonTypeBool : T extends 'key_hash' ? MichelsonTypeKeyHash : T extends 'timestamp' ? MichelsonTypeTimestamp : T extends 'address' ? MichelsonTypeAddress : T extends 'key' ? MichelsonTypeKey : T extends 'unit' ? MichelsonTypeUnit : T extends 'signature' ? MichelsonTypeSignature : T extends 'operation' ? MichelsonTypeOperation : T extends 'chain_id' ? MichelsonTypeChainID : T extends 'option' ? MichelsonTypeOption<MichelsonType> : T extends 'list' ? MichelsonTypeList<MichelsonType> : T extends 'contract' ? MichelsonTypeContract<MichelsonType> : T extends 'ticket' ? MichelsonTypeTicket<MichelsonType> : T extends 'pair' ? MichelsonTypePair<MichelsonType[]> : T extends 'or' ? MichelsonTypeOr<[MichelsonType, MichelsonType]> : T extends 'lambda' ? MichelsonTypeLambda<MichelsonType, MichelsonType> : T extends 'set' ? MichelsonTypeSet<MichelsonType> : T extends 'map' ? MichelsonTypeMap<MichelsonType, MichelsonType> : T extends 'big_map' ? MichelsonTypeBigMap<MichelsonType, MichelsonType> : T extends 'never' ? MichelsonTypeNever : T extends 'bls12_381_g1' ? MichelsonTypeBLS12_381_G1 : T extends 'bls12_381_g2' ? MichelsonTypeBLS12_381_G2 : T extends 'bls12_381_fr' ? MichelsonTypeBLS12_381_FR : T extends 'sapling_transaction' ? MichelsonTypeSaplingTransaction : T extends 'sapling_state' ? MichelsonTypeSaplingState : T extends 'chest_key' ? MichelsonTypeChestKey : MichelsonTypeChest;
export declare type MichelsonDataID = 'Unit' | 'True' | 'False' | 'None' | 'Pair' | 'Left' | 'Right' | 'Some';
declare type Data0<PT extends MichelsonDataID> = Prim0<PT>;
declare type DataX<PT extends MichelsonDataID, AT extends MichelsonData[]> = PrimX<PT, AT>;
export declare type MichelsonDataOption = DataX<'Some', [MichelsonData]> | Data0<'None'>;
export declare type MichelsonDataOr = DataX<'Left' | 'Right', [MichelsonData]>;
declare type DataList<T extends MichelsonData[]> = T & Node;
export declare type MichelsonDataPair<T extends MichelsonData[]> = DataX<'Pair', T> | DataList<T>;
export declare type MichelsonMapElt = PrimX<'Elt', [MichelsonData, MichelsonData]>;
export declare type MichelsonMapEltList = List<MichelsonMapElt>;
export declare type MichelsonData = IntLiteral | StringLiteral | BytesLiteral | Data0<'Unit' | 'True' | 'False'> | MichelsonDataOption | MichelsonDataOr | DataList<MichelsonData[]> | MichelsonDataPair<MichelsonData[]> | InstructionList | MichelsonMapEltList;
export declare type MichelsonSectionID = 'parameter' | 'storage' | 'code' | 'view';
declare type SectionPrim<PT extends MichelsonSectionID, AT extends Expr[]> = PrimX<PT, AT>;
export declare type MichelsonContractParameter = SectionPrim<'parameter', [MichelsonType]>;
export declare type MichelsonContractStorage = SectionPrim<'storage', [MichelsonType]>;
export declare type MichelsonContractCode = SectionPrim<'code', [InstructionList]>;
export declare type MichelsonContractView = SectionPrim<'view', [
    StringLiteral,
    MichelsonType,
    MichelsonType,
    InstructionList
]>;
export declare type MichelsonContract = MichelsonContractSection[];
export declare type MichelsonContractSection<T extends MichelsonSectionID = MichelsonSectionID> = T extends 'parameter' ? MichelsonContractParameter : T extends 'storage' ? MichelsonContractStorage : T extends 'view' ? MichelsonContractView : MichelsonContractCode;
export interface MichelsonTypeFailed {
    failed: MichelsonType;
    level: number;
}
export declare type MichelsonReturnType = MichelsonType[] | MichelsonTypeFailed;
export declare enum Protocol {
    Ps9mPmXa = "Ps9mPmXaRzmzk35gbAYNCAw6UXdE2qoABTHbN2oEEc1qM7CwT9P",
    PtCJ7pwo = "PtCJ7pwoxe8JasnHY8YonnLYjcVHmhiARPJvqcC6VfHT5s8k8sY",
    PsYLVpVv = "PsYLVpVvgbLhAhoqAkMFUo6gudkJ9weNXhUYCiLDzcUpFpkk8Wt",
    PsddFKi3 = "PsddFKi32cMJ2qPjf43Qv5GDWLDPZb3T3bF6fLKiF5HtvHNU7aP",
    Pt24m4xi = "Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd",
    PsBABY5H = "PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU",
    PsBabyM1 = "PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS",
    PsCARTHA = "PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb",
    PsDELPH1 = "PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo",
    PtEdoTez = "PtEdoTezd3RHSC31mpxxo1npxFjoWWcFgQtxapi51Z8TLu6v6Uq",
    PtEdo2Zk = "PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA",
    PsFLoren = "PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i",
    PsFLorena = "PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i",
    PtGRANAD = "PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV",
    PtGRANADs = "PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV",
    PtHangzH = "PtHangzHogokSuiMHemCuowEavgYTP8J5qQ9fQS793MHYFpCY3r",
    PtHangz2 = "PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx",
    PsiThaCa = "PsiThaCaT47Zboaw71QWScM8sXeMM7bbQFncK9FLqYc6EKdpjVP",
    Psithaca2 = "Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A",
    PtJakarta = "PtJakartaiDz69SfDDLXJSiuZqTSeSKRDbKVZC8MNzJnvRjvnGw",
    PtJakart2 = "PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY",
    ProtoALpha = "ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK"
}
export declare const DefaultProtocol = Protocol.Psithaca2;
export declare type ProtocolID = `${Protocol}`;
export declare function ProtoGreaterOfEqual(a: ProtocolID, b: ProtocolID): boolean;
export declare function ProtoInferiorTo(a: ProtocolID, b: ProtocolID): boolean;
export interface ProtocolOptions {
    protocol?: ProtocolID;
}
export {};
