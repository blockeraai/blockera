/**
 * Style Variations Inside Global Styles Panel → Functionality
 * Playwright e2e test
 */
const {
	savePage,
	openSiteEditor,
	getWPDataObject,
	closeWelcomeGuide,
	getSelectedBlockStyle,
	getEditedGlobalStylesRecord,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
	getByDataTest,
	getParentContainer,
	getBlock,
	getByDataCy,
	openGlobalStylesPanel,
	openSettingsPanel,
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Style Variations Inside Global Styles Panel → Functionality', () => {
	const before = async (page) => {
		await openGlobalStylesPanel(page);

		await closeWelcomeGuide(page);

		await getByDataTest(page, 'block-style-variations').nth(1).click();

		await page.locator('button[id="/blocks/core%2Fgroup"]').click();
	};

	test.beforeEach(async ({ page, admin }) => {
		await openSiteEditor(page, admin);

		await before(page);
	});

	test('should be able to duplicate specific style variation', async ({
		page,
	}) => {
		await getByDataTest(page, 'open-default-contextmenu').click();
		await page
			.locator('.blockera-component-popover-body button')
			.filter({ hasText: 'Duplicate' })
			.click();
		await expect(getByDataTest(page, 'style-default-copy')).toBeVisible();

		await getByDataTest(page, 'open-default-copy-contextmenu').click();
		await page
			.locator('.blockera-component-popover-body button')
			.filter({ hasText: 'Duplicate' })
			.click();
		await expect(getByDataTest(page, 'style-default-copy-1')).toBeVisible();

		await getByDataTest(page, 'open-section-1-contextmenu').click();
		await page
			.locator('.blockera-component-popover-body button')
			.filter({ hasText: 'Duplicate' })
			.click();
		await expect(getByDataTest(page, 'style-section-1-copy')).toBeVisible();

		await savePage(page);
		await page.reload();

		await before(page);
		await getByDataTest(page, 'open-default-contextmenu').click();
		await expect(getByDataTest(page, 'style-default-copy')).toBeVisible();
		await expect(getByDataTest(page, 'style-default-copy-1')).toBeVisible();
		await expect(getByDataTest(page, 'style-section-1-copy')).toBeVisible();
	});

	test('should be able to clear customizations from specific style variation', async ({
		page,
	}) => {
		await getByDataTest(page, 'style-section-1').click();

		// Add alias to the feature container
		const bgColorContainer = getParentContainer(page, 'BG Color');

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

		// Assert data
		const selectedStyle = await getSelectedBlockStyle(
			page,
			'core/group',
			'section-1'
		);

		expect({
			settings: {
				name: 'Accent 4',
				id: 'accent-4',
				value: '#686868',
				reference: {
					type: 'theme',
					theme: 'Twenty Twenty-Five',
				},
				type: 'color',
				var: '--wp--preset--color--accent-4',
			},
			name: 'Accent 4',
			isValueAddon: true,
			valueType: 'variable',
		}).toEqual(selectedStyle?.blockeraBackgroundColor?.value);

		await savePage(page);
		await page.reload();

		await before(page);
		await getByDataTest(page, 'style-section-1').click();
		await getByDataTest(page, 'open-section-1-contextmenu').nth(1).click();
		await page
			.locator('.blockera-component-popover-body button')
			.filter({ hasText: 'Clear all customizations' })
			.click();

		// Assert blockera data
		const selectedStyleAfterClear = await getSelectedBlockStyle(
			page,
			'core/group',
			'section-1'
		);

		expect(
			selectedStyleAfterClear?.blockeraBackgroundColor?.value
		).toBeUndefined();

		// Assert WordPress data
		const globalStylesRecord = await getEditedGlobalStylesRecord(
			page,
			'styles'
		);
		expect(globalStylesRecord).toEqual({});

		await savePage(page);
		await page.reload();

		await before(page);
		await getByDataTest(page, 'style-section-1').click();

		// Assert blockera data
		const selectedStyleAfterReload = await getSelectedBlockStyle(
			page,
			'core/group',
			'section-1'
		);

		expect(
			selectedStyleAfterReload?.blockeraBackgroundColor?.value
		).toBeUndefined();

		// Assert WordPress data
		const globalStylesRecordAfterReload = await getEditedGlobalStylesRecord(
			page,
			'styles'
		);
		expect(globalStylesRecordAfterReload).toEqual({});
	});

	test('should be able to rename specific style variation', async ({
		page,
	}) => {
		await getByDataTest(page, 'style-section-1').click();
		await getByDataTest(page, 'open-section-1-contextmenu').nth(1).click();
		await page
			.locator('.blockera-component-popover-body button')
			.filter({ hasText: 'Rename' })
			.click();

		const nameContainer = getParentContainer(page, 'Name');
		await nameContainer.locator('input').clear();
		await nameContainer.locator('input').fill('New Name');

		await getByDataTest(page, 'save-rename-button').click();
		await expect(getByDataTest(page, 'style-section-1')).toContainText(
			'New Name'
		);

		await savePage(page);
		await page.reload();

		await before(page);
		await getByDataTest(page, 'style-section-1').click();
		await expect(getByDataTest(page, 'style-section-1')).toContainText(
			'New Name'
		);
	});

	test('should be able to rename with new ID specific style variation', async ({
		page,
	}) => {
		await getByDataTest(page, 'style-section-1').click();
		await getByDataTest(page, 'open-section-1-contextmenu').nth(1).click();
		await page
			.locator('.blockera-component-popover-body button')
			.filter({ hasText: 'Rename' })
			.click();
		const nameContainer = getParentContainer(page, 'Name');
		await nameContainer.locator('input').clear();
		await nameContainer.locator('input').fill('New Name');

		const idContainer = getParentContainer(page, 'ID');
		await idContainer.locator('input').clear();
		await idContainer.locator('input').fill('new id');

		await page.locator('input[type="checkbox"]').check();
		await getByDataTest(page, 'save-rename-button').click();
		await expect(getByDataTest(page, 'style-new-id')).toContainText(
			'New Name'
		);

		await savePage(page);
		await page.reload();

		await before(page);
		await expect(getByDataTest(page, 'style-new-id')).toContainText(
			'New Name'
		);
	});

	test('should be able to Active/Inactive specific style variation', async ({
		page,
	}) => {
		await getByDataTest(page, 'open-new-id-contextmenu').nth(0).click();

		await page
			.locator('.blockera-component-grid')
			.filter({ hasText: 'Active Style' })
			.locator('input')
			.click();

		await expect(getByDataTest(page, 'style-new-id')).not.toHaveClass(
			/is-enabled/
		);

		await getByDataTest(page, 'style-new-id').click();

		const data = await getWPDataObject(page);
		const selectedVariation = await page.evaluate((dataObj) => {
			return dataObj
				.select('blockera/editor')
				.getSelectedBlockStyleVariation();
		}, data);

		expect(selectedVariation).toBeUndefined();

		await openSettingsPanel(page);
		const block = await getBlock(page, 'core/group');
		await block.nth(0).click();

		await expect(
			getByDataTest(page, 'style-variations-button')
		).toBeVisible();
		await getByDataTest(page, 'style-variations-button').click();

		const popover = page
			.locator('.blockera-component-popover.variations-picker-popover')
			.last();

		await expect(
			popover.locator('[data-test="style-new-id"]')
		).not.toHaveClass(/is-enabled/);

		const selectedVariationInPopover = await page.evaluate((dataObj) => {
			return dataObj
				.select('blockera/editor')
				.getSelectedBlockStyleVariation();
		}, data);

		expect(selectedVariationInPopover).toBeUndefined();

		await savePage(page);
		await page.reload();

		await before(page);
		await getByDataTest(page, 'style-new-id').click();

		const dataAfterReload = await getWPDataObject(page);
		const selectedVariationAfterReload = await page.evaluate((dataObj) => {
			return dataObj
				.select('blockera/editor')
				.getSelectedBlockStyleVariation();
		}, dataAfterReload);

		expect(selectedVariationAfterReload).toBeUndefined();

		await openSettingsPanel(page);
		const blockAfterReload = await getBlock(page, 'core/group');
		await blockAfterReload.nth(0).click();

		await expect(
			getByDataTest(page, 'style-variations-button')
		).toBeVisible();
		await getByDataTest(page, 'style-variations-button').click();

		const popoverAfterReload = page
			.locator('.blockera-component-popover.variations-picker-popover')
			.last();

		await expect(
			popoverAfterReload.locator('[data-test="style-new-id"]')
		).not.toHaveClass(/is-enabled/);

		const selectedVariationInPopoverAfterReload = await page.evaluate(
			(dataObj) => {
				return dataObj
					.select('blockera/editor')
					.getSelectedBlockStyleVariation();
			},
			dataAfterReload
		);

		expect(selectedVariationInPopoverAfterReload).toBeUndefined();

		await getByDataTest(page, 'open-new-id-contextmenu').nth(0).click();

		await getByDataTest(page, 'style-variations-button').click();
		await page
			.locator('.blockera-component-grid')
			.filter({ hasText: 'Active Style' })
			.locator('input')
			.click();
	});

	test('should be able to delete specific style variation', async ({
		page,
	}) => {
		await getByDataTest(page, 'open-new-id-contextmenu').nth(0).click();
		await page
			.locator('.blockera-component-popover-body button')
			.filter({ hasText: 'Delete' })
			.click();

		const modalContent = page.locator('.components-modal__content');
		await modalContent.locator('input[type="checkbox"]').check();
		await getByDataTest(page, 'delete-button').click();

		await expect(getByDataTest(page, 'style-new-id')).not.toBeVisible();

		const data = await getWPDataObject(page);
		const blockStyles = await page.evaluate((dataObj) => {
			return (
				dataObj.select('core/blocks').getBlockStyles('core/group')
					?.length || 0
			);
		}, data);

		expect(blockStyles).toBe(4);

		await openSettingsPanel(page);
		const block = await getBlock(page, 'core/group');
		await block.nth(0).click();

		await expect(
			getByDataTest(page, 'style-variations-button')
		).toBeVisible();
		await getByDataTest(page, 'style-variations-button').click();

		const popover = page
			.locator('.blockera-component-popover.variations-picker-popover')
			.last();

		await expect(
			popover.locator('[data-test="style-new-id"]')
		).not.toBeVisible();

		await savePage(page);
		await page.reload();

		await before(page);
		await expect(getByDataTest(page, 'style-new-id')).not.toBeVisible();

		const dataAfterReload = await getWPDataObject(page);
		const blockStylesAfterReload = await page.evaluate((dataObj) => {
			return (
				dataObj.select('core/blocks').getBlockStyles('core/group')
					?.length || 0
			);
		}, dataAfterReload);

		expect(blockStylesAfterReload).toBe(3);

		await openSettingsPanel(page);
		const blockAfterReload = await getBlock(page, 'core/group');
		await blockAfterReload.nth(0).click();

		await expect(
			getByDataTest(page, 'style-variations-button')
		).toBeVisible();
		await getByDataTest(page, 'style-variations-button').click();

		const popoverAfterReload = page
			.locator('.blockera-component-popover.variations-picker-popover')
			.last();

		await expect(
			popoverAfterReload.locator('[data-test="style-new-id"]')
		).not.toBeVisible();
	});
});
