# `@blockera/storage`

Site-scoped browser storage helpers for Blockera.

Use this package instead of native `localStorage` / `sessionStorage`. Keys are logical (unscoped) in application code; the package appends a **site key** and **user id** so values do not leak across multisite blogs, reinstalls, or users on the same browser.

> **Note:** The npm `description` mentions database CRUD; this package currently implements **browser storage only** (plus PHP helpers that generate the scoping key). Prefer this README and the source over the package.json blurb.

---

## Why it exists

Native browser storage is shared by origin. On WordPress multisite (or after a site reinstall), unscoped keys collide or stale data survives.

Blockera stores a stable per-blog install key in `wp_options` (`blockera_storage_site_key`) and injects it into the editor as `window.blockeraStorageSiteKey` / `window.blockeraStorageUserId`. All reads/writes go through scoped keys:

```text
{baseKey}__{siteKey}_u{userId}
```

Example: `blockera_zoom_percent__a1b2c3d4e5_u1`

JS (`getStorageKey`) and PHP (`blockera_get_scoped_storage_key`) **must stay in sync** on this format.

---

## Package layout

```text
packages/storage/
├── js/
│   ├── index.js                 # Public JS entry (re-exports local-storage)
│   ├── local-storage/index.js   # Scoped localStorage + sessionStorage API
│   └── tests/                   # Jest + Cypress coverage
├── php/
│   ├── functions.php            # Site key + scoped key helpers (Composer autoload)
│   └── index.php                # Security stub
├── package.json                 # @blockera/storage
└── composer.json                # blockera/storage
```

| Side | Package name | Entry |
|------|----------------|-------|
| JS | `@blockera/storage` | `js/index.js` |
| PHP | `blockera/storage` | `php/functions.php` (Composer `files` autoload) |

---

## JS API

### Import

```js
import {
	localStorage,
	sessionStorage,
	getStorageKey,
} from '@blockera/storage';
```

ESLint forbids native `localStorage` / `sessionStorage` / `window.localStorage` outside this package. Always import from `@blockera/storage`.

### `getStorageKey(baseKey)`

Builds the scoped key from window globals (falls back to `0` / `0` if missing):

```js
getStorageKey('my_feature');
// → "my_feature__a1b2c3d4e5_u1" when globals are set
```

### `localStorage` / `sessionStorage`

Same surface for both backends. Pass **logical** keys only; scoping is internal.

| Method | Description |
|--------|-------------|
| `getItem(key)` | Read string, or `null` |
| `setItem(key, value)` | Write string |
| `removeItem(key)` | Delete key |
| `getJSON(key)` | `JSON.parse` of stored string, or `null` if missing/invalid |
| `setJSON(key, value)` | `JSON.stringify` + write |
| `updateJSON(key, partial)` | Shallow-merge into existing object; returns new value or `null` if missing/non-object |
| `freshItem(cacheKey, startsWith)` | Delete other versioned keys for **this** site/user that share `startsWith`, keeping `cacheKey` |

Errors against the native backend are caught and logged; methods fail soft (return `null` / no-op) rather than throw.

### Usage examples

**Strings (e.g. zoom persistence):**

```js
import { localStorage } from '@blockera/storage';

localStorage.setItem('blockera_zoom_percent', '125');
const zoom = localStorage.getItem('blockera_zoom_percent');
```

**JSON (e.g. tabs persistence):**

```js
import { localStorage } from '@blockera/storage';

localStorage.setJSON('blockera_tabs', { open: [], closed: [] });
const tabs = localStorage.getJSON('blockera_tabs');

localStorage.updateJSON('blockera_tabs', { open: ['core/paragraph'] });
```

**Versioned cache cleanup:**

```js
import { localStorage } from '@blockera/storage';

const cacheKey = 'blockera_extensions_cache_v3';
const cacheKeyPrefix = 'blockera_extensions_cache_';

let cache = localStorage.getJSON(cacheKey);
if (!cache) {
	localStorage.freshItem(cacheKey, cacheKeyPrefix);
	cache = {};
}
localStorage.setJSON(cacheKey, cache);
```

**Session-only data:**

```js
import { sessionStorage } from '@blockera/storage';

sessionStorage.setItem('blockera_tabs_bulk_edit_ids', '1,2,3');
```

### Window globals (required in the editor)

Injected by PHP when the editor boots (see `EditorPersistenceStore`):

| Global | Type | Purpose |
|--------|------|---------|
| `window.blockeraStorageSiteKey` | `string` (10 hex chars) | Per-blog install key |
| `window.blockeraStorageUserId` | `number` | Current user id |

