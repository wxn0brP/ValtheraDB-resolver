interface FindNodeModules {
    maxDepth: number;
    pkg: string;
    path?: string;
    depth?: number;
}
export declare function checkPkgExists({ path, depth, maxDepth, pkg }: FindNodeModules): Promise<boolean>;
export {};
