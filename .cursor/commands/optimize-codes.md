# optimize-codes

Optimize the current git changeset in place. **Do the fixes. Do not write a review report.**

Run this after a feature, feature set, or edits. Goal: leave the changeset standard, fast, leak-free, leftover-free, commented where complex, and covered by tests.

## Scope

Review and fix:

1. The **current git changeset** in this repo: staged, unstaged, and untracked files (ignore unrelated dirty files that this work did not touch).
2. **Related code** those files depend on or that depend on them: callers, callees, shared helpers, types, and existing tests.

Stay inside `wp-content/plugins/blockera/` (including `packages/global-packages/`). If the changeset is in the submodule, work there too. Do not leave Blockera scope unless the user already expanded it.

Do **not** expand into a repo-wide cleanup.

## Constraints (safe in-place only)

- Keep public APIs, exports, function signatures, filters/actions, and file structure unchanged.
- Do not move/rename production files. Small helper extracts **inside the same file** are OK.
- Do not change behavior. Infer the contract from call sites + tests and preserve it.
- Do not remove existing comments.
- Do not commit.
- If a needed fix would change behavior, public API, or file structure: skip it and list it under **Skipped** (one line). Do not ask unless you cannot safely continue.

## Workflow

### 1) Discover the changeset

- `git status` and `git diff` (staged + unstaged). Include untracked files that belong to this work.
- If `packages/global-packages/` changed, inspect that submodule the same way.
- Build the file list. Skip generated/build/lock artifacts unless this work authored them.

### 2) Expand to related code

For each changed production file, open:

- Direct callers and callees
- Shared helpers/hooks/selectors used by the change
- Existing unit/integration tests next to the file or in the package `test/` / `tests/` / `__tests__/` / `phpunit` trees

Do not wander beyond one hop unless a leftover, leak, or missing test is clearly caused by this changeset.

### 3) Fix in place (no report while working)

Apply the checklist below. Edit the files. Prefer the smallest correct change.

### 4) Cover with tests, then run them

- Find the nearest existing test for the changed behavior and **extend it**.
- If none exists, **create** a test next to the same convention in that package (Jest `*.spec.js` / `*.test.js`, PHPUnit `*Test.php`, Cypress/Playwright only when the change is UI-e2e and that tree already tests this feature).
- Cover the changed behavior and the edge cases the code now handles. Do not add speculative tests for untouched features.
- Run **only** the relevant tests:
  - JS: `npm run test:js -- <test-file>`
  - PHP: the matching PHPUnit file/testsuite already used in this repo
  - Cypress/Playwright: the single spec you added/updated
- If a test fails because of your optimization, fix the code (not the assertion) unless the assertion was already wrong and unused.

### 5) Stop and list what changed

No analysis, no risk rating, no commit message.

## Checklist (fix these)

### Standard, readable, leftover-free

- Match existing package style, naming, imports, and Gutenberg/WordPress patterns (`development-helper.mdc` source routing when touching editor/core APIs).
- Remove dead code, unused imports/vars, leftover `console.log` / debug, commented-out code, and duplicate logic **introduced or left unused by this changeset**.
- Keep SOLID *in place*: one job per function, stable dependencies, no new abstraction layers or files.

### Performance, rerender, process, memory

React / editor JS:

- Avoid new object/array/function identities on every render (`useMemo` / `useCallback` / stable selectors) when they are passed as props or used as hook deps.
- Do not subscribe more broadly than needed (`useSelect` should pick fields, not whole stores).
- No direct DOM writes on React-owned nodes. No leftover listeners, observers, timers, or subscriptions — clean up on unmount.
- Skip redundant work in hot paths (style engine, inspector, canvas, repeaters).

PHP / server:

- Avoid repeated expensive work in a request (unbounded queries, repeated `get_option` / file reads, growing arrays in loops).
- Prefer early returns, no unused allocations, no accidental N+1.

### Comments

- Add a short comment only where the logic is non-obvious (why, not what): invariants, Gutenberg/WP quirks, perf tradeoffs, edge-case contracts.
- Do not comment trivial code. Do not delete existing comments.

### Tests

- Changed behavior must have a test. Write or update it, then run it.
- Do not snapshot-update unless the snapshot is the intended contract of this change.

## Output (required, and only this)

```
## Changed
- <file>: <what you fixed>

## Tests
- <command you ran> → pass/fail

## Skipped
- <file>: <unsafe fix not applied> (omit this section if nothing was skipped)
```

If the changeset is already clean, say so in one line and do not invent edits.