Without these, keys fall back to `__0_u0` (fine for unit tests; wrong for production editor).

---

## PHP API

Autoloaded via Composer (`blockera/storage` → `php/functions.php`). Safe to load before WordPress in PHPUnit (WP APIs are only called when WordPress is available).

### `blockera_generate_storage_site_key(): string`

Returns a new 10-character hex key (`bin2hex(random_bytes(5))`).

### `blockera_get_storage_site_key(): string`

Gets or creates the stable key for the current blog in option `blockera_storage_site_key` (autoload `no`). Request-level static cache. Legacy/non-matching values are rewritten to the 10-hex format.

### `blockera_get_scoped_storage_key( string $base_key, ?int $user_id = null ): string`

Same format as JS `getStorageKey`. `$user_id` defaults to `get_current_user_id()`.

```php
$ids_key = blockera_get_scoped_storage_key( 'blockera_tabs_bulk_edit_ids' );
// e.g. blockera_tabs_bulk_edit_ids__a1b2c3d4e5_u1
```

Use this when PHP must emit or read the **exact** browser key (e.g. inline scripts, bulk-edit handoff).

### Injecting globals for the editor

Typical pattern (already used in `packages/editor/php/EditorPersistenceStore.php`):

```php
wp_add_inline_script(
	$handle,
	sprintf(
		'( function() {
			window.blockeraStorageSiteKey = %s;
			window.blockeraStorageUserId = %d;
		} )();',
		wp_json_encode( blockera_get_storage_site_key(), JSON_HEX_TAG | JSON_UNESCAPED_SLASHES ),
		(int) get_current_user_id()
	)
);
```

---

## Rules for consumers (JS + PHP)

1. **Never** call native `localStorage` / `sessionStorage` in Blockera app code — import from `@blockera/storage`.
2. Always pass **logical** keys (`blockera_zoom_percent`), never pre-scoped keys.
3. Keep key format identical between JS and PHP: `{baseKey}__{siteKey}_u{userId}`.
4. Prefer `getJSON` / `setJSON` / `updateJSON` for objects; use `getItem` / `setItem` for plain strings.
5. For versioned caches, use `freshItem(currentKey, sharedPrefix)` so old versions for this site/user are pruned.
6. Treat storage as best-effort (quota / private mode): callers should tolerate `null` and failed writes.

---

## Developing this package

### When to change what

| Change | Touch |
|--------|--------|
| Add/adjust scoped storage methods | `js/local-storage/index.js` + Jest tests |
| Change key format | **Both** JS `getStorageKey` and PHP `blockera_get_scoped_storage_key` + Cypress helpers in `@blockera/dev-cypress` |
| Site key generation / option | `php/functions.php` |
| Editor globals injection | Consumer (e.g. `EditorPersistenceStore`), not this package’s core API |

This package is the **only** allowed native browser-storage access (`eslintrc.js` disables the restriction under `packages/storage/js/**`).

### Tests

| File | Kind | Covers |
|------|------|--------|
| `js/tests/local-storage.spec.js` | Jest | Scoping, string/JSON API, `freshItem`, sessionStorage |
| `js/tests/storage-site-key.general.e2e.cy.js` | Cypress | `window.blockeraStorageSiteKey` / `UserId` on editor load |

Cypress helpers for scoped keys live in `@blockera/dev-cypress` (`js/helpers/storage.js`: `getScopedStorageKey`, `removeScopedStorageKeys`).

### Folder sync

`blockera-folder-sync.json` lists dependent repos that may mirror this package (`blockera`, `blockera-pro`, `blockera-site-toolkit`). Keep API changes compatible or sync dependents.

---

## Real consumers (reference)

| Consumer | Usage |
|----------|--------|
| `packages/editor/js/zoom/utils/storage.ts` | Zoom % via `getItem` / `setItem` |
| `packages/editor/js/tabs/hooks/useTabsPersistence.ts` | Tabs JSON persistence |
| `packages/editor/js/extensions/libs/shared/index.js` | Extensions cache + `freshItem` |
| `packages/editor/php/BulkActions.php` | PHP scoped keys for bulk-edit session handoff |
| `packages/editor/php/EditorPersistenceStore.php` | Injects storage globals into the editor |

---

## Quick checklist for AI agents

- [ ] Import `{ localStorage }` or `{ sessionStorage }` from `@blockera/storage` — not natives.
- [ ] Use a stable logical key prefixed with `blockera_` where possible.
- [ ] If PHP must know the browser key, call `blockera_get_scoped_storage_key()`.
- [ ] If changing key format, update JS + PHP + Cypress helpers together.
- [ ] Add/adjust tests under `packages/storage/js/tests/`.
