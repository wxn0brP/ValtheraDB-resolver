import { createRequire } from "module";
import { pathToFileURL } from "url";
import { getPkgPath } from "./module.js";
import { getConfig, parsePkgSource } from "./utils.js";
const cache = new Map();
let memoryActions = null;
async function loadAdapter(pkg, pkgPath) {
    if (cache.has(pkg))
        return cache.get(pkg);
    const resolved = createRequire(pkgPath).resolve(pkg);
    const mod = await import(pathToFileURL(resolved).href);
    const { DYNAMIC } = mod;
    cache.set(pkg, DYNAMIC);
    return DYNAMIC;
}
export async function createAdapter(opts, retry = false) {
    const { pkg, variant, opts: dbOpts } = getConfig(opts);
    if (pkg === "memory") {
        if (!memoryActions) {
            const mod = await import("@wxn0brp/db-core/db/memory");
            memoryActions = mod.MemoryAction;
        }
        return new memoryActions();
    }
    const pkgName = parsePkgSource(pkg);
    const pkgPath = await getPkgPath({
        maxDepth: +process.env.VALTHERA_RESOLVER_MAX_DEPTH || 3,
        pkg: pkgName
    });
    if (!pkgPath && !retry && process.env.NODE_ENV !== "production") {
        const { execSync } = await import("child_process");
        const cmdPrefix = process.isBun ? "bun add" : "npm i";
        const cmd = `${cmdPrefix} ${pkgName}`;
        console.log("[ValtheraDB-resolver] Running:", cmd);
        execSync(cmd);
        return await createAdapter(opts, true);
    }
    if (!pkgPath)
        throw new Error(`Adapter "${pkgName}" not found`);
    const mod = await loadAdapter(pkgName, pkgPath);
    if (!mod)
        throw new Error(`Adapter "${pkgName}" does not support resolver import`);
    const adapter = mod[variant];
    if (!adapter)
        throw new Error(`Adapter "${pkgName}" variant "${variant}" not found`);
    return await adapter(...dbOpts);
}
