# Site Editor: `post-item` route (Blockera)

This file lives in **`packages/editor/js/tabs/`** next to the tabs bootstrap so it stays discoverable beside the implementation.

This document explains why Blockera registers a **`post-item`** route in the Site Editor, what went wrong with earlier approaches, and how the current implementation works. It is meant for **human maintainers** and **AI coding assistants** (e.g. Cursor) when changing tabs, site-editor navigation, or webpack dependency extraction.

## Problem

### Blank canvas when opening a blog post in the Site Editor

- Core’s `useNavigateToEntityRecord` navigates to `/{postType}/{postId}` (e.g. `/post/123` in the router’s `p` query).
- Core registers a **`page-item`** route (`/page/:postId`) but historically did **not** register a matching **`post-item`** route for `/post/:postId`.
- The router then had **no matching route** → **blank canvas**.

### Related: in-app navigation vs full reload

- Forcing a full navigation to `post.php` while the **Site Editor app** is loaded can **desync** the URL from the client router. Blockera’s document switching prefers `onNavigateToEntityRecord` and avoids pushing `post.php` when staying inside the site editor (see `useSwitchDocument`).

## What we must not do (pitfalls)

### 1. Bundling `@wordpress/edit-site/build-module/*`

Importing internal edit-site modules (e.g. `build-module/components/editor`) pulls in **`lock-unlock.js`**, which calls `__dangerousOptInToUnstableAPIsOnlyForCoreModules` for **`@wordpress/edit-site`**. Core’s `wp-edit-site` script has **already** opted in once; executing a **second** copy from the plugin bundle throws (private APIs are for core bundles only).

**Do not** solve the blank canvas by deep-importing edit-site internals into the Blockera webpack bundle.

### 2. `DependencyExtractionWebpackPlugin`: `requestToExternal` returning `undefined`

For `@wordpress/*` imports, returning `undefined` from a custom `requestToExternal` **falls through** to the default, which still **externalizes** the package and can emit bogus PHP dependency handles (e.g. `wp-edit-site/build-module/...`). WordPress 6.9+ may notice **unregistered** script handles. Prefer **not** depending on deep edit-site paths in plugin entry points.

### 3. `registry.dispatch( store )` is not a Redux `dispatch` function

In `@wordpress/data`, `registry.dispatch( storeDescriptor )` returns **`getActions()`** — the **public action creators** object — not a callable that accepts raw `{ type: '...' }` actions.

To dispatch **`REGISTER_ROUTE`** (a **private** action shape that still flows through the reducer), use the **Redux store** behind the registry: read `registry.stores['core/edit-site'].store` and call **`.dispatch({ type: 'REGISTER_ROUTE', route })`** on that (see implementation in `SiteEditorPostItemRouteRegistration.tsx`).

## Current solution (Blockera)

1. **Wait** until core has registered routes (subscribe to the registry until the **`page-item`** route exists in `core/edit-site` state).
2. **Read** `page-item` from `getState().routes` and **reuse** its **`mobile`** and **`preview`** area functions — same canvas as pages, **no** duplicate edit-site modules in our bundle.
3. **Register** a new route **`post-item`** with `path: '/post/:postId'` and a **custom `sidebar`** built only from **public** packages (`@wordpress/components`, `@wordpress/core-data`, `@wordpress/url`, etc.): a simple posts list with links using the same `p` query pattern the Site Editor expects.
4. Dispatch registration via **`reduxStore.dispatch({ type: 'REGISTER_ROUTE', route })`** as above.

### Files

| Area | File |
|------|------|
| Design doc (this file) | `packages/editor/js/tabs/site-editor-post-item-route.md` |
| Route registration + sidebar | `packages/editor/js/tabs/components/SiteEditorPostItemRouteRegistration.tsx` |
| Plugin render order (route before tabs) | `packages/editor/js/tabs/index.tsx` |
| Avoid `post.php` push when in site editor | `packages/editor/js/tabs/hooks/useSwitchDocument.ts` |

## Future / upstream

- If **WordPress core** adds an official **`post-item`** route, re-check for **duplicate** registration: guard with a single registration or remove Blockera’s shim.
- If core’s **`page-item`** areas change, the cloned `mobile` / `preview` behavior should follow core automatically because they are **references** from the live store.

## References (WordPress packages)

- `core/edit-site` store: `REGISTER_ROUTE` / routes reducer in `@wordpress/edit-site`.
- `useResolveEditedEntity` maps `post-item` / `posts` to the `post` post type — route **name** must stay **`post-item`** for consistency.
