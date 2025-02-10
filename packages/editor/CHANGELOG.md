## Unreleased

### Bug Fixes
- Double preview button in header in translated languages. [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/missing-translation-string-for-blockera-iBEIfdKXdbBkpn1?highlight=mIwhJxxt63eUix5)]

### Development Workflow
- GitHub workflow to enable developers to have custom PR playground configurations.

## 1.1.1 (2025-02-04)

### Bug Fixes
- Fixed an issue where too many renders occurred in the canvas editor.

### Improvements
- Optimized performance by detecting and addressing bottlenecks. 🔥

## 1.1.0 (2025-02-03)

### Improvements
- The overall design of the block settings has been improved to boost the UX (based on user feedback and user researches).

### New Features:
- Added Box Sizing feature to Size block section to enhance design flexibility in size-related customizations.
- Added a new fallback UI for the block editor to improve the user experience when an error occurs. [[🔗 Feature Request](https://community.blockera.ai/feature-request-1rsjg2ck/post/bug-detector-and-reporter-inside-wp-admin-JNHwQhKzYqrEjK6)]

### Automated Tests:
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
