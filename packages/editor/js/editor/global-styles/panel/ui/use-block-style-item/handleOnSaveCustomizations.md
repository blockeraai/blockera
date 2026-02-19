# handleOnSaveCustomizations — Cursor IDE Instructions

Instructions for the `handleOnSaveCustomizations` callback in `use-block-style-item`. Useful for Cursor IDE (Composer) and AI-assisted editing.

## Overview

Saves the selected block's current attributes as the global style for the given style variation. Reads blockera attributes from the selected block, normalizes them, applies WP compatibility filters, merges into global styles, updates the block editor store, and persists dirty entities to the database.

## Parameters

| Param           | Type   | Description                                                                 |
|-----------------|--------|-----------------------------------------------------------------------------|
| `currentStyle`  | Object | The style variation to save into (name, label, icon, ...).                  |
| `_defaultStyles`| Object | Default styles for normalization (typically `defaultStyles` from hook).     |

## Flow (execution order)

1. **Get selected block** — `select(blockEditorStore).getSelectedBlock()`.
2. **Extract blockera attributes** — Filter `selectedBlock.attributes` to keep only keys starting with `blockera`; omit the rest.
3. **Normalize** — `getNormalizedStyle(styleAttributes, _defaultStyles)`.
4. **WP compatibility** — `blockeraExtensionsBootstrap()`.
5. **Apply filters** — For each key in `currentStyleValue`, run `applyFilters('blockera.blockEdit.setAttributes', ...)` with block context (clientId, innerBlocks, currentBlock, blockVariations, defaultAttributes, currentState, currentBreakpoint, etc.).
6. **Early exit** — If `Object.keys(currentStyleValue).length === 0`, return (no changesets).
7. **Merge into globalStyles** — Root style: `blocks[blockName]`; non-root: `blocks[blockName].variations[currentStyle.name]`.
8. **Update global styles entity** — `setGlobalStyles(_globalStyles)`.
9. **Update block editor store** — `setGlobalBlockStyles(blockName, currentBlockStyleVariation?.name || 'default', currentStyleValue)`.
10. **Set editor event** — `setEditorSelectedBlockEvent('save-customizations')`.
11. **Update block className** — `handleOnChangeAttributes('className', 'is-style-' + currentStyle.name, { effectiveItems: defaultValue, ref: { current: { action: 'save-customizations' } } })`.
12. **Update active style** — `setCurrentActiveStyle(currentStyle, 'save-customizations')`.
13. **Persist** — `setTimeout(() => saveAllDirtyEntities(), 1000)` — saves global styles, post, etc. to database.

## Key Invariants (DO NOT break when editing)

- Only include attributes starting with `blockera` — non-blockera attributes are ignored.
- Use `isRootStyle(currentStyle)` to choose merge path — root: `blocks[blockName]`; non-root: `blocks[blockName].variations[currentStyle.name]`.
- `handleOnChangeAttributes` uses `ref.current.action: 'save-customizations'` — used by attribute hooks to identify the action.
- `effectiveItems` = `prepareBlockeraDefaultAttributesValues(_defaultStyles)` — passed to handleOnChangeAttributes.
- `saveAllDirtyEntities` runs after 1s delay — allows React/WordPress to flush state before persist.
- `saveAllDirtyEntities` uses `saveEditedEntityRecord` for dirty entities and `savePost` for the post.

## Helpers Reference

| Helper                          | Purpose                                                                 |
|---------------------------------|-------------------------------------------------------------------------|
| `getNormalizedStyle`            | Normalize attributes for storage.                                       |
| `isRootStyle`                   | Detect root vs variation (different merge path).                         |
| `prepareBlockeraDefaultAttributesValues` | Prepare default values for effectiveItems.                    |
| `blockeraExtensionsBootstrap`   | Run WP compatibility setup.                                             |
| `applyFilters('blockera.blockEdit.setAttributes', ...)` | WP filter for attribute transformation.              |

## Related

- `handleOnClearAllCustomizations`: inverse — removes customizations; this handler adds/saves them.
- `handleOnDetachStyle`: detaches block from style; this handler attaches block attributes to style.
- `saveAllDirtyEntities`: persists dirty entities (global styles, post) to database.
