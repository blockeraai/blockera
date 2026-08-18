// Edit packages/global-packages/packages/dev-tools/root-configs/playwright.config.js
// project:bootstrap copies this to the host repo root.
const createPlaywrightConfig = require('./packages/global-packages/packages/dev-tools/js/playwright/config');

export default createPlaywrightConfig({
	rootDir: __dirname,
});
