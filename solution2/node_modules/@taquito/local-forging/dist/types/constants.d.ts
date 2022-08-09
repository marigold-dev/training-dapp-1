export declare const ENTRYPOINT_MAX_LENGTH = 31;
export declare enum CODEC {
    SECRET = "secret",
    RAW = "raw",
    TZ1 = "tz1",
    BRANCH = "branch",
    ZARITH = "zarith",
    PUBLIC_KEY = "public_key",
    PKH = "pkh",
    DELEGATE = "delegate",
    SCRIPT = "script",
    BALLOT_STATEMENT = "ballotStmt",
    PROPOSAL = "proposal",
    PROPOSAL_ARR = "proposalArr",
    INT32 = "int32",
    INT16 = "int16",
    PARAMETERS = "parameters",
    ADDRESS = "address",
    VALUE = "value",
    MANAGER = "manager",
    BLOCK_PAYLOAD_HASH = "blockPayloadHash",
    ENTRYPOINT = "entrypoint",
    OPERATION = "operation",
    OP_ACTIVATE_ACCOUNT = "activate_account",
    OP_DELEGATION = "delegation",
    OP_TRANSACTION = "transaction",
    OP_ORIGINATION = "origination",
    OP_BALLOT = "ballot",
    OP_ENDORSEMENT = "endorsement",
    OP_SEED_NONCE_REVELATION = "seed_nonce_revelation",
    OP_REVEAL = "reveal",
    OP_PROPOSALS = "proposals",
    OP_REGISTER_GLOBAL_CONSTANT = "register_global_constant",
    OP_TRANSFER_TICKET = "transfer_ticket",
    OP_TX_ROLLUP_ORIGINATION = "tx_rollup_origination",
    OP_TX_ROLLUP_SUBMIT_BATCH = "tx_rollup_submit_batch",
    BURN_LIMIT = "burn_limit",
    TX_ROLLUP_ORIGINATION_PARAM = "tx_rollup_origination_param",
    TX_ROLLUP_ID = "tx_rollup_id",
    TX_ROLLUP_BATCH_CONTENT = "tx_rollup_batch_content"
}
export declare const opMapping: {
    [key: string]: string;
};
export declare const opMappingReverse: {
    [key: string]: string;
};
export declare const kindMapping: {
    [key: number]: string;
};
export declare const kindMappingReverse: {
    [key: string]: string;
};
export declare const entrypointMapping: {
    [key: string]: string;
};
export declare const entrypointMappingReverse: {
    [key: string]: string;
};
