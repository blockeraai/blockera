/**
 * Text Orientation → WP Compatibility (Global Styles)
 * Playwright e2e test
 */
const {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	activateMuPlugin,
	deactivateMuPlugin,
	openMoreFeaturesControl,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
	getByDataTest,
	addNewTransition,
	getParentContainer,
	openGlobalStylesPanel,
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Text Orientation → WP Compatibility (Global Styles)', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Horizontal value':
			'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/text-orientation-setup-1.php',
		'Vertical value':
			'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/text-orientation-setup-2.php',
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
		test.describe('Horizontal value', () => {
			test('Horizontal value', async ({ page }) => {
				await getByDataTest(page, 'style-default').click();

				await addNewTransition(page);

				// Open more settings
				await openMoreFeaturesControl(page, 'More typography settings');

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
				const blockeraTextOrientation1 =
					root?.blockeraTextOrientation?.value;

				expect('initial').toEqual(blockeraTextOrientation1);

				//
				// Test 2: Blockera value to WP data
				//

				// Get orientation container
				const orientationContainer = await getParentContainer(
					page,
					'Orientation'
				);

				// set style-1 (vertical-rl)
				await orientationContainer
					.locator('button[data-value="style-1"]')
					.first()
					.click({ force: true });

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const typographyWritingMode2 = root2?.typography?.writingMode;

				expect('vertical-rl').toEqual(typographyWritingMode2);

				// set initial (horizontal-tb)
				await orientationContainer
					.locator('button[data-value="initial"]')
					.first()
					.click({ force: true });

				// Blockera value should be moved to WP data
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const typographyWritingMode3 = root3?.typography?.writingMode;

				expect('horizontal-tb').toEqual(typographyWritingMode3);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear value (click initial again to reset)
				await orientationContainer
					.locator('button[data-value="initial"]')
					.first()
					.click({ force: true });

				// WP data should be removed too
				const globalStylesRecord4 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root4 = globalStylesRecord4?.['core/paragraph'];
				const typographyWritingMode4 = root4?.typography?.writingMode;
				const blockeraTextOrientation4 =
					root4?.blockeraTextOrientation?.value;

				expect(undefined).toEqual(typographyWritingMode4);
				expect(undefined).toEqual(blockeraTextOrientation4);
			});
		});

		test.describe('Vertical value', () => {
			test('Vertical value', async ({ page }) => {
				await getByDataTest(page, 'style-default').click();

				await addNewTransition(page);

				// Open more settings
				await openMoreFeaturesControl(page, 'More typography settings');

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
				const blockeraTextOrientation1 =
					root?.blockeraTextOrientation?.value;

				expect('style-1').toEqual(blockeraTextOrientation1);

				//
				// Test 2: Blockera value to WP data
				//

				// Get orientation container
				const orientationContainer = await getParentContainer(
					page,
					'Orientation'
				);

				// set initial (horizontal-tb)
				await orientationContainer
					.locator('button[data-value="initial"]')
					.first()
					.click({ force: true });

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const typographyWritingMode2 = root2?.typography?.writingMode;

				expect('horizontal-tb').toEqual(typographyWritingMode2);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear value (click style-1 again to reset)
				await orientationContainer
					.locator('button[data-value="style-1"]')
					.click({ force: true });

				// WP data should be removed too
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const typographyWritingMode3 = root3?.typography?.writingMode;
				const blockeraTextOrientation3 =
					root3?.blockeraTextOrientation?.value;

				expect(undefined).toEqual(typographyWritingMode3);
				expect(undefined).toEqual(blockeraTextOrientation3);
			});
		});
	});
});
