import type { ActionsBaseInterface } from "@wxn0brp/db-core/types/action";
export interface Opts {
    name?: string;
    opts?: any[];
    def?: string;
    force?: string;
}
export interface ResolvedConfig {
    pkg: string;
    variant: string;
    opts: any[];
}
export type Adapter = (...args: any[]) => Promise<ActionsBaseInterface> | ActionsBaseInterface;
