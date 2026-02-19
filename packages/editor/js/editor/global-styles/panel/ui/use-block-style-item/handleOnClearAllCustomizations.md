# handleOnClearAllCustomizations — Cursor IDE Instructions

Instructions for the `handleOnClearAllCustomizations` callback in `use-block-style-item`. Useful for Cursor IDE (Composer) and AI-assisted editing.

## Overview

Removes all user customizations for a block style variation from WordPress global styles. The style reverts to its base/theme values. Does not delete the style variation itself — only clears the custom values stored for it.

## Parameters

| Param          | Type   | Description                                                                 |
|----------------|--------|-----------------------------------------------------------------------------|
| `currentStyle` | Object | The style variation to clear (includes name, label, icon, etc.).           |

## Flow (execution order)

1. **Remove variation from globalStyles** — `removeStyleVariationFromGlobalStyles(globalStyles, blockName, currentStyle)` returns a new global styles object with the variation removed from `blocks[blockName].variations`.
2. **Update global styles entity** — `setGlobalStyles(newGlobalStyles)`.
3. **Reset block styles cache** — `setGlobalBlockStyles(blockName, currentBlockStyleVariation?.name || 'default', {})` — clears the editor's block styles for the current variation.
4. **Close context menu** — `setIsOpenContextMenu(false)`.

## Key Invariants (DO NOT break when editing)

- Does NOT delete the style variation — only removes its custom values from globalStyles.
- Uses `removeStyleVariationFromGlobalStyles` — handles both root and non-root styles; clones globalStyles, does not mutate in place.
- `setGlobalBlockStyles` third param is `{}` — clears all customizations for that variation in the block editor store.
- Variation name for `setGlobalBlockStyles` comes from `currentBlockStyleVariation?.name || 'default'` — the currently selected variation, not necessarily `currentStyle`.

## Helpers Reference

| Helper                          | Purpose                                                                 |
|---------------------------------|-------------------------------------------------------------------------|
| `removeStyleVariationFromGlobalStyles` | Remove variation from globalStyles (clones, returns new object).   |
| `isRootStyle`                   | Detect if style is root/default (different removal logic).               |

## Related

- `handleOnDelete`: removes the style entirely (unregister, metadata, blockStyles).
- `handleOnSaveCustomizations`: saves customizations; this handler is the inverse.
- `setGlobalBlockStyles`: dispatch from `blockera/editor` store.
