/**
 * Height → WP Compatibility (Global Styles)
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
	openGlobalStylesPanel,
	setSizeControlValue,
	clearSizeControlValue,
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Height → WP Compatibility (Global Styles)', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Simple Value':
			'packages/editor/js/extensions/libs/size/test/global-styles/fixtures/height-setup-1.php',
	};

	// Store active mu-plugin path for each test
	const activeMuPlugins = new Map();

	const before = async (page) => {
		await openGlobalStylesPanel(page);

		await closeWelcomeGuide(page);

		await getByDataTest(page, 'block-style-variations').nth(1).click();

		await page.locator('button[id="/blocks/core%2Fimage"]').click();
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

	test.describe('Image Block', () => {
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

				const root = globalStylesRecord?.['core/image'];

				// WP data should come to Blockera
				const blockeraHeight1 = root?.blockeraHeight?.value;

				expect('400px').toEqual(blockeraHeight1);

				//
				// Test 2: Blockera value to WP data
				//

				// set height
				await setSizeControlValue(page, 'Height', '500px');

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/image'];
				const dimensionsHeight = root2?.dimensions?.height;

				expect('500px').toEqual(dimensionsHeight);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear height
				await clearSizeControlValue(page, 'Height');

				// WP data should be removed too
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/image'];
				const dimensionsHeight3 = root3?.dimensions?.height;
				const blockeraHeight3 = root3?.blockeraHeight?.value;

				expect(undefined).toEqual(dimensionsHeight3);
				expect('').toEqual(blockeraHeight3);
			});
		});
	});
});
