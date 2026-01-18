/**
 * Blockera dependencies
 */
const {
	openSiteEditor,
	getSelectedBlock,
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

test.describe('Border & Border Radius Together → WP Compatibility', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Compacted borders':
			'packages/editor/js/extensions/libs/border-and-shadow/test/global-styles/fixtures/border-and-radius-setup-1.php',
		'Custom side borders':
			'packages/editor/js/extensions/libs/border-and-shadow/test/global-styles/fixtures/border-and-radius-setup-2.php',
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
			test('Compacted borders', async ({ page }) => {
				await getByDataTest(page, 'style-fill').click();

				// Get feature containers
				const borderContainer = getParentContainer(page, 'Border');
				const radiusContainer = getParentContainer(page, 'Radius');

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
				const blockeraBorder1 = root?.blockeraBorder?.value;
				const blockeraBorderRadius1 = root?.blockeraBorderRadius?.value;
				const border1 = root?.border;

				expect({
					type: 'all',
					all: {
						color: '#ff4848',
						width: '1px',
						style: 'solid',
					},
				}).toEqual(blockeraBorder1);

				expect({
					type: 'all',
					all: '10px',
				}).toEqual(blockeraBorderRadius1);

				expect({
					radius: '10px',
					style: 'solid',
					color: '#ff4848',
					width: '1px',
				}).toEqual(border1);

				//
				// Test 2: Blockera value to WP data
				//

				await borderContainer.locator('input').first().clear({
					force: true,
				});
				await borderContainer.locator('input').first().fill('20', {
					force: true,
				});

				await radiusContainer.locator('input').first().clear({
					force: true,
				});
				await radiusContainer.locator('input').first().fill('20', {
					force: true,
				});

				// WP data should come to Blockera
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/button'];
				const blockeraBorder2 = root2?.blockeraBorder?.value;
				const blockeraBorderRadius2 =
					root2?.blockeraBorderRadius?.value;
				const border2 = root2?.border;

				expect({
					type: 'all',
					all: {
						color: '#ff4848',
						width: '20px',
						style: 'solid',
					},
				}).toEqual(blockeraBorder2);

				expect({
					type: 'all',
					all: '20px',
				}).toEqual(blockeraBorderRadius2);

				expect({
					radius: '20px',
					color: '#ff4848',
					width: '20px',
					style: 'solid',
					top: undefined,
					right: undefined,
					bottom: undefined,
					left: undefined,
				}).toEqual(border2);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear all
				await borderContainer.locator('input').first().clear({
					force: true,
				});

				const colorBtn = borderContainer.locator(
					'[data-test="border-control-color"]'
				);
				await colorBtn.first().click();

				const popover = page.locator('.components-popover').last();
				await popover
					.locator('[aria-label="Reset Color (Clear)"]')
					.click({ force: true });

				await radiusContainer.locator('input').first().clear({
					force: true,
				});

				// WP data should come to Blockera
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/button'];
				const blockeraBorder3 = root3?.blockeraBorder?.value;
				const border3 = root3?.border;

				expect({
					type: 'all',
					all: {
						width: '',
						style: '',
						color: '',
					},
				}).toEqual(blockeraBorder3);

				expect({
					radius: undefined,
					color: undefined,
					style: undefined,
					width: undefined,
					top: undefined,
					right: undefined,
					bottom: undefined,
					left: undefined,
				}).toEqual(border3);
			});

			test('Custom side borders', async ({ page }) => {
				await getByDataTest(page, 'style-fill').click();

				// Get feature containers
				const borderContainer = getParentContainer(page, 'Border');
				const radiusContainer = getParentContainer(page, 'Radius');

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
				const blockeraBorder1 = root?.blockeraBorder?.value;
				const blockeraBorderRadius1 = root?.blockeraBorderRadius?.value;
				const border1 = root?.border;

				expect({
					type: 'custom',
					all: {
						width: '',
						style: '',
						color: '',
					},
					top: {
						width: '1px',
						color: '#ff4848',
						style: 'solid',
					},
					right: {
						width: '2px',
						color: '#ff4848',
						style: 'solid',
					},
					bottom: {
						width: '3px',
						color: '#ff4848',
						style: 'solid',
					},
					left: {
						width: '4px',
						color: '#ff4848',
						style: 'solid',
					},
				}).toEqual(blockeraBorder1);

				expect({
					topLeft: '10px',
					topRight: '20px',
					bottomLeft: '40px',
					bottomRight: '30px',
					type: 'custom',
					all: '',
				}).toEqual(blockeraBorderRadius1);

				expect({
					radius: {
						topLeft: '10px',
						topRight: '20px',
						bottomLeft: '40px',
						bottomRight: '30px',
					},
					top: {
						style: 'solid',
						color: '#ff4848',
						width: '1px',
					},
					right: {
						style: 'solid',
						color: '#ff4848',
						width: '2px',
					},
					bottom: {
						style: 'solid',
						color: '#ff4848',
						width: '3px',
					},
					left: {
						style: 'solid',
						color: '#ff4848',
						width: '4px',
					},
				}).toEqual(border1);

				//
				// Test 2: Blockera value to WP data
				//

				const borderInputs = borderContainer.locator('input');
				await borderInputs.nth(0).clear({ force: true });
				await borderInputs.nth(0).fill('10', { force: true });

				await borderInputs.nth(1).clear({ force: true });
				await borderInputs.nth(1).fill('20', { force: true });

				await borderInputs.nth(2).clear({ force: true });
				await borderInputs.nth(2).fill('30', { force: true });

				await borderInputs.nth(3).clear({ force: true });
				await borderInputs.nth(3).fill('40', { force: true });

				const radiusInputs = radiusContainer.locator('input');
				await radiusInputs.nth(0).clear({ force: true });
				await radiusInputs.nth(0).fill('50', { force: true });

				await radiusInputs.nth(1).clear({ force: true });
				await radiusInputs.nth(1).fill('60', { force: true });

				await radiusInputs.nth(2).clear({ force: true });
				await radiusInputs.nth(2).fill('70', { force: true });

				await radiusInputs.nth(3).clear({ force: true });
				await radiusInputs.nth(3).fill('80', { force: true });

				// WP data should come to Blockera
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/button'];
				const blockeraBorder2 = root2?.blockeraBorder?.value;
				const blockeraBorderRadius2 =
					root2?.blockeraBorderRadius?.value;
				const border2 = root2?.border;

				expect({
					type: 'custom',
					all: {
						width: '',
						style: '',
						color: '',
					},
					top: {
						width: '10px',
						color: '#ff4848',
						style: 'solid',
					},
					right: {
						width: '20px',
						color: '#ff4848',
						style: 'solid',
					},
					bottom: {
						width: '30px',
						color: '#ff4848',
						style: 'solid',
					},
					left: {
						width: '40px',
						color: '#ff4848',
						style: 'solid',
					},
				}).toEqual(blockeraBorder2);

				expect({
					type: 'custom',
					all: '',
					topLeft: '50px',
					topRight: '60px',
					bottomLeft: '70px',
					bottomRight: '80px',
				}).toEqual(blockeraBorderRadius2);

				expect({
					width: undefined,
					color: undefined,
					style: undefined,
					radius: {
						topLeft: '50px',
						topRight: '60px',
						bottomLeft: '70px',
						bottomRight: '80px',
					},
					top: {
						color: '#ff4848',
						width: '10px',
						style: 'solid',
					},
					right: {
						color: '#ff4848',
						width: '20px',
						style: 'solid',
					},
					bottom: {
						color: '#ff4848',
						width: '30px',
						style: 'solid',
					},
					left: {
						color: '#ff4848',
						width: '40px',
						style: 'solid',
					},
				}).toEqual(border2);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				await borderInputs.nth(0).clear({ force: true });
				await borderInputs.nth(1).clear({ force: true });
				await borderInputs.nth(2).clear({ force: true });
				await borderInputs.nth(3).clear({ force: true });

				const colorButtons = borderContainer.locator(
					'[data-test="border-control-color"]'
				);
				for (let i = 0; i < 4; i++) {
					await colorButtons.nth(i).click();

					const popover = page.locator('.components-popover').last();
					await popover
						.locator('[aria-label="Reset Color (Clear)"]')
						.click({ force: true });
				}

				await radiusInputs.nth(0).clear({ force: true });
				await radiusInputs.nth(1).clear({ force: true });
				await radiusInputs.nth(2).clear({ force: true });
				await radiusInputs.nth(3).clear({ force: true });

				// WP data should come to Blockera
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/button'];
				const blockeraBorder3 = root3?.blockeraBorder?.value;
				const border3 = root3?.border;

				expect({
					type: 'custom',
					all: {
						width: '',
						style: '',
						color: '',
					},
					top: {
						width: '',
						color: '',
						style: '',
					},
					right: {
						width: '',
						color: '',
						style: '',
					},
					bottom: {
						width: '',
						color: '',
						style: '',
					},
					left: {
						width: '',
						color: '',
						style: '',
					},
				}).toEqual(blockeraBorder3);

				expect({
					color: undefined,
					style: undefined,
					width: undefined,
					radius: undefined,
					top: undefined,
					right: undefined,
					bottom: undefined,
					left: undefined,
				}).toEqual(border3);
			});
		});
	});
});
