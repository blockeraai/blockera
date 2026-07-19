## Performance Benchmarks

Blockera CI compares **WordPress Core** (Blockera deactivated) vs **Blockera active** using a Playwright harness adapted from WordPress core’s Server-Timing performance suite.

The goal is to catch PHP / request-path regressions early: each scenario has a `%` overhead threshold. If Blockera’s median `wp-total` exceeds Core by more than that threshold, the job fails and a sticky report is posted on the PR.

### How it works

```text
wp-env (performance.json)
  → publish fixtures / resolve scenario URLs
  → Playwright (Blockera ON)  → artifacts/blockera-performance-results.json
  → Playwright (Blockera OFF) → artifacts/core-performance-results.json
  → compare-results.js → report.md (+ threshold gate)
```

1. **Environment** — [`.github/wp-env-configs/performance.json`](../../.github/wp-env-configs/performance.json) enables `BLOCKERA_PERF_BENCHMARK`, maps CI MU-plugins, and activates Twenty Twenty-Five.
2. **Server-Timing** — [`.github/performance/mu-plugins/server-timing.php`](../../.github/performance/mu-plugins/server-timing.php) emits `wp-total` (and front-end `wp-before-template` / `wp-template`, memory, DB queries). [`clear-cache.php`](../../.github/performance/mu-plugins/clear-cache.php) clears caches between iterations via `/?clear_cache`.
3. **Scenarios** — [`.github/performance/scenarios.json`](../../.github/performance/scenarios.json) lists URLs (home, default post, complex-1 fixture, admin screens, block editor). Setup publishes the complex-1 page and writes `.github/performance/results/resolved-scenarios.json`.
4. **Playwright suite** — [`tests/performance/`](../../tests/performance/) loads each scenario many times (`TEST_RUNS`, plus `repeatEach`), collects Server-Timing / TTFB / LCP (front-end only), and writes JSON under `artifacts/`.
5. **Compare + gate** — [`tests/performance/compare-results.js`](../../tests/performance/compare-results.js) builds a markdown report (median / STD / MAD) and fails when `| (Blockera − Core) / Core × 100 |` exceeds the scenario’s `thresholdPercent` on `wp-total`. Scenarios with `requiresBlockera: true` are informational only (no Core gate).

Theme is fixed to **Twenty Twenty-Five**. Locales are **en_US only** (no locale matrix).

### Key paths

| Path | Role |
| --- | --- |
| `.github/workflows/performance-benchmark.yml` | CI workflow |
| `.github/wp-env-configs/performance.json` | wp-env config for benchmarks |
| `.github/performance/scenarios.json` | URLs + thresholds |
| `.github/performance/mu-plugins/` | Server-Timing + cache clear + update-check hardening |
| `.github/performance/scripts/` | setup / run helpers |
| `tests/performance/` | Playwright suite + compare script |
| `.github/performance/results/report.md` | Human-readable compare report |
| `artifacts/*-performance-results.json` | Raw Playwright metric payloads |

### npm scripts

| Script | Purpose |
| --- | --- |
| `npm run test:performance` | Single Playwright subject run (used by the runner with env prefixes) |
| `npm run test:performance:compare` | Compare existing `artifacts/` JSON files and write `report.md` |
| `npm run test:performance:local` | Full local Core vs Blockera pipeline (see below) |

### CI usage

The workflow runs on pull requests (`opened`, `synchronize`, `ready_for_review`) and `workflow_dispatch`.

Typical CI steps:

1. Copy `performance.json` → `.wp-env.json`, start wp-env, build.
2. Install Chromium, verify Server-Timing, set up content.
3. Run [`.github/performance/scripts/run-benchmarks.sh`](../../.github/performance/scripts/run-benchmarks.sh) (Blockera on, then off).
4. Compare with thresholds; post sticky PR comment; fail the job if the gate fails.
5. Upload artifacts (`report.md`, `compare.json`, performance JSON files).

CI uses `TEST_RUNS=20` by default.

### Configuring scenarios and thresholds

Edit [`.github/performance/scenarios.json`](../../.github/performance/scenarios.json):

- `defaults.primaryMetric` — gate metric (`wp-total`).
- `defaults.thresholdPercent` — fallback threshold.
- Per-scenario `thresholdPercent` — override.
- `auth: true` — admin / logged-in paths (Playwright storageState).
- `requiresBlockera: true` — skip Core run / skip gate (report Blockera-only).
- `path` / fixtures — content under test (`{POST_ID}` resolved at setup).

After changing scenarios, re-run content setup (or the full local/CI pipeline) so `resolved-scenarios.json` is refreshed.

### Using it on local

Prefer the all-in-one local script. It applies the performance wp-env config, verifies Server-Timing, runs both subjects, and prints the compare report.

#### Quick start

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

#### CLI flags

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

Example with all flags:

```bash
npm run test:performance:local -- --runs=10 --skip-build --skip-env-start --base-url=http://localhost:8888
```

When Server-Timing is missing after a previous non-perf env:

```bash
npm run test:performance:local -- --skip-build --force-env-restart
```

#### Important: `WP_ENV_CONFIG=performance`

`npm run env:start` runs [`.github/scripts/setup-wp-env.js`](../../.github/scripts/setup-wp-env.js), which copies a config from `.env` (`WP_ENV_CONFIG`, often `base` / `development`) onto `.wp-env.json`. That **overwrites** `performance.json` and drops MU-plugin mappings.

The local runner always starts with:

```bash
WP_ENV_CONFIG=performance npm run env:start
```

Manual equivalent:

```bash
npx wp-env stop
WP_ENV_CONFIG=performance npm run env:start
```

Confirm Server-Timing:

```bash
curl -sD - -o /dev/null "http://localhost:8888/" | grep -i server-timing
```

#### Manual step-by-step (optional)

If you prefer not to use `test:performance:local`:

```bash
WP_ENV_CONFIG=performance npm run env:start
npm run build
npx playwright install chromium
bash .github/performance/scripts/setup-server-timing.sh
bash .github/performance/scripts/setup-content.sh
TEST_RUNS=5 bash .github/performance/scripts/run-benchmarks.sh
npm run test:performance:compare
```

`test:performance:compare` alone only works after both artifact JSON files exist.

#### Tips

- Keep the machine quiet while measuring; treat local numbers as relative (Blockera vs Core on the same run), not absolute CI parity.
- Use higher `--runs` when validating a suspected regression; use `5` for quick iteration.
- Do not commit `.github/performance/results/` or `artifacts/` outputs (they are gitignored / ephemeral).
