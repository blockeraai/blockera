/**
 * Font Size → WP Compatibility (Global Styles)
 * Playwright e2e test
 */
const {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	activateMuPlugin,
	deactivateMuPlugin,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
	getByDataTest,
	addNewTransition,
	getParentContainer,
	openGlobalStylesPanel,
	setSizeControlValue,
	clearSizeControlValue,
	clickValueAddonButton,
	selectValueAddonItem,
	removeValueAddon,
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Font Size → WP Compatibility (Global Styles)', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Simple Value':
			'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/font-size-setup-1.php',
		'Variable Value':
			'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/font-size-setup-2.php',
		'Not found variable':
			'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/font-size-setup-3.php',
	};

	// Store active mu-plugin path for each test
	const activeMuPlugins = new Map();

	const before = async (page) => {
		await openGlobalStylesPanel(page);

		await closeWelcomeGuide(page);

		await getByDataTest(page, 'block-style-variations').nth(1).click();

		await page.locator('button[id="/blocks/core%2Fparagraph"]').click();
	};

	test.beforeEach(async ({ page, admin }, testInfo) => {
		// Get current test title
		const testTitle = testInfo.title;

		// Look up mu-plugin path for this test
		const muPluginPath = muPluginPaths[testTitle];

		if (muPluginPath) {
			// Activate mu-plugin before each test
			await activateMuPlugin(page, muPluginPath);
			// Store the active mu-plugin path for this test
			activeMuPlugins.set(testInfo.testId, muPluginPath);
		}

		await openSiteEditor(page, admin);

		await before(page);
	});

	test.afterEach(async ({ page }, testInfo) => {
		// Get the mu-plugin path that was activated for this test
		const muPluginPath = activeMuPlugins.get(testInfo.testId);

		if (muPluginPath) {
			// Deactivate mu-plugin after each test
			await deactivateMuPlugin(page, muPluginPath);
			// Clean up
			activeMuPlugins.delete(testInfo.testId);
		}
	});

	test.describe('Paragraph Block', () => {
		test.describe('Simple Value', () => {
			test('Simple Value', async ({ page }) => {
				await getByDataTest(page, 'style-default').click();

				await addNewTransition(page);

				//
				// Test 1: WP data to Blockera
				//

				const globalStylesRecord = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root = globalStylesRecord?.['core/paragraph'];

				// WP data should come to Blockera
				const blockeraFontSize1 = root?.blockeraFontSize?.value;

				expect('24px').toEqual(blockeraFontSize1);

				//
				// Test 2: Blockera value to WP data
				//

				// set font size
				await setSizeControlValue(page, 'Font Size', '18px');

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const typographyFontSize = root2?.typography?.fontSize;

				expect('18px').toEqual(typographyFontSize);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear font size
				await clearSizeControlValue(page, 'Font Size');

				// WP data should be removed too
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const typographyFontSize3 = root3?.typography?.fontSize;
				const blockeraFontSize3 = root3?.blockeraFontSize?.value;

				expect(undefined).toEqual(typographyFontSize3);
				expect('').toEqual(blockeraFontSize3);
			});
		});

		test.describe('Variable Value', () => {
			test('Variable Value', async ({ page }) => {
				await getByDataTest(page, 'style-default').click();

				// Get feature container
				const fontSizeContainer = getParentContainer(page, 'Font Size');

				await addNewTransition(page);

				//
				// Test 1: WP data to Blockera
				//

				const globalStylesRecord = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root = globalStylesRecord?.['core/paragraph'];

				// WP data should come to Blockera
				const blockeraFontSize1 = root?.blockeraFontSize?.value;
				const fontSize1 = root?.fontSize;

				expect({
					settings: {
						name: 'Large',
						id: 'large',
						value: '36px',
						reference: {
							type: 'theme',
							theme: 'Twenty Twenty-Five',
						},
						type: 'fontSize',
						var: '--wp--preset--font-size--large',
					},
					name: 'Large',
					isValueAddon: true,
					valueType: 'variable',
				}).toEqual(blockeraFontSize1);
				expect('large').toEqual(fontSize1);

				//
				// Test 2: Blockera value to WP data
				//

				// open font size popover
				await clickValueAddonButton(page, fontSizeContainer);

				// change variable
				await selectValueAddonItem(page, 'medium');

				// Check WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const fontSize2 = root2?.fontSize;

				expect('medium').toEqual(fontSize2);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// open font size popover
				await removeValueAddon(page, fontSizeContainer);

				// Check WP data
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const fontSize3 = root3?.fontSize;
				const blockeraFontSize3 = root3?.blockeraFontSize?.value;

				expect(undefined).toEqual(fontSize3);
				expect('').toEqual(blockeraFontSize3);
			});
		});

		test.describe('Not found variable', () => {
			test('Not found variable', async ({ page }) => {
				await getByDataTest(page, 'style-default').click();

				await addNewTransition(page);

				const fontSizeContainer = getParentContainer(page, 'Font Size');

				//
				// Test 1: WP data to Blockera
				//

				const globalStylesRecord = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root = globalStylesRecord?.['core/paragraph'];

				// WP data should come to Blockera
				const blockeraFontSize1 = root?.blockeraFontSize?.value;
				const fontSize1 = root?.fontSize;

				expect({
					settings: {
						name: 'unknown',
						id: 'var:preset|font-size|unknown',
						value: 'var(--wp--preset--font-size--unknown)',
						type: 'fontSize',
						var: '--wp--preset--font-size--unknown',
					},
					name: 'unknown',
					isValueAddon: true,
					valueType: 'variable',
				}).toEqual(blockeraFontSize1);
				expect('unknown').toEqual(fontSize1);

				//
				// Test 2: Check interface for showing deleted value addon
				//

				await expect(
					fontSizeContainer.locator(
						'[data-test="value-addon-deleted"]'
					)
				).toBeVisible();

				//
				// Test 3: Clear Blockera value and check WP data
				//

				await removeValueAddon(page, fontSizeContainer);

				// Check WP data
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const fontSize3 = root3?.fontSize;
				const blockeraFontSize3 = root3?.blockeraFontSize?.value;

				expect(undefined).toEqual(fontSize3);
				expect('').toEqual(blockeraFontSize3);
			});
		});
	});
});
