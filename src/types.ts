import type { ActionsBaseInterface } from "@wxn0brp/db-core/types/action";

export interface Opts {
    name?: string;
    opts?: any[];
    def?: string;
    force?: string;
}

export type Adapters = Record<string, ActionsBaseInterface>;
