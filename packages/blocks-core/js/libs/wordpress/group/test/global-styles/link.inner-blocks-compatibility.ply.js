/**
 * Group Block → Link Inner Block → WP Data Compatibility
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
	getParentContainer,
	setColorControlValue,
	clearColorControlValue,
	clickValueAddonButton,
	openGlobalStylesPanel,
	selectValueAddonItem,
	removeValueAddon,
	addNewTransition,
} = require('@blockera/dev-playwright/js/support/commands');
const {
	setInnerBlock,
} = require('@blockera/dev-playwright/js/utils/inner-blocks');
const {
	setBlockState,
} = require('@blockera/dev-playwright/js/utils/block-states');

test.describe('Group Block → Link Inner Block → WP Data Compatibility', () => {
	// Mu-plugin paths configuration: map test titles to their mu-plugin paths
	// Mu-plugin paths are relative to plugin root
	const muPluginPaths = {
		'Simple color for inner block (normal + hover)':
			'packages/blocks-core/js/libs/wordpress/group/test/global-styles/fixtures/link-inner-blocks-simple-color.php',
		'Variable color value for inner block (normal + hover)':
			'packages/blocks-core/js/libs/wordpress/group/test/global-styles/fixtures/link-inner-blocks-variable-color.php',
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

	test.describe('Simple color for inner block (normal + hover)', () => {
		test('Simple color for inner block (normal + hover)', async ({
			page,
		}) => {
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
			const linkElement = root?.elements?.link;

			// WP data should come to Blockera
			const blockeraInnerBlocks = root?.blockeraInnerBlocks?.value;
			const linkInnerBlock = blockeraInnerBlocks?.['elements/link'];

			expect('#ffbaba').toEqual(linkElement?.color?.text);
			expect('#ff1d1d').toEqual(linkElement?.[':hover']?.color?.text);

			expect({
				blockeraFontColor: '#ffbaba',
				blockeraBlockStates: {
					hover: {
						isVisible: true,
						breakpoints: {
							desktop: {
								attributes: {
									blockeraFontColor: '#ff1d1d',
								},
							},
						},
					},
				},
			}).toEqual(linkInnerBlock?.attributes);

			//
			// Test 2: Blockera value to WP data
			//

			await setInnerBlock(page, 'elements/link');

			//
			// Normal → Text Color
			//

			await setBlockState(page, 'Normal');

			await setColorControlValue(page, 'Text Color', '#666666');

			//
			// Hover → Text Color
			//

			await setBlockState(page, 'Hover');

			await setColorControlValue(page, 'Text Color', '#888888');

			const globalStylesRecord2 = await getEditedGlobalStylesRecord(
				page,
				'styles',
				'blocks'
			);

			const root2 = globalStylesRecord2?.['core/group'];
			const linkElement2 = root2?.elements?.link;
			const blockeraInnerBlocks2 = root2?.blockeraInnerBlocks?.value;
			const linkInnerBlock2 = blockeraInnerBlocks2?.['elements/link'];

			expect({
				blockeraFontColor: '#666666',
				blockeraBlockStates: {
					hover: {
						isVisible: true,
						breakpoints: {
							desktop: {
								attributes: {
									blockeraFontColor: '#888888',
								},
							},
						},
					},
				},
			}).toEqual(linkInnerBlock2?.attributes);

			expect('#666666').toEqual(linkElement2?.color?.text);
			expect('#888888').toEqual(linkElement2?.[':hover']?.color?.text);

			//
			// Test 3: Clear Blockera value and check WP data
			//

			//
			// Normal → Text Color
			//

			await setBlockState(page, 'Normal');

			await clearColorControlValue(page, 'Text Color');

			//
			// Hover → Text Color
			//

			await setBlockState(page, 'Hover');

			await clearColorControlValue(page, 'Text Color');

			const globalStylesRecord3 = await getEditedGlobalStylesRecord(
				page,
				'styles',
				'blocks'
			);

			const root3 = globalStylesRecord3?.['core/group'];
			const linkElement3 = root3?.elements?.link;
			const blockeraInnerBlocks3 = root3?.blockeraInnerBlocks?.value;
			const linkInnerBlock3 = blockeraInnerBlocks3?.['elements/link'];

			expect({
				blockeraBlockStates: {
					hover: {
						isVisible: true,
						breakpoints: {
							desktop: {
								attributes: {},
							},
						},
					},
				},
			}).toEqual(linkInnerBlock3?.attributes);

			expect(undefined).toEqual(linkElement3?.color?.text);
			expect(undefined).toEqual(linkElement3?.[':hover']?.color?.text);
		});
	});

	test.describe('Variable color value for inner block (normal + hover)', () => {
		test('Variable color value for inner block (normal + hover)', async ({
			page,
		}) => {
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
			const linkElement = root?.elements?.link;

			// WP data should come to Blockera
			const blockeraInnerBlocks = root?.blockeraInnerBlocks?.value;
			const linkInnerBlock = blockeraInnerBlocks?.['elements/link'];

			// WordPress stores preset colors as var:preset|color|{slug} format
			expect('var:preset|color|accent-3').toEqual(
				linkElement?.color?.text
			);
			expect('var:preset|color|accent-4').toEqual(
				linkElement?.[':hover']?.color?.text
			);

			expect({
				blockeraFontColor: {
					settings: {
						name: 'Accent 3',
						id: 'accent-3',
						value: '#503AA8',
						reference: {
							type: 'theme',
							theme: 'Twenty Twenty-Five',
						},
						type: 'color',
						var: '--wp--preset--color--accent-3',
					},
					name: 'Accent 3',
					isValueAddon: true,
					valueType: 'variable',
				},
				blockeraBlockStates: {
					hover: {
						isVisible: true,
						breakpoints: {
							desktop: {
								attributes: {
									blockeraFontColor: {
										settings: {
											name: 'Accent 4',
											id: 'accent-4',
											value: '#686868',
											reference: {
												type: 'theme',
												theme: 'Twenty Twenty-Five',
											},
											type: 'color',
											var: '--wp--preset--color--accent-4',
										},
										name: 'Accent 4',
										isValueAddon: true,
										valueType: 'variable',
									},
								},
							},
						},
					},
				},
			}).toEqual(linkInnerBlock?.attributes);

			//
			// Test 2: Blockera value to WP data
			//

			await setInnerBlock(page, 'elements/link');

			//
			// Normal → Text Color
			//

			await setBlockState(page, 'Normal');

			const textColorContainer = getParentContainer(page, 'Text Color');
			await clickValueAddonButton(page, textColorContainer);

			await selectValueAddonItem(page, 'contrast');

			//
			// Hover → Text Color
			//

			await setBlockState(page, 'Hover');

			const textColorContainerHover = getParentContainer(
				page,
				'Text Color'
			);
			await clickValueAddonButton(page, textColorContainerHover);

			await selectValueAddonItem(page, 'accent-1');

			const globalStylesRecord2 = await getEditedGlobalStylesRecord(
				page,
				'styles',
				'blocks'
			);

			const root2 = globalStylesRecord2?.['core/group'];
			const linkElement2 = root2?.elements?.link;
			const blockeraInnerBlocks2 = root2?.blockeraInnerBlocks?.value;
			const linkInnerBlock2 = blockeraInnerBlocks2?.['elements/link'];

			expect({
				blockeraFontColor: {
					settings: {
						name: 'Contrast',
						id: 'contrast',
						value: '#111111',
						reference: {
							type: 'theme',
							theme: 'Twenty Twenty-Five',
						},
						type: 'color',
						var: '--wp--preset--color--contrast',
					},
					name: 'Contrast',
					isValueAddon: true,
					valueType: 'variable',
				},
				blockeraBlockStates: {
					hover: {
						isVisible: true,
						breakpoints: {
							desktop: {
								attributes: {
									blockeraFontColor: {
										settings: {
											name: 'Accent 1',
											id: 'accent-1',
											value: '#FFEE58',
											reference: {
												type: 'theme',
												theme: 'Twenty Twenty-Five',
											},
											type: 'color',
											var: '--wp--preset--color--accent-1',
										},
										name: 'Accent 1',
										isValueAddon: true,
										valueType: 'variable',
									},
								},
							},
						},
					},
				},
			}).toEqual(linkInnerBlock2?.attributes);

			expect('var:preset|color|contrast').toEqual(
				linkElement2?.color?.text
			);
			expect('var:preset|color|accent-1').toEqual(
				linkElement2?.[':hover']?.color?.text
			);

			//
			// Test 3: Clear Blockera value and check WP data
			//

			//
			// Normal → Text Color
			//

			await setBlockState(page, 'Normal');

			const textColorContainerNormal = getParentContainer(
				page,
				'Text Color'
			);
			await removeValueAddon(page, textColorContainerNormal);

			//
			// Hover → Text Color
			//

			await setBlockState(page, 'Hover');

			const textColorContainerHover2 = getParentContainer(
				page,
				'Text Color'
			);
			await removeValueAddon(page, textColorContainerHover2);

			const globalStylesRecord3 = await getEditedGlobalStylesRecord(
				page,
				'styles',
				'blocks'
			);

			const root3 = globalStylesRecord3?.['core/group'];
			const linkElement3 = root3?.elements?.link;
			const blockeraInnerBlocks3 = root3?.blockeraInnerBlocks?.value;
			const linkInnerBlock3 = blockeraInnerBlocks3?.['elements/link'];

			expect({
				blockeraBlockStates: {
					hover: {
						isVisible: true,
						breakpoints: {
							desktop: {
								attributes: {},
							},
						},
					},
				},
			}).toEqual(linkInnerBlock3?.attributes);

			expect(undefined).toEqual(linkElement3?.color?.text);
			expect(undefined).toEqual(linkElement3?.[':hover']?.color?.text);
		});
	});
});
