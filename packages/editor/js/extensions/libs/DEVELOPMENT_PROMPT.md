# Blockera Editor Extensions - Development Guide for AI Tools

This document provides comprehensive guidance for AI tools (like Cursor IDE) and developers working on Blockera's editor extensions, particularly for WordPress theme.json compatibility features.

## Overview

Blockera extends WordPress block editor functionality by providing advanced styling features that integrate seamlessly with WordPress 6.7+ theme.json schema. Extensions handle bidirectional conversion between WordPress's native attribute format and Blockera's internal format, supporting both block-level (block inspector) and global styles contexts.

## Core Architecture Pattern

### Extension Structure

Each extension follows this structure:

```
extension-name/
├── bootstrap.js              # Main entry point, registers filters
├── compatibilities/          # WordPress compatibility functions
│   ├── feature-1.js         # Individual feature compatibility
│   └── feature-2.js
├── components/               # React components
├── css-generators/           # CSS generation logic
├── extension.js              # Main extension component
├── styles.js                 # Style application logic
├── test/                     # Test files
│   ├── feature.compatibility-*.e2e.cy.js  # Block-level tests
│   └── global-styles/        # Global styles tests
│       ├── feature.compatibility-*.global-styles.ply.js
│       └── fixtures/         # PHP mu-plugins for tests
└── types/                    # Flow type definitions
```

### Key Pattern: `insideBlockInspector` Flag

The `insideBlockInspector` boolean flag (from `blockDetail.insideBlockInspector`) is the central pattern for differentiating contexts:

- **Block Inspector Context** (`insideBlockInspector = true`):
  - Reads from: `attributes.style.*` or `attributes.*` (block-specific attributes)
  - Writes to: `{ style: { [feature]: value } }` or `{ [attribute]: value }`

- **Global Styles Context** (`insideBlockInspector = false`):
  - Reads from: `attributes.*`, `attributes.dimensions.*`, `attributes.typography.*`, `attributes.spacing.*`, `attributes.background.*`, `attributes.shadow`, etc.
  - Writes to: `{ [feature]: value }` or `{ dimensions: { ... } }`, `{ typography: { ... } }`, etc.

### Bootstrap Pattern

```javascript
// bootstrap.js pattern
export const bootstrap = (): void => {
  // Filter 1: WordPress → Blockera conversion
  addFilter(
    'blockera.blockEdit.attributes',
    'blockera.blockEdit.extensionName.bootstrap',
    (attributes: Object, blockDetail: BlockDetail) => {
      if (isBlockNotOriginalState(blockDetail)) {
        return attributes;
      }

      attributes = featureFromWPCompatibility({
        attributes,
        insideBlockInspector: blockDetail.insideBlockInspector,
      });

      return attributes;
    }
  );

  // Filter 2: Blockera → WordPress conversion
  addFilter(
    'blockera.blockEdit.setAttributes',
    'blockera.blockEdit.extensionName.bootstrap.setAttributes',
    (nextState, featureId, newValue, ref, getAttributes, blockDetail) => {
      if (isInvalidCompatibilityRun(blockDetail, ref)) {
        return nextState;
      }

      switch (featureId) {
        case 'blockeraFeatureName':
          return mergeObject(
            nextState,
            featureToWPCompatibility({
              newValue,
              ref,
              insideBlockInspector: blockDetail.insideBlockInspector,
            })
          );
      }

      return nextState;
    }
  );
};
```

## Compatibility Function Pattern

### FromWPCompatibility Pattern

```javascript
export function featureFromWPCompatibility({
  attributes,
  insideBlockInspector = true, // Default for backward compatibility
}: {
  attributes: Object,
  insideBlockInspector: boolean,
}): Object {
  // Early return if Blockera value already exists
  if (
    attributes?.blockeraFeature?.value &&
    !isEmpty(attributes.blockeraFeature.value)
  ) {
    return attributes;
  }

  // Read from appropriate location based on context
  const wpValue = insideBlockInspector
    ? attributes?.style?.feature
    : attributes?.feature; // or attributes.category.feature for global styles

  if (!wpValue) {
    return attributes;
  }

  // Convert WordPress format to Blockera format
  // Handle preset references, CSS values, etc.

  attributes.blockeraFeature = {
    value: convertedValue,
  };

  return attributes;
}
```

