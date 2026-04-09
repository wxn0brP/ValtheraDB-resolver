import { checkPkgExists } from "./module";
import { Adapter, Opts } from "./types";
import { getConfig, parsePkgSource } from "./utils";

const cache = new Map<string, Adapter>();
let memoryActions: any = null;

async function loadAdapter(pkg: string) {
    if (cache.has(pkg))
        return cache.get(pkg)!;

    const mod = await import(pkg);

    const { DYNAMIC } = mod;
    cache.set(pkg, DYNAMIC);
    return DYNAMIC;
}

export async function createAdapter(opts: Opts, retry = false) {
    const { pkg, variant, opts: dbOpts } = getConfig(opts);

    if (pkg === "memory") {
        if (!memoryActions) {
            const mod = await import("@wxn0brp/db-core/db/memory");
            memoryActions = mod.MemoryAction;
        }
        return new memoryActions();
    }

    const pkgName = parsePkgSource(pkg);

    const exits = await checkPkgExists({
        maxDepth: +process.env.VALTHERA_RESOLVER_MAX_DEPTH || 3,
        pkg: pkgName
    });

    if (!exits && !retry && process.env.NODE_ENV !== "production") {
        const { execSync } = await import("child_process");
        const cmdPrefix = process.isBun ? "bun add" : "npm i";
        const cmd = `${cmdPrefix} ${pkgName}`;
        console.log("[ValtheraDB-resolver] Running:", cmd);
        execSync(cmd);
        return await createAdapter(opts, true);
    }

    if (!exits)
        throw new Error(`Adapter "${pkgName}" not found`);

    const mod = await loadAdapter(pkgName);

    if (!mod)
        throw new Error(`Adapter "${pkgName}" does not support resolver import`);

    const adapter = mod[variant];
    if (!adapter)
        throw new Error(`Adapter "${pkgName}" variant "${variant}" not found`);

    return await adapter(...dbOpts as any);
}
