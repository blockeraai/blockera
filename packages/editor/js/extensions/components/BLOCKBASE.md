# BlockBase Component — Developer & AI Reference

> **Audience**: Cursor Composer AI agents, developers extending or modifying BlockBase.
> **Purpose**: Canonical documentation for the BlockBase component. Always consult this when working with BlockBase.

---

## Overview

`BlockBase` is the core wrapper component for WordPress block editor blocks in the Blockera plugin. It orchestrates block editing: state management, style handling, block features, inner blocks, and inspector controls.

**File**: `block-base.js`  
**Exports**: `BlockBase` (ComponentType)

---

## Critical Rules (Always Apply)

### 1. Immutability of `attributes`

**The `attributes` object reference must never be mutated by consumers.**

- `attributes = pendingAttributes ?? compatibleAttributes` — it is a shared reference.
- Child components and hooks may receive it; they must **not** mutate it.
- **Always pass `cloneObject(attributes)`** when handing `attributes` to:
  - `handleOnChangeStyleInLocalState`
  - `setBlockAttributes`
  - `useBlockStyleVariations` (`storedAttributes`)
  - `useAttributes` (`getAttributes` callback)
- Do **not** define a new constant for the clone; clone at the point of use.

### 2. WordPress Core Attributes (style, layout, metadata)

**Never strip or overwrite these with `undefined`.**

- `style`, `layout`, `metadata` are WordPress core block attributes.
- They are preserved in:
  - `getCompatibleAttributes` (from source attributes)
  - `useAttributes` reducer (`preserveWPCoreAttributes`)
  - `setAttributes` in BlockBase (merge from base when missing)
- Compatibility filters (e.g. border, typography) merge into these; they do not replace them.

### 3. Single Source of Truth

- **Source**: `compatibleAttributes` (derived from `blockAttributes` via `useMemo`).
- **Overlay**: `pendingAttributes` — only set during user edits; cleared when derived value updates.
- **Display**: `attributes = pendingAttributes ?? compatibleAttributes`
- Avoid bidirectional sync; use event-driven updates and derive instead of duplicating state.

### 4. `setAttributes` Value Handling

- `setAttributes` receives values from `handleOnChangeAttributes` / reducer / filters.
- **Always clone** the incoming value: `const valueToStore = cloneObject(value)`.
- Preserve `style`, `layout`, `metadata` from `value` or `base` when missing in the clone.
- `setAttributes` mutates the cloned value (e.g. `className`); never mutate the original.

---

## Architecture

### Data Flow

```
blockAttributes (WordPress store)
    → getCompatibleAttributes (preserves style/layout/metadata)
    → compatibleAttributes (useMemo)
    → attributes = pendingAttributes ?? compatibleAttributes

User edit
    → handleOnChangeAttributes
    → useAttributes reducer (preserveWPCoreAttributes)
    → applyFilters('blockera.blockEdit.setAttributes')
    → setAttributes (clone + preserve WP core attrs)
    → setPendingAttributes
    → Effect: debounced setBlockAttributes(cloneObject(attributes))
```

### Sync Effects

1. **Effect 1** (`[attributes]`): Syncs to parent via `setBlockAttributes(cloneObject(attributes))`.
   - Inside inspector: immediate.
   - Outside: debounced (`BLOCKERA_DELAY_EXPECTED_TIME`: 100ms dev, 1000ms prod).
   - Calls `handleOnChangeStyleInLocalState(cloneObject(attributes))` when outside inspector.

2. **Effect 2** (`[compatibleAttributes]`): Clears `pendingAttributes` when derived value matches.
   - Skips for inner blocks and when `!insideBlockInspector && !currentBlockStyleVariation?.name`.

---

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `name` | `string` | ✓ | Block type (e.g. `'core/paragraph'`) |
| `clientId` | `string` | ✓ | Unique block instance ID |
| `attributes` | `Object` | ✓ | Current block attributes from WordPress |
| `setAttributes` | `Function` | ✓ | WordPress callback to update attributes |
| `children` | `ReactNode` | ✓ | Block edit UI |
| `additional` | `Object` | | `activeTab`, `blockFeatures`, `availableBlockStates`, `blockeraInnerBlocks`, `edit` |
| `defaultAttributes` | `Object` | | Default attributes |
| `originDefaultAttributes` | `Object` | | Original defaults before modifications |
| `insideBlockInspector` | `boolean` | | `true` (default) when in inspector |

