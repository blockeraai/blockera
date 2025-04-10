## Unreleased

### Bug Fixes
- Fixed compatibility issue with WordPress 6.8-RC1 translate system to ensure proper text domain loading and string translations.

## 1.2.2 (2025-03-29)

### Improvements
- Added more compatibility with the bootstrap package of blockera, to make it easier to extend the plugin.

## 1.2.1 (2025-03-17)

### Improvements
- Blocksy Compatibility: improve Blocksy colors to include real value in settings to make it detectable while unlinking variable. [Thanks Hoang]
- Added compatibility with the Third Party Cache plugins (Like: LiteSpeed) to prevent conflicts.

## 1.2.0 (2025-03-15)

### New Features
- Added support for enabling/disabling the inline styles cleanup feature in block elements.

### Improvements
- Added compatibility with the LiteSpeed Cache plugin to prevent conflicts.

## 1.1.1 (2025-02-04)

### Improvements
- Refactored initialization Blockera application to improved performance and stability.

## 1.1.0 (2025-02-03)

### New Features
- Blocky theme compatibility (Level 1) [[Feature Request](https://community.blockera.ai/feature-request-1rsjg2ck/post/blockera-compatibility-with-the-blocksy-theme-coNZ62pejloObdo)]

### Development Features
- Added automated test pipeline for checking Blocky theme compatibility.
- Added automated test for checking Blocky theme color variables compatibility.
- Added automated test for checking Blocky theme width size variables compatibility.


### Bug Fixes
- Renamed the constants to avoid conflicts with other plugins. [[Bug Report](https://community.blockera.ai/bugs-mdhyb8nc/post/warning-constant-blockera-version-already-defined-uvTMUjomFS8fELi)]

## 1.0.3 (2025-01-22)

### Bug Fixes

- Fixed the language issue.
- Fixed missing translation strings for Blockera plugin text domain [[Bug Report](https://community.blockera.ai/bugs-mdhyb8nc/post/missing-translation-string-for-blockera-iBEIfdKXdbBkpn1)]

## 1.0.2 (2024-12-21)

### Bug Fixes

- Fixed WooCommerce E2E tests for checking WooCommerce blocks support.


## 1.0.1 (2024-12-08)

### Improvements

- Updated the plugin name.
- Updated the contributors list.
- Updated the readme file.
- Updated the plugin description.

## 1.0.0 (2024-12-08)

### Bug Fixes

- Blockera bootstrapper problems while domReady!
- The automatic `readme.txt` file generator fix.
- The preview button link issue.
- By clicking on items in feature history graph the breakpoint not changes.
- Prevent of generated duplicate css props
- Background feature CSS generator issues.
- Some PHP warnings and errors.
- Fix: editor bootstrapper e2e test problems.

### New Features

- Build: Implemented the CI/CD workflow for the Blockera plugin [[Feature Request](https://community.blockera.ai/feature-request-1rsjg2ck/post/ci-cd-pipeline-for-faster-and-better-development-O0jDtppwUbpRre0)]
- Build: Implemented the `release` workflow in GitHub for fast and secure future releases.
- Build: Added automatic VirusTotal checks during the Blockera plugin build.
- Build: Added automatic PHP security checks during the Blockera plugin build.
- Build: Added an automatic file size check to monitor for unusual changes during the Blockera plugin build.
- Build: Added an automatic plugin final file size check to monitor for unusual changes during the Blockera plugin build.
- Build: Added the [Plugin Check (PCP)](https://wordpress.org/plugins/plugin-check/) automated tests to ensure compliance with WordPress plugin guidelines during the Blockera plugin build.
- Build: Automated changelog creation during the Blockera plugin build.
- Build: Ensured all E2E, JS, and PHP tests pass during the Blockera plugin build.
- Build: Ensured all JS and PHP files are error-free and adhere to coding standards during the Blockera plugin build.
- Build: Automated the building and attachment of the plugin zip file to GitHub pull requests.
- New automated test to recheck final plugin zip file in another WP setup to make sure zip and functionality are correct.



### Improvements

- Features history graph to show current state and also some design polish. 
- Implemented shared and unstable registration for block type attributes.
- Initialized the Bootstrap canvas editor when the WordPress site editor loads.
- Various code improvements and refactoring.
- Change repository branching architecture to have only one master branch (Trunk based).
- Typography sections more feature control design improvements.
- Box Spacing & Box Position features design improvements.
