/**
 * Text Decoration → WP Compatibility (Global Styles)
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

test.describe('Text Decoration → WP Compatibility (Global Styles)', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Simple Value':
			'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/text-decoration-setup-1.php',
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
				const blockeraTextDecoration1 =
					root?.blockeraTextDecoration?.value;

				expect('underline').toEqual(blockeraTextDecoration1);

				//
				// Test 2: Blockera value to WP data
				//

				// Get decoration container
				const decorationContainer = await getParentContainer(
					page,
					'Decoration'
				);

				// set line-through
				await decorationContainer
					.locator('button[data-value="line-through"]')
					.first()
					.click({ force: true });

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const typographyTextDecoration2 =
					root2?.typography?.textDecoration;

				expect('line-through').toEqual(typographyTextDecoration2);

				// set overline
				await decorationContainer
					.locator('button[data-value="overline"]')
					.first()
					.click({ force: true });

				// Blockera value should be moved to WP data
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const typographyTextDecoration3 =
					root3?.typography?.textDecoration;

				expect('overline').toEqual(typographyTextDecoration3);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear value (click None)
				await decorationContainer
					.locator('button[data-value="none"]')
					.first()
					.click({ force: true });

				// WP data should be removed too
				const globalStylesRecord4 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root4 = globalStylesRecord4?.['core/paragraph'];
				const typographyTextDecoration4 =
					root4?.typography?.textDecoration;
				const blockeraTextDecoration4 =
					root4?.blockeraTextDecoration?.value;

				expect(undefined).toEqual(typographyTextDecoration4);
				expect(undefined).toEqual(blockeraTextDecoration4);
			});
		});
	});
});
