# Blockera Popover

Inspector and control popovers built on `@wordpress/components` Popover, with Blockera-specific dismiss rules, nested overlay tracking, and inspector offset math.

This module is used across Blockera controls (repeater items, group controls, var-picker, media controls, etc.). If you change dismiss behavior here, expect ripple effects in nested UI flows.

---

## File map

| File | Role |
|------|------|
| `index.js` | Public `Popover` wrapper — draggable vs core, inspector offset, anchor fallback |
| `core.js` | `PopoverCore` — mount/dismiss listeners, focus-outside, `registerPopoverOpen` |
| `draggable.js` | Draggable variant for titled popovers |
| `utils.js` | Dismiss helpers, nested popover registry, anchor/offset utilities |
| `use-inspector-popover-offset.js` | Hook for sidebar-aware horizontal offset |
| `types/index.js` | Flow types for `TPopoverProps` |
| `test/utils.spec.js` | Unit tests for dismiss + offset logic (**run these first**) |
| `test/popover.cy.js` | Cypress component tests |

---

## Quick start

```jsx
import Popover from '../libs/popover';

<Popover
  title={__('Background', 'blockera')}
  placement="left-start"
  anchor={anchorRef.current}
  onClose={() => setOpen(false)}
>
  {/* control content */}
</Popover>
```

Custom overlays that portal outside the parent (var-picker, color picker, etc.) should call `registerPopoverOpen` on mount so the parent knows they were opened from inside it.

```js
import { getPopoverRoot, registerPopoverOpen, unregisterPopoverRoot } from '../libs/popover/utils';

useLayoutEffect(() => {
  registerPopoverOpen(getPopoverRoot(contentRef.current));
  return () => unregisterPopoverRoot(getPopoverRoot(contentRef.current));
}, []);
```

---

## Architecture: how dismiss works

Blockera popovers can dismiss from two paths:

1. **Pointer down (capture phase)** — `document` listener in `PopoverCore` → `shouldDismissPopoverFromPointerDown` → `dismissPopover({ skipMountGuard: true })`
2. **Focus outside** — WordPress `onFocusOutside` → `shouldIgnorePopoverFocusOutside` → `dismissPopover()` (respects 100ms mount guard)

Both paths ask the same question: **should this interaction keep the popover open?** That is centralized in `isPopoverDismissIgnoredTarget(popoverRoot, target)`.

### Decision order (`isPopoverDismissIgnoredTarget`)

```
1. Target inside popoverRoot DOM          → ignore dismiss (stay open)
2. Variable picker interaction          → see "Var-picker rules" below
3. Value-addon pointer click            → see "Value-addon rules" below
4. Modal / media modal from this popover  → ignore dismiss
5. Registered nested popover              → ignore dismiss (isPopoverNestedChildOf)
6. SelectControl dropdown content         → ignore dismiss
7. Otherwise                            → allow dismiss
```

---

## Nested popover tracking

Nested popovers are **not** inferred from DOM alone. They must be **registered** when they mount.

| API | When to use |
|-----|-------------|
| `registerPopoverOpen(popoverRoot)` | On mount (`useLayoutEffect` in `PopoverCore` / var-picker) |
| `unregisterPopoverRoot(popoverRoot)` | On unmount |
| `linkNestedPopoverToParent(child, parent)` | Manual link (tests, edge cases) |
| `isPopoverNestedChildOf(child, ancestor)` | Dismiss checks — walks `WeakMap` parent chain |

Registration uses `lastPopoverInteractionRoot` (set on pointer down via `notePopoverPointerInteraction`) and optionally `resolveOwningPopoverForFieldTarget` when the pointer target is a value-addon field.

**Important:** Unrelated `.components-popover` nodes (e.g. block state headers) are **not** ignored unless registered. Only explicitly linked children keep the parent open.

---

## Var-picker rules

Variable picker is a special nested overlay (`packages/controls/js/value-addons/components/variable/var-picker.js`).

### Identifying a var-picker

Use the **marker**, not CSS class alone:

```js
VARIABLE_PICKER_POPOVER_MARKER_SELECTOR =
  '[data-test="variable-picker-popover"], [data-cy="variable-picker-popover"]';
```

Edit-variable / preset repeater popovers may use `blockera-control-popover-variables` but **do not** have this marker — they are **not** var-pickers.

### Selection vs pointer

| Interaction | Parent popover | Var-picker being evaluated |
|-------------|----------------|----------------------------|
| Click value-addon **pointer** (open var) | Stay open | May close |
| Click **variable item** / row inside var-picker | Stay open | Stays open until selection completes |
| Click inside **edit-variable popover** (non-pointer) | Normal dismiss rules | Normal dismiss rules |

Helpers:

- `isElementInsideVariablePickerPopover(element)` — marker only
- `isElementInsideVariablePickerSelectionTarget(element)` — `.blockera-control-value-addon-popover-item`
- `isVariablePickerSelectionInteraction(target)` — both of the above

Var-picker calls `markPopoverClosing()` before unmounting on select so parents ignore transient focus-outside events.

Related repeater logic lives in `packages/controls/js/libs/repeater-control/utils.js` (`isClickInsideOpenInspectorRepeaterPopover`) — do not treat var-picker clicks as in-edit-popover clicks.

---

## Value-addon pointer rules

