/**
 * Blockera dependencies
 */
const {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	activateMuPlugin,
	deactivateMuPlugin,
	deleteRepeaterItem,
} = require('@blockera/dev-playwright/js/utils/helpers');
const {
	test,
	expect,
	getByDataTest,
	addNewTransition,
	getParentContainer,
	openGlobalStylesPanel,
	clickValueAddonButton,
	selectValueAddonItem,
} = require('@blockera/dev-playwright/js/support/commands');

test.describe('Background Image & Gradient → WP Compatibility', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Linear Gradient Simple Value':
			'packages/editor/js/extensions/libs/background/test/global-styles/fixtures/background-image-setup-1.php',
		'Linear Gradient Variable':
			'packages/editor/js/extensions/libs/background/test/global-styles/fixtures/background-image-setup-2.php',
		'Linear Gradient Not Found Variable':
			'packages/editor/js/extensions/libs/background/test/global-styles/fixtures/background-image-setup-3.php',
		'Radial Gradient Simple Value':
			'packages/editor/js/extensions/libs/background/test/global-styles/fixtures/background-image-setup-4.php',
		'Background Image Simple Value':
			'packages/editor/js/extensions/libs/background/test/global-styles/fixtures/background-image-setup-5.php',
	};

	// Store active mu-plugin path for each test
	const activeMuPlugins = new Map();

	const before = async (page) => {
		await openGlobalStylesPanel(page);

		await closeWelcomeGuide(page);

		await getByDataTest(page, 'block-style-variations').nth(1).click();
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
		test.describe('Linear Gradient Background', () => {
			test('Linear Gradient Simple Value', async ({ page }) => {
				await page
					.locator('button[id="/blocks/core%2Fparagraph"]')
					.click();

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

				const root = globalStylesRecord?.['core/paragraph'];

				// WP data should come to Blockera
				const blockeraBackground1 = root?.blockeraBackground;

				expect({
					value: {
						'linear-gradient-0': {
							isVisible: true,
							type: 'linear-gradient',
							'linear-gradient':
								'linear-gradient(135deg,rgb(135,254,56) 1%,rgb(255,147,147) 97%)',
							'linear-gradient-angel': '135',
							'linear-gradient-repeat': 'no-repeat',
							'linear-gradient-attachment': 'scroll',
							order: 1,
						},
					},
				}).toEqual(blockeraBackground1);

				//
				// Test 2: Blockera value to WP data
				//

				// open gradient popover
				await bgContainer
					.locator('[data-id="linear-gradient-0"]')
					.click();

				// change angle
				const popover = page.locator('.components-popover').last();
				const angleContainer = getParentContainer(popover, 'Angle');
				await angleContainer.locator('input[type="number"]').clear({
					force: true,
				});
				await angleContainer
					.locator('input[type="number"]')
					.fill('45', {
						force: true,
					});

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const gradient2 = root2?.color?.gradient;

				expect(
					'linear-gradient(45deg,rgb(135,254,56) 1%,rgb(255,147,147) 97%)'
				).toEqual(gradient2);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				await deleteRepeaterItem(page, {
					container: bgContainer,
					itemId: 'linear-gradient-0',
					label: 'Delete linear gradient 0',
				});

				// WP data should be removed too
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const gradient3 = root3?.color?.gradient;

				expect(undefined).toEqual(gradient3);
			});

			test('Linear Gradient Variable', async ({ page }) => {
				await page
					.locator('button[id="/blocks/core%2Fparagraph"]')
					.click();

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

				const root = globalStylesRecord?.['core/paragraph'];

				// WP data should come to Blockera
				const blockeraBackground1 = root?.blockeraBackground;
				const gradient1 = root?.color?.gradient;

				expect({
					value: {
						'linear-gradient-0': {
							type: 'linear-gradient',
							'linear-gradient': {
								settings: {
									name: 'Vivid cyan blue to vivid purple',
									id: 'vivid-cyan-blue-to-vivid-purple',
									value: 'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(155,81,224) 100%)',
									reference: {
										type: 'theme',
										theme: 'Twenty Twenty-Five',
									},
									type: 'linear-gradient',
									var: '--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple',
								},
								name: 'Vivid cyan blue to vivid purple',
								isValueAddon: true,
								valueType: 'variable',
							},
							'linear-gradient-angel': '',
							'linear-gradient-repeat': 'no-repeat',
							'linear-gradient-attachment': 'scroll',
							isVisible: true,
							order: 1,
						},
					},
				}).toEqual(blockeraBackground1);
				expect(
					'var(--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple)'
				).toEqual(gradient1);

				//
				// Test 2: Blockera value to WP data
				//

				// open gradient popover
				await bgContainer
					.locator('[data-id="linear-gradient-0"]')
					.click();

				// Open variables popover
				const bgPopover = page
					.locator(
						'.components-popover.blockera-control-background-popover'
					)
					.last();
				await clickValueAddonButton(page, bgPopover);

				await page.waitForTimeout(500);

				// change variable
				await selectValueAddonItem(
					page,
					'light-green-cyan-to-vivid-green-cyan'
				);

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const gradient2 = root2?.color?.gradient;

				expect(
					'var:preset|gradient|light-green-cyan-to-vivid-green-cyan'
				).toEqual(gradient2);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				await deleteRepeaterItem(page, {
					container: bgContainer,
					itemId: 'linear-gradient-0',
					label: 'Delete linear gradient 0',
				});

				// WP data should be removed too
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const gradient3 = root3?.color?.gradient;

				expect(undefined).toEqual(gradient3);
			});

			test('Linear Gradient Not Found Variable', async ({ page }) => {
				await page
					.locator('button[id="/blocks/core%2Fparagraph"]')
					.click();

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

				const root = globalStylesRecord?.['core/paragraph'];

				// WP data should come to Blockera
				const blockeraBackground1 = root?.blockeraBackground;
				const gradient1 = root?.color?.gradient;

				expect({
					value: {
						'linear-gradient-0': {
							type: 'linear-gradient',
							'linear-gradient': {
								settings: {
									name: 'unknown',
									id: 'var(--wp--preset--gradient--unknown)',
									value: 'var(--wp--preset--gradient--unknown)',
									type: 'linear-gradient',
									var: '--wp--preset--gradient--unknown',
								},
								name: 'unknown',
								isValueAddon: true,
								valueType: 'variable',
							},
							'linear-gradient-angel': '',
							'linear-gradient-repeat': 'no-repeat',
							'linear-gradient-attachment': 'scroll',
							isVisible: true,
							order: 1,
						},
					},
				}).toEqual(blockeraBackground1);
				expect('var(--wp--preset--gradient--unknown)').toEqual(
					gradient1
				);

				//
				// Test 2: Check interface for showing deleted value addon
				//

				// Click on gradient item to open popover
				await bgContainer
					.locator('[data-id="linear-gradient-0"]')
					.click();

				// Wait for popover to be visible
				const bgPopover = page
					.locator(
						'.components-popover.blockera-control-background-popover'
					)
					.last();
				await bgPopover.waitFor({ state: 'visible' });
				await page.waitForTimeout(300);

				// Check for deleted value addon indicator inside the popover
				await expect(
					bgPopover.locator('[data-test="value-addon-deleted"]')
				).toBeVisible();
			});
		});

		test.describe('Radial Gradient Background', () => {
			test('Radial Gradient Simple Value', async ({ page }) => {
				await page
					.locator('button[id="/blocks/core%2Fparagraph"]')
					.click();

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

				const root = globalStylesRecord?.['core/paragraph'];

				// WP data should come to Blockera
				const blockeraBackground1 = root?.blockeraBackground;

				expect({
					value: {
						'radial-gradient-0': {
							isVisible: true,
							type: 'radial-gradient',
							'radial-gradient':
								'radial-gradient(rgb(194,169,144) 27%,rgb(254,95,95) 92%)',
							'radial-gradient-position': {
								top: '50%',
								left: '50%',
							},
							'radial-gradient-size': 'farthest-corner',
							'radial-gradient-repeat': 'no-repeat',
							'radial-gradient-attachment': 'scroll',
							order: 1,
						},
					},
				}).toEqual(blockeraBackground1);

				//
				// Test 2: Blockera value to WP data
				//

				// open gradient popover
				await bgContainer
					.locator('[data-id="radial-gradient-0"]')
					.click();

				// change size
				const popover = page.locator('.components-popover').last();
				await popover.locator('[data-value="farthest-side"]').click();

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/paragraph'];
				const gradient2 = root2?.color?.gradient;

				expect(
					'radial-gradient(rgb(194,169,144) 27%,rgb(254,95,95) 92%)'
				).toEqual(gradient2);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				await deleteRepeaterItem(page, {
					container: bgContainer,
					itemId: 'radial-gradient-0',
					label: 'Delete radial gradient 0',
				});

				// WP data should be removed too
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/paragraph'];
				const gradient3 = root3?.color?.gradient;

				expect(undefined).toEqual(gradient3);
			});
		});
	});

	test.describe('Group Block', () => {
		test.describe('Background Image', () => {
			test('Background Image Simple Value', async ({ page }) => {
				await page.locator('button[id="/blocks/core%2Fgroup"]').click();

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
					value: {
						'image-0': {
							isVisible: true,
							type: 'image',
							image: 'https://placehold.co/600x400',
							'image-size': 'custom',
							'image-size-width': 'auto',
							'image-size-height': 'auto',
							'image-position': {
								top: '50%',
								left: '50%',
							},
							'image-repeat': 'repeat',
							'image-attachment': 'scroll',
							order: 0,
						},
					},
				}).toEqual(blockeraBackground1);

				//
				// Test 2: Blockera value to WP data
				//

				// open image popover
				await bgContainer.locator('[data-id="image-0"]').click();

				// change size
				const popover = page.locator('.components-popover').last();
				await popover.locator('[data-value="cover"]').click();

				// Blockera value should be moved to WP data
				const globalStylesRecord2 = await getEditedGlobalStylesRecord(
					page,
					'styles',
					'blocks'
				);

				const root2 = globalStylesRecord2?.['core/group'];
				const backgroundImage2 = root2?.background?.backgroundImage;

				expect({
					url: 'https://placehold.co/600x400',
					id: 0,
					source: 'file',
					title: 'background image',
				}).toEqual(backgroundImage2);

				//
				// Test 3: Clear Blockera value and check WP data
				//

				await deleteRepeaterItem(page, {
					container: bgContainer,
					itemId: 'image-0',
					label: 'Delete image 0',
				});

				// WP data should be removed too
				const globalStylesRecord3 = await getEditedGlobalStylesRecord(
					bgContainer,
					'styles',
					'blocks'
				);

				const root3 = globalStylesRecord3?.['core/group'];
				const backgroundImage3 = root3?.background?.backgroundImage;
				const blockeraBackground3 = root3?.blockeraBackground;

				expect(undefined).toEqual(backgroundImage3);
				expect({}).toEqual(blockeraBackground3);
			});
		});
	});
});
