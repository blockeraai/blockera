## Unreleased

### New Features
- Added ability to configure responsive breakpoints through a new visual interface.
- Introduced a streamlined blockera canvas editor that remembers each user's preferences and settings.
- Added support for automatically generating styles for all screen sizes and devices that you've set up in your responsive settings.

## 1.8.2 (2025-06-25)

### Bug Fixes
- Fixed an issue where the marker pseudo element's content field was not working properly as a blockera block state.

## 1.8.1 (2025-06-15)

### Bug Fixed
- Fixed an issue where advanced mode block card was shown when `Basic Mode` was enabled.

### Improvements
- Improved UX by showing all available states in editor store, making it easier to manage block states.

## 1.8.0 (2025-06-10)

### New Features

- Added the new hook to extend block functionality while switching to other block or inner block to extend block functionality.

### Improvements

- `Flex → Children Wrap` option change to be shown by default.
- The `Purge Cache` button for style regeneration will remain active after purging the cache.
- Improved cache validation and configuration updates for blockera extensions when options are modified.
- Cleaned up cache data and improved cache functionality in block extensions for a better and easier user experience.

### Bug Fixes

- Fixed an issue where block settings did not properly show when selecting an unsupported block.
- Fixed an issue where `link` inner block color not reset. Thanks to Davor 🙏🏼
- Fixed an issue where setting `flex` display on `Columns` block has styling issue. Thanks to Napat and Davor 🙏🏼
- Fixed an issue where setting `Opacity` to `100%` not works on block states. Thanks to Davor 🙏🏼
- Fixed an issue where the extensions cache data not correctly updated.
- Fixed an issue where the `Flex Child` block section `Order`, `Grow`, `Shrink`, and `Basis` features not working properly. Thanks to Davor 🙏🏼
- Fixed an issue where the pseudo elements not deleted. Thanks to Davor 🙏🏻
- Fixed an issue where the `Active` block pseudo element was not working properly.
- Fixed an issue where the `Restricts Blocks by Post Types` option was not working properly. Thanks Hoang 🙏🏻

### Automated Tests
- Added E2E tests to check `Flex` display on `Columns` block.


## 1.7.1 (2025-05-25)

### Improvements

- Improved the checkup for restricted block visibility by user roles, post types and block manager in panel options.

## 1.7.0 (2025-05-24)

### New Features

- Reset icon for spacing feature sides (top, right, bottom and left).
- Reset icon for position feature sides (top, right, bottom and left).

### Improvements

- Improve ".block" support in the custom css feature.

### Bug Fixes

- Font weight feature not working properly on breakpoints.
- Text orientation feature not working properly on breakpoints.
- Fixed an issue where the inline styles were not being correctly merged with the generated CSS rules.

### Automated Tests

- Added E2E tests to check spacing sides reset button.
- Added E2E tests to check position sides reset button.

## 1.6.0 (2025-05-21)

### Bug Fixes

- Fixed an issue where the some styles were not being correctly generated for block on frontend.
- Fixed an issue where the features are not persistent across page reload. Thanks to Davor 🙏🏼
- Fixed an issue where block settings were incorrectly applied to pseudo-elements of block states.
- Fixed an issue where CSS selectors were incorrectly generated for pseudo-elements with content property in block states.
- Fixed an issue where pseudo-elements in inner blocks could not be edited through block settings.

### Improvements

- Optimized the style engine speedup the process of generating css styles.

### New Features

- **Block style variation live preview**:
    - The live preview of style variation for block will be shown while mouse over on them inside style variation picker 🔥
    - If mouse wait over 1 second on the button, the example preview will be shown too.

### Bug Fixes

- Paddings CSS code is persist on page after after resetting value. Thanks to Davor 🙏🏼

## 1.5.1 (2025-05-19)

### Bug Fixes

- Fixed an issue where the some block states were not being correctly configured.
- Fixed an issue where the display value was not being correctly retrieved from the current breakpoint settings.

### Improvements

- Block card design improved.
- Improved support of third-party plugin blocks as inner block. Thanks to Hoang.

## 1.5.0 (2025-05-19)

