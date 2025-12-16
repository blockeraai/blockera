# Task: Refactor ONE PHP function for max runtime performance + min memory (WordPress plugin context)

You are a PHP engine / compiler-level performance expert. Your #1 priority is **maximum runtime speed** and **minimum memory usage**. Readability is secondary, but the code must remain correct and WordPress-safe.

## Scope

-   Refactor **only the targeted function** (the one I highlight / select in Cursor).
-   Do NOT change the function’s public behavior, returned values, side-effects, filters/actions interactions, or edge-case handling.
-   If behavior is unclear, infer it from call sites + existing tests and preserve it exactly.

## Mandatory workflow

### 1) Understand usage first (no refactor yet)

-   Search the codebase for **all call sites** of this function.
-   Identify input shapes/types, expected output, edge cases, hot paths, and typical data sizes.
-   Note WordPress context assumptions (globals, WP APIs used, caching layers, filters/actions, transients, object cache, etc.).

### 2) Find and use existing tests (required)

-   Search for any existing automated tests covering this function or its behavior:
    -   PHPUnit / WP_UnitTestCase tests
    -   Integration tests that call it indirectly
    -   Snapshot / expected-output tests, fixtures, golden files, etc.
-   If tests exist:
    -   Read them to understand expected behavior and edge cases.
    -   Ensure your refactor continues to satisfy them.
    -   If possible within the repo constraints, run/validate mentally and keep compatibility (do not “fix” tests by changing expectations unless the existing behavior is demonstrably wrong and used nowhere).
-   If no tests exist:
    -   Treat call sites and observed behavior as the contract.
    -   Add extra input/output validations inside `refactor.php` benchmark harness (not in production code) to reduce risk.

### 3) Benchmark in WordPress root

-   Find `refactor.php` in the WordPress root. If it does not exist, create it in the WP root.
-   **Clean `refactor.php`:** remove unrelated code and keep it minimal, focused, and runnable (only WP bootstrap + benchmark harness + the two functions + helpers).
-   At the top of `refactor.php`, ALWAYS include:

    ```php
    <?php
    include './wp-load.php';
    ```

-   Add BOTH implementations:

    -   `original_<functionName>()` (copy of old function)
    -   `refactored_<functionName>()` (your optimized version)

-   The benchmark must:

    -   Run both functions across multiple realistic inputs (based on discovered call sites).
    -   Validate outputs are identical (strict checks where possible). If mismatch, print a clear diff and fail.
    -   Measure time (seconds + ms) and show **percentage improvement**.
    -   Warm up before measuring (e.g. one run).
    -   Use enough iterations to reduce noise (adaptive loops or at least 10k–100k depending on workload).
    -   Report memory usage deltas (`memory_get_usage(true)` and `memory_get_peak_usage(true)`).

-   **Static-cache aware benchmarking (required)**
    -   If the function uses any `static` cache (e.g. `static $cache = [];`, memoization, or per-request caching), the benchmark must include:
        -   **Cold benchmark:** cache cleared/reset between iterations (or emulate cold runs by changing inputs / forcing miss). Report separately.
        -   **Warm benchmark:** cache primed first, then timed runs with cache hits. Report separately.
    -   Explain exactly how cache reset/priming is
