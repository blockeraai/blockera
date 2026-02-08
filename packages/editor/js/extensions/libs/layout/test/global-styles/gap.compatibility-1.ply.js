/**
 * Gap → WP Compatibility (Global Styles)
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

test.describe('Gap → WP Compatibility (Global Styles)', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Simple Value':
			'packages/editor/js/extensions/libs/layout/test/global-styles/fixtures/gap-setup-1.php',
	};

	// Store active mu-plugin path for each test
	const activeMuPlugins = new Map();

	const before = async (page) => {
		await openGlobalStylesPanel(page);

		await closeWelcomeGuide(page);

		await getByDataTest(page, 'block-style-variations').nth(1).click();

		await page.locator('button[id="/blocks/core%2Fgroup"]').click();
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

	test.describe('Group Block', () => {
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

				const root = globalStylesRecord?.['core/group'];

				// WP data should come to Blockera
				const blockeraGap1 = root?.blockeraGap?.value;

				expect({
					lock: true,
					gap: '30px',
					columns: '',
					rows: '',
				}).toEqual(blockeraGap1);

				//
				// Test 2: Blockera value to WP data
				//

				const gapContainer = await getParentContainer(page, 'Gap');

				// set gap
				await gapContainer.locator('input').first().fill('40px');

				await page.waitForTimeout(500);

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/group'];
				const spacingBlockGap = root2?.spacing?.blockGap;
				const blockeraGap2 = root2?.blockeraGap?.value;

				expect({
					lock: true,
					gap: '40px',
					columns: '',
					rows: '',
				}).toEqual(blockeraGap2);
				expect('40px').toEqual(spacingBlockGap);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear gap
				await gapContainer.locator('input').first().clear();

				await page.waitForTimeout(500);

				// WP data should be removed too
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/group'];
				const spacingBlockGap3 = root3?.spacing?.blockGap;
				const blockeraGap3 = root3?.blockeraGap?.value;

				expect(undefined).toEqual(spacingBlockGap3);
				expect(undefined).toEqual(blockeraGap3);
			});
		});
	});
});
