# @blockera/dev-playwright

Blockera Playwright configuration and helper utilities for end-to-end testing.

## Overview

This package provides Playwright configuration, fixtures, and helper utilities for writing e2e tests in the Blockera plugin ecosystem. It mirrors the functionality of `@blockera/dev-cypress` but uses Playwright instead of Cypress.

## Usage

Import fixtures and helpers in your Playwright test files:

```javascript
const { test, expect } = require('@blockera/dev-playwright/js/fixtures/editor');
const {
	addBlockToPost,
	selectBlock,
} = require('@blockera/dev-playwright/js/utils/helpers');
```

Or import specific utility modules:

```javascript
const {
	resetPanelSettings,
} = require('@blockera/dev-playwright/js/utils/admin');
const {
	setDeviceType,
} = require('@blockera/dev-playwright/js/utils/responsive');
const {
	setBoxSpacingSide,
} = require('@blockera/dev-playwright/js/utils/controls-box-spacing');
```

## Structure

-   `js/fixtures/editor.js` - Playwright test fixtures with WordPress utilities
-   `js/support/` - Support files (similar to Cypress support files):
    -   `commands.js` - Custom Playwright commands (similar to Cypress commands)
    -   `e2e.js` - E2E test setup and hooks (with automatic login and editor setup)
-   `js/utils/` - Helper utility functions organized by category:
    -   `admin.js` - Admin panel utilities
    -   `editor.js` - Editor utilities (blocks, content, etc.)
    -   `inner-blocks.js` - Inner blocks utilities
    -   `block-states.js` - Block states utilities
    -   `responsive.js` - Responsive/breakpoint utilities
    -   `controls.js` - General control utilities
    -   `controls-box-position.js` - Box position control utilities
    -   `controls-box-spacing.js` - Box spacing control utilities
    -   `other.js` - Miscellaneous utilities
    -   `site-navigation.js` - Site navigation utilities
    -   `create-term.js` - Taxonomy term creation utilities
    -   `helpers.js` - Main export file (re-exports all utilities)
-   `js/config/global-setup.js` - Global setup configuration for WordPress authentication

## Available Utilities

### Editor Utilities

-   `addBlockToPost()` - Add a block to the editor
-   `selectBlock()` - Select a block by type
-   `clearBlocks()` - Clear all blocks
-   `savePage()` - Save the post/page
-   `getSelectedBlock()` - Get selected block data
-   `getEditorContent()` - Get editor content
-   `openDocumentSettingsSidebar()` - Open settings sidebar
-   `openSettingsPanel()` - Open a settings panel
-   `closeWelcomeGuide()` - Close welcome guide
-   And many more...

### Admin Utilities

-   `resetPanelSettings()` - Reset panel settings

### Inner Blocks Utilities

-   `setInnerBlock()` - Set inner block
-   `getAllowedBlocks()` - Get allowed blocks
-   `checkSelectedInnerBlock()` - Check selected inner block

### Block States Utilities

-   `addBlockState()` - Add block state
-   `setBlockState()` - Set block state
-   `resetBlockState()` - Reset block state
-   `checkCurrentState()` - Check current state

### Responsive Utilities

-   `setDeviceType()` - Set device type/breakpoint

### Controls Utilities

-   `setInputValue()` - Set input value
-   `setColorSettingsFoldableSetting()` - Set color setting
-   `toggleSettingCheckbox()` - Toggle checkbox

### Box Position/Spacing Utilities

-   `setBoxPositionSide()` - Set box position side
-   `setBoxSpacingSide()` - Set box spacing side
-   `clearBoxPositionSide()` - Clear box position side
-   `clearBoxSpacingSide()` - Clear box spacing side

### Site Navigation Utilities

-   `loginToSite()` - Login to WordPress
-   `goTo()` - Navigate to a URL
-   `createPost()` - Create a new post
-   `openSiteEditor()` - Open site editor
-   `editPost()` - Edit a post

### Other Utilities

-   `hexToRGB()` - Convert hex to RGB
-   `isWP62AtLeast()` - Check WordPress version
-   `createTerm()` - Create taxonomy term

## Custom Commands

The package provides custom commands similar to Cypress commands:

-   `getByDataCy()` - Get element by data-cy attribute
-   `getByDataTest()` - Get element by data-test attribute
-   `getByDataId()` - Get element by data-id attribute
-   `getByAriaLabel()` - Get element by aria-label
-   `getBlock()` - Get block by name
-   `getSelectedBlock()` - Get selected block
-   `uploadFile()` - Upload file
-   `multiClick()` - Click element multiple times
-   `setSliderValue()` - Set slider value
-   `customSelect()` - Select from custom dropdown
-   `setColorControlValue()` - Set color control value
-   `setBlockVariation()` - Set block variation
-   `wpCli()` - Execute WP CLI command
-   `checkBlockCardItems()` - Check block card items
-   `prepareEditorForScreenshot()` - Prepare editor for screenshots
-   And many more...

### Usage

```javascript
const { test, expect } = require('@blockera/dev-playwright/js/fixtures/editor');
const { getByDataCy, getBlock, wpCli } = require('@blockera/dev-playwright/js/support/commands');

test('example test', async ({ page }) => {
	// Use custom commands
	const element = getByDataCy(page, 'my-element');
	await element.click();

	const block = await getBlock(page, 'core/paragraph');
	await expect(block).toBeVisible();

	// Execute WP CLI
	const result = await wpCli(page, 'wp core version');
	console.log(result.stdout);
});
```

## Spec File Patterns

Playwright tests follow similar naming patterns to Cypress:

-   **E2E tests**: `*.e2e.spec.js` or `*.spec.js` in `tests/e2e/specs/` or `packages/**/`
-   **Visual tests**: `*.visual.spec.js` (if implementing visual testing)
-   **Categorized tests**: `*.category-1.spec.js` (e.g., `example.blocks-1.spec.js`)

The Playwright config automatically discovers test files matching these patterns, similar to how Cypress uses `specPattern` in `cypress.config.js`.

## Test File Structure

Test files should be placed in:
-   `tests/e2e/specs/` - Main test directory
-   `packages/**/` - Package-specific tests (mirrors Cypress pattern)

Example test file structure:

```
tests/e2e/specs/
  ├── example.spec.js
  ├── blocks/
  │   └── paragraph.blocks-1.spec.js
  └── editor/
      └── inserter.spec.js

packages/
  └── blocks-core/
      └── test/
          └── functionality.blocks-2.spec.js
```

This mirrors the Cypress structure where tests are in `packages/**/*.e2e.cy.js` and `tests/**/*.e2e.cy.js`.
