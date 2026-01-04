/**
 * Visual snapshot test for Blockera Dashboard
 * Playwright e2e test
 */
const path = require('path');
const fs = require('fs');
const { goTo } = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	compareScreenshot,
} = require('@blockera/dev-playwright/js/support/commands');

const failures = [];

test.describe('Visual Regression Test', () => {
	// Configure snapshot directory for this test
	const snapshotDir = path.resolve(__dirname, 'snapshots');
	if (!fs.existsSync(snapshotDir)) {
		fs.mkdirSync(snapshotDir, { recursive: true });
	}

	test.beforeEach(({}, testInfo) => {
		// Override snapshotPath function to use custom directory
		testInfo.snapshotPath = (snapshotName) => {
			return path.resolve(snapshotDir, snapshotName);
		};
	});

	test('screenshot dashboard', async ({ page }, testInfo) => {
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

		try {
			await compareScreenshot(
				body,
				'dashboard.png',
				snapshotDir,
				testInfo,
				0.02
			);
		} catch (error) {
			failures.push({
				name: 'dashboard',
				error: error.message,
			});
		}
	});

	test.afterAll(() => {
		// After all tests, check if any failed and throw combined error
		if (failures.length > 0) {
			const errorMessage = failures
				.map((f, i) => `\n${i + 1}. ${f.name}:\n   ${f.error}`)
				.join('\n');
			throw new Error(
				`${failures.length} screenshot(s) failed:${errorMessage}`
			);
		}
	});
});
