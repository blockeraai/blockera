/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
	setInnerBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Blocksy → Search Block → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Input Focus Color', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"customInputFontColorFocus":"#ff1c1c"} -->
<div>Blocksy: Search Block</div>
<!-- /wp:blocksy/search -->`
				);

				// Select target block
				cy.getBlock('blocksy/search').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'inputFontColorFocus')
					);

					expect('#ff1c1c').to.be.equal(
						getSelectedBlock(data, 'customInputFontColorFocus')
					);

					expect('#ff1c1c').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBlockStates?.focus?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/input');
				setBlockState('Focus');

				cy.setColorControlValue('Text Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'inputFontColorFocus')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customInputFontColorFocus')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBlockStates?.focus?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Typography', 'Text Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'inputFontColorFocus')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputFontColorFocus')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBlockStates?.focus?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"inputFontColorFocus":"palette-color-1"} -->
<div>Blocksy: Search Block</div>
<!-- /wp:blocksy/search -->`
				);

				// Select target block
				cy.getBlock('blocksy/search').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('palette-color-1').to.be.equal(
						getSelectedBlock(data, 'inputFontColorFocus')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customInputFontColorFocus')
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
							'elements/input'
						]?.attributes?.blockeraBlockStates?.focus?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/input');
				setBlockState('Focus');

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
						getSelectedBlock(data, 'inputFontColorFocus')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputFontColorFocus')
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
							'elements/input'
						]?.attributes?.blockeraBlockStates?.focus?.breakpoints
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
						getSelectedBlock(data, 'inputFontColorFocus')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputFontColorFocus')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBlockStates?.focus?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});
			});
		});
	});

	describe('Input Border Color', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"customInputBorderColor":"#0066ff"} -->
<div>Blocksy: Search Block</div>
<!-- /wp:blocksy/search -->`
				);

				// Select target block
				cy.getBlock('blocksy/search').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('').to.be.equal(
						getSelectedBlock(data, 'inputBorderColor')
					);

					expect('#0066ff').to.be.equal(
						getSelectedBlock(data, 'customInputBorderColor')
					);

					expect('#0066ff').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBorder?.all?.color
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/input');

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
						getSelectedBlock(data, 'inputBorderColor')
					);

					expect('#9958e3').to.be.equal(
						getSelectedBlock(data, 'customInputBorderColor')
					);

					expect('#9958e3').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
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
						getSelectedBlock(data, 'inputBorderColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customInputBorderColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBorder?.all?.color
					);
				});
			});
		});
	});

	describe('Input BG Focus Color', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"customInputBackgroundColorFocus":"#ff0000"} -->
<div>Blocksy: Search Block</div>
<!-- /wp:blocksy/search -->`
				);

				// Select target block
				cy.getBlock('blocksy/search').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'inputBackgroundColorFocus')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(
							data,
							'customInputBackgroundColorFocus'
						)
					);

					expect('#ff0000').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBlockStates?.focus?.breakpoints
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/input');
				setBlockState('Focus');

				cy.setColorControlValue('BG Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'inputBackgroundColorFocus')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(
							data,
							'customInputBackgroundColorFocus'
						)
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBlockStates?.focus?.breakpoints
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Background', 'BG Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'inputBackgroundColorFocus')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(
							data,
							'customInputBackgroundColorFocus'
						)
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBlockStates?.focus?.breakpoints
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"inputBackgroundColorFocus":"palette-color-1"} -->
<div>Blocksy: Search Block</div>
<!-- /wp:blocksy/search -->`
				);

				// Select target block
				cy.getBlock('blocksy/search').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'inputBackgroundColorFocus')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(
							data,
							'customInputBackgroundColorFocus'
						)
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
							'elements/input'
						]?.attributes?.blockeraBlockStates?.focus?.breakpoints
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/input');
				setBlockState('Focus');

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
						getSelectedBlock(data, 'inputBackgroundColorFocus')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(
							data,
							'customInputBackgroundColorFocus'
						)
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
							'elements/input'
						]?.attributes?.blockeraBlockStates?.focus?.breakpoints
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
						getSelectedBlock(data, 'inputBackgroundColorFocus')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(
							data,
							'customInputBackgroundColorFocus'
						)
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBlockStates?.focus?.breakpoints
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});
			});
		});
	});
});
