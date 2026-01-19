/**
 * Background Position → WP Compatibility (Global Styles)
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

test.describe('Background Position → WP Compatibility (Global Styles)', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Custom Value':
			'packages/editor/js/extensions/libs/background/test/global-styles/fixtures/background-position-setup-1.php',
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
		test.describe('Background Position', () => {
			test('Custom Value', async ({ page }) => {
				await getByDataTest(page, 'style-default').click();

				// Get feature container
				const bgContainer = getParentContainer(
					page,
					'Image & Gradient'
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

				const root = globalStylesRecord?.['core/group'];

				// WP data should come to Blockera
				const blockeraBackground1 = root?.blockeraBackground;

				expect({
					'image-0': {
						isVisible: true,
						type: 'image',
						image: 'https://placehold.co/600x400',
						'image-size': 'custom',
						'image-size-width': 'auto',
						'image-size-height': 'auto',
						'image-position': {
							top: '20%',
							left: '30%',
						},
						'image-repeat': 'repeat',
						'image-attachment': 'scroll',
						order: 0,
					},
				}).toEqual(blockeraBackground1);

				//
				// Test 2: Blockera value to WP data
				//

				// open image popover
				await bgContainer.locator('[data-id="image-0"]').click();

				// open position popover
				const popover = page.locator('.components-popover').last();
				await popover.locator('[data-test="position-button"]').click();

				// change position
				const positionPopover = page
					.locator('.components-popover')
					.last();
				const topContainer = getParentContainer(positionPopover, 'Top');
				await topContainer.locator('input[type="text"]').fill('40%');
				await topContainer.locator('input[type="text"]').press('Enter');

				const leftContainer = getParentContainer(
					positionPopover,
					'Left'
				);
				await leftContainer.locator('input[type="text"]').fill('60%');
				await leftContainer
					.locator('input[type="text"]')
					.press('Enter');

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/group'];
				const backgroundPosition2 =
					root2?.background?.backgroundPosition;

				expect('40% 60%').toEqual(backgroundPosition2);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear image
				await bgContainer
					.locator('[aria-label="Delete image 0"]')
					.click({ force: true });

				// WP data should be removed too
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/group'];
				const backgroundPosition3 =
					root3?.background?.backgroundPosition;
				const blockeraBackground3 = root3?.blockeraBackground;

				expect(undefined).toEqual(backgroundPosition3);
				expect({}).toEqual(blockeraBackground3);
			});
		});
	});
});
