## Unreleased

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
 