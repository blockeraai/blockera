/**
 * Background Image & Gradient → WP Compatibility (Global Styles)
 */
import {
	openSiteEditor,
	closeWelcomeGuide,
	getEditedGlobalStylesRecord,
	assertBlockData,
	activateMuPlugin,
	deactivateMuPlugin,
} from '@blockera/dev-cypress/js/helpers';

const FIXTURE_ROOT =
	'packages/editor/js/extensions/libs/background/test/global-styles/fixtures';

const muPluginByTestTitle = {
	'Linear Gradient Simple Value': {
		path: `${FIXTURE_ROOT}/background-image-setup-1.php`,
		target: 'blockera-test-bg-image-global-styles-linear-simple.php',
	},
	'Linear Gradient Variable': {
		path: `${FIXTURE_ROOT}/background-image-setup-2.php`,
		target: 'blockera-test-bg-image-global-styles-linear-variable.php',
	},
	'Linear Gradient Not Found Variable': {
		path: `${FIXTURE_ROOT}/background-image-setup-3.php`,
		target: 'blockera-test-bg-image-global-styles-linear-unknown.php',
	},
	'Radial Gradient Simple Value': {
		path: `${FIXTURE_ROOT}/background-image-setup-4.php`,
		target: 'blockera-test-bg-image-global-styles-radial-simple.php',
	},
	'Background Image Simple Value': {
		path: `${FIXTURE_ROOT}/background-image-setup-5.php`,
		target: 'blockera-test-bg-image-global-styles-image-simple.php',
	},
};

const activeMuPlugins = new Map();

const getParagraphGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/paragraph'];

const getGroupGlobalStyles = (data) =>
	getEditedGlobalStylesRecord(data, 'styles', 'blocks')?.['core/group'];

const openGlobalStylesBase = () => {
	cy.openGlobalStylesPanel();
	closeWelcomeGuide();
	cy.getByDataTest('block-style-variations').eq(0).click();
};

const openParagraphGlobalStyles = () => {
	cy.get('button[id="/blocks/core%2Fparagraph"]').click();
	cy.getByDataTest('style-default').click();
	cy.addNewTransition();
};

const openGroupGlobalStyles = () => {
	cy.get('button[id="/blocks/core%2Fgroup"]').click();
	cy.getByDataTest('style-default').click();
	cy.addNewTransition();
};

