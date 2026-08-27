## Contribute To Blockera

Community made patches, localizations, bug reports and contributions are always welcome!

When contributing please ensure you follow the guidelines below so that we can keep on top of things.

**Please Note:** GitHub is for bug reports and contributions only - if you have a support question head over to the [support forum on WordPress.org](https://wordpress.org/support/plugin/blockera).

## Getting Started

-   **Do not report potential security vulnerabilities here. Email them privately to our team at [info@blockera.ai](mailto:info@blockera.ai)**
-   Before submitting a ticket, please be sure to replicate the behavior with no other plugins active and on a base theme like Twenty Twenty-Four.
-   Submit a ticket for your issue, assuming one does not already exist.
    -   Raise it on our [Issue Tracker](https://github.com/blockeraai/blockera/issues)
    -   Clearly describe the issue including steps to reproduce the bug.
    -   Make sure you fill in the earliest version that you know has the issue as well as the version of WordPress you're using.

## Shared packages (git submodule)

Shared packages live in a sparse submodule:

```
packages/global-packages/          # submodule → blockeraai/blockera-global-packages
  packages/                        # only tree checked out (sparse)
    autoloader-coordinator/
    editor/
    blockera/
    ...
```

### Local setup

```bash
git clone --recurse-submodules <blockera-url>
cd blockera
# If you cloned without --recurse-submodules:
git submodule update --init packages/global-packages
bash .github/actions/ensure-global-packages/ensure.sh
# or (after submodule content exists):
# bash packages/global-packages/packages/dev-tools/github/scripts/ensure-global-packages-sparse.sh

composer install
npm ci
```

npm `file:` deps and Composer path repos point at `packages/global-packages/packages/*` (no symlinks).

### Updating shared packages (automated)

You usually **do not** bump the submodule pin by hand.

1. Push to `blockeraai/blockera-global-packages` (any branch).
2. That repo’s `notify-blockera-submodule` workflow reads `.github/global-packages-consumers.json` and dispatches `global-packages-updated` to **every enabled consumer** (Blockera, Blockera Pro, Blockera One, …).
3. Each consumer’s `sync-global-packages-submodule` workflow bumps `packages/global-packages`:
   - **master** → opens/updates PR `chore/bump-global-packages` (CI gates the pin)
   - **matching feature branch** (Husky mirror as `<repo>/<branch>`, e.g. `blockera/fix/foo`) → **skipped**. Pin locally with `npm run submodule:bump` (not auto-pushed as blockerabot).
4. Manual remote catch-up: Actions → **Sync global-packages submodule** (`workflow_dispatch` with `mode=pr` or `mode=push`), or wait for the daily schedule (master only).

To add/remove a consumer, edit `blockera-global-packages/.github/global-packages-consumers.json` (set `"enabled": false` to pause without deleting).

Feature-branch gitlink bump (commits **locally** as your git user, does not `git push`):

```bash
npm run submodule:bump                 # advance current pin’s branch tip and commit
npm run submodule:bump -- fix/issues   # or any branch / SHA (explicit override)
```

Push this repo yourself when you are ready.

With no arg, the local bump keeps the pin on the same lineage: `master` if the current SHA is on master, otherwise the single remote branch that contains it (errors if the SHA is on no remote branch).

Husky `post-checkout` mirrors new consumer branches into the submodule as `<repo>/<branch>` (from the `origin` remote name).

Husky `pre-push` verifies the pinned `packages/global-packages` SHA exists on origin (and pushes the mirrored submodule branch when needed). Skip with `BLOCKERA_SKIP_SUBMODULE_PUSH=1`.

CI does **not** use `actions/checkout` `submodules:` (shallow SHA fetches fail for non-default-branch pins). Jobs check out the repo, run `./.github/actions/ensure-global-packages` (SSH → HTTPS + `secrets.BLOCKERABOT_PAT`), then call shared composites under `packages/global-packages/packages/dev-tools/github/actions/` (e.g. `setup-node`, `setup-php`, `update-assets`) and helpers/job scripts under `…/scripts/` (override defaults with step `env:`).

Consumer `.github/scripts/` is removed. The only bootstrap that must live in the consumer (before the submodule exists) is `.github/actions/ensure-global-packages/`. Sync it after submodule bumps:

```bash
bash packages/global-packages/packages/dev-tools/github/scripts/sync-consumer-bootstrap.sh
```

**Note:** `repository_dispatch` only runs workflows that exist on Blockera’s **default branch**. Merge the sync workflow to `master` once for automation to go live.

## Making Changes

-   Check out the [Getting Started](../docs/contributors/getting-started.md) guide for additional development information
-   Fork the repository on GitHub
-   Make the changes to your forked repository
    -   Ensure you stick to the [WordPress Coding Standards](https://codex.wordpress.org/WordPress_Coding_Standards)
-   When committing, reference your issue (if present) and include a note about the fix
-   If possible, and if applicable, please also add/update unit tests and E2E tests for your changes
-   Push the changes to your fork
-   Submit a pull request to the 'develop' branch of the Blockera repository
-   Check unit and E2E tests to make sure they pass and have not any conflicts

## Code Documentation

-   We ensure that every Blockera function is documented well and follows the standards set by phpDoc
-   Finally, please use tabs and not spaces. The tab indent size should be 8.

At this point you're waiting on us to merge your pull request. We'll review all pull requests, and make suggestions and changes if necessary.

# Additional Resources

-   [General GitHub Documentation](https://help.github.com/)
-   [GitHub Pull Request documentation](https://help.github.com/send-pull-requests/)
-   [PHPUnit Tests Guide](https://phpunit.de/manual/current/en/writing-tests-for-phpunit.html)
