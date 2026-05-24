# use-block-style-item — Cursor IDE Instructions

Merged instructions for all handler callbacks in `use-block-style-item`. Useful for Cursor IDE (Composer) and AI-assisted editing.

---

## Table of Contents

1. [handleOnClearAllCustomizations](#handleonclearallcustomizations)
2. [handleOnDelete](#handleondelete)
3. [handleOnDetachStyle](#handleondetachstyle)
4. [handleOnDuplicate](#handleonduplicate)
5. [handleOnEnable](#handleonenable)
6. [handleOnRename](#handleonrename)
7. [handleOnSaveCustomizations](#handleonsavecustomizations)
8. [handleOnUsageForMultipleBlocks](#handleonusageformultipleblocks)

---

## handleOnClearAllCustomizations

### Overview

Removes all user customizations for a block style variation from WordPress global styles. The style reverts to its base/theme values. Does not delete the style variation itself — only clears the custom values stored for it.

### Parameters

| Param          | Type   | Description                                                                 |
|----------------|--------|-----------------------------------------------------------------------------|
| `currentStyle` | Object | The style variation to clear (includes name, label, icon, etc.).           |

### Flow (execution order)

1. **Remove variation from globalStyles** — `removeStyleVariationFromGlobalStyles(globalStyles, blockName, currentStyle)` returns a new global styles object with the variation removed from `blocks[blockName].variations`.
2. **Update global styles entity** — `setGlobalStyles(newGlobalStyles)`.
3. **Reset block styles cache** — `setGlobalBlockStyles(blockName, currentBlockStyleVariation?.name || 'default', {})` — clears the editor's block styles for the current variation.
4. **Close context menu** — `setIsOpenContextMenu(false)`.

### Key Invariants (DO NOT break when editing)

- Does NOT delete the style variation — only removes its custom values from globalStyles.
- Uses `removeStyleVariationFromGlobalStyles` — handles both root and non-root styles; clones globalStyles, does not mutate in place.
- `setGlobalBlockStyles` third param is `{}` — clears all customizations for that variation in the block editor store.
- Variation name for `setGlobalBlockStyles` comes from `currentBlockStyleVariation?.name || 'default'` — the currently selected variation, not necessarily `currentStyle`.

### Helpers Reference

| Helper                          | Purpose                                                                 |
|---------------------------------|-------------------------------------------------------------------------|
| `removeStyleVariationFromGlobalStyles` | Remove variation from globalStyles (clones, returns new object).   |
| `isRootStyle`                   | Detect if style is root/default (different removal logic).               |

### Related

- `handleOnDelete`: removes the style entirely (unregister, metadata, blockStyles).
- `handleOnSaveCustomizations`: saves customizations; this handler is the inverse.
- `setGlobalBlockStyles`: dispatch from `blockera/editor` store.

---

## handleOnDelete

### Overview

Permanently deletes a block style variation. Removes it from global styles, block registration, metadata, and the block styles picker. For Blockera-created styles: removes from metadata entirely. For block/theme/core styles: marks `isDeleted: true` in metadata for rendering requirements.

### Parameters

| Param             | Type   | Description                                                                 |
|-------------------|--------|-----------------------------------------------------------------------------|
| `currentStyleName`| string | The style variation name to delete (e.g. from `style.name`).               |

### Flow (execution order)

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

### Key Invariants (DO NOT break when editing)

- Use `markStyleAsDeletedInMetaData` — shared with handleOnRename; Blockera-created: remove entirely; block/theme/core: set `isDeleted: true`.
- `mergeObject` with `forceUpdated` and `deletedProps` — required to remove the variation key from globalStyles.blocks[blockName].variations.
- `setBlockeraGlobalStylesMetaData` before `setGlobalStyles` — metadata must be updated first.
- `deleteStyleVariationBlocks(currentStyleName, true, blockName)` — removes blockName from style's block list in store.
- Outside panel: use `ref.current.action: 'delete-style'` for `handleOnChangeAttributes`.

### Helpers Reference

| Helper                          | Purpose                                                                 |
|---------------------------------|-------------------------------------------------------------------------|
| `markStyleAsDeletedInMetaData`  | Mark style as deleted (remove or isDeleted) per origin.                 |
| `isBlockeraCreatedStyle`        | Detect Blockera-created vs block/theme/core.                            |
| `getDefaultStyle`               | Get default style from block styles list.                               |
| `mergeObject` (forceUpdated, deletedProps) | Remove nested keys from globalStyles.                         |

### Related

- `handleOnRename`: uses same metadata pattern when confirming; marks old style as deleted.
- `handleOnEnable`: only toggles visibility; handleOnDelete removes entirely.
- `handleOnClearAllCustomizations`: clears values; handleOnDelete removes the style.
- `delete-modal`: calls `handleOnDelete(style.name)`.

---

## handleOnDetachStyle

### Overview

Detaches the selected block from its style variation. Instead of applying the style via `is-style-{name}` className, the block receives all style values as inline attributes and a unique `blockera-block` class. The block becomes independent of the style variation and retains its current appearance.

### Parameters

| Param          | Type   | Description                                                                 |
|----------------|--------|-----------------------------------------------------------------------------|
| `currentStyle` | Object | The style variation to detach from (name, label, icon, ...).               |

### Flow (execution order)

1. **Set active style to default** — `setCurrentActiveStyle(getDefaultStyle(blockStyles), 'detach')`.
2. **Get selected block** — `select(blockEditorStore).getSelectedBlock()`.
3. **Generate unique className** — `generateUniqueClassName(selectedBlock.clientId, selectedBlock?.attributes?.className || '')`.
4. **Get style values** — `getStyleValuesFromSources(base, globalStyles, blockName, currentStyle)` → `baseValues`, `userValues`.
5. **Merge attributes** — `mergeObject(mergeObject(selectedBlock.attributes, baseValues), userValues)` — block gets base + user style values as inline attributes.
6. **Omit rich-text/source attributes** — `getIgnoredAttributesForSchema(getBlockType(blockName)?.attributes)` returns attributes to omit; `omit(mergedAttributes, ignoredAttributes)` prevents critical errors for rich-text and source attributes in WordPress blocks.
7. **Set editor event** — `setEditorSelectedBlockEvent('detach-style')`.
8. **Update block** — `handleOnChangeAttributes('className', 'blockera-block ' + className, { effectiveItems: getAttributesWithIds(newAttributes, 'blockeraPropsId', true) })`.

### Key Invariants (DO NOT break when editing)

- New className format: `blockera-block ${className}` — replaces `is-style-{name}` with unique block class.
- `effectiveItems` = `getAttributesWithIds(newAttributes, 'blockeraPropsId', true)` — passes merged attributes with blockera IDs for attribute application.
- Merge order: `selectedBlock.attributes` + `baseValues` + `userValues` — userValues overrides baseValues overrides block attributes.
- Does NOT modify global styles — only the selected block's attributes and className.
- Omit rich-text and source attributes via `getIgnoredAttributesForSchema` — prevents critical errors when applying attributes cross-block (shared with block-settings Edit component).

### Helpers Reference

| Helper                      | Purpose                                                                 |
|-----------------------------|-------------------------------------------------------------------------|
| `getStyleValuesFromSources` | Get baseValues and userValues for a style from base + user config.     |
| `getIgnoredAttributesForSchema` | Get rich-text/source attributes to omit (shared with block-settings). |
| `getDefaultStyle`           | Get default style from block styles list.                               |
| `generateUniqueClassName`   | Generate unique class for block (avoids conflicts).                    |
| `getAttributesWithIds`      | Extract attributes with blockeraPropsId for effectiveItems.           |

### Related

- `handleOnSaveCustomizations`: inverse — attaches block attributes to style; detach makes block independent.
- `handleOnClearAllCustomizations`: clears style values; detach moves values onto the block.

---

## handleOnDuplicate

### Overview

Creates a copy of a block style variation with a new name. The duplicate inherits all style values (base + user config) from the source style and is stored in WordPress globalStyles. Supports both auto-generated names (via `getCalculatedNewStyle`) and custom names (via `customValues`).

### Parameters

| Param           | Type   | Description                                                                 |
|-----------------|--------|-----------------------------------------------------------------------------|
| `currentStyle`  | Object | The style object to duplicate (includes name, label, icon, etc.).           |
| `customValues`  | Object | Optional. `{ label: string, name: string }` — when provided, use these instead of auto-generated. |

### Flow (execution order)

1. **Increment counter** — `counter + 1`, update `counterMap[blockName]`, `setCounter`.
2. **Resolve duplicate style object** — `customValues` if provided, else `getCalculatedNewStyle({ styles, blockStyles, currentStyle, action: 'duplicate' })`. New style always has Blockera icon.
3. **Register block style** — Use store's `getStyleVariationBlocks` (not context) so it works outside global styles panel. `getBlockTypesForStyle(blockName, storeGetStyleVariationBlocks, currentStyle.name)` → `registerBlockStyle(blockType, duplicateStyle)` for each block type.
4. **Set style variation blocks** — Use store's `setStyleVariationBlocks` via `dispatch('blockera/editor')` so it works outside panel (context may not provide it when in inspector-controls).
5. **Update UI state** — `setCurrentBlockStyleVariation`, `setCurrentActiveStyle`, `setBlockStyles([...blockStyles, duplicateStyle])`.
6. **Clone style values from merged config** — `getMergedNormalizedStyleFromSources(base, globalStyles, blockName, currentStyle, styles, defaultStyles, getNormalizedStyle)`.
7. **Store in globalStyles** — `buildBlocksUpdateForStyle(blockTypesToRegister, duplicateStyle.name, normalizedStyle)` → merge into globalStyles with `mergeBlockeraGlobalStylesMetaData` and `setGlobalStyles`.
8. **Close context menu** — `setIsOpenContextMenu(false)`.

### Key Invariants (DO NOT break when editing)

- Duplicate style MUST have `icon: { name: 'blockera', library: 'blockera' }`.
- When `customValues` is provided, apply `kebabCase(customValues.name)` for the style name.
- Style values MUST come from merged config (baseValues + userValues); baseConfig is fallback.
- Use `getBlockTypesForStyle` with `currentStyle.name` (source style) — duplicate inherits same block types as source.
- **Outside panel**: Use `select('blockera/editor').getStyleVariationBlocks` and `dispatch('blockera/editor').setStyleVariationBlocks` directly — context's getStyleVariationBlocks returns `[]` when not in GlobalStylesPanelContextProvider (e.g. inspector-controls).
- Use `mergeBlockeraGlobalStylesMetaData(metaDataUpdate)` — merges, does NOT replace existing metadata.
- `buildDuplicateStyleMetaDataUpdate` sets `enabledIn: blockTypesToRegister`, `disabledIn: []` for the new variation.
- `setGlobalStyles` must include both `blockeraMetaData` and `blocks: blocksUpdate` in the merge.

### Helpers Reference

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

### Dependencies (useCallback)

`styles`, `blockStyles`, `getStyleVariationBlocks`, `setStyleVariationBlocks`.  
Note: eslint-disable for exhaustive deps — `base`, `globalStyles`, `defaultStyles`, `counter`, `counterMap`, `blockName`, etc. are used but omitted to avoid unnecessary re-creations.

### Related

- `handleOnRename`: shares merged config logic (getStyleValuesFromSources, buildBlocksUpdateForStyle).
- `handleOnDelete`: inverse operation; does not share logic with duplicate.
- `add-new-style-modal`: may call `handleOnDuplicate` with `customValues` when creating from template.

---

## handleOnEnable

### Overview

Enables or disables a block style variation. When disabled, the style is hidden from the block style picker and blocks using it revert to default. The `status` flag is stored in blockera metadata and used for rendering (e.g. filtering styles in `getRenderedStyles`).

### Parameters

| Param          | Type    | Description                                                                 |
|----------------|---------|-----------------------------------------------------------------------------|
| `status`       | boolean | `true` = enable, `false` = disable.                                       |
| `currentStyle` | Object  | The style variation to enable/disable (includes name, label, icon, etc.).  |

### Flow (execution order)

1. **Build variation data** — If metadata already has this variation with data, use `{ status }` only. Otherwise include full `currentStyle` plus `status` to avoid incomplete metadata.
2. **Update blockera metadata** — `updateBlockeraGlobalStylesMetaData(blockName, currentStyle.name, variationData)`.
3. **Update global styles entity** — `setGlobalStyles({ ...globalStyles, blockeraMetaData: updatedMetaData })`.
4. **Update cached style** — `setCachedStyle({ ...cachedStyle, status })`.
5. **When disabling** (`status === false`):
   - `setCurrentBlockStyleVariation(undefined)`.
   - If outside global styles panel: `setCurrentActiveStyle(getDefaultStyle(blockStyles))`, `handleOnChangeAttributes('className', '', { ... })` to clear className on selected block.

### Key Invariants (DO NOT break when editing)

- Use `updateBlockeraGlobalStylesMetaData` — merges, does NOT replace other variation fields.
- When variation exists in metadata: only update `status` to avoid overwriting enabledIn, disabledIn, etc.
- When variation is new in metadata: include `...currentStyle` plus `status` so we store a complete entry.
- Disable-side effects (step 5) run only when `status === false`.
- Outside panel: clearing className uses `ref.current.action: 'disable-style'` for `handleOnChangeAttributes`.

### Related

- `handleOnDelete`: removes the style entirely; handleOnEnable only toggles visibility.
- `cachedStyle`: UI state for style item; `status` controls whether it appears enabled in the picker.
- `getRenderedStyles`: filters styles by metadata `status` for display.

---

## handleOnRename

### Overview

This callback supports a two-phase rename flow:

1. **Pre-confirmation** (`isConfirmedChangeID === false`): User edits label/name in UI.
   - Only metadata (label, name, refId, hasNewID) is updated via `updateBlockeraGlobalStylesMetaData`.
   - Global styles and block registration are NOT changed yet.

2. **Post-confirmation** (`isConfirmedChangeID === true`): User confirmed the name change.
   - **All rules below apply only when `isConfirmedChangeID === true`.**

### RULES (when `isConfirmedChangeID === true`)

#### Rule 1: Merged config clone and globalStyles storage

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
   - Use `markStyleAsDeletedInMetaData(blockeraMetaData, blockName, currentStyle.name, currentStyle, base)`.
   - Follows same logic as `handleOnDelete`:
     - If **Blockera-created** (`isBlockeraCreatedStyle`): remove the variation from `blockeraMetaData.blocks[blockName].variations` entirely (and from `blockeraMetaData.variations` if present).
     - If **from block/theme/core**: set `blockeraMetaData.blocks[blockName].variations[currentStyle.name].isDeleted = true` (or create the entry with `isDeleted: true` if it doesn't exist).
   - This is required for future rendering requirements (e.g. to know the old style was "deleted" and should not be rendered).

5. **Assign old style's metadata to new style**:
   - Use `buildMetadataTransferForRenamedStyle(blockeraMetaData, blockName, currentStyle.name, editedStyle.name, blockTypesToRegister, mergedVariation)`.
   - Copies all blockera metadata for the old style to the new style name:
     - **blocks**: For each block in `blockTypesToRegister`, copy `blocks[blockType].variations[oldStyleName]` → `variations[newStyleName]` (primary block uses `mergedVariation`; other blocks use old data with `name`/`label` updated).
     - **variations**: Copy `variations[oldStyleName]` (enabledIn, disabledIn for "Share with other blocks") → `variations[newStyleName]` with `name`/`label` updated.
   - Merge the transfer result into `metaDataWithDeleted` to produce final `updatedMetaData`.
   - Ensures "Share with other blocks" settings (enabledIn, disabledIn) and per-block variation data (status, index) are preserved after rename.

#### Rule 2: Extract duplicate logic into standalone helpers

If you detect duplicate code between `handleOnRename` and other handlers (`handleOnDelete`, `handleOnDuplicate`, etc.):

- Create a standalone helper in `./helpers.js` (or a dedicated module).
- Use that helper inside all relevant handlers.
- Examples of shared logic that may need extraction:
  - Marking a style as deleted in metadata (Blockera vs block/theme/core).
  - Removing a variation from globalStyles with `mergeObject` + `forceUpdated`/`deletedProps`.
  - Building merged style values from base + user config.
  - Building blockera metadata updates for variation add/remove/rename.

### Parameters

| Param          | Type   | Description                                                                 |
|----------------|--------|-----------------------------------------------------------------------------|
| `newValue`     | Object | `{ label: string, name: string }` from the rename UI input.                 |
| `currentStyle` | Object | The style object being renamed (includes name, label, icon, etc.).          |

### Key Invariants (DO NOT break when editing)

- When `isConfirmedChangeID` is true: name MUST be kebab-cased via `kebabCase(newValue.name)`.
- Preserve `status`, `enabledIn`, `disabledIn` from existing variation — use `buildMetadataTransferForRenamedStyle` to copy old style's metadata (blocks + variations) to new style name.
- `globalStyles.blocks[blockName].variations`: remove old key (`currentStyle.name`), add new key (`editedStyle.name`) with cloned merged style values.
- `blockeraMetaData.blocks[blockName].variations`: mark old style as deleted (Rule 1.4); assign old metadata to new style via `buildMetadataTransferForRenamedStyle` (Rule 1.5).
- Unregister/register for **all** block types: `unregisterStyleFromBlockTypes`, `registerStyleForBlockTypes` with `blockTypesToRegister`.
- Update style variation blocks via store: `clearStyleVariationBlocksInStore(currentStyle.name)`, `setStyleVariationBlocksInStore(editedStyle.name, blockTypesToRegister)`.

### Helpers Reference

| Helper                         | Purpose                                                                 |
|--------------------------------|-------------------------------------------------------------------------|
| `getMergedNormalizedStyleFromSources` | Clone style values from base + user config (shared with handleOnDuplicate). |
| `getBlockTypesForStyleFromStore` | Get block types from store (works outside panel).                       |
| `registerStyleForBlockTypes`   | Register style for each block type.                                     |
| `unregisterStyleFromBlockTypes` | Unregister style from each block type.                                 |
| `setStyleVariationBlocksInStore` | Set style variation blocks in store.                                  |
| `clearStyleVariationBlocksInStore` | Clear style variation blocks in store.                               |
| `buildBlocksUpdateForStyle`    | Build blocks update object for globalStyles.                            |
| `markStyleAsDeletedInMetaData` | Mark old style as deleted (remove or isDeleted) per origin.             |
| `buildMetadataTransferForRenamedStyle` | Copy old style's metadata (blocks.*.variations + variations) to new style name. Preserves enabledIn, disabledIn, status, per-block data. |
| `getBlockTypesForStyle`        | Get block types to register for a style.                                |
| `getNormalizedStyle`           | Normalize style values for storage.                                     |
| `isBlockeraCreatedStyle`       | Detect if style is Blockera-created vs block/theme/core.                |
| `removeStyleVariationFromGlobalStyles` | Remove variation from globalStyles (alternative to mergeObject). |
| `mergeObject` (with `forceUpdated`, `deletedProps`) | Remove keys from nested objects (used in handleOnDelete).   |

### Dependencies (useCallback)

`blockName`, `blockStyles`, `globalStyles`, `setBlockStyles`, `setGlobalStyles`, `isConfirmedChangeID`, `setBlockeraGlobalStylesMetaData`, `getBlockeraGlobalStylesMetaData`, `updateBlockeraGlobalStylesMetaData`, `base`, `styles`, `defaultStyles`.

### Related

- `setIsConfirmedChangeID`: caller must set `true` when user confirms rename (e.g. modal "Apply").
- `getVariationUpdate()`: returns `{ label, name, refId, hasNewID }` — do not add extra fields here.
- `handleOnDelete`: reference for marking style as deleted and removing from globalStyles.
- `handleOnDuplicate`: reference for merged config (baseValues + userValues) and `buildBlocksUpdateForStyle`.

---

## handleOnSaveCustomizations

### Overview

Saves the selected block's current attributes as the global style for the given style variation. Reads blockera attributes from the selected block, normalizes them, applies WP compatibility filters, merges into global styles, updates the block editor store, and persists dirty entities to the database.

### Parameters

| Param           | Type   | Description                                                                 |
|-----------------|--------|-----------------------------------------------------------------------------|
| `currentStyle`  | Object | The style variation to save into (name, label, icon, ...).                  |
| `_defaultStyles`| Object | Default styles for normalization (typically `defaultStyles` from hook).     |

### Flow (execution order)

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

### Key Invariants (DO NOT break when editing)

- Only include attributes starting with `blockera` — non-blockera attributes are ignored.
- Use `isRootStyle(currentStyle)` to choose merge path — root: `blocks[blockName]`; non-root: `blocks[blockName].variations[currentStyle.name]`.
- `handleOnChangeAttributes` uses `ref.current.action: 'save-customizations'` — used by attribute hooks to identify the action.
- `effectiveItems` = `prepareBlockeraDefaultAttributesValues(_defaultStyles)` — passed to handleOnChangeAttributes.
- `saveAllDirtyEntities` runs after 1s delay — allows React/WordPress to flush state before persist.
- `saveAllDirtyEntities` uses `saveEditedEntityRecord` for dirty entities and `savePost` for the post.

### Helpers Reference

| Helper                          | Purpose                                                                 |
|---------------------------------|-------------------------------------------------------------------------|
| `getNormalizedStyle`            | Normalize attributes for storage.                                       |
| `isRootStyle`                   | Detect root vs variation (different merge path).                         |
| `prepareBlockeraDefaultAttributesValues` | Prepare default values for effectiveItems.                    |
| `blockeraExtensionsBootstrap`   | Run WP compatibility setup.                                             |
| `applyFilters('blockera.blockEdit.setAttributes', ...)` | WP filter for attribute transformation.              |

### Related

- `handleOnClearAllCustomizations`: inverse — removes customizations; this handler adds/saves them.
- `handleOnDetachStyle`: detaches block from style; this handler attaches block attributes to style.
- `saveAllDirtyEntities`: persists dirty entities (global styles, post) to database.

---

## handleOnUsageForMultipleBlocks

### Overview

Manages style variation usage across multiple block types. Two handlers work together:

1. **handleOnUsageForMultipleBlocks** — Updates block styles picker UI when the selected block type is enabled/disabled for a style (add/remove style from `blockStyles` list).
2. **handleOnSaveUsageForMultipleBlocks** — Applies the "Share with other blocks" modal changes: register/unregister block styles, update style variation blocks store, update global styles and metadata.

The main save logic lives in `handleOnSaveUsageForMultipleBlocks`; `BlockTypes` (block-types.js) is the UI and delegates to it.

### handleOnUsageForMultipleBlocks

#### Parameters

| Param          | Type   | Description                                                                 |
|----------------|--------|-----------------------------------------------------------------------------|
| `currentStyle` | Object | The style variation (name, label, icon, ...).                              |
| `action`       | 'add' \| 'delete' | Add style to blockStyles list or remove it.                        |

#### Flow

- **add**: If style not in `blockStyles`, `setBlockStyles([...blockStyles, currentStyle])`.
- **delete**: If style in `blockStyles`, `setBlockStyles(blockStyles.filter(s => s.name !== currentStyle.name))`.

#### When called

From `BlockTypes` when the selected block type (`selectedBlockStyle`) is in the enabled/disabled list — updates the style picker so it reflects the current block's style availability.

---

### handleOnSaveUsageForMultipleBlocks

#### Parameters

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

#### Flow (by action)

1. **disable-all**: Keep current block (selectedBlockStyle or blockName) enabled. `deleteStyleVariationBlocks`, `setStyleVariationBlocks` with enabledIn (block to keep), unregister only for disabledIn, `handleOnUsageForMultipleBlocks(style, 'delete')` for each disabled block that matches selected, `setGlobalStyles`.
2. **enable-all**: When limit applies, cap to `maxSelectableBlocks` (add up to `remainingBlocks`). `setStyleVariationBlocks` with enabled blocks, register for each, `handleOnUsageForMultipleBlocks(style, 'add')` if selected block matches, `setGlobalStyles`.
3. **single-enable**: `setStyleVariationBlocks(style.name, enabledIn, 'manual')`, optionally `deleteStyleVariationBlocks` for disabled, register for each in enabledIn, `handleOnUsageForMultipleBlocks` when selected block in enabledIn, `setGlobalStyles`.
4. **single-disable**: `deleteStyleVariationBlocks(style.name, true, blockType)`, optionally `setStyleVariationBlocks` for remaining enabled, unregister for each in disabledIn, `handleOnUsageForMultipleBlocks` when selected block in disabledIn, `setGlobalStyles`.

#### Key invariants

- Call `setBlockeraGlobalStylesMetaData(newGlobalStyles.blockeraMetaData)` before `setGlobalStyles`.
- For each block in `enabledIn`: `registerBlockStyle(block, style)`.
- For each block in `disabledIn`: `unregisterBlockStyle(block, style.name)`.
- When `selectedBlockStyle` is in enabled list: `handleOnUsageForMultipleBlocks(style, 'add')`.
- When `selectedBlockStyle` is in disabled list: `handleOnUsageForMultipleBlocks(style, 'delete')`.

### Related

- `BlockTypes` (block-types.js): UI for toggling block types; calls `handleOnSaveUsageForMultipleBlocks` on Save.
- `setGlobalData` in block-types: Computes `enabledIn`, `disabledIn`, `newGlobalStyles` from user toggles.
- `UsageForMultipleBlocksModal`, `SearchBlockTypes`: Modal and search UI that pass handlers to BlockTypes.
