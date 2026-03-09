/**
 * Block Unique Classname → Functionality
 * Playwright e2e test
 */
const { createPost } = require('@blockera/dev-playwright/js/utils/helpers');
const {
	appendBlocks,
	getSelectedBlock,
	doBlockToolbarContextMenuOption,
} = require('@blockera/dev-playwright/js/utils/editor');
const {
	test,
	expect,
	getBlock,
	getParentContainer,
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Block Unique Classname → Functionality', () => {
	test.beforeEach(async ({ page }) => {
		await createPost(page);

		await appendBlocks(
			page,
			`<!-- wp:paragraph -->
				<p>test</p>
			<!-- /wp:paragraph -->`
		);

		const block = await getBlock(page, 'core/paragraph');
		await block.nth(0).click();
	});

	test('should be generate unique classname for duplicate blocks while copying', async ({
		page,
	}) => {
		// Add alias to the feature container
		const bgColorContainer = await getParentContainer(page, 'BG Color');

		// Act: clicking on color button
		const colorBtn = bgColorContainer.locator('[data-cy="color-btn"]');
		if ((await colorBtn.count()) > 0) {
			await bgColorContainer
				.locator('[data-cy="value-addon-btn-open"]')
				.click({
					force: true,
				});
		} else {
			await bgColorContainer
				.locator('[data-cy="value-addon-btn"]')
				.click({
					force: true,
				});
		}

		// Select variable
		await page
			.locator('[data-cy="va-item-accent-4"]')
			.click({ force: true });

		const originBlockClassname = await getSelectedBlock(page, 'className');

		await doBlockToolbarContextMenuOption(page, 'Duplicate');

		// Act: clicking on color button
		// Add alias to the feature container
		const bgColorContainer1 = await getParentContainer(page, 'BG Color');
		const colorBtn1 = bgColorContainer1.locator('[data-cy="color-btn"]');
		if ((await colorBtn1.count()) > 0) {
			await bgColorContainer1
				.locator('[data-cy="value-addon-btn-open"]')
				.click({
					force: true,
				});
		} else {
			await bgColorContainer1
				.locator('[data-cy="value-addon-btn"]')
				.click({
					force: true,
				});
		}

		// Select variable
		await page
			.locator('[data-cy="va-item-accent-5"]')
			.click({ force: true });

		const duplicatedBlockClassname = await getSelectedBlock(
			page,
			'className'
		);

		expect(originBlockClassname).not.toEqual(duplicatedBlockClassname);
	});
});
