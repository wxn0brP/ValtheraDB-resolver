
import type { ActionsBaseInterface } from "@wxn0brp/db-core/types/action";
import { Opts } from "./types";
import { getConfig } from "./utils";

const cache = new Map<string, ActionsBaseInterface>();
const adapterNotInstalled = Symbol("adapterNotInstalled");

async function loadAdapter(pkg: string) {
    if (cache.has(pkg))
        return cache.get(pkg)!;

    const mod = await import(`@wxn0brp/db-storage-${pkg}`).catch((error) => {
        if (
            error.code === "ERR_MODULE_NOT_FOUND" &&
            error.message.includes(`@wxn0brp/db-storage-${pkg}`)
        )
            return adapterNotInstalled;

        throw error;
    });

    if (mod === adapterNotInstalled)
        return mod;

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

    const mod = await loadAdapter(pkg);

    if (mod === adapterNotInstalled && !retry) {
        const { execSync } = await import("child_process");
        const cmdPrefix = process.isBun ? "bun add" : "npm i";
        const cmd = `${cmdPrefix} @wxn0brp/db-storage-${pkg}`;
        console.log("[ValtheraDB-resolver] Running:", cmd);
        execSync(cmd);
        return await createAdapter(opts, true);
    }

    if (!mod)
        throw new Error(`Adapter "${pkg}" does not support resolver import`);

    const adapter = mod[variant];
    if (!adapter)
        throw new Error(`Adapter "${pkg}" variant "${variant}" not found`);

    try {
        return new adapter(...dbOpts as any);
    } catch (error) {
        if (error instanceof TypeError && error.message.includes("is not a constructor"))
            return adapter(...dbOpts as any);

        throw error;
    }
}
