# blockera-only

Scope this chat to the **Blockera** plugin only. Do not work on other plugins, themes, or unrelated site projects unless the user explicitly expands scope.

## Primary scope

All research, edits, searches, terminal commands, and commits MUST stay inside:

`wp-content/plugins/blockera/`

In-scope paths include:

- Plugin source (`packages/`, `blockera.php`, build/config, tests, docs)
- Local reference trees (read-only unless the task says otherwise):
  - `source-code-block-editor/`
  - `source-code-wordpress/`

## Out of scope

Do NOT read, edit, search, stage, or run commands against:

- Sibling plugins (`blockera-pro`, `blockera-demo-*`, `akismet`, `blocksy-companion`, etc.)
- `wp-content/themes/`
- WordPress/site files outside Blockera unless the user explicitly asks

If a task seems to require an out-of-scope path, stop and ask before leaving Blockera scope.

## Agent behavior

1. **Search & read** — limit grep, codebase search, and file reads to `wp-content/plugins/blockera/**`.
2. **Edits** — only modify files under `wp-content/plugins/blockera/`.
3. **Terminal** — run build, test, and lint from Blockera scripts/directories; do not operate on sibling plugins.
4. **Commits** — stage only Blockera paths unless the user explicitly requests otherwise.
5. **Dependencies** — do not add imports or coupling to other workspace plugins.
6. **Subagents & tools** — pass the same scope constraint to any subagent or parallel task.

## Related rules

Follow Blockera rules in `.cursor/rules/`, especially:

- `development-helper.mdc` — Gutenberg vs WordPress core source routing
- `final-review-generated-codes.mdc` — pre-commit review

## Session confirmation

Start your first response after this command with:

`Scope: Blockera plugin only (wp-content/plugins/blockera/).`
