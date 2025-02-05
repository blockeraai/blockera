## Unreleased

### New Features
- Added support for the `Blocksy Breadcrumbs Block` by Blockera.
- Added support for the `Blocksy Breadcrumbs` text inner element by Blockera.
- Added support for the `Blocksy Breadcrumbs` link inner element by Blockera.
- Added support for the `Blocksy Breadcrumbs` separator inner element by Blockera.
- Added support for the `Blocksy Advanced Posts Block` by Blockera.
- Added support for the `Blocksy Post Template Block` by Blockera.
- Added support for the `Blocksy Advanced Taxonomies Block` by Blockera.
- Added support for the `Blocksy Tax Template Block` by Blockera.
- Added support for the `Blocksy Widgets Wrapper Block` by Blockera.
- Added support for the `Blocksy About Me Block` by Blockera.
- Added support for the `Blocksy About Me Block` text inner block by Blockera.


### Automated Tests
- Added E2E tests for the `Blocksy Breadcrumbs Block` text inner element.
- Added E2E tests for the `Blocksy Breadcrumbs Block` link inner element.
- Added E2E tests for the `Blocksy Breadcrumbs Block` separator inner element.
- Added E2E tests for the `Blocksy Advanced Posts Block` support by Blockera.
- Added E2E tests for the `Blocksy Post Template Block` support by Blockera.
- Added E2E tests for the `Blocksy Advanced Taxonomies Block` support by Blockera.
- Added E2E tests for the `Blocksy Tax Template Block` support by Blockera.
- Added E2E tests for the `Blocksy Widgets Wrapper Block` support by Blockera.

## 1.0.0 (2024-12-08)

### New Features
- Added `Spacer Block` support by Blockera. [[🔗 Link](https://community.blockera.ai/feature-request-1rsjg2ck/post/spacer-block-support-pritFhuc8gbsXko)]
- Added support for the `Navigation Link Block` by Blockera. [[🔗 Link](https://community.blockera.ai/feature-request-1rsjg2ck/post/supporting-blocks-inside-navigation-block-MIcY979kIVCxkvU)]
- Added support for the `Home Link Block` by Blockera. [[🔗 Link](https://community.blockera.ai/feature-request-1rsjg2ck/post/supporting-blocks-inside-navigation-block-MIcY979kIVCxkvU)]
- Added support for the `Submenu Block` and its inner blocks by Blockera. [[🔗 Link](https://community.blockera.ai/feature-request-1rsjg2ck/post/supporting-blocks-inside-navigation-block-MIcY979kIVCxkvU)]
- Added support for the `Tag Cloud Block` by Blockera.
- Added support for the `Archives Block` by Blockera.
- Added support for the inner blocks of `Archives` by Blockera.
- Added support for the `Calendar` by Blockera.
- Enhanced inner blocks of the `Page List Block` for greater customization flexibility.
- Enhanced inner blocks of the `List Block` for greater customization flexibility.
- Enhanced inner blocks of the `List Item Block` for greater customization flexibility.
- Enhanced inner blocks of the `Details Block` for greater customization flexibility.
- Added a link inner block to all Navigation Link Blocks.
- Added a link inner block to the `Image Block`.
- Added `Parent Menu Link` inner block to the `Submenu Block`.

### Bug Fixes
- Fixed an issue with test assertions.
- Fixed a conflicts with the blockeraRatio and blockeraFlexWrap features data structure with WordPress block editor saving process. [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/bug-in-navigation-block-WQZsA8IAhFcPNxR)]

### Automated Tests:
- Tests for the `Spacer Block` to ensure is supported by Blockera.
- Added automated test for `Navigation Link Block` to check that the `Back to Parent` navigation buttons work correctly.
- Added automated test for `Home Link Block` to check that the `Back to Parent` navigation buttons work correctly.
- Added automated test for `Submenu Block` to check that the `Back to Parent` navigation buttons work correctly.
- Added automated test to verify functionality of the `Tag Cloud Block` and its inner blocks.
- Added automated test for `Archives Block` to check its inner blocks work correctly.
- Added automated test for `Page List Block` to check its inner blocks work correctly.
- Added automated test for `List Block` to check its inner blocks work correctly.
- Added automated test for `List Item Block` to check its inner blocks work correctly.
- Added automated test for `Details Block` to check its inner blocks work correctly.
- Added automated test for `Image Block` to check its inner blocks work correctly.

### Miscellaneous

- Updated the changelog for the blockera/blocks-core package.
