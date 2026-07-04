import { ValtheraClass } from "@wxn0brp/db-core";
import { Collection } from "@wxn0brp/db-core/helpers/collection";
import type { ActionsBaseInterface } from "@wxn0brp/db-core/types/action";
import { Data } from "@wxn0brp/db-core/types/data";

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

export type ValtheraLazy<T extends Record<string, Data> = {}> = ValtheraClass & {
    [K in keyof T]: Collection<T[K]>;
};

export interface ScopeBase {
    dir(folder: string, opts?: any): any;
    sqlite: {
        (file: string, keys?: any, opts?: any): any;
        bun(file: string, keys?: any, opts?: any): any;
        node(file: string, keys?: any, opts?: any): any;
        better(file: string, keys?: any, opts?: any): any;
    };
    mongodb(uri: string, dbName: string, opts?: any): any;
    rocks(location: string, opts?: any): any;
    crypt(folder: string, options?: any): any;
    client(url: any, ...args: any[]): any;
    accdb(file: string, keys?: any, opts?: any): any;
    length(opts: any): any;
    bin(path: string, opts?: any): any;
}

export type _ReplaceReturn<T, S extends Record<string, Data>> =
    T extends (...args: infer A) => any
    ? ((...args: A) => ValtheraLazy<S>) & { [K in keyof T]: _ReplaceReturn<T[K], S> } // <-- Zmiana tutaj
    : T extends object
    ? { [K in keyof T]: _ReplaceReturn<T[K], S> }
    : T;

export type ValtheraScope<T extends Record<string, Data>> = {
    [K in keyof ScopeBase]: _ReplaceReturn<ScopeBase[K], T>;
};
