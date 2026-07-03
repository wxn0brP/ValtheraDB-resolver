import { Opts, ResolvedConfig } from "./types.js";
export declare function parsePkgSource(pkg: string): string;
export declare function parseId(id: string): {
    pkg: string;
    variant: string;
};
export declare function getConfig(opts: Opts): ResolvedConfig;
