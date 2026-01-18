## Unreleased

## Improvements

-   **Improved WordPress Core API Compatibility**: Enhanced variable support for colors, gradients, spacing, and font sizes to work seamlessly with WordPress core's native CSS variable format. This ensures better compatibility with WordPress themes and the block editor, allowing variables to be recognized whether they use WordPress's standard format or Blockera's internal format.
-   **Better Theme Integration**: Color, gradient, spacing, and font size variables now properly recognize and work with WordPress theme presets, making it easier to use theme-defined design tokens across your site.

## 1.1.0 (2025-03-15)

### New Features
- Added a new cache mechanism to increase speed of rendering blocks on front end pages and ensure that the blockera site editor outputs are always up to date.

## 1.0.2 (2025-02-03)

### Improvements
- Showing color palette of the current non-block theme in the colors variable picker (for Blocksy theme compatibility).
- Enhanced the clear cache functionality to ensure that the cache is cleared correctly.

### Bug Fixes
- Fix a bug for when the variable items from theme has not name information.


## 1.0.1 (2025-01-22)

### Bug Fixes
- Fixed an issue where block themes without variable settings for Spacing and Color would cause errors. [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/theme-defined-spacing-does-not-fall-back-to-wordpress-defaults-Ft6gpFAjwsMoNA8)]
- Fixed JavaScript undefined errors when accessing theme variables and settings.


## 1.0.0 (2024-12-08)

### Fixed
- Fixed an issue where theme gradients could result in undefined behavior.