describe('Background Image & Gradient → WP Compatibility (Global Styles)', () => {
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
		openGlobalStylesBase();
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

	describe('Paragraph Block', () => {
		describe('Linear Gradient Background', () => {
			it('Linear Gradient Simple Value', () => {
				openParagraphGlobalStyles();
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				assertBlockData((data) => {
					const blockeraBackground =
						getParagraphGlobalStyles(data)?.blockeraBackground;

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
					}).to.deep.equal(blockeraBackground);
				});

				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="linear-gradient-0"]').click();
				});

				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.getParentContainer('Angle').within(() => {
							cy.get('input[type="number"]').clear({
								force: true,
							});
							cy.get('input[type="number"]').type('45', {
								force: true,
							});
						});
					});

				assertBlockData((data) => {
					const gradient =
						getParagraphGlobalStyles(data)?.color?.gradient;

					expect(
						'linear-gradient(45deg,rgb(135,254,56) 1%,rgb(255,147,147) 97%)'
					).to.equal(gradient);
				});

				cy.get('@bgContainer').within(() => {
					cy.getByAriaLabel('Delete linear gradient 0').click({
						force: true,
					});
				});

				assertBlockData((data) => {
					const gradient =
						getParagraphGlobalStyles(data)?.color?.gradient;

					expect(undefined).to.equal(gradient);
				});
			});

			it('Linear Gradient Variable', () => {
				openParagraphGlobalStyles();
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				assertBlockData((data) => {
					const root = getParagraphGlobalStyles(data);
					const blockeraBackground = root?.blockeraBackground;
					const gradient = root?.color?.gradient;

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
					}).to.deep.equal(blockeraBackground);
					expect(
						'var(--wp--preset--gradient--vivid-cyan-blue-to-vivid-purple)'
					).to.equal(gradient);
				});

				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="linear-gradient-0"]').click();
				});

				cy.get(
					'.components-popover.blockera-control-background-popover'
				).within(() => {
					cy.clickValueAddonButton();
				});

				cy.selectValueAddonItem('light-green-cyan-to-vivid-green-cyan');

				assertBlockData((data) => {
					const gradient =
						getParagraphGlobalStyles(data)?.color?.gradient;

					expect(
						'var:preset|gradient|light-green-cyan-to-vivid-green-cyan'
					).to.equal(gradient);
				});

				cy.get('@bgContainer').within(() => {
					cy.getByAriaLabel('Delete linear gradient 0').click({
						force: true,
					});
				});

				assertBlockData((data) => {
					const gradient =
						getParagraphGlobalStyles(data)?.color?.gradient;

					expect(undefined).to.equal(gradient);
				});
			});

			it('Linear Gradient Not Found Variable', () => {
				openParagraphGlobalStyles();
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				assertBlockData((data) => {
					const root = getParagraphGlobalStyles(data);
					const blockeraBackground = root?.blockeraBackground;
					const gradient = root?.color?.gradient;

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
					}).to.deep.equal(blockeraBackground);
					expect('var(--wp--preset--gradient--unknown)').to.equal(
						gradient
					);
				});

				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="linear-gradient-0"]').click();
				});

				cy.get(
					'.components-popover.blockera-control-background-popover'
				).within(() => {
					cy.get('[data-test="value-addon-deleted"]').should('exist');
				});
			});
		});

		describe('Radial Gradient Background', () => {
			it('Radial Gradient Simple Value', () => {
				openParagraphGlobalStyles();
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				assertBlockData((data) => {
					const blockeraBackground =
						getParagraphGlobalStyles(data)?.blockeraBackground;

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
					}).to.deep.equal(blockeraBackground);
				});

				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="radial-gradient-0"]').click();
				});

				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.get('[data-value="farthest-side"]').click();
					});

				assertBlockData((data) => {
					const gradient =
						getParagraphGlobalStyles(data)?.color?.gradient;

					expect(
						'radial-gradient(rgb(194,169,144) 27%,rgb(254,95,95) 92%)'
					).to.equal(gradient);
				});

				cy.get('@bgContainer').within(() => {
					cy.getByAriaLabel('Delete radial gradient 0').click({
						force: true,
					});
				});

				assertBlockData((data) => {
					const gradient =
						getParagraphGlobalStyles(data)?.color?.gradient;

					expect(undefined).to.equal(gradient);
				});
			});
		});
	});

	describe('Group Block', () => {
		describe('Background Image', () => {
			it('Background Image Simple Value', () => {
				openGroupGlobalStyles();
				cy.getParentContainer('Image & Gradient').as('bgContainer');

				assertBlockData((data) => {
					const blockeraBackground =
						getGroupGlobalStyles(data)?.blockeraBackground;

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
					}).to.deep.equal(blockeraBackground);
				});

				cy.get('@bgContainer').within(() => {
					cy.get('[data-id="image-0"]').click();
				});

				cy.get('.components-popover')
					.last()
					.within(() => {
						cy.get('[data-value="cover"]').click();
					});

				assertBlockData((data) => {
					const backgroundImage =
						getGroupGlobalStyles(data)?.background?.backgroundImage;

					expect({
						url: 'https://placehold.co/600x400',
						id: 0,
						source: 'file',
						title: 'background image',
					}).to.deep.equal(backgroundImage);
				});

				cy.get('@bgContainer').within(() => {
					cy.getByAriaLabel('Delete image 0').click({ force: true });
				});

				assertBlockData((data) => {
					const root = getGroupGlobalStyles(data);
					const backgroundImage = root?.background?.backgroundImage;
					const blockeraBackground = root?.blockeraBackground;

					expect(undefined).to.equal(backgroundImage);
					expect(undefined).to.equal(blockeraBackground);
				});
			});
		});
	});
});
