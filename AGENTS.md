# Agents — Blockera (free plugin)

WordPress plugin that extends the block editor. Host is thin: `blockera.php`, `config/`. Editor runtime lives in the global-packages submodule (`@blockera/blockera` → Composer `vendor/blockera/blockera`).

## Inspect

- Shared architecture: [`packages/global-packages/packages/dev-tools/ai/index.md`](packages/global-packages/packages/dev-tools/ai/index.md)
- Product notes: [`.ai/index.md`](.ai/index.md)
- Gutenberg: `source-codes/block-editor/` · WordPress: `source-codes/wordpress/src/` (Cursor `development-helper`)
- Cursor templates are generated into `.cursor/` from GP `dev-tools/cursor/` — do not hand-edit `.cursor/`

## Constraints

- Active product is **blockera** unless the user named another. GP writes: `packages/global-packages/`.
- After a task: Unreleased changelog + README if the public contract changed — [`…/ai/workflows/changelog-and-readme.md`](packages/global-packages/packages/dev-tools/ai/workflows/changelog-and-readme.md)
- Do not install deps. Tests: `npm run test:e2e`, `test:js`, `test:unit:php` — [`…/ai/workflows/product-scripts-and-deps.md`](packages/global-packages/packages/dev-tools/ai/workflows/product-scripts-and-deps.md)
- Ask before editing blockera-pro.

## Validate

From this repo root, use `package.json` scripts. Cypress: `npm run test:e2e -- --spec <spec>`.
