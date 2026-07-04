import { DbDirOpts } from "@wxn0brp/db-storage-dir/types";
import { Options as BinOpts } from "@wxn0brp/db-storage-bin";
import { MongoClientOptions } from "mongodb";
import { RocksOpenOptions } from "@wxn0brp/db-storage-rocks/types";
import { EncryptedActionOptions } from "@wxn0brp/db-storage-crypt/crypto";
import { RemoteConfig } from "@wxn0brp/db-client/remote";
import { Opts as LengthOpts } from "@wxn0brp/db-storage-length/action";
export interface ScopeBase {
    dir(folder: string, opts?: DbDirOpts): any;
    bin(path: string, opts?: Partial<BinOpts>): any;
    sqlite: {
        (file: string, keys?: Record<string, string>, opts?: any): any;
        bun(file: string, keys?: Record<string, string>, opts?: any): any;
        node(file: string, keys?: Record<string, string>, opts?: any): any;
        better(file: string, keys?: Record<string, string>, opts?: any): any;
    };
    mongodb(uri: string, dbName: string, opts?: MongoClientOptions): any;
    rocks(location: string, opts?: RocksOpenOptions): any;
    crypt(folder: string, options?: EncryptedActionOptions): any;
    client(url: string | RemoteConfig): any;
    accdb(file: string, keys?: Record<string, string>): any;
    length(opts: LengthOpts): any;
}