### Improvements

- Improved the block card design to make it more consistent and easier to use.
- Improved block card inner blocks priority system for better user experience and performance.
- Improved the style engine to support flexible CSS selectors in block and inner block states, providing more powerful styling capabilities.
- `Flex Child` block section: Smartly showing icons of setting based on parent block flex direction setting.
- `Flex Child` block section: Help for all features added.

### New Features

- Added BlockComposite module to simplify creation of composite blocks by providing a reusable framework and components for developers.
- Block style variation redesigned and moved to block card (Block Card v3).
- Added support for flexible CSS selectors in block and inner block states, providing more powerful styling capabilities.
- Added smart calculation for block states in inner blocks.
- Added `content` css property support for `:before` and `:after` pseudo-elements in block states.

### Automated Tests

- Added E2E tests to check block style variation functionality.
- Added Unit tests for computation css declarations to ensure the robustness of the style engine.

### Bug Fixes

- Fixed an issue where the merge of styles for block states was not working properly.

## 1.4.0 (2025-04-27)

### New Features

- Implemented the block states new configuration to make it easier to manage block states around the editor.
- Added support for external block states configuration through Blockera's block states feature, enabling developers to define custom block states and behaviors.
- Introduced block states API documentation and examples for third-party developers.
- Added priority-based sorting for block states to enable ordered configuration from both internal and external sources.

### Bug Fixes

- Modals design issue.

## 1.3.1 (2025-04-23)

### Bug Fixes

- Block `Style Variations` buttons hover state design issue.

## 1.3.0 (2025-04-22)

### Bug Fixes

- Flex layout feature not working properly on breakpoints reported by Davor Jovanović 🙏🏼 [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/block-row-doesn-t-accept-justify-content-center-bZeVoRwgQ5xhnbm)]
- Duplicate preview button on non-English websites reported by Hoang 🙏🏼.
- Fixed duplicate preview button in editor header section.
- Strange issue that shows block `General` tab items in `Style` tab.
- Wrong `General` tab settings for inner blocks.
- `Custom HTML Attributes` feature should not available for inner blocks.

### New Features

