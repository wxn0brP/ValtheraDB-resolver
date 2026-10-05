export declare class ResolverError extends Error {
    code: string;
    suggestion?: string;
    constructor(message: string, code: string, suggestion?: string);
}
export declare class AdapterNotFoundError extends ResolverError {
    constructor(pkg: string);
}
export declare class VariantNotFoundError extends ResolverError {
    constructor(pkg: string, variant: string, available?: string[]);
}
export declare class InvalidOptsError extends ResolverError {
    constructor(field: string, reason: string);
}
export declare class MissingDynamicError extends ResolverError {
    constructor(pkg: string);
}
