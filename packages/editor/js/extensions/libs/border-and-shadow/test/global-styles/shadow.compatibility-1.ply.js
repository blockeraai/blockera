/**
 * Blockera dependencies
 */
const {
	openSiteEditor,
	activateMuPlugin,
	closeWelcomeGuide,
	deactivateMuPlugin,
	deleteRepeaterItem,
	getEditedGlobalStylesRecord,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
	getByDataTest,
	addNewTransition,
	getParentContainer,
	openGlobalStylesPanel,
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Shadow → WP Compatibility', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Simple shadow value':
			'packages/editor/js/extensions/libs/border-and-shadow/test/global-styles/fixtures/shadow-setup-1.php',
		'Shadow preset reference':
			'packages/editor/js/extensions/libs/border-and-shadow/test/global-styles/fixtures/shadow-setup-2.php',
		// Add more test titles and their mu-plugin paths here
	};

	// Store active mu-plugin path for each test
	const activeMuPlugins = new Map();

	const before = async (page) => {
		await openGlobalStylesPanel(page);

		await closeWelcomeGuide(page);

		await getByDataTest(page, 'block-style-variations').nth(1).click();

		await page.locator('button[id="/blocks/core%2Fbutton"]').click();
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

	test.describe('Button Block', () => {
		test.describe('Simple Value', () => {
			test('Simple shadow value', async ({ page }) => {
				await getByDataTest(page, 'style-fill').click();

				// Get feature container
				const shadowContainer = await getParentContainer(
					page,
					'Box Shadows'
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

				const root = globalStylesRecord?.['core/button'];

				// WP data should come to Blockera
				const blockeraBoxShadow1 = root?.blockeraBoxShadow?.value;
				const shadow1 = root?.shadow;

				// Check that Blockera received the shadow data
				expect(blockeraBoxShadow1).toBeDefined();
				expect(Object.keys(blockeraBoxShadow1).length).toBeGreaterThan(
					0
				);

				// Check the first shadow item structure
				const firstShadowKey = Object.keys(blockeraBoxShadow1)[0];
				const firstShadow = blockeraBoxShadow1[firstShadowKey];

				expect(firstShadow.isVisible).toBe(true);
				expect(firstShadow.type).toBe('outer');
				expect(firstShadow.x).toBe('10px');
				expect(firstShadow.y).toBe('20px');
				expect(firstShadow.blur).toBe('5px');
				expect(firstShadow.spread).toBe('0px');
				expect(firstShadow.color).toBe('rgba(0, 0, 0, 0.3)');

				// Check WP shadow value
				expect(shadow1).toBe('10px 20px 5px 0px rgba(0, 0, 0, 0.3)');

				//
				// Test 2: Blockera value to WP data
				//

				await shadowContainer.locator('[data-id="outer-0"]').click();

				// Wait for popover to appear and be ready
				const shadowPopover = page
					.locator('.blockera-component-popover')
					.last();
				await shadowPopover.waitFor({ state: 'visible' });

				// Wait for input elements to be ready before interacting
				const xInput = shadowPopover.locator(
					'[data-test="box-shadow-x-input"]'
				);
				await xInput.waitFor({ state: 'visible' });
				await xInput.clear();
				await xInput.fill('15');

				const yInput = shadowPopover.locator(
					'[data-test="box-shadow-y-input"]'
				);
				await yInput.waitFor({ state: 'visible' });
				await yInput.clear();
				await yInput.fill('25');

				const blurInput = shadowPopover.locator(
					'[data-test="box-shadow-blur-input"]'
				);
				await blurInput.waitFor({ state: 'visible' });
				await blurInput.clear();
				await blurInput.fill('10');

				// Check WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/button'];
				const shadow2 = root2?.shadow;

				// WP shadow should be removed because adjusted box shadow not registered inside shadow presets list.
				expect(shadow2).toBeUndefined();

				//
				// Test 3: Clear Blockera value and check WP data
				//

				await deleteRepeaterItem(page, {
					container: shadowContainer,
					itemId: 'outer-0',
					label: 'Delete outer 0',
				});

				// Clear shadow by clicking reset or removing the shadow
				// For now, we'll test by checking if reset works
				// This might require clicking a reset button if available

				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/button'];
				const blockeraBoxShadow3 = root3?.blockeraBoxShadow;

				// After modification, shadow should still exist
				expect(blockeraBoxShadow3).toBeUndefined();
			});

			test('Shadow preset reference', async ({ page }) => {
				await getByDataTest(page, 'style-fill').click();

				// Get feature container
				const shadowContainer = await getParentContainer(
					page,
					'Box Shadows'
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

				const root = globalStylesRecord?.['core/button'];

				// WP data should come to Blockera
				const blockeraBoxShadow1 = root?.blockeraBoxShadow?.value;
				const shadow1 = root?.shadow;

				// Check that Blockera received the shadow preset reference
				expect(blockeraBoxShadow1).toBeDefined();
				expect(Object.keys(blockeraBoxShadow1).length).toBeGreaterThan(
					0
				);

				// Check the first shadow item structure
				const firstShadowKey = Object.keys(blockeraBoxShadow1)[0];
				const firstShadow = blockeraBoxShadow1[firstShadowKey];

				expect(firstShadow.isVisible).toBe(true);
				expect(firstShadow.type).toBe('outer');
				// For preset references, the color should contain the preset variable
				expect(typeof firstShadow.color).toBe('string');
				expect(firstShadow.color).toBe('rgba(0, 0, 0, 0.2)');

				// Check WP shadow value (should be the preset reference)
				expect(shadow1).toBe('var(--wp--preset--shadow--natural)');

				//
				// Test 2: Blockera value to WP data (modifying shadow)
				//

				// Modify shadow values
				await shadowContainer.locator('[data-id="outer-0"]').click();

				// Wait for popover to appear and be ready
				const shadowPopover = page
					.locator('.blockera-component-popover')
					.last();
				await shadowPopover.waitFor({ state: 'visible' });

				// Wait for input element to be ready before interacting
				const xInput = shadowPopover.locator(
					'[data-test="box-shadow-x-input"]'
				);
				await xInput.waitFor({ state: 'visible' });
				await xInput.clear();
				await xInput.fill('5');

				// Check WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/button'];
				const shadow2 = root2?.shadow;

				// WP shadow should be removed from root of core/button because current adjusted box shadow not registered in shadow presets list.
				expect(shadow2).toBeUndefined();
			});
		});
	});
});
