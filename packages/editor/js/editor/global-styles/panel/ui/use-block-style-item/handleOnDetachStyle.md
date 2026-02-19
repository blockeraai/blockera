# handleOnDetachStyle — Cursor IDE Instructions

Instructions for the `handleOnDetachStyle` callback in `use-block-style-item`. Useful for Cursor IDE (Composer) and AI-assisted editing.

## Overview

Detaches the selected block from its style variation. Instead of applying the style via `is-style-{name}` className, the block receives all style values as inline attributes and a unique `blockera-block` class. The block becomes independent of the style variation and retains its current appearance.

## Parameters

| Param          | Type   | Description                                                                 |
|----------------|--------|-----------------------------------------------------------------------------|
| `currentStyle` | Object | The style variation to detach from (name, label, icon, ...).               |

## Flow (execution order)

1. **Set active style to default** — `setCurrentActiveStyle(getDefaultStyle(blockStyles), 'detach')`.
2. **Get selected block** — `select(blockEditorStore).getSelectedBlock()`.
3. **Generate unique className** — `generateUniqueClassName(selectedBlock.clientId, selectedBlock?.attributes?.className || '')`.
4. **Get style values** — `getStyleValuesFromSources(base, globalStyles, blockName, currentStyle)` → `baseValues`, `userValues`.
5. **Merge attributes** — `mergeObject(mergeObject(selectedBlock.attributes, baseValues), userValues)` — block gets base + user style values as inline attributes.
6. **Omit rich-text/source attributes** — `getIgnoredAttributesForSchema(getBlockType(blockName)?.attributes)` returns attributes to omit; `omit(mergedAttributes, ignoredAttributes)` prevents critical errors for rich-text and source attributes in WordPress blocks.
7. **Set editor event** — `setEditorSelectedBlockEvent('detach-style')`.
8. **Update block** — `handleOnChangeAttributes('className', 'blockera-block ' + className, { effectiveItems: getAttributesWithIds(newAttributes, 'blockeraPropsId', true) })`.

## Key Invariants (DO NOT break when editing)

- New className format: `blockera-block ${className}` — replaces `is-style-{name}` with unique block class.
- `effectiveItems` = `getAttributesWithIds(newAttributes, 'blockeraPropsId', true)` — passes merged attributes with blockera IDs for attribute application.
- Merge order: `selectedBlock.attributes` + `baseValues` + `userValues` — userValues overrides baseValues overrides block attributes.
- Does NOT modify global styles — only the selected block's attributes and className.
- Omit rich-text and source attributes via `getIgnoredAttributesForSchema` — prevents critical errors when applying attributes cross-block (shared with block-settings Edit component).

## Helpers Reference

| Helper                      | Purpose                                                                 |
|-----------------------------|-------------------------------------------------------------------------|
| `getStyleValuesFromSources` | Get baseValues and userValues for a style from base + user config.     |
| `getIgnoredAttributesForSchema` | Get rich-text/source attributes to omit (shared with block-settings). |
| `getDefaultStyle`           | Get default style from block styles list.                               |
| `generateUniqueClassName`   | Generate unique class for block (avoids conflicts).                    |
| `getAttributesWithIds`      | Extract attributes with blockeraPropsId for effectiveItems.           |

## Related

- `handleOnSaveCustomizations`: inverse — attaches block attributes to style; detach makes block independent.
- `handleOnClearAllCustomizations`: clears style values; detach moves values onto the block.
