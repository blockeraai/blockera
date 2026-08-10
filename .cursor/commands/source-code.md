# source-code

If you need to check and access the block editor, WordPress, WooCommerce, or Create Block Theme uncompiled source codes, use the following directories.

These trees live only in the **Blockera plugin** repo root (gitignored local clones of upstream GitHub repos).

**Critical:** these are **repo clones**, not the installed/build layout under a running WordPress site. Paths often differ (especially WordPress `src/` and the WooCommerce monorepo). Always search and cite paths **as they exist in these clones**.

## Source trees (canonical)

- **Uncompiled Block Editor (Gutenberg) source** — clone of `WordPress/gutenberg`
    - Root: `source-codes/block-editor/`
    - Preferred for editor features (React/JS/TS/CSS and Gutenberg PHP shims).

- **WordPress core source** — clone of `WordPress/wordpress-develop`
    - Root: `source-codes/wordpress/`
    - Preferred for PHP core and server-side behavior.
    - Runtime core files live under **`src/`** (not at the repo root).

- **WooCommerce source** — clone of `woocommerce/woocommerce` **monorepo**
    - Root: `source-codes/woocommerce/`
    - Preferred for WooCommerce features and compatibility work.
    - Not a single-plugin folder: contains plugins, shared packages, docs, and tools.

- **Create Block Theme source** — clone of `WordPress/create-block-theme`
    - Root: `source-codes/create-block-theme/`
    - Secondary reference for block-theme tooling: start with `block-editor` / `wordpress` first, then consult this tree when relevant.

## Clone layout map (use these paths)

### Block Editor (`source-codes/block-editor/`)

| Area | Path | Notes |
| --- | --- | --- |
| JS packages (`@wordpress/*`) | `packages/<package>/src/` | Primary lookup. Example: `packages/block-editor/src/`, `packages/editor/src/`, `packages/components/src/` |
| Package root / build config | `packages/<package>/` | `package.json`, webpack, etc. Prefer `src/` for implementation |
| Gutenberg PHP / theme.json shims | `lib/` | e.g. `lib/blocks.php`, `lib/class-wp-theme-json-gutenberg.php` |
| Docs | `docs/` | Design notes and package docs |
| Tests | `phpunit/`, package-level tests | Use when verifying behavior |

Example cite: `source-codes/block-editor/packages/editor/src/components/...`

### WordPress (`source-codes/wordpress/`)

| Area | Path | Notes |
| --- | --- | --- |
| **Core PHP / runtime tree** | `src/` | **Always start here.** Mirrors installed WP root, but under `src/` |
| Includes | `src/wp-includes/` | e.g. `src/wp-includes/blocks.php`, `src/wp-includes/theme.json` |
| Admin | `src/wp-admin/` | Admin screens and includes |
| Content placeholder | `src/wp-content/` | Develop-repo placeholder; not a substitute for real themes/plugins |
| Tests / tooling | `tests/`, `tools/` | PHPUnit, build/dev tooling — not runtime API source |

**Do not** cite `source-codes/wordpress/wp-includes/...` (missing `src/`). That path matches an installed site, not this clone.

Example cite: `source-codes/wordpress/src/wp-includes/blocks.php`

### WooCommerce (`source-codes/woocommerce/`) — monorepo

This is the full WooCommerce GitHub monorepo. Prefer the most specific subtree for the task; do not assume `wp-content/plugins/woocommerce/` layout.

| Area | Path | When to use |
| --- | --- | --- |
| **Core plugin** | `plugins/woocommerce/` | Default for cart, checkout, products, REST, emails, settings, SSR |
| Legacy PHP | `plugins/woocommerce/includes/` | Classic includes, many hooks/classes |
| Modern PHP (`src/`) | `plugins/woocommerce/src/` | Namespaced / newer core code |
| Blocks & admin JS | `plugins/woocommerce/client/` | Especially `client/blocks/` for Cart/Checkout/product blocks |
| Plugin templates | `plugins/woocommerce/templates/` | PHP templates |
| Shared JS packages | `packages/js/` | Reusable `@woocommerce/*` packages (components, data, email-editor, …) |
| Shared PHP packages | `packages/php/` | Blueprint, email-editor, analytics, etc. |
| Beta tester plugin | `plugins/woocommerce-beta-tester/` | Dev/testing plugin only |
| Docs | `docs/` | Theming, blocks, APIs, contribution guides |
| Monorepo tools | `tools/` | Build/release utilities — rarely needed for feature work |

Search order for most Woo tasks:

1. `plugins/woocommerce/` (`includes/`, `src/`, `client/`)
2. `packages/js/` or `packages/php/` if the code lives in a shared package
3. `docs/` for intended extension patterns

Example cites:

- `source-codes/woocommerce/plugins/woocommerce/includes/...`
- `source-codes/woocommerce/plugins/woocommerce/src/...`
- `source-codes/woocommerce/plugins/woocommerce/client/blocks/...`
- `source-codes/woocommerce/packages/js/components/...`

### Create Block Theme (`source-codes/create-block-theme/`)

| Area | Path | Notes |
| --- | --- | --- |
| Plugin bootstrap | `create-block-theme.php` | Main plugin file |
| PHP | `includes/` | API, loader, theme create/export helpers (`includes/create-theme/`) |
| JS/UI | `src/` | Editor sidebar, landing page, enhancements |
| Assets / boilerplate | `assets/` | Theme boilerplate and static assets |

Example cites:

- `source-codes/create-block-theme/includes/...`
- `source-codes/create-block-theme/src/editor-sidebar/...`

## How to resolve the path

1. Prefer the workspace folder named `blockera` (multi-root workspace).
2. Paths are always relative to that folder root (`source-codes/...`).
3. Never use absolute user paths (`/Users/...`, `/home/...`).
4. Never substitute installed-site paths for clone paths (e.g. omit WordPress `src/`, or treat WooCommerce as only `plugins/woocommerce` without checking `packages/`).
5. If the `blockera` workspace folder is not open, ask the user to add it, or resolve via:
   - `wp-content/plugins/blockera/source-codes/block-editor/`
   - `wp-content/plugins/blockera/source-codes/wordpress/`
   - `wp-content/plugins/blockera/source-codes/woocommerce/`
   - `wp-content/plugins/blockera/source-codes/create-block-theme/`

## Agent search tips

- Confirm the file exists under the clone layout before proposing an API.
- Prefer uncompiled/`src` implementations over built/minified assets.
- When a path from memory looks like an installed WP/plugin tree, rewrite it to the clone map above, then search.
- For WooCommerce, state which monorepo area you searched (core plugin vs `packages/js` vs `packages/php`).
