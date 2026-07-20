## Performance Benchmarks

Blockera CI compares **WordPress Core** (Blockera deactivated) vs **Blockera active** using two Playwright harnesses:

1. **Server-Timing** — PHP / request-path overhead (`wp-total`, TTFB, LCP on the front end).
2. **Block editor (client)** — Chromium tracing metrics adapted from the Gutenberg post-editor performance suite (block selection, workspace tab switching).

Each comparable scenario has a `%` overhead threshold. If Blockera’s median exceeds Core by more than that threshold (either direction), the job fails. Server-Timing and editor results each get their own sticky PR comment and share the same workflow artifact upload.

### How it works

```text
wp-env (performance.json)
  → publish fixtures / resolve scenario URLs
  → Server-Timing: Blockera ON / Core OFF → compare-results.js → report.md
  → Editor:        Blockera ON / Core OFF → compare-editor-results.js → editor-report.md
  → sticky PR comments (separate) + artifacts
```

1. **Environment** — [`.github/wp-env-configs/performance.json`](../../.github/wp-env-configs/performance.json) enables `BLOCKERA_PERF_BENCHMARK`, maps CI MU-plugins, and activates Twenty Twenty-Five.
2. **Server-Timing** — [`.github/performance/mu-plugins/server-timing.php`](../../.github/performance/mu-plugins/server-timing.php) emits `wp-total` (and front-end `wp-before-template` / `wp-template`, memory, DB queries). [`clear-cache.php`](../../.github/performance/mu-plugins/clear-cache.php) clears caches between iterations via `/?clear_cache`.
3. **Server-Timing scenarios** — [`.github/performance/scenarios.json`](../../.github/performance/scenarios.json) lists URLs (home, page-1, admin screens, block editor shell). Setup publishes the page-1 page and writes `.github/performance/results/resolved-scenarios.json`.
4. **Editor scenarios** — [`.github/performance/editor-scenarios.json`](../../.github/performance/editor-scenarios.json) lists client interaction suites (selecting blocks, switching Blockera workspace tabs).
5. **Playwright suites** — [`tests/performance/`](../../tests/performance/)  
   - Server-Timing: `specs/scenarios.test.js` + `playwright.config.js`  
   - Editor: `specs/editor-scenarios.test.js` + `playwright.editor.config.js` (Gutenberg-style 10 samples + 1 throwaway, `repeatEach: 1`)
6. **Compare + gate** —  
   - [`compare-results.js`](../../tests/performance/compare-results.js) → `report.md` (gate on `wp-total`)  
   - [`compare-editor-results.js`](../../tests/performance/compare-editor-results.js) → `editor-report.md` (gate on per-scenario metric, e.g. `focus`)  
   Scenarios with `requiresBlockera: true` are informational only (no Core gate).

Theme is fixed to **Twenty Twenty-Five**. Locales are **en_US only** (no locale matrix).

### Key paths

| Path | Role |
| --- | --- |
| `.github/workflows/performance-benchmark.yml` | CI workflow |
| `.github/wp-env-configs/performance.json` | wp-env config for benchmarks |
| `.github/performance/scenarios.json` | Server-Timing URLs + thresholds |
| `.github/performance/editor-scenarios.json` | Editor interaction scenarios + thresholds |
| `.github/performance/mu-plugins/` | Server-Timing + cache clear + update-check hardening |
| `.github/performance/scripts/` | setup / run helpers |
| `tests/performance/` | Playwright suites + compare scripts |
| `.github/performance/results/report.md` | Server-Timing compare report |
| `.github/performance/results/editor-report.md` | Block editor compare report |
| `artifacts/*-performance-results.json` | Raw Playwright metric payloads |

### npm scripts

| Script | Purpose |
| --- | --- |
| `npm run test:performance` | Single Server-Timing subject run (used by the runner with env prefixes) |
| `npm run test:performance:compare` | Compare Server-Timing artifacts → `report.md` |
| `npm run test:performance:editor` | Single editor subject run |
| `npm run test:performance:editor:compare` | Compare editor artifacts → `editor-report.md` |
| `npm run test:performance:editor:local` | Full local editor Core vs Blockera pipeline (see below) |
| `npm run test:performance:local` | Full local Server-Timing Core vs Blockera pipeline (see below) |

### CI usage

The workflow runs on pull requests (`opened`, `synchronize`, `ready_for_review`) and `workflow_dispatch`.

Typical CI steps:

1. Copy `performance.json` → `.wp-env.json`, start wp-env, build.
2. Install Chromium, verify Server-Timing, set up content.
3. Run [`.github/performance/scripts/run-benchmarks.sh`](../../.github/performance/scripts/run-benchmarks.sh) (Blockera on, then off).
4. Compare Server-Timing; post sticky PR comment (`header: blockera-perf-benchmark`).
5. Run [`.github/performance/scripts/run-editor-benchmarks.sh`](../../.github/performance/scripts/run-editor-benchmarks.sh) (Blockera on, then off).
6. Compare editor; post **separate** sticky PR comment (`header: blockera-editor-perf-benchmark`).
7. Fail the job if either threshold gate failed.
8. Upload artifacts (both reports + JSON files).

