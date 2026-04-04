## Unreleased

### New Features
- Added new helper functions to improve plugin functionality.

### Improvements
- Length values used in block styles (for example borders and shadows) are normalized more reliably when saved data uses shorthand decimals or omits a unit; the `normalizeCssLengthValue` helper also accepts an optional default unit (defaults to `px`, or use an empty string to keep numbers unitless).

## 1.2.1 (2025-06-10)

### Improvements
- Enhanced URL utilities with more robust domain extraction and parameter parsing capabilities.

## 1.2.0 (2025-04-27)

### New Features
- Added `getSortedObject` helper to sort objects by `priority` property.

## 1.1.0 (2025-03-15)

### New Features
- Add `Shift` key to increase/decrease value by 10x in `Input` and `Spacing` fields.

### Improvements
- Improve the input fields to change value by dragging the mouse after a 5 pixel threshold is reached.

## 1.0.0 (2024-12-08)

### New Features

- Added modifySelectorPos() method to the utilities object.

### Automated Tests:

- Added full PHPUnit tests for the Blockera\Utils\Utils class.