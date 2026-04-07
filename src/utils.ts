import { Opts } from "./types"

export function parseId(id: string) {
    const [pkg, variant] = id.split(":")
    return {
        pkg,
        variant: variant ?? pkg
    }
}

export function getConfig(opts: Opts) {
    if (opts.force)
        return {
            ...parseId(opts.force),
            opts: opts.opts ?? []
        }

    let { name } = opts;

    const envName = `VALTHERA_${name.toUpperCase()}`;
    if (name && process.env[envName]) {
        const optsEnv = process.env[`${envName}_OPTS`];
        const dbOpts: any[] = optsEnv ?
            JSON.parse(optsEnv) :
            opts.opts ?? [];

        return {
            ...parseId(process.env[envName]!),
            opts: dbOpts
        };
    }

    if (opts.def)
        return {
            ...parseId(opts.def),
            opts: opts.opts ?? []
        }

    name ||= "master";
    return {
        pkg: "dir",
        variant: "dir",
        opts: opts.opts ?? [`./vdb-data/${name}`]
    }
}
