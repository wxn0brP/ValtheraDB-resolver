import { checkPkgExists } from "./module";
import { Adapter, Opts } from "./types";
import { getConfig } from "./utils";

const cache = new Map<string, Adapter>();

async function loadAdapter(pkg: string) {
    if (cache.has(pkg))
        return cache.get(pkg)!;

    const mod = await import(`@wxn0brp/db-storage-${pkg}`);

    const { DYNAMIC } = mod;
    cache.set(pkg, DYNAMIC);
    return DYNAMIC;
}

export async function createAdapter(opts: Opts, retry = false) {
    const { pkg, variant, opts: dbOpts } = getConfig(opts);

    if (pkg === "memory") {
        const { MemoryAction } = await import("@wxn0brp/db-core/db/memory");
        return new MemoryAction();
    }

    const exits = await checkPkgExists({
        maxDepth: +process.env.DB_RESOLVER_MAX_DEPTH || 3,
        pkg
    });

    if (!exits && !retry && process.env.NODE_ENV !== "production") {
        const { execSync } = await import("child_process");
        const cmdPrefix = process.isBun ? "bun add" : "npm i";
        const cmd = `${cmdPrefix} @wxn0brp/db-storage-${pkg}`;
        console.log("[ValtheraDB-resolver] Running:", cmd);
        execSync(cmd);
        return await createAdapter(opts, true);
    }

    if (!exits)
        throw new Error(`Adapter "${pkg}" not found`);

    const mod = await loadAdapter(pkg);

    if (!mod)
        throw new Error(`Adapter "${pkg}" does not support resolver import`);

    const adapter = mod[variant];
    if (!adapter)
        throw new Error(`Adapter "${pkg}" variant "${variant}" not found`);

    return await adapter(...dbOpts as any);
}
