## Unreleased

### Improvements
- Refactored the registration of the block type to be a single time to improved performance.

## 1.1.0 (2025-03-15)

### New Features
- Added a new feature to cleanup inline styles from the block elements on the front end.

### Bug Fixes
- Fixed a bug in the style engine optimization affecting the Render content of post and blocks.

## 1.0.1 (2024-12-21)

### Bug Fixes
- Fixed the current identifier of the Blockera admin page menu in the WordPress dashboard.
- Resolved compatibility issues with PHP 7.4.

## 1.0.0 (2024-12-08)

### Bug Fixes

- Fixed a bug in the cache mechanism affecting the Render block. [[[🔗 Bug]](https://community.blockera.ai/changelog-9l8hbrv0/post/version-1-0---in-development-oz0Mrh3r3JN0QDO)]

### Improvements

- Refactored inline styles to be printed in the wp_head hook for better performance and consistency.
- Enhanced the Render class by flushing and rewriting CSS rules for better efficiency.
- Separated the experimental icon element rendering into a distinct process for improved modularity.

### New Feature

- Added new helper functions in the `blockera/wordpress` package.

### Automated Tests

- Added new test suites to fully test the new helper functions in the `blockera/wordpress` package.
 