Pointers (`.blockera-control-value-addon-pointers`, SVG icons inside) open var-picker / dynamic-value UI.

Dismiss uses **ownership**, not just DOM containment:

```js
resolveOwningPopoverForFieldTarget(target) → popover that owns the field
shouldIgnoreDismissForValueAddonPointer(popoverRoot, target)
  → true when owner matches this popover (parent stays open)
  → false when this popover is var-picker and owner is parent (var-picker may close)
```

Clicks on `<svg>` / `<path>` inside pointers are supported (`Element`, not only `HTMLElement`).

---

## Modals

Modal ignore is scoped to modals opened **from** the popover:

- Blockera: `.components-modal__screen-overlay`
- WordPress media library: `.media-modal`, `.media-modal-backdrop` (via `../modal/overlay-utils.js`)

`modalOpenedFromPopoverRoot` is synced when a modal opens after an in-popover pointer interaction. Unrelated modals elsewhere in the document do **not** keep the popover open.

---

## Closing coordination

| API | Purpose |
|-----|---------|
| `markPopoverClosing(root)` | Parent popovers ignore dismiss/focus-outside while a child closes (100ms window) |
| `isOtherPopoverClosing(root)` | Guard in dismiss handlers |
| `hasNestedOverlayOpenAsideFrom(root)` | Escape key — let innermost overlay handle first |

---

## Anchor & offset

- `resolvePopoverAnchorElement(explicit, fallback)` — finds value-addon opener or focus opener within field scope
- `computeInspectorPopoverOffset(anchor, placement, gap)` — horizontal gap from inspector sidebar edge
- `POPOVER_ANCHOR_SCOPE_SELECTORS` — field scopes used for anchor + ownership resolution

The public `Popover` component keeps `anchor` as passed by the consumer for Floating UI; resolved openers are used for **offset math only** (see `index.js` comment).

---

## Extending dismiss behavior

When adding a new portaled surface opened from inside a popover:

1. Call `registerPopoverOpen` on mount (and `unregisterPopoverRoot` on unmount).
2. If it has custom document-level dismiss, reuse `isPopoverDismissIgnoredTarget` instead of duplicating logic.
3. Add unit tests in `test/utils.spec.js` covering:
   - parent stays open when interacting with the nested surface
   - parent dismisses for unrelated outside clicks
   - nested surface dismisses when appropriate
4. If the surface uses repeater selectable rows, check interaction with `isClickInsideOpenInspectorRepeaterPopover` in repeater-control.

**Do not** ignore all `.components-popover` or all `.blockera-component-popover` nodes — that breaks block-state and unrelated sidebar popovers.

---

## Testing

```bash
# Unit tests (preferred for dismiss logic changes)
npm run test:js -- packages/controls/js/libs/popover/test/utils.spec.js

# Component tests
# (via package cypress setup — see test/popover.cy.js)
```

When changing `utils.js`, also consider:

```bash
npm run test:js -- packages/controls/js/libs/repeater-control/test/utils.spec.js
```

Repeater and var-picker flows depend on this module.

After JS changes, rebuild before manual/e2e verification:

```bash
npm run build
```

---

## Common pitfalls (for AI & contributors)

1. **Class vs marker for var-picker** — `blockera-control-popover-variables` alone is not enough; require `[data-test="variable-picker-popover"]`.
2. **Forgetting `registerPopoverOpen`** — nested overlay clicks will dismiss the parent incorrectly.
3. **Broad popover ignore** — ignoring every Blockera popover breaks unrelated inspector UI.
4. **Mount guard vs pointer dismiss** — pointer dismiss uses `skipMountGuard: true`; focus-outside does not (first 100ms after mount).
5. **`closeInspectorRepeaterPopovers()`** — skips var-picker selection clicks; still runs for other selectable activations.
6. **SVG pointer targets** — always test with `<path>` inside pointer, not only the wrapper element.
7. **Multiple open var-pickers** — ownership and `markPopoverClosing` matter for parent stability after inner select.

---

## Related modules

| Module | Relationship |
|--------|--------------|
| `../modal/overlay-utils.js` | Media modal + Blockera modal detection |
| `../repeater-control/utils.js` | Edit-popover surface detection vs var-picker |
| `../../value-addons/components/variable/var-picker.js` | Nested var-picker, custom mousedown dismiss |
| `../group-control/index.js` | Passes `anchor` / opens edit popovers |

---

## Key exports (`utils.js`)

**Dismiss:** `isPopoverDismissIgnoredTarget`, `shouldDismissPopoverFromPointerDown`, `shouldIgnorePopoverFocusOutside`

**Nested registry:** `registerPopoverOpen`, `unregisterPopoverRoot`, `linkNestedPopoverToParent`, `isPopoverNestedChildOf`

**Closing guards:** `markPopoverClosing`, `isOtherPopoverClosing`, `hasNestedOverlayOpenAsideFrom`

**DOM helpers:** `getPopoverRoot`, `normalizePopoverRoot`, `POPOVER_ROOT_SELECTOR`

**Var-picker:** `isElementInsideVariablePickerPopover`, `isElementInsideVariablePickerSelectionTarget`, `isVariablePickerSelectionInteraction`

**Value-addon:** `isElementInsideValueAddonPointers`, `resolvePopoverAnchorElement` (via anchor scope)

**Offset:** `computeInspectorPopoverOffset`, `getInspectorSidebarElement`