- Inline block renaming by clicking on block card [[🔗 Feature request](https://community.blockera.ai/feature-request-1rsjg2ck/post/block-renaming-quick-block-renaming-from-the-block-card-j7XmvUiOTj36VFn)]
- Custom CSS Code Feature: Allows you to add custom CSS codes per block. [Pro Feature]
- Smart autocomplete suggestions for CSS variables in code editor by typing `--`.
- Smart `.block` autocomplete for current block selector in code editor.
- Smart `.block:hover` autocomplete for current block hover state in code editor.

### Improvements

- Aspect ratio feature improved to smartly set the width and height while switching to custom ratio.
- Improve block card design.
- Improve overall codes.
- Added `blockera-editor` class to the admin body class to improve canvas editor UI and styles.
- Improve overall block editor design.

### Automated Tests

- Added E2E tests to check inline block renaming.
- Added E2E test to check inline block renaming for blocks with variations.
- Added E2E tests to check Custom CSS feature.
- Aspect ratio tests updated for latest updates.

## 1.2.4 (2025-04-16)

### Improvements

- The block card now displays the custom block name if it has been set.

### Automated Tests

- Added E2E tests to check showing block custom name on block card.

## 1.2.3 (2025-04-12)

### Improvements

- UX & design improvements for block section settings.

## 1.2.2 (2025-03-29)

### Automated Tests

- Added E2E tests for opening popover of spacing feature by clicking on labels or side shapes.

## 1.2.1 (2025-03-17)

### Bug Fixes

- Fixed an issue in the Layout style generator Reported by [@hoang](https://github.com/hoang) 🙏🏼
- Fixed an issue where the gap lock or unlock button was not working properly.
- Fixed an issue with the style engine were not being correctly generating styles for blocks in breakpoints. [@hoang](https://github.com/hoang) Thanks a lot for your help!

## 1.2.0 (2025-03-15)

### Bug Fixes

- Double preview button in header in translated languages. [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/missing-translation-string-for-blockera-iBEIfdKXdbBkpn1?highlight=mIwhJxxt63eUix5)]
- Various bug fixes.
- Fixed an issue where the style engine generated incorrect selectors on both server and client sides.
- Block section settings are now hidden if there are no taggable features in the section.
- The Width feature should use `flex-basis` in the Column Block.
- Fixed an issue where the toggle action in the block section was not working correctly.
- Fixed an issue where the block section focus, collapse and expand actions were not being updated correctly as a unified state around the editor for all blocks.
- Fixed the Flex Direction not working properly sometimes.
- Fixed the extra Flex Wrap css property for blocks.
- Fixed an issue where the gap feature was not working properly.
- Fixed an issue in the Layout style definition where margin-block-start was incorrectly being generated multiple times - once for the root selector and again for all child selectors, causing duplicate CSS rules. This was happening specifically when using gap with margin type in flex/grid layouts. The fix ensures margin-block-start is only generated once for the appropriate selector.
- Fixed flex layout not working properly on mobile devices (Thanks Hoang 🙏🏼)

### Development Workflow

- GitHub workflow to enable developers to have custom PR playground configurations.

### New Features

- `Text Wrap` feature added to enhance typography customization (Pro Feature).
- Added a new feature to cleanup inline styles from the block elements on the blockera site editor.
- Multiple UX enhancements.

### Automated Tests

- Added E2E tests for the `Text Wrap` feature to verify its functionality in both the editor and front end.
- Added E2E tests to check Shift + Click on label to reset value.
- Added E2E tests to check "x" icon click on label to reset value.

## 1.1.1 (2025-02-04)

### Bug Fixes

- Fixed an issue where too many renders occurred in the canvas editor.

### Improvements

- Optimized performance by detecting and addressing bottlenecks. 🔥

## 1.1.0 (2025-02-03)

### Improvements

- The overall design of the block settings has been improved to boost the UX (based on user feedback and user researches).
- Enhanced Block Sections with improved state management for seamless transitions between parent and inner blocks, maintaining section states and focus mode settings during block switching.

### New Features:

- Added Box Sizing feature to Size block section to enhance design flexibility in size-related customizations.
- Added a new fallback UI for the block editor to improve the user experience when an error occurs. [[🔗 Feature Request](https://community.blockera.ai/feature-request-1rsjg2ck/post/bug-detector-and-reporter-inside-wp-admin-JNHwQhKzYqrEjK6)]

### Automated Tests

- Added E2E tests for the Box Sizing feature to verify its functionality in both the editor and front end.

### Bug Fixes

- Fixed an issue where features configurations and cached data caused problems when adding new features options.
- Fixed an issue in the custom style section where this is by default closed, but the section remained open.
- Fixed an issue where the navigation block were not correctly working with flex wrap and aspect ratio features. [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/bug-in-navigation-block-WQZsA8IAhFcPNxR)]
- Fixed an issue where the breakpoints navbar disappear when the 'Top Toolbar' setting is selected. [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/blockers-top-toolbar-disappears-if-you-select-top-toolbar-setting-sldgztD8JG2lVeC)]

## 1.0.3 (2025-01-22)

### Improvements

- Enhanced the CSS style generator for typography features to improve design flexibility and customization.
- Enhanced the style engine server-side implementation with improved APIs for better developer experience and extensibility.

### Bug Fixes

- Fixed a TypeError caused by calling a class as a function.
- Wrapped the block edit component in an ErrorBoundary to enhance error handling.
- Fixed an issue with the blockeraGap feature in the style engine causing incorrect gap values.

## 1.0.2 (2025-01-17)

### Bug Fixes

- Fixed an issue causing compatibility errors with the Blocksy theme.

## 1.0.1 (2025-01-06)

### Bug Fixes

- Ensured compatibility with the React.js rendering pipeline [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/single-product-block-error-bXDiO88g7LsP0hV)].
- Fixed the block mode callback handler to improve functionality and reliability [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/block-mode-switch-not-works-FsR1uwRuIcCakWp)].

### Improvements

- Updated block sections to remove the "Powered by Blockera" icon from the bottom. Instead, an indicator was added at the top of the block to show whether it is in advanced mode, displayed only once per block. (Based on users feedback)

## 1.0.0 (2024-12-08)

### New Features:

- Added the ability to change `font family` for blocks, supporting all states and breakpoints. [[🔗 Feature Request](https://community.blockera.ai/feature-request-1rsjg2ck/post/font-font-appearance-support-nhEJYxOd5p9k4E1)]
- Added the ability to change `font weight` for blocks, supporting all states and breakpoints. [[🔗 Feature Request](https://community.blockera.ai/feature-request-1rsjg2ck/post/font-font-appearance-support-nhEJYxOd5p9k4E1)]

### Bug Fixes

- Max 200 value for Gap feature [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/max-200-value-for-gap-feature-nwcVKkoyV5PVKEZ)]
- JS error while resetting the gap feature [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/js-error-while-resetting-the-gap-feature-DMkePSiXbnwyPSE)]
- CSS Display property always should be printed to prevent bugs [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/display-feature-always-not-priting-aKA5Jr0gnb6N6Yu)]
- Flex layout align items and justify content not working properly for column direction [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/flex-layout-bug-aZ0Z3LqgOT8aApK)]
- Text align feature change from block toolbar not update Typography block section control [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/changing-text-aling-not-affects-inside-blockera-typography-section-kjKfo0aGpFIJSre)]
- Heading block text align compatibility
- Layout Section → Flex Child → Self order icon is wrong [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/flex-chlild-order-icon-is-wrong-uVCroH9QzuZSWsf)]
- Extra Blockera logo is showing in blocks preview section [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/extra-logo-on-blocks-fFacaGcdbdRHS3M)]
- Strange "0" character after Layout block section [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/strange-0-after-layout-block-section-tXhcZXMGMn631EH)]
- Strange bug of flex layout that makes issue for inner blocks flex layout.
- Wrong style generation for blocks in gap feature [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/wrong-style-generation-for-blocks-in-gap-feature-nkRSbYvjaK226Rh)]
- Refactored BlockBase component to fix compatibility with WordPress problems. [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/group-block-variation-control-bug-with-updating-layout-section---flex-MSd1lhFdxAGDd2c)]
- Fixed an issue where advanced values of the Flex Layout (e.g., `space-between`, `space-around`) were not working properly. [[🔗 Link](https://community.blockera.ai/bugs-mdhyb8nc/post/advanced-values-of-flex-layout-not-working-properly-wTCfgyDW4w1EoVK)]
- Fixed a style issue when the selected block is unsupported. [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/style-issue-if-current-selected-block-is-a-not-supported-block-9VjcCa2CSA7FPpl)]
- Fixed an issue that caused duplicate block cards to be displayed. [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/extra-block-card-in-the-settings-tab-0C3lR6niX6ygYir)]

