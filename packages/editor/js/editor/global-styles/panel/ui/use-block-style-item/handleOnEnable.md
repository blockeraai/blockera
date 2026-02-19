# handleOnEnable — Cursor IDE Instructions

Instructions for the `handleOnEnable` callback in `use-block-style-item`. Useful for Cursor IDE (Composer) and AI-assisted editing.

## Overview

Enables or disables a block style variation. When disabled, the style is hidden from the block style picker and blocks using it revert to default. The `status` flag is stored in blockera metadata and used for rendering (e.g. filtering styles in `getRenderedStyles`).

## Parameters

| Param          | Type    | Description                                                                 |
|----------------|---------|-----------------------------------------------------------------------------|
| `status`       | boolean | `true` = enable, `false` = disable.                                       |
| `currentStyle` | Object  | The style variation to enable/disable (includes name, label, icon, etc.).  |

## Flow (execution order)

1. **Build variation data** — If metadata already has this variation with data, use `{ status }` only. Otherwise include full `currentStyle` plus `status` to avoid incomplete metadata.
2. **Update blockera metadata** — `updateBlockeraGlobalStylesMetaData(blockName, currentStyle.name, variationData)`.
3. **Update global styles entity** — `setGlobalStyles({ ...globalStyles, blockeraMetaData: updatedMetaData })`.
4. **Update cached style** — `setCachedStyle({ ...cachedStyle, status })`.
5. **When disabling** (`status === false`):
   - `setCurrentBlockStyleVariation(undefined)`.
   - If outside global styles panel: `setCurrentActiveStyle(getDefaultStyle(blockStyles))`, `handleOnChangeAttributes('className', '', { ... })` to clear className on selected block.

## Key Invariants (DO NOT break when editing)

- Use `updateBlockeraGlobalStylesMetaData` — merges, does NOT replace other variation fields.
- When variation exists in metadata: only update `status` to avoid overwriting enabledIn, disabledIn, etc.
- When variation is new in metadata: include `...currentStyle` plus `status` so we store a complete entry.
- Disable-side effects (step 5) run only when `status === false`.
- Outside panel: clearing className uses `ref.current.action: 'disable-style'` for `handleOnChangeAttributes`.

## Related

- `handleOnDelete`: removes the style entirely; handleOnEnable only toggles visibility.
- `cachedStyle`: UI state for style item; `status` controls whether it appears enabled in the picker.
- `getRenderedStyles`: filters styles by metadata `status` for display.
