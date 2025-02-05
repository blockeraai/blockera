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
});
