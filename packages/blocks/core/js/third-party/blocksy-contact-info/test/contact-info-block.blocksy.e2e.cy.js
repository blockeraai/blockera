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

describe('Blocksy → Contact Info Block → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Text Color Inner Block', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"Contact Info","block":"blocksy/contact-info","hasDescription":true} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Contact Info</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/contact-info {"customTextColor":"#7790ff","lock":{"remove":true}} -->
<div>Blocksy: Contact Info</div>
<!-- /wp:blocksy/contact-info -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/contact-info').first().click();

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
					`<!-- wp:blocksy/widgets-wrapper {"heading":"Contact Info","block":"blocksy/contact-info","hasDescription":true} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Contact Info</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/contact-info {"textColor":"palette-color-1","lock":{"remove":true}} -->
<div>Blocksy: Contact Info</div>
<!-- /wp:blocksy/contact-info -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/contact-info').first().click();

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

	describe('Link Color Inner Block', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"Contact Info","block":"blocksy/contact-info","hasDescription":true} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Contact Info</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/contact-info {"customTextInitialColor":"#7790ff","lock":{"remove":true}} -->
<div>Blocksy: Contact Info</div>
<!-- /wp:blocksy/contact-info -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/contact-info').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'textInitialColor')
					);

					expect('#7790ff').to.be.equal(
						getSelectedBlock(data, 'customTextInitialColor')
					);

					expect('#7790ff').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/link'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/link');

				cy.setColorControlValue('Text Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'textInitialColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customTextInitialColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/link'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Typography', 'Text Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'textInitialColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customTextInitialColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/link'
						]?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"Contact Info","block":"blocksy/contact-info","hasDescription":true} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Contact Info</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/contact-info {"textInitialColor":"palette-color-1","lock":{"remove":true}} -->
<div>Blocksy: Contact Info</div>
<!-- /wp:blocksy/contact-info -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/contact-info').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('palette-color-1').to.be.equal(
						getSelectedBlock(data, 'textInitialColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customTextInitialColor')
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
							'elements/link'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/link');

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
						getSelectedBlock(data, 'textInitialColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customTextInitialColor')
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
							'elements/link'
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
						getSelectedBlock(data, 'textInitialColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customTextInitialColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/link'
						]?.attributes?.blockeraFontColor
					);
				});
			});
		});
	});

	describe('Link Hover Color Inner Block', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"Contact Info","block":"blocksy/contact-info","hasDescription":true} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Contact Info</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/contact-info {"customTextHoverColor":"#ff0000","lock":{"remove":true}} -->
<div>Blocksy: Contact Info</div>
<!-- /wp:blocksy/contact-info -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/contact-info').first().click();

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
							'elements/link'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/link');
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
							'elements/link'
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
							'elements/link'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/widgets-wrapper {"heading":"Contact Info","block":"blocksy/contact-info","hasDescription":true} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Contact Info</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/contact-info {"textHoverColor":"palette-color-1","lock":{"remove":true}} -->
<div>Blocksy: Contact Info</div>
<!-- /wp:blocksy/contact-info -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/contact-info').first().click();

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
							'elements/link'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/link');
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
							'elements/link'
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
							'elements/link'
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
					`<!-- wp:blocksy/widgets-wrapper {"heading":"Contact Info","block":"blocksy/contact-info","hasDescription":true} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Contact Info</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/contact-info {"customIconsColor":"#ff9e9e","lock":{"remove":true}} -->
<div>Blocksy: Contact Info</div>
<!-- /wp:blocksy/contact-info -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/contact-info').first().click();

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
					`<!-- wp:blocksy/widgets-wrapper {"heading":"Contact Info","block":"blocksy/contact-info","hasDescription":true} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Contact Info</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/contact-info {"iconsColor":"palette-color-1","lock":{"remove":true}} -->
<div>Blocksy: Contact Info</div>
<!-- /wp:blocksy/contact-info -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/contact-info').first().click();

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
					`<!-- wp:blocksy/widgets-wrapper {"heading":"Contact Info","block":"blocksy/contact-info","hasDescription":true} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Contact Info</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/contact-info {"customIconsHoverColor":"#ff1c1c","lock":{"remove":true}} -->
