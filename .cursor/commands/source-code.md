# source-code

If you need to check and access the block editor, WordPress, WooCommerce, or Create Block Theme uncompiled source codes, use the following directories.

These trees live only in the **Blockera plugin** repo root (gitignored local clones).

## Source trees (canonical)

- **Uncompiled Block Editor (Gutenberg) source**
    - `source-codes/block-editor/`
    - Contains the real React/JS/TS/CSS sources (preferred for editor features).

- **WordPress core source**
    - `source-codes/wordpress/`
    - Contains PHP core and server-side behavior; also includes compiled editor artifacts that MUST NOT be used as the primary reference for editor internals.

- **WooCommerce source**
    - `source-codes/woocommerce/`
    - Contains WooCommerce PHP, blocks, admin, REST API, and related frontend/packages source (preferred for WooCommerce features and compatibility work).

- **Create Block Theme source**
    - `source-codes/create-block-theme/`
    - WordPress plugin for creating and working with block themes (theme.json, templates, style variations, theme export/create, and related tooling).
    - Use as a **secondary reference** when developing block themes: start with `block-editor` / `wordpress` first, then consult this tree when relevant.

## How to resolve the path

1. Prefer the workspace folder named `blockera` (multi-root workspace).
2. Paths are always relative to that folder root:
   - `source-codes/block-editor/`
   - `source-codes/wordpress/`
   - `source-codes/woocommerce/`
   - `source-codes/create-block-theme/`
3. Never use absolute user paths (`/Users/...`, `/home/...`).
4. If the `blockera` workspace folder is not open, ask the user to add it, or resolve via the standard WP layout:
   - `wp-content/plugins/blockera/source-codes/block-editor/`
   - `wp-content/plugins/blockera/source-codes/wordpress/`
   - `wp-content/plugins/blockera/source-codes/woocommerce/`
   - `wp-content/plugins/blockera/source-codes/create-block-theme/`
