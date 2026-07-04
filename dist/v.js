import { ValtheraClass } from "@wxn0brp/db-core";
import { forgeTypedValthera } from "@wxn0brp/db-core/helpers/forge";
import { createAdapter } from "./index.js";
function createAdapterBuilder(pkgName, scopeOpts) {
    const buildDb = (variant, ...args) => {
        const adapterOpts = args.length > 0 ? args : (scopeOpts.opts ?? []);
        const finalOpts = {
            ...scopeOpts,
            force: `${pkgName}:${variant}`,
            opts: adapterOpts
        };
        const vdb = new ValtheraClass({
            dbAction: () => createAdapter(finalOpts)
        });
        return forgeTypedValthera(vdb);
    };
    const defaultExecute = (...args) => {
        return buildDb(pkgName, ...args);
    };
    return new Proxy(defaultExecute, {
        get(target, prop) {
            if (typeof prop !== "string")
                return Reflect.get(target, prop);
            return (...args) => {
                return buildDb(prop, ...args);
            };
        },
        apply(target, thisArg, args) {
            return Reflect.apply(target, thisArg, args);
        }
    });
}
export function VDB(name = "master", baseOpts = {}) {
    return new Proxy({}, {
        get(_, prop) {
            if (typeof prop !== "string")
                return undefined;
            const pkgName = prop;
            return createAdapterBuilder(pkgName, { ...baseOpts, name });
        }
    });
}
