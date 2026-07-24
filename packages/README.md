# Blockera packages

Monorepo packages under `packages/`. Prefer each package’s own `README.md` for API details, usage, and development notes (especially for AI agents).

## Documented packages

| Package | Path | Summary |
|---------|------|---------|
| [`@blockera/storage`](./storage/README.md) | `packages/storage` | Site/user-scoped `localStorage` / `sessionStorage` helpers (JS + PHP site key). **Do not use native browser storage.** |

## Adding docs

When documenting a package for agents/developers, put the full guide in `packages/<name>/README.md` and add a one-line entry to the table above.
