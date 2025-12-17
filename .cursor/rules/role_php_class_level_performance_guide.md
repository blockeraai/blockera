# PHP Class-Level Performance Guide

> **Scope:** Practical, production-ready performance tips focused on **PHP classes and object-oriented code**. Applies to PHP 8+ (with notes where relevant). Prioritizes **CPU time, memory usage, and request-level latency**.

---

## 1) Class Design & Object Lifecycle

### Prefer Fewer Objects on Hot Paths

* **Why:** Object allocation + GC pressure is expensive when repeated.
* **Do:** Reuse objects, cache instances, or use arrays/scalars for transient data.
* **Avoid:** Creating new objects inside tight loops.

```php
// Bad
foreach ($rows as $r) {
    $dto = new ItemDTO($r);
}

// Better
$dto = new ItemDTO();
foreach ($rows as $r) {
    $dto->hydrate($r);
}
```

### Mark Classes `final` When Not Extended

* Reduces dynamic dispatch and clarifies intent.

```php
final class FastService {}
```

### Avoid Magic Methods in Hot Code

* `__get`, `__set`, `__call` add dynamic dispatch.
* Prefer explicit properties/methods.

---

## 2) Constructors & Initialization

### Keep Constructors Lightweight

* **Rule:** No I/O, no DB, no heavy computation in `__construct()`.
* Defer heavy work to explicit `init()` or lazy getters.

```php
class Repo {
    private ?array $cache = null;

    public function getAll(): array {
        return $this->cache ??= $this->load();
    }
}
```

### Lazy Initialization (Memoization)

* Compute once per request; reuse thereafter.

```php
private function config(): array {
    static $cfg;
    return $cfg ??= $this->buildConfig();
}
```

---

## 3) Method Design & Call Overhead

### Reduce Method Calls in Tight Loops

* Inline trivial helpers when profiling shows them hot.

```php
// Hot path: inline tiny logic
$x = ($a + 1) * 2;
```

### Prefer Non-Variadic, Non-Dynamic Calls

* Avoid `call_user_func*`, reflection, dynamic method names.

```php
// Bad
call_user_func([$this, $method], $arg);

// Better
$this->handle($arg);
```

### Use `static` Functions/Closures When Possible

* Avoid capturing `$this`.

```php
usort($items, static fn($a, $b) => $a <=> $b);
```

---

## 4) Properties & Data Structures

### Prefer Typed Properties

* Faster access, fewer surprises.

```php
private int $count = 0;
```

### Flatten Data for Hot Access

* Deep nesting = multiple hash lookups.

```php
// Prefer
$data[$id] = $value;

// Over
$data[$group][$id]['value']
```

### Normalize Keys Once

* Decide `int` vs `string` and stick to it.

```php
$id = (int) $id;
$map[$id] = true;
```

---

## 5) Arrays vs Objects

### Use Arrays for Temporary, High-Volume Data

* Arrays are cheaper than objects for DTO-like data.

### Avoid Copy-on-Write Pitfalls

* Writing to shared arrays triggers copies.
* Treat shared config as **immutable**.

---

## 6) Loops & Iteration

### Prefer `foreach` (Critical Rule)

* `foreach` is a language construct → minimal overhead.
* Avoid `array_map`, `array_filter`, `array_walk` in hot paths.

```php
$out = [];
foreach ($in as $v) {
    if (!$v) continue;
    $out[] = transform($v);
}
```

### Cache Loop Invariants

```php
$len = count($items);
for ($i = 0; $i < $len; $i++) {}
```

---

## 7) Memory Management

### Release Large Structures Early

* Especially in long-running processes (CLI, workers).

```php
$big = null; // allow GC
```

### Avoid References Unless Proven Necessary

* References can disable copy-on-write and cause bugs.

---

## 8) Strings & Formatting

### Prefer Concatenation Over `sprintf()` in Loops

```php
// Faster
$s = $a . ':' . $b;
```

### Use `implode()` for Large Output

```php
$html = implode('', $buffer);
```

### Avoid Regex for Simple Checks

* Prefer `str_contains`, `str_starts_with`, `strpos`.

---

## 9) Error Handling

### Don’t Use Exceptions for Normal Flow

* Exceptions allocate objects + stack traces.

```php
if (!$ok) return null;
```

### Batch Errors, Create Once

* Avoid creating many error objects in loops.

---

## 10) Caching Inside Classes

### Request-Level Cache (Fastest)

```php
private static array $memo = [];

public function get(int $id): Item {
    return self::$memo[$id] ??= $this->load($id);
}
```

### Versioned Cache Keys

* Change version to invalidate cheaply.

```php
$key = "v2:$id";
```

---

## 11) Serialization & JSON

### Decode/Encode Once

```php
$data = json_decode($json, true);
```

### Cache Encoded Payloads if Stable

```php
static $json;
$json ??= json_encode($payload);
```

---

## 12) OOP Patterns That Hurt Performance

Avoid in hot paths:

* Service Locators
* Dependency resolution per call
* Reflection
* Deep inheritance chains
* Traits with heavy logic

Prefer:

* Shallow composition
* Explicit wiring
* Data-first design

---

## 13) Profiling-Driven Workflow

1. Identify hot methods (SPX / Xdebug / Blackfire).
2. Optimize **top 1–3** only.
3. Measure before/after (CPU + peak memory).
4. Re-validate correctness.

---

## 14) Quick Checklist (Class-Level)

* [ ] Constructors are cheap
* [ ] No object creation in hot loops
* [ ] `foreach` over callback-based array helpers
* [ ] No magic methods on hot paths
* [ ] Lazy init + memoization used
* [ ] Exceptions not used for control flow
* [ ] Large arrays released early
* [ ] Strings built efficiently
* [ ] Profiling data exists

---

**Rule of Thumb:**

> *Do less work. Do it once. Do it where it’s cheapest.*
