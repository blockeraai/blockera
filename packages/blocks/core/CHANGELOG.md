## Unreleased

## 1.2.1 (2025-04-23)

### Automated Tests
- Improve `RSS` block tests.
- Improve `Latest Comments` block tests.


## 1.2.0 (2025-04-16)

### New Features
- Added support for the `Query Total` block.

### Automated Tests
- Added E2E tests to check `Query Total` block functionality.
- Blocks monitoring for WP core and WooCommerce blocks to detect new blocks for supporting them.

## 1.1.2 (2025-04-13)

### Automated Tests
- Added E2E tests for the column block to verify:
  - Proper flex-basis CSS property generation instead of width
  - Correct style generation in both editor and frontend views
  - Style sheet inclusion and CSS selector accuracy
  - Compatibility with the experimental style generation optimization feature

## 1.1.1 (2025-04-12)

### Automated Tests
- Improve `Table` block E2E tests to latest changes of WP 6.8.


## 1.1.0 (2025-03-15)

### New Features
- Added support for the Blocksy `Breadcrumbs` block by Blockera.
- Added support for the Blocksy `Breadcrumbs → Text` inner element by Blockera.
- Added support for the Blocksy `Breadcrumbs → Link` inner element by Blockera.
- Added support for the Blocksy `Breadcrumbs → Separator` inner element by Blockera.
- Added support for the Blocksy `Advanced Posts` block by Blockera.
- Added support for the Blocksy `Post Template` block by Blockera.
- Added support for the Blocksy `Advanced Taxonomies` block by Blockera.
- Added support for the Blocksy `Tax Template` block by Blockera.
- Added support for the Blocksy `Widgets Wrapper` block by Blockera.
- Added support for the Blocksy `About Me` block by Blockera.
- Added support for the Blocksy `About Me → Text` inner block by Blockera.
- Added support for the Blocksy `About Me → Icons` inner block by Blockera.
- Added support for the Blocksy `About Me → Icons Border Color` by Blockera.
- Added support for the Blocksy `About Me → Avatar` inner block by Blockera.
- Added support for the Blocksy `About Me → Name` inner block by Blockera.
- Added support for the Blocksy `About Me → Profile Link` inner block by Blockera.
- Added support for the Blocksy `Contact Info` block by Blockera.
- Added support for the Blocksy `Contact Info → Titles` inner block by Blockera.
- Added support for the Blocksy `Contact Info → Contents` inner block by Blockera.
- Added support for the Blocksy `Contact Info → Icons` inner block by Blockera.
- Added support for the Blocksy `Contact Info → Texts` inner block by Blockera.
- Added support for the Blocksy `Contact Info → Links` inner block by Blockera.
- Added support for the Blocksy `Socials` block by Blockera.
- Added support for the Blocksy `Socials → Icons` inner block by Blockera.
- Added support for the Blocksy `Share Box` block by Blockera.
- Added support for the Blocksy `Share Box → Icons` inner block by Blockera.
- Added support for the Blocksy `Share Box → Icons Color` inner block by Blockera.
- Added support for the Blocksy `Share Box → Icons Hover Color` inner block by Blockera.
- Added support for the Blocksy `Share Box → Icons Border Color` inner block by Blockera.
- Added support for the Blocksy `Share Box → Icons Border Hover Color` inner block by Blockera.
- Added support for the Blocksy `Share Box → Icons Background Color` inner block by Blockera.
- Added support for the Blocksy `Share Box → Icons Background Hover Color` inner block by Blockera.
- Added support for the Blocksy `Search` block by Blockera.
- Added support for the Blocksy `Search → Input` inner block by Blockera.
- Added support for the Blocksy `Search → Button` inner block by Blockera.
- Added support for the Blocksy `Search → Result Dropdown` inner block by Blockera.
- Added support for the Blocksy `Search → Result Link` inner block by Blockera.
- Added support for the Blocksy `Search → Taxonomy Filter` inner block by Blockera.
- Added support for the Blocksy `Dynamic Data` block by Blockera.
- Added support for the Blocksy `Dynamic Data → Link` inner block by Blockera.
- Added support for the Blocksy `Dynamic Data → Image` inner block by Blockera.

