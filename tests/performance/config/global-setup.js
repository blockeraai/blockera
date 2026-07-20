/**
 * Authenticate as admin and pin Twenty Twenty-Five for performance runs.
 *
 * Adapted from WordPress core tests/performance/config/global-setup.js
 */

const { request } = require('@playwright/test');
const { RequestUtils } = require('@wordpress/e2e-test-utils-playwright');

/**
 * @param {import('@playwright/test').FullConfig} config
 * @return {Promise<void>}
 */
async function globalSetup(config) {
	const { storageState, baseURL } = config.projects[0].use;
	const storageStatePath =
		typeof storageState === 'string' ? storageState : undefined;

	const requestContext = await request.newContext({
		baseURL,
	});

	const requestUtils = new RequestUtils(requestContext, {
		storageStatePath,
	});

	await requestUtils.setupRest();
	await requestUtils.activateTheme('twentytwentyfive');

	await requestContext.dispose();
}

module.exports = globalSetup;
