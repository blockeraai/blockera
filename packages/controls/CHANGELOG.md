## Unreleased

### New Features
- Added `children` support to `RepeaterControl` component to allow developers to add custom content to the repeater control.
- Blockera interface uses current user WP color for interface fore more unified design in block editor.

## 1.2.2 (2025-04-27)

### Improvements
- Design and UX improvements.


## 1.2.1 (2025-04-23)

### Improvements
- Features upgrade to pro notice design improvement.


## 1.2.0 (2025-04-22)

### New Features
- Implemented inner `Code Control` component to allow developers to create code control for any languages.

### Bug Fixes
- Design issue in popovers after setting `Hover` state for block. 


## 1.1.3 (2025-04-12)

### Improvements
- Add WP 6.8 compatibility.
- Improve overall codes.
- Improve Unit Inputs for 'No Unit' state. 
- Border feature improved to show a warning for color if width was set and the color wasn't!


## 1.1.2 (2025-03-29)

### Improvements
- Clear value button added to spacing control open popovers.
- UX Improvement for spacing control to open popover for setting value by one click.
- Design improvement for spacing control while using units other than PX.
- UX Improvement for color picker to have delete button and also better error for Eye Dropper browser support.
- UX Improvement for position control to open popover for setting value by one click.
- Clear value button added to position control open popovers.

### Automated Tests
- Improve E2E tests of spacing control to test more scenarios.
- Improve E2E test of spacing control to test "Clear value" button. 
- Improve E2E tests of position control to test more scenarios.
- Improve E2E test of position control to test "Clear value" button. 

### Bug Fixes
- Design issue in box position control about variable values. 


## 1.1.1 (2025-03-17)

### Improvements
- Improve variable unlink feature to try extract real value from var(...) while unlinking. [Thanks Hoang]

### Bug Fixes
- Design issue in spacing feature. 
- Fixed an issue where the input control was not accepting a value of 0 [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/other-bugs-of-blockera-v1-5-pGcrLeGU8mc0S7J)]

## 1.1.0 (2025-03-15)

### New Features
- Added a reset (X) icon to allow users to quickly revert feature values to improve UX [[🔗 Feature Request](https://community.blockera.ai/feature-request-1rsjg2ck/post/simplifying-the-process-of-reseting-features-value-tEpNZzvvd64SAX2)]
- Added a fast shortcut for resetting features by holing Shift key and click on the label.
- Added dynamic unit switching in input controls - Users can now change units by typing them directly (e.g., typing "12px" or "12%" automatically updates both value and unit) [[🔗 Feature Request](https://community.blockera.ai/feature-request-1rsjg2ck/post/support-changing-the-unit-of-input-by-typing-it-nVKjZXQKHGTN4Da)]
- Added Shift key modifier for input controls - Hold Shift while using arrow keys to increment/decrement values by 10 instead of 1, enabling faster value adjustments.
- Added mathematical calculation support in input controls:[[🔗 Feature Request](https://community.blockera.ai/feature-request-1rsjg2ck/post/calculation-support-in-input-fields-vYgMNzDYuGLilZy)]
- Supports basic operations (+, -, *, /)
- Evaluates on Enter key or loosing focus.
- Example: Type "10 + 20" and press Enter to calculate.
- Added color variables support to border line feature.
- Added loading component to show a loading state while content is being fetched or processed, featuring animated dots that provide visual feedback to users during wait times.

### Improvements
- Update border radius control to improve UX.
- Update border control to improve UX.
- Update color control to improve UX.
- When copying values from unit inputs (like px, em, rem), the unit is now automatically appended to the copied text.
- Support for decimal values on input control.
- Improvement on variables green pointer design.

### Bug Fixes
- Fixed an issue where the select control style is not correct when the control is focused or opened.
- Fixed an issue where the input control style is not correct when the control is focused or hovered.
- Fixed an issue where the border line control preview is not correct.
- Fixed an issue where the transform feature control shows value incorrectly.
- Fixed an issue where the controls are overlapping the "x" reset icon. (Thanks Hoang Hxn)
- Fixed an issue where the border line control had incorrect default values, causing inconsistent initial states and UI behavior. Updated the default values to properly initialize the control and ensure consistent functionality with the value addon interface.

### Automated Tests
- Added comprehensive test coverage for input controls, including number inputs, unit selection, keyboard navigation, and copy/paste functionality.
- Added complete test for input control calculation feature.
- Added test to check opening variable picker by typing "--".
- Added test to Border Line feature for using variable colors on all and custom borders completely.

## 1.0.2 (2025-02-03)

### Improvements
- Updated the variable picker to display external product variables before theme variables.

## 1.0.1 (2025-01-22)

### Bug Fixes
- Fixed an issue where variable colors appeared lighter in Blockera Variables than in the original variables  [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/showing-theme-colors-as-they-are-4VjzJz6qKKL9HdQ)]

### Improvements
- Improved variable picker to display accurate title indicating whether the variable is sourced from the block theme or block editor.


## 1.0.0 (2024-12-08)

### Bug Fixes
- Gap feature design issue [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/gap-feature-design-issue-oF3n51EmkszId4T)]
- Extra horizontal scroll in block inspector [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/horizontal-scroll-in-block-inspectror-gKJ6oUo3qLdRo9Y)]
- Refactor input control to improve performance and fix issues.
- Fixed an issue where the input control was not accepting a value of 0 [[🔗 Bug](https://community.blockera.ai/bugs-mdhyb8nc/post/the-width-feature-does-not-accepts-0-value-74lCJXSXBziXaqU)]

### Improvements
- Improve transform controls popover design.
- Notice control design improvement.
