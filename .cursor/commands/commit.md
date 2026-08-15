# commit

You are in chat and we made changes into the codebase in this chat and we want to commit them.

## What to commit

- Commit **only** changes made in **this chat**. Ignore unrelated dirty files.
- Prefer **micro commits**: if changes are not related or can be separated, commit them separately (multiple commits are better than one mixed commit). Apply this **per repo** (parent and/or submodule).

## Separate test commits

If this chat created or updated tests **and** implementation, never mix them in one commit. Pair them so the test commit clearly covers the change:

1. Commit the implementation first (`feat` / `fix` / `refactor` / …).
2. Then commit the related tests in a **separate** commit using type `test:` (not `tests:`).
3. If the chat has multiple unrelated features, pair each one: impl A → test A, then impl B → test B.
4. Test-only chats: one (or more unrelated) `test:` commit(s) — no empty implementation commit.
5. Implementation-only chats: no test commit.

Treat **all** test kinds as test files (unit, integration, e2e, Playwright, Cypress, PHPUnit, snapshots, visual fixtures, and helpers/mocks/fixtures under `test/`, `tests/`, `__tests__/`, `*.spec.*`, `*.test.*`, `*Test.php`).

Apply this pairing in **every repo this command commits** (parent Blockera and `packages/global-packages`).

## Commit message

Allowed conventional commit types and changelog rules live in the shared global-packages config (not a root YAML):

`packages/global-packages/packages/dev-tools/git-conventional-commits.yaml`

Husky `commit-msg` validates against that file via `--config`. Use only types listed there when writing subjects.

1. If the chat already has a final commit subject and message → use them and commit immediately.
2. If the user sent a subject/message → use that and commit immediately.
3. Otherwise → generate a conventional subject/message from the chat changes and **commit immediately** (no confirmation / wait for accept).
4. If impl and tests must be paired (see **Separate test commits**), still split: use the provided/generated subject for the implementation commit, then write a `test:` subject for the covering test commit. Do not fold tests into the implementation commit just because only one message was supplied.

Follow the repo’s conventional commit style (types from the shared YAML above) and the usual git commit safety protocol (no force, no amend unless rules allow, no secrets, HEREDOC for messages, etc.).

## `packages/global-packages` submodule

Shared packages live in the `packages/global-packages` git submodule (`blockeraai/blockera-global-packages`).

When this chat touched files under `packages/global-packages/`:

1. Commit those changes **inside the submodule repo** (`cd packages/global-packages` / `git -C packages/global-packages …`).
2. Use micro commits inside the submodule when changes are unrelated.
3. **Do not push** the submodule; the user pushes manually.
4. **Do not** stage or commit the parent-repo gitlink / submodule SHA bump for `packages/global-packages`. CI (`sync-global-packages-submodule`) updates the parent pin after the submodule is pushed.

## Mixed parent + submodule changes

If the chat changed both parent Blockera files and `packages/global-packages`:

1. Commit submodule changes first.
2. Then commit parent-repo changes, **excluding** any `packages/global-packages` gitlink change.

## Parent-only changes

If only parent Blockera paths changed (outside the submodule), commit in the parent repo as usual. Still never include an incidental submodule pointer update unless the user explicitly asks to bump the pin (they normally should not).
