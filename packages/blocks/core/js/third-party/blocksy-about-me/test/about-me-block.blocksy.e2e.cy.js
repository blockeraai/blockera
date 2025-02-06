/**
 * Blockera dependencies
 */
import {
	savePage,
	redirectToFrontPage,
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
	setInnerBlock,
	setBlockState,
	setParentBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Blocksy → About Me Block → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Text Color Inner Block', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"About Me","block":"blocksy/about-me"} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">About Me</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/about-me {"customTextColor":"#7790ff","customTextHoverColor":"#224bff","lock":{"remove":true}} -->
<div>Blocksy: About Me</div>
<!-- /wp:blocksy/about-me -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/about-me').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('').to.be.equal(getSelectedBlock(data, 'textColor'));

					expect('#7790ff').to.be.equal(
						getSelectedBlock(data, 'customTextColor')
					);

					expect('#7790ff').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/text'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/text');

				cy.setColorControlValue('Text Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'textColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customTextColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/text'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Typography', 'Text Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'textColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customTextColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/text'
						]?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"About Me","block":"blocksy/about-me"} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">About Me</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/about-me {"textColor":"palette-color-1","textHoverColor":"palette-color-3","lock":{"remove":true}} -->
<div>Blocksy: About Me</div>
<!-- /wp:blocksy/about-me -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/about-me').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('palette-color-1').to.be.equal(
						getSelectedBlock(data, 'textColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customTextColor')
					);

					expect({
						settings: {
							name: 'Palette Color 1',
							id: 'palette-color-1',
							value: 'var(--theme-palette-color-1, #2872fa)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-1',
						},
						name: 'Palette Color 1',
						isValueAddon: true,
						valueType: 'variable',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/text'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/text');

				cy.getParentContainer('Text Color').within(() => {
					cy.clickValueAddonButton();
				});

				// change variable
				cy.selectValueAddonItem('palette-color-2');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect('palette-color-2').to.be.equal(
						getSelectedBlock(data, 'textColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customTextColor')
					);

					expect({
						settings: {
							name: 'Palette Color 2',
							id: 'palette-color-2',
							value: 'var(--theme-palette-color-2, #1559ed)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-2',
						},
						name: 'Palette Color 2',
						isValueAddon: true,
						valueType: 'variable',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/text'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.getParentContainer('Text Color').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'textColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customTextColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/text'
						]?.attributes?.blockeraFontColor
					);
				});
			});
		});
	});

	describe('Text Hover Color Inner Block', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"About Me","block":"blocksy/about-me"} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">About Me</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/about-me {"customTextColor":"#7790ff","customTextHoverColor":"#ff0000","lock":{"remove":true}} -->
<div>Blocksy: About Me</div>
<!-- /wp:blocksy/about-me -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/about-me').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'textHoverColor')
					);

					expect('#ff0000').to.be.equal(
						getSelectedBlock(data, 'customTextHoverColor')
					);

					expect('#ff0000').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/text'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/text');
				setBlockState('Hover');

				cy.setColorControlValue('Text Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'textHoverColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customTextHoverColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/text'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Typography', 'Text Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'textHoverColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customTextHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/text'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"About Me","block":"blocksy/about-me"} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">About Me</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/about-me {"textColor":"palette-color-3","textHoverColor":"palette-color-1","lock":{"remove":true}} -->
<div>Blocksy: About Me</div>
<!-- /wp:blocksy/about-me -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/about-me').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('palette-color-1').to.be.equal(
						getSelectedBlock(data, 'textHoverColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customTextHoverColor')
					);

					expect({
						settings: {
							name: 'Palette Color 1',
							id: 'palette-color-1',
							value: 'var(--theme-palette-color-1, #2872fa)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-1',
						},
						name: 'Palette Color 1',
						isValueAddon: true,
						valueType: 'variable',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/text'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/text');
				setBlockState('Hover');

				cy.getParentContainer('Text Color').within(() => {
					cy.clickValueAddonButton();
				});

				// change variable
				cy.selectValueAddonItem('palette-color-2');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect('palette-color-2').to.be.equal(
						getSelectedBlock(data, 'textHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customTextHoverColor')
					);

					expect({
						settings: {
							name: 'Palette Color 2',
							id: 'palette-color-2',
							value: 'var(--theme-palette-color-2, #1559ed)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-2',
						},
						name: 'Palette Color 2',
						isValueAddon: true,
						valueType: 'variable',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/text'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.getParentContainer('Text Color').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'textHoverColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customTextHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/text'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});
			});
		});
	});

	describe('Icons Color Inner Block', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"About Me","block":"blocksy/about-me"} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">About Me</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/about-me {"customIconsColor":"#ff9e9e","customIconsHoverColor":"#ff1c1c","lock":{"remove":true}} -->
