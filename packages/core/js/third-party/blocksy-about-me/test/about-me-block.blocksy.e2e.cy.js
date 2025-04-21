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
							name: 'Color 1',
							id: 'palette-color-1',
							value: 'var(--theme-palette-color-1, #2872fa)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-1',
						},
						name: 'Color 1',
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
							name: 'Color 2',
							id: 'palette-color-2',
							value: 'var(--theme-palette-color-2, #1559ed)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-2',
						},
						name: 'Color 2',
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
							name: 'Color 1',
							id: 'palette-color-1',
							value: 'var(--theme-palette-color-1, #2872fa)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-1',
						},
						name: 'Color 1',
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
							name: 'Color 2',
							id: 'palette-color-2',
							value: 'var(--theme-palette-color-2, #1559ed)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-2',
						},
						name: 'Color 2',
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
							name: 'Color 1',
							id: 'palette-color-1',
							value: 'var(--theme-palette-color-1, #2872fa)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-1',
						},
						name: 'Color 1',
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
							name: 'Color 2',
							id: 'palette-color-2',
							value: 'var(--theme-palette-color-2, #1559ed)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-2',
						},
						name: 'Color 2',
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
							name: 'Color 1',
							id: 'palette-color-1',
							value: 'var(--theme-palette-color-1, #2872fa)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-1',
						},
						name: 'Color 1',
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
							name: 'Color 2',
							id: 'palette-color-2',
							value: 'var(--theme-palette-color-2, #1559ed)',
							reference: {
								type: 'theme',
								theme: 'Blocksy',
							},
							type: 'color',
							var: '--wp--preset--color--palette-color-2',
						},
						name: 'Color 2',
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

	it('Inner blocks existence + CSS selectors in editor and front-end', () => {
		appendBlocks(`<!-- wp:blocksy/widgets-wrapper {"heading":"About Me","block":"blocksy/about-me"} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">About Me</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/about-me {"blockeraPropsId":"27e00124-6f09-4d2c-91db-3250f518cc87","blockeraCompatId":"16142144350","blockeraBackgroundClip":{"value":"padding-box"},"blockeraBorder":{"value":{"type":"all","all":{"width":"","color":"rgba(218, 222, 228, 0.5)","style":"solid"}}},"blockeraInnerBlocks":{"value":{"elements/icons":{"attributes":{"blockeraBorder":{"type":"all","all":{"width":"1px","style":"solid","color":"rgba(218, 222, 228, 0.5)"}},"blockeraBlockStates":{"hover":{"isVisible":true,"breakpoints":{"desktop":{"attributes":{"blockeraBorder":{"type":"all","all":{"width":"1px","style":"solid","color":"rgba(218, 222, 228, 0.7)"}}}}}}},"blockeraBackgroundColor":"#ff5b5b"}},"elements/avatar":{"attributes":{"blockeraBorder":{"type":"all","all":{"width":"4px","style":"","color":"#ff0000"}}}},"elements/name":{"attributes":{"blockeraBackgroundColor":"#ffcdcd"}},"elements/profile-link":{"attributes":{"blockeraBackgroundColor":"#ff9a9a"}},"elements/text":{"attributes":{"blockeraFontColor":"#00a95a"}}}},"customTextColor":"#00a95a","lock":{"remove":true},"className":"blockera-block blockera-block\u002d\u002dwslmq4"} -->
<div>Blocksy: About Me</div>
<!-- /wp:blocksy/about-me -->
<!-- /wp:blocksy/widgets-wrapper -->`);

		cy.getBlock('blocksy/about-me').first().click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		//
		// 1. Assert inner blocks selectors in editor
		//
		cy.getBlock('blocksy/about-me').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.getBlock('blocksy/about-me')
			.first()
			.within(() => {
				// color inner block
				cy.get('.ct-about-me-name span').should(
					'have.css',
					'color',
					'rgb(0, 169, 90)'
				);
				cy.get('.ct-about-me-name a').should(
					'have.css',
					'color',
					'rgb(0, 169, 90)'
				);

				// icons inner block
				cy.get('.ct-icon-container')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 91, 91)');

				// avatar inner block
				cy.get('figure img').should(
					'have.css',
					'border-color',
					'rgb(255, 0, 0)'
				);

				// name inner block
				cy.get('.ct-about-me-name span').should(
					'have.css',
					'background-color',
					'rgb(255, 205, 205)'
				);

				// profile link inner block
				cy.get('.ct-about-me-name a').should(
					'have.css',
					'background-color',
					'rgb(255, 154, 154)'
				);
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block').within(() => {
			// color inner block
			cy.get('.ct-about-me-name span').should(
				'have.css',
				'color',
				'rgb(0, 169, 90)'
			);
			cy.get('.ct-about-me-name a').should(
				'have.css',
				'color',
				'rgb(0, 169, 90)'
			);

			// icons inner block
			cy.get('.ct-icon-container')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 91, 91)');

			// avatar inner block
			cy.get('figure img').should(
				'have.css',
				'border-color',
				'rgb(255, 0, 0)'
			);

			// name inner block
			cy.get('.ct-about-me-name span').should(
				'have.css',
				'background-color',
				'rgb(255, 205, 205)'
			);

			// profile link inner block
			cy.get('.ct-about-me-name a').should(
				'have.css',
				'background-color',
				'rgb(255, 154, 154)'
			);
		});
	});
});
