/**
 * Aspect Ratio → WP Compatibility (Global Styles)
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

test.describe('Aspect Ratio → WP Compatibility (Global Styles)', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Simple Value':
			'packages/editor/js/extensions/libs/size/test/global-styles/fixtures/aspect-ratio-setup-1.php',
	};

	// Store active mu-plugin path for each test
	const activeMuPlugins = new Map();

	const before = async (page) => {
		await openGlobalStylesPanel(page);

		await closeWelcomeGuide(page);

		await getByDataTest(page, 'block-style-variations').nth(1).click();

		await page.locator('button[id="/blocks/core%2Fcover"]').click();
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

	test.describe('Cover Block', () => {
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

				const root = globalStylesRecord?.['core/cover'];

				// WP data should come to Blockera
				const blockeraRatio1 = root?.blockeraRatio?.value;

				expect({
					val: '3/2',
					width: '',
					height: '',
				}).toEqual(blockeraRatio1);

				//
				// Test 2: Blockera value to WP data
				//

				// Get aspect ratio container
				const aspectRatioContainer = getParentContainer(
					page,
					'Aspect Ratio'
				);

				// set aspect ratio
				await aspectRatioContainer
					.locator('select')
					.selectOption('16/9');

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/cover'];
				const dimensionsAspectRatio = root2?.dimensions?.aspectRatio;

				expect('16/9').toEqual(dimensionsAspectRatio);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear aspect ratio
				await aspectRatioContainer.locator('select').selectOption('');

				// WP data should be removed too
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/cover'];
				const dimensionsAspectRatio3 = root3?.dimensions?.aspectRatio;
				const blockeraRatio3 = root3?.blockeraRatio?.value;

				expect(undefined).toEqual(dimensionsAspectRatio3);
				expect({
					val: '',
					width: '',
					height: '',
				}).toEqual(blockeraRatio3);
			});
		});
	});
});
