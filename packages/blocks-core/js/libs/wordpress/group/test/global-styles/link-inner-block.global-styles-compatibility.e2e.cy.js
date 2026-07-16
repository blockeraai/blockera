/**
 * Group Block → Link Inner Block → WP Data Compatibility (Global Styles)
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	assertBlockData,
	activateMuPlugin,
	deactivateMuPlugin,
	setInnerBlock,
	setBlockState,
} from '@blockera/dev-cypress/js/helpers';

const FIXTURE_ROOT =
	'packages/blocks-core/js/libs/wordpress/group/test/global-styles/fixtures';

const muPluginByTestTitle = {
	'Simple color for inner block (normal + hover)': {
		path: `${FIXTURE_ROOT}/link-inner-blocks-simple-color.php`,
		target: 'blockera-test-link-inner-blocks-gs-simple-color.php',
	},
	'Variable color value for inner block (normal + hover)': {
		path: `${FIXTURE_ROOT}/link-inner-blocks-variable-color.php`,
		target: 'blockera-test-link-inner-blocks-gs-variable-color.php',
	},
};

const activeMuPlugins = new Map();

const getGroupGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/group'];

const openGroupGlobalStyles = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(0).click();
	cy.get('button[id="/blocks/core%2Fgroup"]').click();
};

describe('Group Block → Link Inner Block → WP Data Compatibility (Global Styles)', () => {
	beforeEach(function () {
		const muPlugin = muPluginByTestTitle[this.currentTest.title];

		if (muPlugin) {
			activateMuPlugin({
				pluginPath: muPlugin.path,
				pluginName: muPlugin.target,
			});
			activeMuPlugins.set(this.currentTest.title, muPlugin);
		}

		openSiteEditor();
		openGroupGlobalStyles();
	});

	afterEach(function () {
		const muPlugin = activeMuPlugins.get(this.currentTest.title);

		if (muPlugin) {
			deactivateMuPlugin({
				pluginPath: muPlugin.path,
				pluginName: muPlugin.target,
			});
			activeMuPlugins.delete(this.currentTest.title);
		}
	});

	it('Simple color for inner block (normal + hover)', () => {
		cy.getByDataTest('style-default').click();
		cy.addNewTransition();

		assertBlockData((data) => {
			const root = getGroupGlobalStyles(data);
			const linkElement = root?.elements?.link;
			const linkInnerBlock =
				root?.blockeraInnerBlocks?.value?.['elements/link'];

			expect('#ffbaba').to.equal(linkElement?.color?.text);
			expect('#ff1d1d').to.equal(linkElement?.[':hover']?.color?.text);
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
			}).to.deep.equal(linkInnerBlock?.attributes);
		});

		setInnerBlock('elements/link');

		setBlockState('Normal');
		cy.setColorControlValue('Text Color', '666666');

		setBlockState('Hover');
		cy.setColorControlValue('Text Color', '888888');

		assertBlockData((data) => {
			const root = getGroupGlobalStyles(data);
			const linkElement = root?.elements?.link;
			const linkInnerBlock =
				root?.blockeraInnerBlocks?.value?.['elements/link'];

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
			}).to.deep.equal(linkInnerBlock?.attributes);
			expect('#666666').to.equal(linkElement?.color?.text);
			expect('#888888').to.equal(linkElement?.[':hover']?.color?.text);
		});

		setBlockState('Normal');
		cy.clearColorControlValue('Text Color');

		setBlockState('Hover');
		cy.clearColorControlValue('Text Color');

		assertBlockData((data) => {
			const root = getGroupGlobalStyles(data);
			const linkElement = root?.elements?.link;
			const linkInnerBlock =
				root?.blockeraInnerBlocks?.value?.['elements/link'];

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
			}).to.deep.equal(linkInnerBlock?.attributes);
			expect(undefined).to.equal(linkElement?.color?.text);
			expect(undefined).to.equal(linkElement?.[':hover']?.color?.text);
		});
	});

	it('Variable color value for inner block (normal + hover)', () => {
		cy.getByDataTest('style-default').click();
		cy.addNewTransition();

		assertBlockData((data) => {
			const root = getGroupGlobalStyles(data);
			const linkElement = root?.elements?.link;
			const linkInnerBlock =
				root?.blockeraInnerBlocks?.value?.['elements/link'];

			expect('var(--wp--preset--color--accent-3)').to.equal(
				linkElement?.color?.text
			);
			expect('var(--wp--preset--color--accent-4)').to.equal(
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
			}).to.deep.equal(linkInnerBlock?.attributes);
		});

		setInnerBlock('elements/link');

		setBlockState('Normal');
		cy.getParentContainer('Text Color').within(() => {
			cy.clickValueAddonButton();
		});
		cy.selectValueAddonItem('contrast');

		setBlockState('Hover');
		cy.getParentContainer('Text Color').within(() => {
			cy.clickValueAddonButton();
		});
		cy.selectValueAddonItem('accent-1');

		assertBlockData((data) => {
			const root = getGroupGlobalStyles(data);
			const linkElement = root?.elements?.link;
			const linkInnerBlock =
				root?.blockeraInnerBlocks?.value?.['elements/link'];

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
			}).to.deep.equal(linkInnerBlock?.attributes);
			expect('var:preset|color|contrast').to.equal(
				linkElement?.color?.text
			);
			expect('var:preset|color|accent-1').to.equal(
				linkElement?.[':hover']?.color?.text
			);
		});

		setBlockState('Normal');
		cy.getParentContainer('Text Color').within(() => {
			cy.removeValueAddon();
		});

		setBlockState('Hover');
		cy.getParentContainer('Text Color').within(() => {
			cy.removeValueAddon();
		});

		assertBlockData((data) => {
			const root = getGroupGlobalStyles(data);
			const linkElement = root?.elements?.link;
			const linkInnerBlock =
				root?.blockeraInnerBlocks?.value?.['elements/link'];

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
			}).to.deep.equal(linkInnerBlock?.attributes);
			expect(undefined).to.equal(linkElement?.color?.text);
			expect(undefined).to.equal(linkElement?.[':hover']?.color?.text);
		});
	});
});