### Improvements
- Core search block inner block icons improved to be more consistent and user-friendly.
- `Readmore` block: improve support.
- `Post Comments Form` block: improve support.
- `Latest Comments` block: improve support.
- `Button` block: improve support.
- `Buttons` block: improve support.


### Automated Tests
- Added E2E tests for all core blocks to test block functionality + inner blocks functionality. 🔥🔥
- Added E2E tests for the Blocksy `Breadcrumbs` block text inner element.
- Added E2E tests for the Blocksy `Breadcrumbs` block link inner element.
- Added E2E tests for the Blocksy `Breadcrumbs` block separator inner element.
- Added E2E tests for the Blocksy `Advanced Posts` block support by Blockera.
- Added E2E tests for the Blocksy `Post Template` block support by Blockera.
- Added E2E tests for the Blocksy `Advanced Taxonomies` block support by Blockera.
- Added E2E tests for the Blocksy `Tax Template` block support by Blockera.
- Added E2E tests for the Blocksy `Widgets Wrapper` block support by Blockera.
- Added E2E tests for the Blocksy `About Me` block support by Blockera.
- Added E2E tests for the Blocksy `About Me → Text` inner block.
- Added E2E tests for the Blocksy `About Me → Icons` inner block.
- Added E2E tests for the Blocksy `About Me → Icons Border Color` inner block.
- Added E2E tests for the Blocksy `About Me → Avatar` inner block.
- Added E2E tests for the Blocksy `About Me → Name` inner block.
- Added E2E tests for the Blocksy `About Me → Profile Link` inner block.
- Added E2E tests for the Blocksy `Contact Info` block support by Blockera.
- Added E2E tests for the Blocksy `Contact Info → Titles` inner block.
- Added E2E tests for the Blocksy `Contact Info → Contents` inner block.
- Added E2E tests for the Blocksy `Contact Info → Icons` inner block.
- Added E2E tests for the Blocksy `Contact Info → Texts` inner block.
- Added E2E tests for the Blocksy `Contact Info → Links` inner block.
- Added E2E tests for the Blocksy `Socials` block support by Blockera.
- Added E2E tests for the Blocksy `Socials → Icons` inner block.
- Added E2E tests for the Blocksy `Share Box` block support by Blockera.
- Added E2E tests for the Blocksy `Share Box → Icons` inner block.
- Added E2E tests for the Blocksy `Share Box → Icons Color` inner block.
- Added E2E tests for the Blocksy `Share Box → Icons Hover Color` inner block.
- Added E2E tests for the Blocksy `Share Box → Icons Border Color` inner block.
- Added E2E tests for the Blocksy `Share Box → Icons Border Hover Color` inner block.
- Added E2E tests for the Blocksy `Share Box → Icons Background Color` inner block.
- Added E2E tests for the Blocksy `Share Box → Icons Background Hover Color` inner block.
- Added E2E tests for the Blocksy `Search` block support by Blockera.
- Added E2E tests for the Blocksy `Search → Input` inner block.
- Added E2E tests for the Blocksy `Search → Button` inner block.
- Added E2E tests for the Blocksy `Search → Result Dropdown` inner block.
- Added E2E tests for the Blocksy `Search → Result Link` inner block.
- Added E2E tests for the Blocksy `Dynamic Data` block support by Blockera.
- Added E2E tests for the Blocksy `Dynamic Data → Link` inner block.
- Added E2E tests for the Blocksy `Dynamic Data → Image` inner block.
- Improve tests for Gap feature to check all different usages and situations. 
- Improve tests for `Button` block. 
- Improve `Post Content` block tests to test it while changing post template.

### Bug Fixes
- Flex child block section not showing for child blocks of 9 blocks (e.g. `Columns`, `Buttons`, `Social Links` and etc.).
- `Post Comments Form` block inner blocks not working in non-block themes.
- The `Separator` inner block of the `Post Terms` not working properly.
- The `Aspect Ratio` feature not working properly in the `Image` block.
- The CSS selector of the `Images Caption` inner block of the `Gallery Block` not working properly.

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
