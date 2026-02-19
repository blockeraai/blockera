# handleOnDuplicate — Cursor IDE Instructions

Instructions for the `handleOnDuplicate` callback in `use-block-style-item`. Useful for Cursor IDE (Composer) and AI-assisted editing.

## Overview

Creates a copy of a block style variation with a new name. The duplicate inherits all style values (base + user config) from the source style and is stored in WordPress globalStyles. Supports both auto-generated names (via `getCalculatedNewStyle`) and custom names (via `customValues`).

## Parameters

| Param           | Type   | Description                                                                 |
|-----------------|--------|-----------------------------------------------------------------------------|
| `currentStyle`  | Object | The style object to duplicate (includes name, label, icon, etc.).           |
| `customValues`  | Object | Optional. `{ label: string, name: string }` — when provided, use these instead of auto-generated. |

## Flow (execution order)

1. **Increment counter** — `counter + 1`, update `counterMap[blockName]`, `setCounter`.
2. **Resolve duplicate style object** — `customValues` if provided, else `getCalculatedNewStyle({ styles, blockStyles, currentStyle, action: 'duplicate' })`. New style always has Blockera icon.
3. **Register block style** — Use store's `getStyleVariationBlocks` (not context) so it works outside global styles panel. `getBlockTypesForStyle(blockName, storeGetStyleVariationBlocks, currentStyle.name)` → `registerBlockStyle(blockType, duplicateStyle)` for each block type.
4. **Set style variation blocks** — Use store's `setStyleVariationBlocks` via `dispatch('blockera/editor')` so it works outside panel (context may not provide it when in inspector-controls).
5. **Update UI state** — `setCurrentBlockStyleVariation`, `setCurrentActiveStyle`, `setBlockStyles([...blockStyles, duplicateStyle])`.
6. **Clone style values from merged config** — `getMergedNormalizedStyleFromSources(base, globalStyles, blockName, currentStyle, styles, defaultStyles, getNormalizedStyle)`.
7. **Store in globalStyles** — `buildBlocksUpdateForStyle(blockTypesToRegister, duplicateStyle.name, normalizedStyle)` → merge into globalStyles with `mergeBlockeraGlobalStylesMetaData` and `setGlobalStyles`.
8. **Close context menu** — `setIsOpenContextMenu(false)`.

## Key Invariants (DO NOT break when editing)

- Duplicate style MUST have `icon: { name: 'blockera', library: 'blockera' }`.
- When `customValues` is provided, apply `kebabCase(customValues.name)` for the style name.
- Style values MUST come from merged config (baseValues + userValues); baseConfig is fallback.
- Use `getBlockTypesForStyle` with `currentStyle.name` (source style) — duplicate inherits same block types as source.
- **Outside panel**: Use `select('blockera/editor').getStyleVariationBlocks` and `dispatch('blockera/editor').setStyleVariationBlocks` directly — context's getStyleVariationBlocks returns `[]` when not in GlobalStylesPanelContextProvider (e.g. inspector-controls).
- Use `mergeBlockeraGlobalStylesMetaData(metaDataUpdate)` — merges, does NOT replace existing metadata.
- `buildDuplicateStyleMetaDataUpdate` sets `enabledIn: blockTypesToRegister`, `disabledIn: []` for the new variation.
- `setGlobalStyles` must include both `blockeraMetaData` and `blocks: blocksUpdate` in the merge.

## Helpers Reference

| Helper                          | Purpose                                                                 |
|---------------------------------|-------------------------------------------------------------------------|
| `getCalculatedNewStyle`         | Auto-generate unique name/label for duplicate (e.g. "Style (Copy)").     |
| `getMergedNormalizedStyleFromSources` | Clone style values from base + user config (shared with handleOnRename). |
| `getBlockTypesForStyleFromStore` | Get block types from store (works outside panel).                       |
| `registerStyleForBlockTypes`   | Register style for each block type.                                     |
| `setStyleVariationBlocksInStore` | Set style variation blocks in store.                                  |
| `getBlockTypesForStyle`         | Get block types to register for a style.                               |
| `buildBlocksUpdateForStyle`     | Build blocks update object for globalStyles.                            |
| `buildDuplicateStyleMetaDataUpdate` | Build metadata update for new variation (blocks + variations).    |
| `getNormalizedStyle`            | Normalize style values for storage.                                     |

## Dependencies (useCallback)

`styles`, `blockStyles`, `getStyleVariationBlocks`, `setStyleVariationBlocks`.  
Note: eslint-disable for exhaustive deps — `base`, `globalStyles`, `defaultStyles`, `counter`, `counterMap`, `blockName`, etc. are used but omitted to avoid unnecessary re-creations.

## Related

- `handleOnRename`: shares merged config logic (getStyleValuesFromSources, buildBlocksUpdateForStyle).
- `handleOnDelete`: inverse operation; does not share logic with duplicate.
- `add-new-style-modal`: may call `handleOnDuplicate` with `customValues` when creating from template.