### ToWPCompatibility Pattern

```javascript
export function featureToWPCompatibility({
  newValue,
  ref,
  insideBlockInspector = true,
}: {
  newValue: Object,
  ref?: Object,
  insideBlockInspector: boolean,
}): Object {
  // Handle reset case
  if ('reset' === ref?.current?.action || newValue === '') {
    return insideBlockInspector
      ? {
          style: {
            feature: undefined,
          },
        }
      : {
          feature: undefined, // or { category: { feature: undefined } }
        };
  }

  // Convert Blockera format to WordPress format
  const wpValue = convertToWPFormat(newValue);

  return insideBlockInspector
    ? {
        style: {
          feature: wpValue,
        },
      }
    : {
        feature: wpValue, // or { category: { feature: wpValue } }
      };
}
```

## WordPress theme.json Schema Mapping

### Typography Features
- **Block Inspector**: `attributes.style.typography.*`
- **Global Styles**: `attributes.typography.*`
- **theme.json path**: `styles.blocks[blockName].typography.*`

### Size Features
- **Block Inspector**: `attributes.width`, `attributes.height`, `attributes.style.dimensions.*`
- **Global Styles**: `attributes.dimensions.*`
- **theme.json path**: `styles.blocks[blockName].dimensions.*`

### Layout Features (Spacing/Gap)
- **Block Inspector**: `attributes.style.spacing.*`
- **Global Styles**: `attributes.spacing.*`
- **theme.json path**: `styles.blocks[blockName].spacing.*`

### Background Features
- **Block Inspector**: `attributes.style.background.*`, `attributes.style.color.background`, `attributes.gradient`
- **Global Styles**: `attributes.background.*`, `attributes.color.background`, `attributes.color.gradient`
- **theme.json path**: `styles.blocks[blockName].background.*`, `styles.blocks[blockName].color.*`

### Border and Shadow Features
- **Block Inspector**: `attributes.style.border.*`, `attributes.style.border.radius`, `attributes.style.shadow`
- **Global Styles**: `attributes.border.*`, `attributes.border.radius`, `attributes.shadow`
- **theme.json path**: `styles.blocks[blockName].border.*`, `styles.blocks[blockName].shadow`

## Handling WordPress Presets

### Preset Reference Formats

WordPress uses two formats for preset references:
1. **WordPress format**: `var:preset|category|slug` (e.g., `var:preset|shadow|natural`)
2. **CSS variable format**: `var(--wp--preset--category--slug)` (e.g., `var(--wp--preset--shadow--natural)`)

### Resolving Presets

When encountering preset references, resolve them using WordPress block editor settings:

```javascript
import { select } from '@wordpress/data';

function resolvePreset(presetReference: string, category: string): ?string {
  // Extract slug
  let slug = null;
  if (presetReference.startsWith(`var:preset|${category}|`)) {
    slug = presetReference.replace(`var:preset|${category}|`, '');
  } else if (presetReference.startsWith(`var(--wp--preset--${category}--`)) {
    const match = presetReference.match(
      new RegExp(`var\\(--wp--preset--${category}--([^)]+)\\)`)
    );
    if (match && match[1]) {
      slug = match[1];
    }
  }

  if (!slug) return null;

  // Access WordPress settings
  try {
    const settings = select('core/block-editor')?.getSettings();
    const features = settings?.__experimentalFeatures?.[category];
    
    if (features?.presets) {
      // Check nested structure (theme/default)
      const themePresets = features.presets.theme || [];
      const defaultPresets = features.presets.default || [];
      const allPresets = [...themePresets, ...defaultPresets];
      
      const preset = allPresets.find((p) => p.slug === slug);
      return preset?.[category] || preset?.value || null;
    }
    
    // Fallback: flat array
    if (Array.isArray(features.presets)) {
      const preset = features.presets.find((p) => p.slug === slug);
      return preset?.[category] || preset?.value || null;
    }
  } catch (error) {
    // Handle gracefully if settings unavailable
  }
  
  return null;
}
```

