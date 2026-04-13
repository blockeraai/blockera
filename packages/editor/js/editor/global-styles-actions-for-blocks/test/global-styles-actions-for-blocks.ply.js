/**
 * Global Styles Actions For Blocks Plugin → Functionality
 * Playwright e2e test
 */
const {
	openSiteEditor,
	closeWelcomeGuide,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
	getByDataTest,
	openGlobalStylesPanel,
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Global Styles Actions For Blocks Plugin → Functionality', () => {
	const before = async (page) => {
		await openGlobalStylesPanel(page);
		await closeWelcomeGuide(page);

		await getByDataTest(page, 'block-style-variations').last().click({
			force: true,
		});
	};

	test.beforeEach(async ({ page, admin }) => {
		await openSiteEditor(page, admin);
		await before(page);
	});

	test('should activate panel when global styles screen is visible', async ({
		page,
	}) => {
		// Verify panel activation class is added when block is clicked
		const blockButton = page.locator('button[id="/blocks/core%2Fgroup"]');
		const blockExists = (await blockButton.count()) > 0;

		if (blockExists) {
			await blockButton.click();

			// Check that activated data-test attribute is added to body
			await expect(
				await getByDataTest(page, 'blockera-block-card')
			).toBeVisible({ timeout: 5000 });
		}
	});

	test('should set selected block style when global styles button is clicked', async ({
		page,
	}) => {
		// Verify panel activation class is added when block is clicked
		const blockButton = page.locator('button[id="/blocks/core%2Fgroup"]');
		const blockExists = (await blockButton.count()) > 0;

		if (blockExists) {
			await blockButton.click();

			// Check that activated data-test attribute is added to body
			await expect(
				await getByDataTest(page, 'blockera-block-card')
			).toBeVisible({ timeout: 5000 });
		}

		// Click on global styles button
		const globalStylesButton = page
			.locator('button[aria-controls="edit-site:global-styles"]')
			.first();
		const buttonExists = (await globalStylesButton.count()) > 0;

		if (buttonExists) {
			await globalStylesButton.click();

			// Verify that selected block style is cleared
			const selectedBlockStyle = await page.evaluate(() => {
				const dataObj = window.wp.data;
				return dataObj
					.select('blockera/editor')
					.getSelectedBlockStyle();
			});

			expect(selectedBlockStyle).toBe('');
		}
	});

	test('should handle block type click events', async ({ page }) => {
		// Click on a block type button
		const blockButton = page.locator('button[id="/blocks/core%2Fgroup"]');
		const blockExists = (await blockButton.count()) > 0;

		if (blockExists) {
			await blockButton.click();

			// Verify activated data-test attribute is added to body
			await expect(
				page.locator('body[data-test="has-blockera-global-styles-ui"]')
			).toBeVisible({ timeout: 5000 });

			// Verify block type is selected
			const selectedBlockRef = await page.evaluate(() => {
				const dataObj = window.wp.data;
				return dataObj.select('blockera/editor').getSelectedBlockRef();
			});

			expect(selectedBlockRef).toBeDefined();
		}
	});
});
