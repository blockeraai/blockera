/**
 * Font Appearance → WP Compatibility (Global Styles)
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
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Font Appearance → WP Compatibility (Global Styles)', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Simple Value (Weight and Style)':
			'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/font-appearance-setup-1.php',
		'Weight Only':
			'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/font-appearance-setup-2.php',
		'Style Only':
			'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/font-appearance-setup-3.php',
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
		test.describe('Simple Value (Weight and Style)', () => {
			test('Simple Value (Weight and Style)', async ({ page }) => {
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
				const blockeraFontAppearance1 =
					root?.blockeraFontAppearance?.value;

				expect({
					weight: '600',
					style: 'italic',
				}).toEqual(blockeraFontAppearance1);

				//
				// Test 2: Blockera value to WP data
				//

				// set font appearance
				const appearanceContainer = getParentContainer(
					page,
					'Appearance'
				);
				await appearanceContainer
					.locator('select')
					.selectOption('200-normal');

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const typographyFontWeight = root2?.typography?.fontWeight;
				const typographyFontStyle = root2?.typography?.fontStyle;

				expect('200').toEqual(typographyFontWeight);
				expect('normal').toEqual(typographyFontStyle);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear font appearance
				await appearanceContainer.locator('select').selectOption('');

				// WP data should be removed too
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const typographyFontWeight3 = root3?.typography?.fontWeight;
				const typographyFontStyle3 = root3?.typography?.fontStyle;
				const blockeraFontAppearance3 =
					root3?.blockeraFontAppearance?.value;

				expect(undefined).toEqual(typographyFontWeight3);
				expect(undefined).toEqual(typographyFontStyle3);
				expect({
					weight: '',
					style: '',
				}).toEqual(blockeraFontAppearance3);
			});
		});

		test.describe('Weight Only', () => {
			test('Weight Only', async ({ page }) => {
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
				const blockeraFontAppearance1 =
					root?.blockeraFontAppearance?.value;

				expect({
					weight: '700',
					style: 'normal', // default when only weight is set
				}).toEqual(blockeraFontAppearance1);

				//
				// Test 2: Blockera value to WP data
				//

				// set font appearance
				const appearanceContainer = getParentContainer(
					page,
					'Appearance'
				);
				await appearanceContainer
					.locator('select')
					.selectOption('400-normal');

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const typographyFontWeight = root2?.typography?.fontWeight;
				const typographyFontStyle = root2?.typography?.fontStyle;

				expect('400').toEqual(typographyFontWeight);
				expect('normal').toEqual(typographyFontStyle);
			});
		});

		test.describe('Style Only', () => {
			test('Style Only', async ({ page }) => {
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
				const blockeraFontAppearance1 =
					root?.blockeraFontAppearance?.value;

				expect({
					weight: '100', // default when only style is set
					style: 'italic',
				}).toEqual(blockeraFontAppearance1);

				//
				// Test 2: Blockera value to WP data
				//

				// set font appearance
				const appearanceContainer = getParentContainer(
					page,
					'Appearance'
				);
				await appearanceContainer
					.locator('select')
					.selectOption('300-normal');

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const typographyFontWeight = root2?.typography?.fontWeight;
				const typographyFontStyle = root2?.typography?.fontStyle;

				expect('300').toEqual(typographyFontWeight);
				expect('normal').toEqual(typographyFontStyle);
			});
		});
	});
});
