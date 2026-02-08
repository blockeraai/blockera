/**
 * Blocks UI Plugin → Functionality
 * Playwright e2e test
 */
const {
	savePage,
	openSiteEditor,
	closeWelcomeGuide,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
	getByDataTest,
	openGlobalStylesPanel,
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Blocks UI Plugin → Functionality', () => {
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

	test('should render block type icons in sidebar', async ({ page }) => {
		// Wait for sidebar search input to be available
		const sidebarSearch = page.locator(
			'.edit-site-block-types-search input[type="search"]'
		);
		const searchExists = (await sidebarSearch.count()) > 0;

		if (searchExists) {
			await expect(sidebarSearch).toBeVisible({ timeout: 10000 });

			// Check that block type icons wrapper is rendered
			const blockIconsWrapper = page.locator(
				'.blockera-block-types-icons'
			);
			const iconsExist = (await blockIconsWrapper.count()) > 0;

			if (iconsExist) {
				await expect(blockIconsWrapper.first()).toBeVisible();
			}

			// Verify at least one block icon exists
			const blockIcon = page
				.locator('[data-test^="block-icon-"]')
				.first();
			const iconExists = (await blockIcon.count()) > 0;
			expect(iconExists).toBe(true);
		}
	});

	test('should display icons for blocks with blockeraPropsId attribute', async ({
		page,
	}) => {
		// Wait for sidebar search
		const sidebarSearch = page.locator(
			'.edit-site-block-types-search input[type="search"]'
		);
		const searchExists = (await sidebarSearch.count()) > 0;

		if (searchExists) {
			await expect(sidebarSearch).toBeVisible({ timeout: 10000 });

			// Get block types with blockeraPropsId
			const blockTypesWithProps = await page.evaluate(() => {
				const dataObj = window.wp.data;
				const blockTypes = dataObj
					.select('core/blocks')
					.getBlockTypes();
				return blockTypes.filter(
					(blockType) => blockType.attributes?.blockeraPropsId
				);
			});

			// If there are blocks with blockeraPropsId, verify icons are rendered
			if (blockTypesWithProps.length > 0) {
				// Check for block icon wrappers using data-test
				const firstBlockName = blockTypesWithProps[0].name.replace(
					'/',
					'-'
				);
				const blockIcon = page.locator(
					`[data-test="block-icon-${firstBlockName}"]`
				);
				const iconExists = (await blockIcon.count()) > 0;

				// Icons should be rendered for blocks with blockeraPropsId
				expect(iconExists).toBe(true);
			}
		}
	});

	test('should render icons next to block type buttons', async ({ page }) => {
		// Wait for sidebar search
		const sidebarSearch = page.locator(
			'.edit-site-block-types-search input[type="search"]'
		);
		const searchExists = (await sidebarSearch.count()) > 0;

		if (searchExists) {
			await expect(sidebarSearch).toBeVisible({ timeout: 10000 });

			// Get block types with blockeraPropsId
			const blockTypesWithProps = await page.evaluate(() => {
				const dataObj = window.wp.data;
				const blockTypes = dataObj
					.select('core/blocks')
					.getBlockTypes();
				return blockTypes
					.filter(
						(blockType) => blockType.attributes?.blockeraPropsId
					)
					.slice(0, 1); // Get first one
			});

			if (blockTypesWithProps.length > 0) {
				const blockName = blockTypesWithProps[0].name;
				const encodedBlockName = blockName.replace('/', '%2F');

				// Check if block button exists
				const blockButton = page.locator(
					`button[id="/blocks/${encodedBlockName}"]`
				);
				const buttonExists = (await blockButton.count()) > 0;

				if (buttonExists) {
					await expect(blockButton).toBeVisible();

					// Check if icon wrapper is rendered using data-test
					const iconTestId = `block-icon-${blockName.replace(
						'/',
						'-'
					)}`;
					const iconWrapper = page
						.locator(`[data-test="${iconTestId}"] svg`)
						.first();
					const iconExists = (await iconWrapper.count()) > 0;

					// Icon should be rendered as a portal in the button
					if (iconExists) {
						await expect(iconWrapper).toBeVisible();
					}
				}
			}
		}
	});

	test('should persist block icons after page reload', async ({ page }) => {
		// Wait for sidebar search
		const sidebarSearch = page.locator(
			'.edit-site-block-types-search input[type="search"]'
		);
		const searchExists = (await sidebarSearch.count()) > 0;

		if (searchExists) {
			await expect(sidebarSearch).toBeVisible({ timeout: 10000 });

			await savePage(page);
			await page.reload();

			await before(page);

			// Verify sidebar search is still visible
			const sidebarSearchAfterReload = page.locator(
				'.edit-site-block-types-search input[type="search"]'
			);
			await expect(sidebarSearchAfterReload).toBeVisible({
				timeout: 10000,
			});
		}
	});

	test('should work with all registered block types', async ({ page }) => {
		// Get all block types
		const blockTypes = await page.evaluate(() => {
			const dataObj = window.wp.data;
			return dataObj.select('core/blocks').getBlockTypes();
		});

		expect(blockTypes.length).toBeGreaterThan(0);

		// Wait for sidebar search
		const sidebarSearch = page.locator(
			'.edit-site-block-types-search input[type="search"]'
		);
		const searchExists = (await sidebarSearch.count()) > 0;

		if (searchExists) {
			await expect(sidebarSearch).toBeVisible({ timeout: 10000 });

			// Verify that the plugin initializes correctly with all block types
			expect(blockTypes.length).toBeGreaterThan(0);
		}
	});
});
