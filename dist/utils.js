export function parseId(id) {
    const [pkg, variant] = id.split(":");
    return {
        pkg,
        variant: variant ?? pkg
    };
}
export function getConfig(opts) {
    if (opts.force)
        return {
            ...parseId(opts.force),
            opts: opts.opts ?? []
        };
    let { name } = opts;
    if (name) {
        const envName = `VALTHERA_${name.toUpperCase()}`;
        if (process.env[envName]) {
            const optsEnv = process.env[`${envName}_OPTS`];
            const dbOpts = optsEnv ?
                JSON.parse(optsEnv) :
                opts.opts ?? [];
            return {
                ...parseId(process.env[envName]),
                opts: dbOpts
            };
        }
    }
    if (opts.def)
        return {
            ...parseId(opts.def),
            opts: opts.opts ?? []
        };
    name ||= "master";
    return {
        pkg: "dir",
        variant: "dir",
        opts: opts.opts ?? [`./vdb-data/${name}`]
    };
}
