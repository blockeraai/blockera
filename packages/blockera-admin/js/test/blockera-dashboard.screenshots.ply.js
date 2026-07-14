/**
 * Visual snapshot test for Blockera Dashboard
 * Playwright e2e test
 */
const { goTo } = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Blockera Dashboard → Visual Test', () => {
	test('screenshot dashboard', async ({ page }) => {
		await goTo(
			page,
			'/wp-admin/admin.php?page=blockera-settings-dashboard'
		);

		// disable wp footer to avoid screenshot issue
		await page.evaluate(() => {
			const wpfooter = document.querySelector('#wpfooter');
			if (wpfooter) {
				wpfooter.style.display = 'none';
			}
		});

		// disable sticky menu to avoid screenshot issue
		await page.evaluate(() => {
			const adminmenuwrap = document.querySelector('#adminmenuwrap');
			if (adminmenuwrap) {
				adminmenuwrap.style.position = 'relative';
			}
		});

		// Wait for content to be ready
		await page.waitForTimeout(500);

		// Dashboard Snapshot
		const body = page.locator('body');
		await body.scrollIntoViewIfNeeded();

		await page.setViewportSize({
			width: 1600,
			height: 1500,
		});

		// Soft assertion keeps the failure on this test (avoid try/catch + afterAll,
		// which can be misreported as flaky on CI retries).
		await expect.soft(body).toHaveScreenshot(`dashboard.png`, {
			threshold: 0.02,
		});
	});
});
