import { Expr } from "@taquito/michel-codec";
import { GlobalConstantHash, GlobalConstantsProvider } from "./interface-global-constants-provider";
export declare class NoopGlobalConstantsProvider implements GlobalConstantsProvider {
    getGlobalConstantByHash(_hash: GlobalConstantHash): Promise<Expr>;
}
