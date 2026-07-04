import { Data } from "@wxn0brp/db-core/types/data";
import { Opts, ValtheraScope } from "./types.js";
export declare function VDB<T extends Record<string, Data> = {}>(name?: string, baseOpts?: Opts): ValtheraScope<T>;
