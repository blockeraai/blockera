## Unreleased

### Bug Fixes

- Fix: Blockera bootstrapper problems while domReady!
- Fix: The automatic `readme.txt` file generator fix.

### New Features

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

### Improvements

- Implemented shared and unstable registration for block type attributes.
- Initialized the Bootstrap canvas editor when the WordPress site editor loads.
