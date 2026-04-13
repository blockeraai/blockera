## Accessing WordPress Global Styles Identifiers

To obtain the ID for the current Global Styles in WordPress, you can use the following JavaScript code snippet:

```javascript
const coreStore = wp.data.select('core');

const globalStylesPostId = coreStore.__experimentalGetCurrentGlobalStylesId();

const globalStylesRecord = coreStore.getEditedEntityRecord(
	'root',
	'globalStyles',
	globalStylesPostId
);
```

This approach utilizes the WordPress `wp.data` API, which allows you to access the unique identifier linked to the global styles of the active theme. Note that this functionality may still be experimental and subject to changes.

## Accessing Blockera Global Styles Identifiers

```javascript
const blockeraEditorStore = wp.data.select('core');

const globalStyles = blockeraEditorStore.getGlobalStyles();

const selectedBlockStyle = blockeraEditorStore.getSelectedBlockStyle();

const blockName = 'core/group';

const style1 = blockeraEditorStore.getBlockStyles(blockName, 'section-1');
const style2 = blockeraEditorStore.getBlockStyles(blockName, 'section-2');
const style3 = blockeraEditorStore.getBlockStyles(blockName, 'section-3');

const groupStyles = blockeraEditorStore.getBlockStyleVariations(blockName);
```

This approach provides access to Blockera's global styles system, which extends WordPress's native global styles functionality. The `getGlobalStyles()` method returns the complete global styles object containing all style definitions for blocks and their variations.

The `getSelectedBlockStyle()` method retrieves the currently active block style variation, while `getBlockStyles()` allows you to fetch styles for a specific block and variation. When passing 'default' as the variation parameter, it returns the base styles for that block.

The `getBlockStyleVariations()` method returns all registered style variations for a given block type, enabling you to enumerate and work with multiple style options programmatically. This is particularly useful when building custom interfaces or managing style variations dynamically.

