# Blockera free plugin architecture

## Host vs shared packages

- Plugin bootstrap: `blockera.php` (autoloader coordinator, `blockera_init`).
- PHP app: Composer package `blockera/blockera` from `packages/global-packages/packages/blockera`.
- JS editor entry: `@blockera/blockera` from the same GP package.
- Site config: `config/*.php` (breakpoints, telemetry, …).

Shared package edits belong under `packages/global-packages/` (submodule of `blockera-global-packages`). Sparse-checkout is `/packages/` only.

## Tests (this product’s scripts)

| Need | Command |
|------|---------|
| Cypress e2e | `npm run test:e2e` |
| Cypress component | `npm run test:ct` |
| Jest | `npm run test:js` |
| PHPUnit units | `npm run test:unit:php` |
| PHP snapshots | `npm run test:snapshots:php` |
| Playwright | `npm run test:e2e:base` |

PHPUnit units for shared packages often live in GP `php/tests`; host `tests/phpunit/main/` holds product snapshots.

## Source-codes

`source-codes/` is a gitignored symlink (`BLOCKERA_EXTERNAL_SOURCE_CODES_PATH`). Read-only. Gutenberg first for editor JS; WordPress `src/` for PHP.
