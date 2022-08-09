import { OriginateParams } from "../operations/types";
import { ParserProvider } from "./interface";
export declare class NoopParser implements ParserProvider {
    prepareCodeOrigination(params: OriginateParams): Promise<OriginateParams>;
}
