# handleOnDelete — Cursor IDE Instructions

Instructions for the `handleOnDelete` callback in `use-block-style-item`. Useful for Cursor IDE (Composer) and AI-assisted editing.

## Overview

Permanently deletes a block style variation. Removes it from global styles, block registration, metadata, and the block styles picker. For Blockera-created styles: removes from metadata entirely. For block/theme/core styles: marks `isDeleted: true` in metadata for rendering requirements.

## Parameters

| Param             | Type   | Description                                                                 |
|-------------------|--------|-----------------------------------------------------------------------------|
| `currentStyleName`| string | The style variation name to delete (e.g. from `style.name`).               |

## Flow (execution order)

1. **Resolve currentStyle** — `blockStyles.find(s => s.name === currentStyleName)`; fallback to `style` prop when not found.
2. **Mark as deleted in metadata** — `markStyleAsDeletedInMetaData(blockeraMetaData, blockName, currentStyleName, currentStyle \|\| style, base)`.
3. **Update global styles** — `mergeObject(globalStyles, { blocks: { [blockName]: { variations: { [currentStyleName]: undefined } } }, blockeraMetaData }, { forceUpdated: [currentStyleName], deletedProps: [currentStyleName] })`.
4. **Update block styles list** — `setBlockStyles(blockStyles.filter(s => s.name !== currentStyleName))`.
5. **Unregister block style** — `unregisterBlockStyle(blockName, currentStyleName)`.
6. **Update panel styles** — `setStyles({ ...styles, variations: { ...filtered } })` — remove variation from styles.variations.
7. **Delete style variation blocks** — `deleteStyleVariationBlocks(currentStyleName, true, blockName)`.
8. **Decrement counter** — `counter - 1`, update `counterMap[blockName]`, `setCounter`.
9. **Update selection** — `setCurrentBlockStyleVariation(undefined)`.
10. **Outside panel** — `setCurrentActiveStyle(defaultStyle, 'click')`, `onSelectStylePreview(defaultStyle)`, `handleOnChangeAttributes('className', '', { ref: { current: { action: 'delete-style' } } })`.

## Key Invariants (DO NOT break when editing)

- Use `markStyleAsDeletedInMetaData` — shared with handleOnRename; Blockera-created: remove entirely; block/theme/core: set `isDeleted: true`.
- `mergeObject` with `forceUpdated` and `deletedProps` — required to remove the variation key from globalStyles.blocks[blockName].variations.
- `setBlockeraGlobalStylesMetaData` before `setGlobalStyles` — metadata must be updated first.
- `deleteStyleVariationBlocks(currentStyleName, true, blockName)` — removes blockName from style's block list in store.
- Outside panel: use `ref.current.action: 'delete-style'` for `handleOnChangeAttributes`.

## Helpers Reference

| Helper                          | Purpose                                                                 |
|---------------------------------|-------------------------------------------------------------------------|
| `markStyleAsDeletedInMetaData`  | Mark style as deleted (remove or isDeleted) per origin.                 |
| `isBlockeraCreatedStyle`        | Detect Blockera-created vs block/theme/core.                            |
| `getDefaultStyle`               | Get default style from block styles list.                               |
| `mergeObject` (forceUpdated, deletedProps) | Remove nested keys from globalStyles.                         |

## Related

- `handleOnRename`: uses same metadata pattern when confirming; marks old style as deleted.
- `handleOnEnable`: only toggles visibility; handleOnDelete removes entirely.
- `handleOnClearAllCustomizations`: clears values; handleOnDelete removes the style.
- `delete-modal`: calls `handleOnDelete(style.name)`.
