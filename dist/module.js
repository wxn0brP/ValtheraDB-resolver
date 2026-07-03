import { promises as fs } from "fs";
import { join } from "path";
export async function getPkgPath({ path = process.cwd(), depth = 0, maxDepth, pkg }) {
    const pkgDir = join(path, "node_modules", ...pkg.split("/"));
    if (await fs.access(pkgDir).then(() => true).catch(() => false))
        return pkgDir;
    if (depth >= maxDepth)
        return null;
    const parent = join(path, "..");
    if (parent === path)
        return null;
    return getPkgPath({
        path: parent,
        depth: depth + 1,
        maxDepth,
        pkg
    });
}
