import { createRequire } from "module";
import { pathToFileURL } from "url";
import { AdapterNotFoundError, MissingDynamicError, VariantNotFoundError, } from "./errors.js";
import { getPkgPath } from "./module.js";
import { getConfig, getInstallName, parsePkgSource } from "./utils.js";
const cache = new Map();
let memoryActions = null;
async function loadAdapter(pkg, pkgPath) {
    if (cache.has(pkg))
        return cache.get(pkg);
    const resolved = createRequire(pkgPath).resolve(pkg);
    const mod = await import(pathToFileURL(resolved).href);
    const { DYNAMIC } = mod;
    if (!DYNAMIC)
        throw new MissingDynamicError(pkg);
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
        pkg: pkgName,
    });
    if (!pkgPath && !retry && process.env.NODE_ENV !== "production") {
        const { execSync } = await import("child_process");
        const cmdPrefix = process.isBun ? "bun add" : "npm i";
        const cmd = `${cmdPrefix} ${getInstallName(pkgName)}`;
        console.log("[ValtheraDB-resolver] Running:", cmd);
        execSync(cmd);
        return await createAdapter(opts, true);
    }
    if (!pkgPath)
        throw new AdapterNotFoundError(pkgName);
    const mod = await loadAdapter(pkgName, pkgPath);
    const factory = mod[variant];
    if (!factory)
        throw new VariantNotFoundError(pkgName, variant, Object.keys(mod));
    return await factory(...dbOpts);
}
