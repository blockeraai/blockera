## Unreleased

### Bug Fixes

- Blockera bootstrapper problems while domReady!
- The automatic `readme.txt` file generator fix.
- The preview button link issue.
- By clicking on items in feature history graph the breakpoint not changes.
- Prevent of generated duplicate css props
- Background feature CSS generator issues.
- Some PHP warnings and errors.

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
