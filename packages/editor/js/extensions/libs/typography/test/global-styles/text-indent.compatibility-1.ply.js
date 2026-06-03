/**
 * Text Indent → WP Compatibility (Global Styles)
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

test.describe('Text Indent → WP Compatibility (Global Styles)', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Simple Value':
			'packages/editor/js/extensions/libs/typography/test/global-styles/fixtures/text-indent-setup-1.php',
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
				const blockeraTextIndent1 = root?.blockeraTextIndent?.value;

				expect('2px').toEqual(blockeraTextIndent1);

				//
				// Test 2: Blockera value to WP data
				//

				const textIndentContainer = await getParentContainer(
					page,
					'Text Indent'
				);

				// set text indent
				await textIndentContainer.locator('input').first().fill('3');

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const typographyTextIndent = root2?.typography?.textIndent;

				expect('3px').toEqual(typographyTextIndent);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear text indent
				await textIndentContainer
					.locator('input')
					.first()
					.clear({ force: true });

				// WP data should be removed too
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const typographyTextIndent3 = root3?.typography?.textIndent;
				const blockeraTextIndent3 = root3?.blockeraTextIndent?.value;

				expect(undefined).toEqual(typographyTextIndent3);
				expect(undefined).toEqual(blockeraTextIndent3);
			});
		});
	});
});
