# Resolver

A dynamic database adapter resolver for the ValtheraDB ecosystem. Automatically selects and instantiates the appropriate database storage adapter based on configuration, environment variables, or fallback defaults.

## Installation

```bash
npm i @wxn0brp/db-resolver @wxn0brp/db-core
```

## Usage

```typescript
import { createAdapter } from "@wxn0brp/db-resolver";
import { ValtheraClass } from "@wxn0brp/db-core";

const adapter = await createAdapter({ name: "master" });
const db = new ValtheraClass({ adapter });
```

### More Examples

```typescript
// Force a specific adapter
await createAdapter({ force: "bin" });
// same as
await createAdapter({ force: "bin:bin" });

// Use environment variables
process.env.VALTHERA_MASTER = "sqlite";
await createAdapter({ name: "master" });

// Use default fallback
await createAdapter({ name: "master", def: "dir" });
```

## Configuration

The resolver determines which database adapter to use based on the following priority:

1. **`force` option** - Explicitly specify the storage package and variant
2. **Environment variables** - Set `VALTHERA_<NAME>` and optionally `VALTHERA_<NAME>_OPTS`
3. **`def` option** - Define a default fallback
4. **Default behavior** - Falls back to `./vdb-data/<name>` directory storage

### Options

| Option | Type | Description |
|--------|------|-------------|
| `name` | `string` | Identifier used for environment variable lookup (`VALTHERA_<NAME>`) |
| `opts` | `any[]` | Options passed to the database adapter constructor |
| `def` | `string` | Default adapter in format `"package:variant"` |
| `force` | `string` | Force a specific adapter in format `"package:variant"` |

### Environment Variables

- `VALTHERA_<NAME>` - Adapter identifier in format `"package"` or `"package:variant"` (e.g., `VALTHERA_MASTER=dir:dir`)
- `VALTHERA_<NAME>_OPTS` - JSON array of constructor options for the adapter
- `VALTHERA_RESOLVER_MAX_DEPTH` - Maximum depth to search for adapters

### Package Resolution

The resolver supports multiple package sources for flexible adapter installation:

| Input Format | Resolves To | Description |
|--------------|-------------|-------------|
| `"sqlite"` | `@wxn0brp/db-storage-sqlite` | Default ValtheraDB adapters |
| `"@pkg"` | `pkg` | Scoped package without organization |
| `"@org/pkg"` | `@org/pkg` | Full scoped package name |

#### Examples

```typescript
// Use official ValtheraDB SQLite adapter
await createAdapter({ force: "sqlite" });

// Use a custom adapter from npm
await createAdapter({ force: "@my-custom-adapter" });

// Use a scoped package
await createAdapter({ force: "@company/db-adapter" });
```

This allows installation and use of adapters from different sources, not just the official `@wxn0brp/db-storage-*` packages.

### Dynamic install

If the adapter is not installed and `process.env.NODE_ENV !== "production"`, it will be installed automatically.

## License

MIT
