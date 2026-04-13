/**
 * Blockera dependencies
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

test.describe('Background Color → WP Compatibility', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Simple Value':
			'packages/editor/js/extensions/libs/background/test/global-styles/fixtures/background-color-setup-1.php',
		'Variable Value':
			'packages/editor/js/extensions/libs/background/test/global-styles/fixtures/background-color-setup-2.php',
		'Not found variable':
			'packages/editor/js/extensions/libs/background/test/global-styles/fixtures/background-color-setup-3.php',
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
			const blockeraBackgroundColor1 =
				root?.blockeraBackgroundColor?.value;

			expect('#ffdfdf').toEqual(blockeraBackgroundColor1);

			//
			// Test 2: Blockera value to WP data
			//

			// open color popover
			await setColorControlValue(page, 'BG Color', '#666666');

			// Blockera value should be moved to WP data
			const globalStylesRecord2 = await getEditedGlobalStylesRecord(
				page,
				'styles',
				'blocks'
			);

			const root2 = globalStylesRecord2?.['core/paragraph'];
			const styleColorBackground = root2?.color?.background;

			expect('#666666').toEqual(styleColorBackground);

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear bg color
			await clearColorControlValue(page, 'BG Color');

			// WP data should be removed too
			const globalStylesRecord3 = await getEditedGlobalStylesRecord(
				page,
				'styles',
				'blocks'
			);

			const root3 = globalStylesRecord3?.['core/paragraph'];
			const styleColorBackground3 = root3?.color?.background;
			const blockeraBackgroundColor3 =
				root3?.blockeraBackgroundColor?.value;

			expect(undefined).toEqual(styleColorBackground3);
			expect(undefined).toEqual(blockeraBackgroundColor3);
		});

		test('Variable Value', async ({ page }) => {
			await getByDataTest(page, 'style-default').click();

			// Get feature container
			const bgColorContainer = await getParentContainer(page, 'BG Color');

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
			// For global styles, WordPress stores background color in color.background
			// Format can be CSS color string or CSS variable reference
			const blockeraBackgroundColor1 =
				root?.blockeraBackgroundColor?.value;
			const backgroundColor1 = root?.color?.background;

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
			}).toEqual(blockeraBackgroundColor1);
			// WordPress stores preset colors in color.background as CSS variable
			// (from theme.json styles.color.background)
			expect('var(--wp--preset--color--accent-3)').toEqual(
				backgroundColor1
			);

			//
			// Test 2: Blockera value to WP data
			//

			// open color popover
			await clickValueAddonButton(page, bgColorContainer);

			// change variable
			await selectValueAddonItem(page, 'contrast');

			// Check WP data
			const globalStylesRecord2 = await getEditedGlobalStylesRecord(
				page,
				'styles',
				'blocks'
			);

			const root2 = globalStylesRecord2?.['core/paragraph'];
			const backgroundColor2 = root2?.color?.background;

			// WordPress stores preset colors in color.background using var:preset|color|slug format
			// (compatibility code writes var:preset|color|${slug} to match theme.json schema)
			expect('var:preset|color|contrast').toEqual(backgroundColor2);

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// open color popover
			await removeValueAddon(page, bgColorContainer);

			// Check WP data
			const globalStylesRecord3 = await getEditedGlobalStylesRecord(
				page,
				'styles',
				'blocks'
			);

			const root3 = globalStylesRecord3?.['core/paragraph'];
			const backgroundColor3 = root3?.color?.background;
			const blockeraBackgroundColor3 =
				root3?.blockeraBackgroundColor?.value;

			expect(undefined).toEqual(backgroundColor3);
			expect(undefined).toEqual(blockeraBackgroundColor3);
		});

		test('Not found variable', async ({ page }) => {
			await getByDataTest(page, 'style-default').click();

			await addNewTransition(page);

			const bgColorContainer = await getParentContainer(page, 'BG Color');

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
			const blockeraBackgroundColor1 =
				root?.blockeraBackgroundColor?.value;
			const backgroundColor1 = root?.color?.background;

			expect({
				settings: {
					name: 'unknown',
					id: 'var(--wp--preset--color--unknown)',
					value: 'var(--wp--preset--color--unknown)',
					type: 'color',
					var: '--wp--preset--color--unknown',
				},
				name: 'unknown',
				isValueAddon: true,
				valueType: 'variable',
			}).toEqual(blockeraBackgroundColor1);
			expect('var(--wp--preset--color--unknown)').toEqual(
				backgroundColor1
			);

			//
			// Test 2: Check interface for showing deleted value addon
			//

			await expect(
				bgColorContainer.locator('[data-test="value-addon-deleted"]')
			).toBeVisible();

			//
			// Test 3: Clear Blockera value and check WP data
			//

			await removeValueAddon(page, bgColorContainer);

			// Check WP data
			const globalStylesRecord3 = await getEditedGlobalStylesRecord(
				page,
				'styles',
				'blocks'
			);

			const root3 = globalStylesRecord3?.['core/paragraph'];
			const backgroundColor3 = root3?.color?.background;
			const blockeraBackgroundColor3 =
				root3?.blockeraBackgroundColor?.value;

			expect(undefined).toEqual(backgroundColor3);
			expect(undefined).toEqual(blockeraBackgroundColor3);
		});
	});
});
