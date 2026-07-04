interface FindNodeModules {
    maxDepth: number;
    pkg: string;
    path?: string;
    depth?: number;
}
export declare function getPkgPath({ path, depth, maxDepth, pkg }: FindNodeModules): Promise<string>;
export {};
