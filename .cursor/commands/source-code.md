# source-code

If you need to check and access the block editor and WordPress uncompiled source codes, use the following directories.

These trees live only in the **Blockera plugin** repo root (gitignored local clones).

## Source trees (canonical)

- **Uncompiled Block Editor (Gutenberg) source**
    - `source-codes/block-editor/`
    - Contains the real React/JS/TS/CSS sources (preferred for editor features).

- **WordPress core source**
    - `source-codes/wordpress/`
    - Contains PHP core and server-side behavior; also includes compiled editor artifacts that MUST NOT be used as the primary reference for editor internals.

## How to resolve the path

1. Prefer the workspace folder named `blockera` (multi-root workspace).
2. Paths are always relative to that folder root:
   - `source-codes/block-editor/`
   - `source-codes/wordpress/`
3. Never use absolute user paths (`/Users/...`, `/home/...`).
4. If the `blockera` workspace folder is not open, ask the user to add it, or resolve via the standard WP layout:
   - `wp-content/plugins/blockera/source-codes/block-editor/`
   - `wp-content/plugins/blockera/source-codes/wordpress/`
