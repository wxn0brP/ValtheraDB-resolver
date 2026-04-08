import { promises as fs } from "fs";
import { join } from "path";
export async function checkPkgExists({ path = process.cwd(), depth = 0, maxDepth, pkg }) {
    const pkgDir = join(path, "node_modules", "@wxn0brp", "db-storage-" + pkg);
    if (await fs.access(pkgDir).then(() => true).catch(() => false))
        return true;
    if (depth >= maxDepth)
        return false;
    const parent = join(path, "..");
    if (parent === path)
        return false;
    return checkPkgExists({
        path: parent,
        depth: depth + 1,
        maxDepth,
        pkg
    });
}
