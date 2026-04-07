
import type { ActionsBaseInterface } from "@wxn0brp/db-core/types/action";
import { Opts } from "./types";
import { getConfig } from "./utils";

const cache = new Map<string, ActionsBaseInterface>();

async function loadAdapter(pkg: string) {
    if (cache.has(pkg))
        return cache.get(pkg)!;

    const { DYNAMIC } = await import(`@wxn0brp/db-storage-${pkg}`);
    cache.set(pkg, DYNAMIC);
    return DYNAMIC;
}

export async function createAdapter(opts: Opts, retry = false) {
    const { pkg, variant, opts: dbOpts } = getConfig(opts);

    if (pkg === "memory") {
        const { MemoryAction } = await import("@wxn0brp/db-core/db/memory");
        return new MemoryAction();
    }

    try {
        return await loadAdapter(pkg)[variant](...dbOpts as any);
    } catch (e) {
        if (process.env.NODE_ENV === "production")
            throw e;

        if (e instanceof Error && e.message.includes("Cannot find module")) {
            if (retry)
                throw e;
            const { execSync } = await import("child_process");
            const cmd = process.isBun ? "bun add" : "npm i";
            execSync(`${cmd} @wxn0brp/db-storage-${pkg}`);
            return createAdapter(opts, true);
        }

        throw e;
    }
}
