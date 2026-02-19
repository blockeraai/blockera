# handleOnUsageForMultipleBlocks — Cursor IDE Instructions

Instructions for the `handleOnUsageForMultipleBlocks` and `handleOnSaveUsageForMultipleBlocks` callbacks in `use-block-style-item`. Useful for Cursor IDE (Composer) and AI-assisted editing.

## Overview

Manages style variation usage across multiple block types. Two handlers work together:

1. **handleOnUsageForMultipleBlocks** — Updates block styles picker UI when the selected block type is enabled/disabled for a style (add/remove style from `blockStyles` list).
2. **handleOnSaveUsageForMultipleBlocks** — Applies the "Use for Multiple Blocks" modal changes: register/unregister block styles, update style variation blocks store, update global styles and metadata.

The main save logic lives in `handleOnSaveUsageForMultipleBlocks`; `BlockTypes` (block-types.js) is the UI and delegates to it.

## handleOnUsageForMultipleBlocks

### Parameters

| Param          | Type   | Description                                                                 |
|----------------|--------|-----------------------------------------------------------------------------|
| `currentStyle` | Object | The style variation (name, label, icon, ...).                              |
| `action`       | 'add' \| 'delete' | Add style to blockStyles list or remove it.                        |

### Flow

- **add**: If style not in `blockStyles`, `setBlockStyles([...blockStyles, currentStyle])`.
- **delete**: If style in `blockStyles`, `setBlockStyles(blockStyles.filter(s => s.name !== currentStyle.name))`.

### When called

From `BlockTypes` when the selected block type (`selectedBlockStyle`) is in the enabled/disabled list — updates the style picker so it reflects the current block's style availability.

---

## handleOnSaveUsageForMultipleBlocks

### Parameters

| Param               | Type   | Description                                                                 |
|---------------------|--------|-----------------------------------------------------------------------------|
| `style`             | Object | The style variation.                                                       |
| `action`            | string | 'disable-all' \| 'enable-all' \| 'single-enable' \| 'single-disable'.     |
| `enabledIn`         | Array<string> | Block types that have the style enabled.                          |
| `disabledIn`        | Array<string> | Block types that have the style disabled.                         |
| `blockType`         | string | Block type for single-enable/disable.                                      |
| `newGlobalStyles`   | Object | Global styles object to persist.                                          |
| `validItems`        | Array<Object> | Block type items (with `.name`).                                    |
| `selectedBlockStyle`| string | Currently selected block type name.                                       |

### Flow (by action)

1. **disable-all**: Keep current block (selectedBlockStyle or blockName) enabled. `deleteStyleVariationBlocks`, `setStyleVariationBlocks` with enabledIn (block to keep), unregister only for disabledIn, `handleOnUsageForMultipleBlocks(style, 'delete')` for each disabled block that matches selected, `setGlobalStyles`.
2. **enable-all**: When limit applies, cap to `maxSelectableBlocks` (add up to `remainingBlocks`). `setStyleVariationBlocks` with enabled blocks, register for each, `handleOnUsageForMultipleBlocks(style, 'add')` if selected block matches, `setGlobalStyles`.
3. **single-enable**: `setStyleVariationBlocks(style.name, enabledIn, 'manual')`, optionally `deleteStyleVariationBlocks` for disabled, register for each in enabledIn, `handleOnUsageForMultipleBlocks` when selected block in enabledIn, `setGlobalStyles`.
4. **single-disable**: `deleteStyleVariationBlocks(style.name, true, blockType)`, optionally `setStyleVariationBlocks` for remaining enabled, unregister for each in disabledIn, `handleOnUsageForMultipleBlocks` when selected block in disabledIn, `setGlobalStyles`.

### Key invariants

- Call `setBlockeraGlobalStylesMetaData(newGlobalStyles.blockeraMetaData)` before `setGlobalStyles`.
- For each block in `enabledIn`: `registerBlockStyle(block, style)`.
- For each block in `disabledIn`: `unregisterBlockStyle(block, style.name)`.
- When `selectedBlockStyle` is in enabled list: `handleOnUsageForMultipleBlocks(style, 'add')`.
- When `selectedBlockStyle` is in disabled list: `handleOnUsageForMultipleBlocks(style, 'delete')`.

---

## Related

- `BlockTypes` (block-types.js): UI for toggling block types; calls `handleOnSaveUsageForMultipleBlocks` on Save.
- `setGlobalData` in block-types: Computes `enabledIn`, `disabledIn`, `newGlobalStyles` from user toggles.
- `UsageForMultipleBlocksModal`, `SearchBlockTypes`: Modal and search UI that pass handlers to BlockTypes.
