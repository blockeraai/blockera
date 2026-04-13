/**
 * Style Variations Inside Global Styles Panel → Functionality
 * Playwright e2e test
 */
const {
	savePage,
	openSiteEditor,
	closeWelcomeGuide,
	getSelectedBlockStyle,
	getEditedWPGlobalStylesRecord,
	selectBlockByType,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
	getByDataTest,
	openSettingsPanel,
	getParentContainer,
	openGlobalStylesPanel,
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
		getByDataTest(page, 'open-default-contextmenu').click();
		await page
			.locator('.blockera-component-popover-body button')
			.filter({ hasText: 'Duplicate' })
			.click();
		getByDataTest(
			await page.locator('.blockera-component-style-variation-modal'),
			'save-duplicate-button'
		).click();
		getByDataTest(page, 'Close Block Style').click();
		await expect(getByDataTest(page, 'style-default-copy')).toBeVisible();

		// The test failed due to a strict mode violation: locator('[data-test="open-default-copy-contextmenu"]') matched multiple elements.
		// To resolve this, disambiguate the target by using .first(), .nth(), or a more specific query.
		getByDataTest(page, 'open-default-copy-contextmenu').first().click();
		await page
			.locator('.blockera-component-popover-body button')
			.filter({ hasText: 'Duplicate' })
			.click();
		await expect(
			getByDataTest(page, 'promote-global-styles-premium-feature')
		).toBeVisible();

		await savePage(page);
		await page.reload();

		await before(page);
		await expect(getByDataTest(page, 'style-default-copy')).toBeVisible();
	});

	test('should be able to clear customizations from specific style variation', async ({
		page,
	}) => {
		await getByDataTest(page, 'style-section-1').click();

		// Add alias to the feature container
		const bgColorContainer = await getParentContainer(page, 'BG Color');

		// Act: clicking on color button
		const colorBtnCount = await bgColorContainer
			.locator('[data-cy="color-btn"]')
			.count();
		if (colorBtnCount > 0) {
			await bgColorContainer
				.locator('[data-cy="value-addon-btn-open"]')
				.click();
		} else {
			await bgColorContainer
				.locator('[data-cy="value-addon-btn"]')
				.click();
		}

		// Select variable
		await page
			.locator(
				'.blockera-component-popover-body [data-cy="va-item-accent-4"]'
			)
			.click();

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
		await getByDataTest(
			page,
			'open-section-1-block-card-contextmenu'
		).click();
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
		const globalStylesRecord = await getEditedWPGlobalStylesRecord(
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
		const globalStylesRecordAfterReload =
			await getEditedWPGlobalStylesRecord(page, 'styles');
		expect(globalStylesRecordAfterReload).toEqual({});
	});

	test('should be able to rename specific style variation', async ({
		page,
	}) => {
		getByDataTest(page, 'style-section-1').click();
		getByDataTest(page, 'open-section-1-block-card-contextmenu').click();
		await page
			.locator('.blockera-component-popover-body button')
			.filter({ hasText: 'Rename' })
			.click();

		const nameContainer = await getParentContainer(page, 'Name');
		await nameContainer.locator('input').clear();
		await nameContainer.locator('input').fill('New Name');

		getByDataTest(page, 'save-rename-button').click();
		await expect(getByDataTest(page, 'style-section-1')).toContainText(
			'New Name'
		);

		await savePage(page);
		await page.reload();

		await before(page);
		getByDataTest(page, 'style-section-1').click();
		await expect(getByDataTest(page, 'style-section-1')).toContainText(
			'New Name'
		);
	});

	test('should be able to rename with new ID specific style variation', async ({
		page,
	}) => {
		await getByDataTest(page, 'style-section-1').click();
		await getByDataTest(
			page,
			'open-section-1-block-card-contextmenu'
		).click();
		await page
			.locator('.blockera-component-popover-body button')
			.filter({ hasText: 'Rename' })
			.click();
		const nameContainer = await getParentContainer(page, 'Name');
		await nameContainer.locator('input').clear();
		await nameContainer.locator('input').fill('New Name');

		const idContainer = await getParentContainer(page, 'ID');
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

		const selectedVariation = await page.evaluate(() => {
			const dataObj = window.wp.data;

			return dataObj
				.select('blockera/editor')
				.getSelectedBlockStyleVariation();
		});

		expect(selectedVariation).toBeUndefined();

		await openSettingsPanel(page);
		await selectBlockByType(page, 'core/group', 0);

		await expect(
			getByDataTest(page, 'style-variations-button')
		).toBeVisible();
		getByDataTest(page, 'style-variations-button').click();

		const popover = await page
			.locator('.blockera-component-popover.variations-picker-popover')
			.last();

		await expect(
			await popover.locator('[data-test="style-new-id"]')
		).not.toHaveCount(1);

		const selectedVariationInPopover = await page.evaluate(() => {
			const dataObj = window.wp.data;

			return dataObj
				.select('blockera/editor')
				.getSelectedBlockStyleVariation();
		});

		expect(selectedVariationInPopover).toBeUndefined();

		await savePage(page);
		await page.reload();

		await before(page);
		getByDataTest(page, 'style-new-id').click();

		const selectedVariationAfterReload = await page.evaluate(() => {
			const dataObj = window.wp.data;

			return dataObj
				.select('blockera/editor')
				.getSelectedBlockStyleVariation();
		});

		expect(selectedVariationAfterReload).toBeUndefined();

		await openSettingsPanel(page);
		await selectBlockByType(page, 'core/group', 0);

		await expect(
			getByDataTest(page, 'style-variations-button')
		).toBeVisible();
		await getByDataTest(page, 'style-variations-button').click();

		const popoverAfterReload = page
			.locator('.blockera-component-popover.variations-picker-popover')
			.last();

		await expect(
			popoverAfterReload.locator('[data-test="style-new-id"]')
		).not.toHaveCount(1);

		const selectedVariationInPopoverAfterReload = await page.evaluate(
			() => {
				const dataObj = window.wp.data;

				return dataObj
					.select('blockera/editor')
					.getSelectedBlockStyleVariation();
			}
		);

		expect(selectedVariationInPopoverAfterReload).toBeUndefined();
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

		const blockStyles = await page.evaluate(() => {
			const dataObj = window.wp.data;

			return (
				dataObj.select('core/blocks').getBlockStyles('core/group')
					?.length || 0
			);
		});

		expect(blockStyles).toBe(5);

		await openSettingsPanel(page);
		await selectBlockByType(page, 'core/group', 0);

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

		const blockStylesAfterReload = await page.evaluate(() => {
			const dataObj = window.wp.data;

			return (
				dataObj.select('core/blocks').getBlockStyles('core/group')
					?.length || 0
			);
		});

		expect(blockStylesAfterReload).toBe(3);

		await openSettingsPanel(page);
		await selectBlockByType(page, 'core/group', 0);

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
