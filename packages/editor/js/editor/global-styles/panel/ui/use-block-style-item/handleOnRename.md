# handleOnRename — Cursor IDE Instructions

Instructions for the `handleOnRename` callback in `use-block-style-item`. Useful for Cursor IDE (Composer) and AI-assisted editing.

## Overview

This callback supports a two-phase rename flow:

1. **Pre-confirmation** (`isConfirmedChangeID === false`): User edits label/name in UI.
   - Only metadata (label, name, refId, hasNewID) is updated via `updateBlockeraGlobalStylesMetaData`.
   - Global styles and block registration are NOT changed yet.

2. **Post-confirmation** (`isConfirmedChangeID === true`): User confirmed the name change.
   - **All rules below apply only when `isConfirmedChangeID === true`.**

---

## RULES (when `isConfirmedChangeID === true`)

### Rule 1: Merged config clone and globalStyles storage

When renaming a block style variation — regardless of origin (wp core theme.json, theme.json, blocks, or Blockera plugin UI):

1. **Create a clone of the main `currentStyle` from merged config**:
   - Use `getMergedNormalizedStyleFromSources(base, globalStyles, blockName, currentStyle, styles, defaultStyles, getNormalizedStyle)`.
   - This returns merged/normalized style values (baseConfig + userConfig, baseConfig as fallback).

2. **Store the new style in WordPress globalStyles**:
   - Use store's `getStyleVariationBlocks` (not context) so it works outside panel and for styles in multiple blocks.
   - Use `buildBlocksUpdateForStyle(blockTypesToRegister, editedStyle.name, normalizedStyle)` to build the blocks update.
   - Merge into `globalStyles` so the new variation key (`editedStyle.name`) contains the cloned style values.

3. **Remove any values for the previous (main) style from globalStyles**:
   - Remove `globalStyles.blocks[blockName].variations[currentStyle.name]` entirely.
   - Use `mergeObject(globalStyles, { blocks: { [blockName]: { variations: { [currentStyle.name]: undefined } } } }, { forceUpdated: [currentStyle.name], deletedProps: [currentStyle.name] })` — same pattern as `handleOnDelete` — to ensure the old variation is deleted from the global styles object.

4. **Mark the previous style as deleted in global styles metadata**:
   - Follow the same logic as `handleOnDelete` for metadata:
     - If **Blockera-created** (`isBlockeraCreatedStyle`): remove the variation from `blockeraMetaData.blocks[blockName].variations` entirely (and from `blockeraMetaData.variations` if present).
     - If **from block/theme/core**: set `blockeraMetaData.blocks[blockName].variations[currentStyle.name].isDeleted = true` (or create the entry with `isDeleted: true` if it doesn't exist).
   - This is required for future rendering requirements (e.g. to know the old style was "deleted" and should not be rendered).

### Rule 2: Extract duplicate logic into standalone helpers

If you detect duplicate code between `handleOnRename` and other handlers (`handleOnDelete`, `handleOnDuplicate`, etc.):

- Create a standalone helper in `./helpers.js` (or a dedicated module).
- Use that helper inside all relevant handlers.
- Examples of shared logic that may need extraction:
  - Marking a style as deleted in metadata (Blockera vs block/theme/core).
  - Removing a variation from globalStyles with `mergeObject` + `forceUpdated`/`deletedProps`.
  - Building merged style values from base + user config.
  - Building blockera metadata updates for variation add/remove/rename.

---

## Parameters

| Param          | Type   | Description                                                                 |
|----------------|--------|-----------------------------------------------------------------------------|
| `newValue`     | Object | `{ label: string, name: string }` from the rename UI input.                 |
| `currentStyle` | Object | The style object being renamed (includes name, label, icon, etc.).          |

---

## Key Invariants (DO NOT break when editing)

- When `isConfirmedChangeID` is true: name MUST be kebab-cased via `kebabCase(newValue.name)`.
- Preserve `status`, `enabledIn`, `disabledIn` from existing variation when merging (`editedStyle` may lack these; omit them before merge to avoid overwriting).
- `globalStyles.blocks[blockName].variations`: remove old key (`currentStyle.name`), add new key (`editedStyle.name`) with cloned merged style values.
- `blockeraMetaData.blocks[blockName].variations`: mark old style as deleted (see Rule 1.4); add new variation with merged metadata.
- Unregister/register for **all** block types: `blockTypesToRegister.forEach(blockType => { unregisterBlockStyle(blockType, ...); registerBlockStyle(blockType, ...); })`.
- Update style variation blocks via store: clear old with `setStyleVariationBlocks(currentStyle.name, [], 'manual')`, add new with `setStyleVariationBlocks(editedStyle.name, blockTypesToRegister, 'manual')`.

---

## Helpers Reference

| Helper                         | Purpose                                                                 |
|--------------------------------|-------------------------------------------------------------------------|
| `getMergedNormalizedStyleFromSources` | Clone style values from base + user config (shared with handleOnDuplicate). |
| `getBlockTypesForStyleFromStore` | Get block types from store (works outside panel).                       |
| `registerStyleForBlockTypes`   | Register style for each block type.                                     |
| `unregisterStyleFromBlockTypes` | Unregister style from each block type.                                 |
| `setStyleVariationBlocksInStore` | Set style variation blocks in store.                                  |
| `clearStyleVariationBlocksInStore` | Clear style variation blocks in store.                               |
| `buildBlocksUpdateForStyle`    | Build blocks update object for globalStyles.                            |
| `getBlockTypesForStyle`        | Get block types to register for a style.                                |
| `getNormalizedStyle`           | Normalize style values for storage.                                     |
| `isBlockeraCreatedStyle`       | Detect if style is Blockera-created vs block/theme/core.                |
| `removeStyleVariationFromGlobalStyles` | Remove variation from globalStyles (alternative to mergeObject). |
| `mergeObject` (with `forceUpdated`, `deletedProps`) | Remove keys from nested objects (used in handleOnDelete).   |

---

## Dependencies (useCallback)

`blockName`, `blockStyles`, `globalStyles`, `setBlockStyles`, `setGlobalStyles`, `isConfirmedChangeID`, `deleteStyleVariationBlocks`, `setBlockeraGlobalStylesMetaData`, `getBlockeraGlobalStylesMetaData`, `updateBlockeraGlobalStylesMetaData`, `base`, `styles`, `defaultStyles`.

---

## Related

- `setIsConfirmedChangeID`: caller must set `true` when user confirms rename (e.g. modal "Apply").
- `getVariationUpdate()`: returns `{ label, name, refId, hasNewID }` — do not add extra fields here.
- `handleOnDelete`: reference for marking style as deleted and removing from globalStyles.
- `handleOnDuplicate`: reference for merged config (baseValues + userValues) and `buildBlocksUpdateForStyle`.