<div>Blocksy: Contact Info</div>
<!-- /wp:blocksy/contact-info -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/contact-info').first().click();

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
					`<!-- wp:blocksy/widgets-wrapper {"heading":"Contact Info","block":"blocksy/contact-info","hasDescription":true} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Contact Info</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/contact-info {"iconsHoverColor":"palette-color-1","lock":{"remove":true}} -->
<div>Blocksy: Contact Info</div>
<!-- /wp:blocksy/contact-info -->
<!-- /wp:blocksy/widgets-wrapper -->`
				);

				// Select target block
				cy.getBlock('blocksy/contact-info').first().click();

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

	describe('CSS selectors in editor and front-end', () => {
		it('Step 1', () => {
			appendBlocks(`<!-- wp:blocksy/widgets-wrapper {"heading":"Contact Info","block":"blocksy/contact-info","hasDescription":true} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Contact Info</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/contact-info {"blockeraPropsId":"1328e472-bfca-4af4-82db-19f2dcc1ba06","blockeraCompatId":"16183445239","blockeraBackgroundColor":{"value":"#ffc1c1"},"blockeraBackgroundClip":{"value":"padding-box"},"blockeraBorder":{"value":{"type":"all","all":{"width":"","color":"rgba(218, 222, 228, 0.5)","style":"solid"}}},"blockeraInnerBlocks":{"value":{"elements/icons":{"attributes":{"blockeraBorder":{"type":"all","all":{"width":"1px","style":"solid","color":"rgba(218, 222, 228, 0.5)"}},"blockeraBlockStates":{"hover":{"isVisible":true,"breakpoints":{"desktop":{"attributes":{"blockeraBorder":{"type":"all","all":{"width":"1px","style":"solid","color":"rgba(218, 222, 228, 0.7)"}}}}}}},"blockeraBackgroundColor":"#ff7878"}},"elements/titles":{"attributes":{"blockeraFontColor":"#38ffb3"}},"elements/contents":{"attributes":{"blockeraFontColor":"#1500ff"}}}},"lock":{"remove":true},"className":"blockera-block blockera-block\u002d\u002dt97zuv","style":{"color":{"background":"#ffc1c1"}}} -->
<div>Blocksy: Contact Info</div>
<!-- /wp:blocksy/contact-info -->
<!-- /wp:blocksy/widgets-wrapper -->`);

			cy.getBlock('blocksy/contact-info').first().click();

			cy.get('.blockera-extension-block-card').should('be.visible');

			//
			// 1. Assert inner blocks selectors in editor
			//
			cy.getBlock('blocksy/contact-info').should(
				'have.css',
				'background-clip',
				'padding-box'
			);

			cy.getBlock('blocksy/contact-info')
				.first()
				.within(() => {
					cy.get('.contact-title').should(
						'have.css',
						'color',
						'rgb(56, 255, 179)'
					);

					cy.get('.contact-text')
						.first()
						.should('have.css', 'color', 'rgb(21, 0, 255)');

					cy.get('.ct-icon-container')
						.first()
						.should(
							'have.css',
							'background-color',
							'rgb(255, 120, 120)'
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
				cy.get('.contact-title').should(
					'have.css',
					'color',
					'rgb(56, 255, 179)'
				);

				cy.get('.contact-text')
					.first()
					.should('have.css', 'color', 'rgb(21, 0, 255)');

				cy.get('.ct-icon-container')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(255, 120, 120)'
					);
			});
		});

		it('Step 2', () => {
			appendBlocks(`<!-- wp:blocksy/widgets-wrapper {"heading":"Contact Info","block":"blocksy/contact-info","hasDescription":true} -->
<!-- wp:heading {"level":3,"className":"","fontSize":"medium"} -->
<h3 class="wp-block-heading has-medium-font-size">Contact Info</h3>
<!-- /wp:heading -->

<!-- wp:blocksy/contact-info {"blockeraPropsId":"76b85ed2-a93c-4193-8926-7f87fb83d843","blockeraCompatId":"16184648619","blockeraBorder":{"value":{"type":"all","all":{"width":"","color":"rgba(218, 222, 228, 0.5)","style":"solid"}}},"blockeraInnerBlocks":{"value":{"elements/icons":{"attributes":{"blockeraBorder":{"type":"all","all":{"width":"1px","style":"solid","color":"rgba(218, 222, 228, 0.5)"}},"blockeraBlockStates":{"hover":{"isVisible":true,"breakpoints":{"desktop":{"attributes":{"blockeraBorder":{"type":"all","all":{"width":"1px","style":"solid","color":"rgba(218, 222, 228, 0.7)"}}}}}}}}},"elements/text":{"attributes":{"blockeraFontColor":"#ff0000"}},"elements/link":{"attributes":{"blockeraFontColor":"#003cff"}}}},"contact_information":[{"id":"address","enabled":true,"title":"Address:","content":"Street Name, NY 38954","link":"","__id":"3NUQCGgk8PCZ8Xg18l7aA"},{"id":"phone","enabled":true,"title":"Phone:","content":"578-393-4937","link":"tel:578-393-4937","__id":"S81M7iC3AeggDZlHXoLC2"},{"id":"mobile","enabled":true,"title":"Mobile:","content":"578-393-4937","link":"tel:578-393-4937","__id":"SX_1_n_amGZWwbl4mN7YU"}],"customTextColor":"#ff0000","customTextInitialColor":"#003cff","lock":{"remove":true},"className":"blockera-block blockera-block\u002d\u002df7to8b"} -->
<div>Blocksy: Contact Info</div>
<!-- /wp:blocksy/contact-info -->
<!-- /wp:blocksy/widgets-wrapper -->`);

			cy.getBlock('blocksy/contact-info').first().click();

			cy.get('.blockera-extension-block-card').should('be.visible');

			//
			// 1. Assert inner blocks selectors in editor
			//

			cy.getBlock('blocksy/contact-info')
				.first()
				.within(() => {
					cy.get('.contact-title').should(
						'have.css',
						'color',
						'rgb(255, 0, 0)'
					);

					cy.get('.contact-text')
						.first()
						.should('have.css', 'color', 'rgb(255, 0, 0)');

					cy.get('.contact-text a')
						.first()
						.should('have.css', 'color', 'rgb(0, 60, 255)');
				});

			//
			// 2. Assert inner blocks selectors in front end
			//
			savePage();
			redirectToFrontPage();

			cy.get('.blockera-block').within(() => {
				cy.get('.contact-title').should(
					'have.css',
					'color',
					'rgb(255, 0, 0)'
				);

				cy.get('.contact-text')
					.first()
					.should('have.css', 'color', 'rgb(255, 0, 0)');

				cy.get('.contact-text a')
					.first()
					.should('have.css', 'color', 'rgb(0, 60, 255)');
			});
		});
	});
});