---

## Key Functions

### `setAttributes(value, { ref, shouldUpdateClassName })`

- Clones `value`, applies `className` logic, updates `compatibleAttributesRef`, calls `setPendingAttributes`.
- Preserves `style`, `layout`, `metadata` from value or base when missing.

### `getAttributes(key?)`

- Returns `sanitizedAttributes` (or a key from it).
- `sanitizedAttributes` is derived from `cloneObject(attributes)` — safe to pass downstream.

### `updateBlockEditorSettings(key, value)`

- `'current-block'`: `setCurrentBlock`
- `'current-state'`: `setCurrentState` or `setInnerBlockState` (for inner blocks)
- `'current-block-style-variation'`: `setCurrentBlockStyleVariation`

### `masterIsNormalState()` / `isNormalState()`

- Determine if block is in normal state at base breakpoint.
- Inner blocks use `currentInnerBlockState`; master uses `currentState`.

---

## Hooks & Dependencies

### Custom Hooks

- `useAttributes`: Attribute changes, validation, reducer, filters.
- `useInnerBlocksInfo`: Inner blocks structure.
- `useCalculateCurrentAttributes`: Attributes for current state/breakpoint.
- `useBlockFeatures`: Block features integration.
- `useBlockStyleVariations`: Style variation state.
- `useCleanupStyles`: Unused style cleanup.
- `useGlobalStylesPanelContext`: Global styles panel context.

### WordPress Stores

- `blockera/extensions`: Current block, states, breakpoint.
- `core/blocks`: Block type, variations.
- `core/block-editor`: Block attributes.
- `blockera/editor`: Device type, selected block event.

---

## Block Props Passed to Children

Children receive (via `blockProps`):

- `name`, `clientId`, `className`, `supports`
- `attributes` (sanitizedAttributes)
- `setAttributes`, `handleOnChangeAttributes`, `getAttributes`
- `defaultAttributes`, `currentAttributes`, `currentStateAttributes`
- `currentBlock`, `currentState`, `currentTab`, `currentBreakpoint`
- `blockeraInnerBlocks`, `currentInnerBlockState`
- `setCurrentTab`, `updateBlockEditorSettings`
- `additional`, `...props`

---

## Tips for AI Agents & Developers

### Do

- Clone `attributes` before passing to any consumer.
- Preserve `style`, `layout`, `metadata` in attribute flows.
- Use `isEquals` for comparisons to avoid unnecessary updates.
- Respect `insideBlockInspector` for sync behavior.
- Use `cloneObject` from `@blockera/utils` for deep clones.

### Do Not

- Mutate `attributes`, `pendingAttributes`, or `compatibleAttributes` directly.
- Pass `attributes` by reference to hooks or children without cloning.
- Strip or overwrite `style`, `layout`, `metadata` with `undefined`.
- Introduce bidirectional sync or duplicate sources of truth.
- Bypass `setAttributes` when updating block attributes.

### Edge Cases

- **Inner blocks**: Effect 2 skips; parent block manages their attributes.
- **Outside inspector**: Sync is debounced; `handleOnChangeStyleInLocalState` used for local preview.
- **Breakpoint/context change**: `pendingAttributes` cleared when `compatibleAttributes` changes.
- **`blockeraPropsId` / `metadata`**: Effect 1 skips when both absent (unless `save-customizations` / `detach-style`).

---

## Related Files

- `get-compatible-attributes.js`: Compatibility and WP core attribute preservation.
- `use-attributes/reducer.js`: `preserveWPCoreAttributes`, `blockera.blockEdit.setAttributes` filters.
- `use-attributes/helpers.js`: State helpers, `memoizedBlockStates`.
- `block-edit.js`: Parent that passes props to BlockBase.

---

## Performance

- Debounce: 100ms (dev) / 1000ms (prod) for attribute sync.
- Memoization: `args`, `compatibleAttributes`, `sanitizedAttributes`, callbacks.
- Shallow equality checks to reduce re-renders and updates.

---

## Error Handling

- Style rendering wrapped in `ErrorBoundary`.
- Fallback: `ErrorBoundaryFallback` with `BlockStyle`.
- `notice`, `isReportingErrorCompleted` for error state.