### Preserving Preset References

When converting back to WordPress format, preserve preset references:

```javascript
// Store preset reference when reading
if (isPresetReference(wpValue)) {
  blockeraValue.presetReference = wpValue;
}

// Use preset reference when writing back
if (blockeraValue.presetReference) {
  return { shadow: blockeraValue.presetReference };
}
```

## Testing Patterns

### Block-Level Tests (Cypress)

File naming: `feature.compatibility-*.e2e.cy.js`

```javascript
import {
  appendBlocks,
  getSelectedBlock,
  getWPDataObject,
  createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Feature → WP Compatibility', () => {
  beforeEach(() => {
    createPost();
  });

  describe('Block Type', () => {
    it('Test case name', () => {
      // Insert block with WordPress attributes
      appendBlocks('<!-- wp:block {"style":{"feature":"value"}} -->...');
      
      cy.getBlock('core/block').click();
      cy.getParentContainer('Feature Name').as('container');
      cy.addNewTransition();

      // Test 1: WP data → Blockera
      getWPDataObject().then((data) => {
        const blockeraValue = getSelectedBlock(data, 'blockeraFeature');
        const wpValue = getSelectedBlock(data, 'style')?.feature;
        // Assertions...
      });

      // Test 2: Blockera → WP data
      cy.get('@container').within(() => {
        // Modify values...
      });
      getWPDataObject().then((data) => {
        // Assertions...
      });

      // Test 3: Clear values
      // ...
    });
  });
});
```

### Global Styles Tests (Playwright)

File naming: `feature.compatibility-*.global-styles.ply.js`

```javascript
const {
  openSiteEditor,
  getSelectedBlock,
  closeWelcomeGuide,
  getEditedGlobalStylesRecord,
  activateMuPlugin,
  deactivateMuPlugin,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
  test,
  expect,
  getByDataTest,
  addNewTransition,
  getParentContainer,
  openGlobalStylesPanel,
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Feature → WP Compatibility', () => {
  const muPluginPaths = {
    'Test Name': 'path/to/fixture.php',
  };
  const activeMuPlugins = new Map();

  const before = async (page) => {
    await openGlobalStylesPanel(page);
    await closeWelcomeGuide(page);
    await getByDataTest(page, 'block-style-variations').nth(1).click();
    await page.locator('button[id="/blocks/core%2Fblock"]').click();
  };

  test.beforeEach(async ({ page, admin }, testInfo) => {
    const muPluginPath = muPluginPaths[testInfo.title];
    if (muPluginPath) {
      await activateMuPlugin(page, muPluginPath);
      activeMuPlugins.set(testInfo.testId, muPluginPath);
    }
    await openSiteEditor(page, admin);
    await before(page);
  });

  test.afterEach(async ({ page }, testInfo) => {
    const muPluginPath = activeMuPlugins.get(testInfo.testId);
    if (muPluginPath) {
      await deactivateMuPlugin(page, muPluginPath);
      activeMuPlugins.delete(testInfo.testId);
    }
  });

  test('Test case name', async ({ page }) => {
    // Test implementation...
  });
});
```

### Test Fixtures (PHP Mu-Plugins)

File naming: `feature-setup-*.php`

```php
<?php
/**
 * Temporary mu-plugin to modify theme.json for feature tests
 */
add_filter('blockera_theme_json_data_theme', function($theme_json) {
  $data = $theme_json;
  
  if (!isset($data['styles']['blocks'])) {
    $data['styles']['blocks'] = [];
  }
  
  if (!isset($data['styles']['blocks']['core/block'])) {
    $data['styles']['blocks']['core/block'] = [];
  }
  
  // Add feature configuration
  $data['styles']['blocks']['core/block']['feature'] = 'value';
  
  return $data;
}, 10, PHP_INT_MAX);
```

## Rules and Best Practices

### Code Style Rules

1. **One logical change per file** - Don't mix unrelated refactors
2. **Keep commits mentally reversible** - Changes should be clear and isolated
3. **Backward compatible** - Always default `insideBlockInspector = true` for backward compatibility
4. **Preserve behavior** - Ensure existing functionality remains intact
5. **Step-by-step updates** - Update compatibility files and tests incrementally

