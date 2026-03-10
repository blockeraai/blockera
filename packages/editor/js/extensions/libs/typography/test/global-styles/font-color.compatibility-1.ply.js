/**
 * Font Color → WP Compatibility (Global Styles)
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
	setColorControlValue,
	clearColorControlValue,
	clickValueAddonButton,
	selectValueAddonItem,
	removeValueAddon,
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Font Color → WP Compatibility (Global Styles)', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Simple Value':
			'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/font-color-setup-1.php',
		'Variable Value':
			'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/font-color-setup-2.php',
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
				const blockeraFontColor1 = root?.blockeraFontColor?.value;

				expect('#ffbaba').toEqual(blockeraFontColor1);

				//
				// Test 2: Blockera value to WP data
				//

				// set font color
				await setColorControlValue(page, 'Text Color', '#666666');

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const colorText = root2?.color?.text;

				expect('#666666').toEqual(colorText);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear font color
				await clearColorControlValue(page, 'Text Color');

				// WP data should be removed too
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const colorText3 = root3?.color?.text;
				const blockeraFontColor3 = root3?.blockeraFontColor?.value;

				expect(undefined).toEqual(colorText3);
				expect(undefined).toEqual(blockeraFontColor3);
			});
		});

		test.describe('Variable Value', () => {
			test('Variable Value', async ({ page }) => {
				await getByDataTest(page, 'style-default').click();

				// Get feature container
				const textColorContainer = await getParentContainer(
					page,
					'Text Color'
				);

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
				const blockeraFontColor1 = root?.blockeraFontColor?.value;
				const textColor1 = root?.color?.text;

				expect({
					settings: {
						name: 'Accent 3',
						id: 'accent-3',
						value: '#503AA8',
						reference: {
							type: 'theme',
							theme: 'Twenty Twenty-Five',
						},
						type: 'color',
						var: '--wp--preset--color--accent-3',
					},
					name: 'Accent 3',
					isValueAddon: true,
					valueType: 'variable',
				}).toEqual(blockeraFontColor1);
				expect('var(--wp--preset--color--accent-3)').toEqual(
					textColor1
				);

				//
				// Test 2: Blockera value to WP data
				//

				// open color popover
				await clickValueAddonButton(page, textColorContainer);

				// change variable
				await selectValueAddonItem(page, 'contrast');

				// Check WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const textColor2 = root2?.color?.text;

				expect('var(--wp--preset--color--accent-3)').toEqual(
					textColor2
				);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// open color popover
				await removeValueAddon(page, textColorContainer);

				// Check WP data
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const textColor3 = root3?.color?.text;
				const blockeraFontColor3 = root3?.blockeraFontColor?.value;

				expect(undefined).toEqual(textColor3);
				expect(undefined).toEqual(blockeraFontColor3);
			});
		});
	});
});