CI uses `TEST_RUNS=20` for Server-Timing. Editor suites use a fixed 10 (+1 throwaway) samples per Gutenberg’s pattern.

### Configuring Server-Timing scenarios

Edit [`.github/performance/scenarios.json`](../../.github/performance/scenarios.json):

- `defaults.primaryMetric` — gate metric (`wp-total`).
- `defaults.thresholdPercent` — fallback threshold.
- Per-scenario `thresholdPercent` — override.
- `auth: true` — admin / logged-in paths (Playwright storageState).
- `requiresBlockera: true` — skip Core run / skip gate (report Blockera-only).
- `path` / fixtures — content under test (`{POST_ID}` resolved at setup).

After changing scenarios, re-run content setup (or the full local/CI pipeline) so `resolved-scenarios.json` is refreshed.

### Configuring editor scenarios

Edit [`.github/performance/editor-scenarios.json`](../../.github/performance/editor-scenarios.json):

| Scenario id | Metric | Notes |
| --- | --- | --- |
| `editor-select-blocks` | `focus` | Gutenberg “Selecting blocks” pattern; Blockera vs Core gated (default threshold 1000% — Blockera’s inspector makes selection much slower than Core; tighten as optimizations land) |
| `editor-switch-workspace-tabs` | `switchTab` | Blockera workspace document tabs; `requiresBlockera` (informational) |

- Per-scenario `primaryMetric` — result key to gate/report.
- Per-scenario `thresholdPercent` — override (default 20%).
- `requiresBlockera: true` — skip when `PERF_SUBJECT=core`; no Core gate.

More editor metrics (typing, inserter, loading) can be added later as new describe blocks + scenario rows.

### Using it on local

#### Server-Timing (existing)

Prefer the all-in-one local script. It applies the performance wp-env config, verifies Server-Timing, runs both subjects, and prints the compare report.

```bash
npm run test:performance:local
```

Defaults:

- `TEST_RUNS=5` (faster than CI’s 20)
- Reuses wp-env if already up **and** Server-Timing is present
- Auto-restarts wp-env with `WP_ENV_CONFIG=performance` if Server-Timing is missing
- Runs `npm run build` unless `--skip-build` is passed

Report output:

- `.github/performance/results/report.md`
- `artifacts/blockera-performance-results.json`
- `artifacts/core-performance-results.json`

#### CLI flags (Server-Timing local)

```bash
npm run test:performance:local -- --help
```

| Flag | Meaning |
| --- | --- |
| `--runs=N` | Iterations per scenario (default `5`) |
| `--skip-build` | Skip `npm run build` |
| `--skip-env-start` | Do not start/restart wp-env (must already use performance config) |
| `--force-env-restart` | Stop + start wp-env with performance mappings |
| `--base-url=URL` | WordPress URL (default `http://localhost:8888`) |

#### Block editor (client) locally

Prefer the all-in-one local script (same performance wp-env as Server-Timing):

```bash
npm run test:performance:editor:local
```

```bash
npm run test:performance:editor:local -- --help
```

| Flag | Meaning |
| --- | --- |
| `--skip-build` | Skip `npm run build` |
| `--skip-env-start` | Do not start/restart wp-env |
| `--force-env-restart` | Stop + start wp-env with performance mappings |
| `--base-url=URL` | WordPress URL (default `http://localhost:8888`) |

Example:

```bash
npm run test:performance:editor:local -- --skip-build --force-env-restart
```

Report output:

- `.github/performance/results/editor-report.md`
- `.github/performance/results/editor-compare.json`
- `artifacts/blockera-editor-performance-results.json`
- `artifacts/core-editor-performance-results.json`

#### Important: `WP_ENV_CONFIG=performance`

`npm run env:start` runs [`.github/scripts/setup-wp-env.js`](../../.github/scripts/setup-wp-env.js), which copies a config from `.env` (`WP_ENV_CONFIG`, often `base` / `development`) onto `.wp-env.json`. That **overwrites** `performance.json` and drops MU-plugin mappings.

The Server-Timing local runner always starts with:

```bash
WP_ENV_CONFIG=performance npm run env:start
```

Confirm Server-Timing:

```bash
curl -sD - -o /dev/null "http://localhost:8888/" | grep -i server-timing
```

#### Manual Server-Timing step-by-step (optional)

```bash
WP_ENV_CONFIG=performance npm run env:start
npm run build
npx playwright install chromium
bash .github/performance/scripts/setup-server-timing.sh
bash .github/performance/scripts/setup-content.sh
TEST_RUNS=5 bash .github/performance/scripts/run-benchmarks.sh
npm run test:performance:compare
```

`test:performance:compare` / `test:performance:editor:compare` alone only work after the matching artifact JSON files exist.

#### Tips

- Keep the machine quiet while measuring; treat local numbers as relative (Blockera vs Core on the same run), not absolute CI parity.
- Use higher `--runs` when validating a suspected Server-Timing regression; use `5` for quick iteration.
- Do not commit `.github/performance/results/` or `artifacts/` outputs (they are gitignored / ephemeral).