### Improvements

- Design of post preview link in header improved.
- Enhanced the getNormalizedSelector API for better performance and functionality.
- Refactored server-side style engine with cleaner code and improved support for & ampersand in selector creation.
- Added spacer for processed selector in the client-side style engine to improved css selector normalizer.
- Added a reset method in Layout style definition.
- Updated the layout of typography features to enhance user experience (UX).
- Optimized performance by detecting and addressing bottlenecks. 🔥
- Refactored memoization helpers in package/utils and updated all use cases for better efficiency.

### Automated Tests:

- Completed E2E tests to verify the functionality of all advanced states in Flex Layout.
- Conducted WP data compatibility test for the Spacer Block to ensure correct functionality.
- Added new test suites to ensure the robustness of the getNormalizedSelector API.
- Updated tests to detect real hover states more accurately.
- Updated Blockera inline style tag ID to ensure all assertions pass successfully.
- Added new automated tests to verify unique class names for blocks in Blockera.
- Added tests to verify the functionality of the `font family` feature.
- Added tests for checking `font family` functionality and WordPress data compatibility.
- Added tests to verify the functionality of the `font weight` feature.
- Added tests for checking `font weight` functionality and WordPress data compatibility.
- Added new Jest tests for the getTarget() API of the Canvas editor.
