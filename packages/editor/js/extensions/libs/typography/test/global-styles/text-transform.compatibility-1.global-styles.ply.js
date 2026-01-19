/**
 * Text Transform → WP Compatibility (Global Styles)
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

test.describe('Text Transform → WP Compatibility (Global Styles)', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Simple Value':
			'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/text-transform-setup-1.php',
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
				const blockeraTextTransform1 =
					root?.blockeraTextTransform?.value;

				expect('uppercase').toEqual(blockeraTextTransform1);

				//
				// Test 2: Blockera value to WP data
				//

				// Get capitalize container
				const capitalizeContainer = getParentContainer(
					page,
					'Capitalize'
				);

				// set capitalize
				await capitalizeContainer
					.locator('button[data-value="capitalize"]')
					.click();

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const typographyTextTransform2 =
					root2?.typography?.textTransform;

				expect('capitalize').toEqual(typographyTextTransform2);

				// set lowercase
				await capitalizeContainer
					.locator('button[data-value="lowercase"]')
					.click();

				// Blockera value should be moved to WP data
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const typographyTextTransform3 =
					root3?.typography?.textTransform;

				expect('lowercase').toEqual(typographyTextTransform3);

				// set initial
				await capitalizeContainer
					.locator('button[data-value="initial"]')
					.click();

				// Blockera value should be moved to WP data
				const globalStylesRecord4 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root4 = globalStylesRecord4?.['core/paragraph'];
				const typographyTextTransform4 =
					root4?.typography?.textTransform;

				expect('initial').toEqual(typographyTextTransform4);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear value (click initial again to reset)
				await capitalizeContainer
					.locator('button[data-value="initial"]')
					.click();

				// WP data should be removed too
				const globalStylesRecord5 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root5 = globalStylesRecord5?.['core/paragraph'];
				const typographyTextTransform5 =
					root5?.typography?.textTransform;
				const blockeraTextTransform5 =
					root5?.blockeraTextTransform?.value;

				expect(undefined).toEqual(typographyTextTransform5);
				expect('').toEqual(blockeraTextTransform5);
			});
		});
	});
});