### Error Handling

- Always handle cases where WordPress settings might not be available (test environments)
- Use try-catch blocks when accessing WordPress APIs
- Provide fallback behavior when preset resolution fails
- Don't break existing functionality if new features aren't available

### Type Safety

- Use Flow type annotations
- Handle `?string`, `?Object` types properly
- Use proper type guards before accessing nested properties

### ESLint Compliance

- Avoid nested ternary expressions (use if/else instead)
- Fix `no-lonely-if` rule violations
- Format regex patterns properly (multi-line if needed)
- Handle spread operator complexity issues

## Common Patterns by Feature Type

### Color Features
- Use `getColorVAFromVarString()` for color preset conversion
- Handle both CSS colors and preset references
- Support `var:preset|color|slug` format

### Gradient Features
- Use `getGradientVAFromVarString()` for gradient preset conversion
- Handle linear and radial gradients
- Support `var:preset|gradient|slug` format

### Shadow Features
- Resolve shadow presets to CSS values before parsing
- Parse CSS box-shadow format: `[inset] x y blur [spread] [color]`
- Preserve preset references for round-trip conversion
- Handle both `var:preset|shadow|slug` and CSS variable formats

### Spacing Features
- Handle padding and margin objects with top/right/bottom/left properties
- Support blockGap for layout blocks
- Convert between Blockera's unified spacing and WordPress's separate padding/margin

### Dimension Features
- Handle width, height, minHeight
- Support aspect ratio for specific blocks (core/cover, core/image)
- Convert between Blockera's format and WordPress's dimensions object

## When to Update Compatibility Files

Update compatibility files when:
1. WordPress adds new features to theme.json schema
2. Blockera adds new features that need WordPress integration
3. WordPress changes attribute structure or format
4. New block types need special handling
5. Preset reference formats change

## Debugging Tips

1. **Check context**: Verify `insideBlockInspector` is being passed correctly
2. **Verify paths**: Ensure reading/writing from correct attribute paths
3. **Test both contexts**: Always test in both block inspector and global styles
4. **Check preset resolution**: Verify presets are resolved correctly using WordPress settings
5. **Validate round-trip**: Ensure WP → Blockera → WP conversion preserves values

## Example: Adding a New Feature

1. **Create compatibility file**: `compatibilities/new-feature.js`
   - Implement `newFeatureFromWPCompatibility()`
   - Implement `newFeatureToWPCompatibility()`
   - Handle `insideBlockInspector` flag
   - Support preset references if applicable

2. **Update bootstrap.js**:
   - Add import for compatibility functions
   - Add filter for reading (attributes filter)
   - Add case in switch statement for writing (setAttributes filter)

3. **Create tests**:
   - Block-level test: `test/new-feature.compatibility-1.e2e.cy.js`
   - Global styles test: `test/global-styles/new-feature.compatibility-1.global-styles.ply.js`
   - Test fixtures: `test/global-styles/fixtures/new-feature-setup-*.php`

4. **Update CHANGELOG.md**:
   - Add feature entry in Improvements section
   - Add test entries in Automated Tests section

5. **Write commit message**:
   - Follow conventional commit format
   - Include detailed description
   - List all changes and features
   - Document test coverage

## Resources

- WordPress theme.json schema: https://raw.githubusercontent.com/WordPress/gutenberg/wp/6.7/schemas/json/theme.json
- WordPress Block Editor API: https://developer.wordpress.org/block-editor/
- Blockera extension examples: See existing extensions (typography, size, layout, background, border-and-shadow)

## Questions to Ask When Working on Compatibility

1. Does this feature exist in WordPress theme.json schema?
2. Is it supported in global styles or only block-level?
3. Does WordPress use preset references for this feature?
4. What is the correct attribute path for block inspector vs global styles?
5. Are there any special cases for specific block types?
6. How should preset references be resolved and preserved?
7. What happens when values are cleared/reset?
8. Are there any edge cases or fallback behaviors needed?

---

**Last Updated**: Based on WordPress 6.7 theme.json schema and Blockera editor extensions implementation patterns.