<div>Blocksy: About Me</div>
<!-- /wp:blocksy/about-me -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/about-me').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'iconsColor')
					);

					expect('#ff9e9e').to.be.equal(
						getSelectedBlock(data, 'customIconsColor')
					);

					expect('#ff9e9e').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/icons');

				cy.setColorControlValue('Text Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'iconsColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customIconsColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Typography', 'Text Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'iconsColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customIconsColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"About Me","block":"blocksy/about-me"} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">About Me</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/about-me {"iconsColor":"palette-color-1","iconsHoverColor":"palette-color-3","lock":{"remove":true}} -->
<div>Blocksy: About Me</div>
<!-- /wp:blocksy/about-me -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/about-me').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('palette-color-1').to.be.equal(
						getSelectedBlock(data, 'iconsColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customIconsColor')
					);

					expect({
						settings: {
							name: 'Palette Color 1',
							id: 'palette-color-1',
							value: 'var(--theme-palette-color-1, #2872fa)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-1',
						},
						name: 'Palette Color 1',
						isValueAddon: true,
						valueType: 'variable',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/icons');

				cy.getParentContainer('Text Color').within(() => {
					cy.clickValueAddonButton();
				});

				// change variable
				cy.selectValueAddonItem('palette-color-2');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect('palette-color-2').to.be.equal(
						getSelectedBlock(data, 'iconsColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customIconsColor')
					);

					expect({
						settings: {
							name: 'Palette Color 2',
							id: 'palette-color-2',
							value: 'var(--theme-palette-color-2, #1559ed)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-2',
						},
						name: 'Palette Color 2',
						isValueAddon: true,
						valueType: 'variable',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.getParentContainer('Text Color').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'iconsColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customIconsColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraFontColor
					);
				});
			});
		});
	});

	describe('Icons Hover Color Inner Block', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"About Me","block":"blocksy/about-me"} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">About Me</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/about-me {"customIconsColor":"#ff9e9e","customIconsHoverColor":"#ff1c1c","lock":{"remove":true}} -->
<div>Blocksy: About Me</div>
<!-- /wp:blocksy/about-me -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/about-me').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'iconsHoverColor')
					);

					expect('#ff1c1c').to.be.equal(
						getSelectedBlock(data, 'customIconsHoverColor')
					);

					expect('#ff1c1c').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/icons');
				setBlockState('Hover');

				cy.setColorControlValue('Text Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'iconsHoverColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customIconsHoverColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Typography', 'Text Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'iconsHoverColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customIconsHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"About Me","block":"blocksy/about-me"} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">About Me</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/about-me {"iconsColor":"palette-color-3","iconsHoverColor":"palette-color-1","lock":{"remove":true}} -->
<div>Blocksy: About Me</div>
<!-- /wp:blocksy/about-me -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/about-me').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('palette-color-1').to.be.equal(
						getSelectedBlock(data, 'iconsHoverColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customIconsHoverColor')
					);

					expect({
						settings: {
							name: 'Palette Color 1',
							id: 'palette-color-1',
							value: 'var(--theme-palette-color-1, #2872fa)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-1',
						},
						name: 'Palette Color 1',
						isValueAddon: true,
						valueType: 'variable',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/icons');
				setBlockState('Hover');

				cy.getParentContainer('Text Color').within(() => {
					cy.clickValueAddonButton();
				});

				// change variable
				cy.selectValueAddonItem('palette-color-2');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect('palette-color-2').to.be.equal(
						getSelectedBlock(data, 'iconsHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customIconsHoverColor')
					);

					expect({
						settings: {
							name: 'Palette Color 2',
							id: 'palette-color-2',
							value: 'var(--theme-palette-color-2, #1559ed)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-2',
						},
						name: 'Palette Color 2',
						isValueAddon: true,
						valueType: 'variable',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.getParentContainer('Text Color').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'iconsHoverColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customIconsHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});
			});
		});
	});

	// todo move this test to pro version because border is a pro feature for inner blocks
	describe('Icons Border Color Inner Block', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"About Me","block":"blocksy/about-me"} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">About Me</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/about-me {"customBorderColor":"#0066ff","lock":{"remove":true}} -->
<div>Blocksy: About Me</div>
<!-- /wp:blocksy/about-me -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/about-me').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('rgba(218, 222, 228, 0.5)').to.be.equal(
						getSelectedBlock(data, 'borderColor')
					);

					expect('#0066ff').to.be.equal(
						getSelectedBlock(data, 'customBorderColor')
					);

					expect('#0066ff').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBorder?.all?.color
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/icons');

				cy.getParentContainer('Border Line').within(() => {
					cy.getByDataTest('border-control-color').click();
				});

				// color
				cy.getByDataTest('popover-body')
					.last()
					.within(() => {
						cy.get('input[maxlength="9"]').clear({ force: true });
						cy.get('input[maxlength="9"]').type('9958e3 ');
					});

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'borderColor')
					);

					expect('#9958e3').to.be.equal(
						getSelectedBlock(data, 'customBorderColor')
					);

					expect('#9958e3').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBorder?.all?.color
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute(
					'Border And Shadow',
					'Border Line',
					'reset'
				);

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'borderColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customBorderColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBorder?.all?.color
					);
				});
			});
		});
	});
});
