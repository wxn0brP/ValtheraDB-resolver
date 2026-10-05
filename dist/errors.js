export class ResolverError extends Error {
    code;
    suggestion;
    constructor(message, code, suggestion) {
        super(message);
        this.code = code;
        this.suggestion = suggestion;
        this.name = "ResolverError";
    }
}
export class AdapterNotFoundError extends ResolverError {
    constructor(pkg) {
        super(`Adapter "${pkg}" not found`, "ADAPTER_NOT_FOUND", `Try: npm install ${pkg}`);
        this.name = "AdapterNotFoundError";
    }
}
export class VariantNotFoundError extends ResolverError {
    constructor(pkg, variant, available) {
        const msg = available?.length
            ? `Available variants: ${available.join(", ")}`
            : undefined;
        super(`Adapter "${pkg}" has no variant "${variant}"`, "VARIANT_NOT_FOUND", msg);
        this.name = "VariantNotFoundError";
    }
}
export class InvalidOptsError extends ResolverError {
    constructor(field, reason) {
        super(`Invalid option "${field}": ${reason}`, "INVALID_OPTS");
        this.name = "InvalidOptsError";
    }
}
export class MissingDynamicError extends ResolverError {
    constructor(pkg) {
        super(`Adapter "${pkg}" does not support resolver import: missing DYNAMIC export`, "MISSING_DYNAMIC", `The package "${pkg}" is installed but does not export DYNAMIC.\n` +
            "Make sure it's a ValtheraDB adapter with `export const DYNAMIC = { ... }`");
        this.name = "MissingDynamicError";
    }
}
