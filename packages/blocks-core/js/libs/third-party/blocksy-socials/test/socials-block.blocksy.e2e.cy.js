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

describe('Blocksy → Socials Block → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('BG Color Inner Block', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper -->
<!-- wp:heading {"level":3,"className":"","style":{"border":{"radius":"17px"}},"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size" style="border-radius:17px">Socials</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/socials {"social_type":"rounded","social_icons_fill":"solid","customBackgroundColor":"#7790ff","lock":{"remove":true}} -->
<div>Blocksy: Socials</div>
<!-- /wp:blocksy/socials -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/socials').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'backgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customBackgroundColor')
					);

					expect('#7790ff').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/icons');

				cy.setColorControlValue('BG Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'backgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customBackgroundColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Background', 'BG Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'backgroundColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBackgroundColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper -->
<!-- wp:heading {"level":3,"className":"","style":{"border":{"radius":"17px"}},"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size" style="border-radius:17px">Socials</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/socials {"social_type":"rounded","social_icons_fill":"solid","backgroundColor":"palette-color-1","lock":{"remove":true}} -->
<div>Blocksy: Socials</div>
<!-- /wp:blocksy/socials -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/socials').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'backgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customBackgroundColor')
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
						]?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/icons');

				cy.getParentContainer('BG Color').within(() => {
					cy.clickValueAddonButton();
				});

				// change variable
				cy.selectValueAddonItem('palette-color-2');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'backgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customBackgroundColor')
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
						]?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.getParentContainer('BG Color').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'backgroundColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBackgroundColor
					);
				});
			});
		});
	});

	describe('BG Hover Color Inner Block', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper -->
<!-- wp:heading {"level":3,"className":"","style":{"border":{"radius":"17px"}},"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size" style="border-radius:17px">Socials</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/socials {"social_type":"rounded","social_icons_fill":"solid","customBackgroundHoverColor":"#ff0000","lock":{"remove":true}} -->
<div>Blocksy: Socials</div>
<!-- /wp:blocksy/socials -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/socials').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'backgroundHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customBackgroundHoverColor')
					);

					expect('#ff0000').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/icons');
				setBlockState('Hover');

				cy.setColorControlValue('BG Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'backgroundHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customBackgroundHoverColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Background', 'BG Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'backgroundHoverColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customBackgroundHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper -->
<!-- wp:heading {"level":3,"className":"","style":{"border":{"radius":"17px"}},"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size" style="border-radius:17px">Socials</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/socials {"social_type":"rounded","social_icons_fill":"solid","backgroundHoverColor":"palette-color-1","lock":{"remove":true}} -->
<div>Blocksy: Socials</div>
<!-- /wp:blocksy/socials -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/socials').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'backgroundHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customBackgroundHoverColor')
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
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/icons');
				setBlockState('Hover');

				cy.getParentContainer('BG Color').within(() => {
					cy.clickValueAddonButton();
				});

				// change variable
				cy.selectValueAddonItem('palette-color-2');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'backgroundHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customBackgroundHoverColor')
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
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.getParentContainer('BG Color').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'backgroundHoverColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customBackgroundHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/icons'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});
			});
		});
	});

	describe('Icons Color Inner Block', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper -->
<!-- wp:heading {"level":3,"className":"","style":{"border":{"radius":"17px"}},"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size" style="border-radius:17px">Socials</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/socials {"social_type":"rounded","customInitialColor":"#ff9e9e","lock":{"remove":true}} -->
<div>Blocksy: Socials</div>
<!-- /wp:blocksy/socials -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/socials').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'initialColor')
					);

					expect('#ff9e9e').to.be.equal(
						getSelectedBlock(data, 'customInitialColor')
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
						getSelectedBlock(data, 'initialColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customInitialColor')
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
						getSelectedBlock(data, 'initialColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInitialColor')
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
					`<!-- wp:blocksy/widgets-wrapper -->
<!-- wp:heading {"level":3,"className":"","style":{"border":{"radius":"17px"}},"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size" style="border-radius:17px">Socials</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/socials {"social_type":"rounded","initialColor":"palette-color-1","lock":{"remove":true}} -->
<div>Blocksy: Socials</div>
<!-- /wp:blocksy/socials -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/socials').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('palette-color-1').to.be.equal(
						getSelectedBlock(data, 'initialColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customInitialColor')
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
						getSelectedBlock(data, 'initialColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInitialColor')
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
						getSelectedBlock(data, 'initialColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInitialColor')
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
					`<!-- wp:blocksy/widgets-wrapper -->
<!-- wp:heading {"level":3,"className":"","style":{"border":{"radius":"17px"}},"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size" style="border-radius:17px">Socials</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/socials {"social_type":"rounded","customHoverColor":"#ff1c1c","lock":{"remove":true}} -->
<div>Blocksy: Socials</div>
<!-- /wp:blocksy/socials -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/socials').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'hoverColor')
					);

					expect('#ff1c1c').to.be.equal(
						getSelectedBlock(data, 'customHoverColor')
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
						getSelectedBlock(data, 'hoverColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customHoverColor')
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
						getSelectedBlock(data, 'hoverColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customHoverColor')
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
					`<!-- wp:blocksy/widgets-wrapper -->
<!-- wp:heading {"level":3,"className":"","style":{"border":{"radius":"17px"}},"fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size" style="border-radius:17px">Socials</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/socials {"social_type":"rounded","hoverColor":"palette-color-1","lock":{"remove":true}} -->
<div>Blocksy: Socials</div>
<!-- /wp:blocksy/socials -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/socials').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('palette-color-1').to.be.equal(
						getSelectedBlock(data, 'hoverColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customHoverColor')
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
						getSelectedBlock(data, 'hoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customHoverColor')
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
						getSelectedBlock(data, 'hoverColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customHoverColor')
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

	it('Block card + CSS selectors in editor and front-end', () => {
		appendBlocks(`<!-- wp:blocksy/widgets-wrapper -->
<!-- wp:heading {"level":3,"blockeraCompatId":"17145539258","blockeraFontSize":{"value":{"settings":{"name":"Medium","id":"medium","value":"20px","fluid":null,"reference":{"type":"preset"},"type":"font-size","var":"\u002d\u002dwp\u002d\u002dpreset\u002d\u002dfont-size\u002d\u002dmedium"},"name":"Medium","isValueAddon":true,"valueType":"variable"}},"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Socials</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/socials {"blockeraPropsId":"b4d2ac21-d208-434b-aa0c-e255b31e9de1","blockeraCompatId":"17145540307","blockeraBackgroundColor":{"value":"#ffd8d8"},"blockeraBackgroundClip":{"value":"padding-box"},"blockeraBorder":{"value":{"type":"all","all":{"width":"","color":"rgba(218, 222, 228, 0.5)","style":"solid"}}},"blockeraInnerBlocks":{"value":{"elements/icons":{"attributes":{"blockeraBorder":{"type":"all","all":{"width":"1px","style":"solid","color":"#21212180"}},"blockeraBlockStates":{"hover":{"isVisible":true,"breakpoints":{"desktop":{"attributes":{"blockeraBorder":{"type":"all","all":{"width":"1px","style":"solid","color":"rgba(218, 222, 228, 0.7)"}},"blockeraBackgroundColor":"#ff3030"}}}}},"blockeraBackgroundColor":"#ff8383"}}}},"social_type":"rounded","customBorderColor":"#21212180","lock":{"remove":true},"className":"blockera-block blockera-block\u002d\u002d1t0a9e"} -->
<div>Blocksy: Socials</div>
<!-- /wp:blocksy/socials -->
<!-- /wp:blocksy/widgets-wrapper -->`);

		cy.getBlock('blocksy/socials').first().click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover', 'elements/icons']);

		//
		// 1. Assert inner blocks selectors in editor
		//
		cy.getBlock('blocksy/socials').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.getBlock('blocksy/socials')
			.first()
			.within(() => {
				cy.get('.ct-icon-container').should(
					'have.css',
					'background-color',
					'rgb(255, 131, 131)'
				);
			});

		//
		// 2. block card items
		//
		setInnerBlock('elements/icons');
		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block').within(() => {
			cy.get('.ct-icon-container').should(
				'have.css',
				'background-color',
				'rgb(255, 131, 131)'
			);
		});
	});
});
