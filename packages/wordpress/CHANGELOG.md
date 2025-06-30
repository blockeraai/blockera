## Unreleased

### New Features
- Added support for icons in blocks, allowing users to easily add and customize icons in their content.

## 1.1.5 (2025-06-10)

### Bug Fixes
- Fixed a bug in the panel admin React components to improve user experience.
- Fixed design overflow issue on the Blockera admin pages.

### Improvements
- Improved the assets loader to be more flexible and easier to use of packages versions and dependencies.

## 1.1.4 (2025-05-25)

### Improvements
- Improved the APIs of the `blockera/wordpress` package to be more flexible and easier to use.

## 1.1.3 (2025-05-24)

### Bug Fixes
- Fixed a bug where the style engine failed to generate when block content was created through shortcodes in the front end.

## 1.1.2 (2025-04-16)

### Bug Fixes
- Fixed a bug in the front end where the style engine was not being flushed and rewritten when the block content was created by blockera site builder.

### Improvements
- Improve admin page design.

## 1.1.1 (2025-04-12)

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
 