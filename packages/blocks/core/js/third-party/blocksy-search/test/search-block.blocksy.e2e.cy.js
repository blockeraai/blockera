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

describe('Blocksy → Search Block → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Input Text Color', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"customInputFontColor":"#ff9e9e"} -->
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
						getSelectedBlock(data, 'inputFontColor')
					);

					expect('#ff9e9e').to.be.equal(
						getSelectedBlock(data, 'customInputFontColor')
					);

					expect('#ff9e9e').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/input');

				cy.setColorControlValue('Text Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'inputFontColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customInputFontColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Typography', 'Text Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'inputFontColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputFontColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"inputFontColor":"palette-color-1"} -->
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
						getSelectedBlock(data, 'inputFontColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customInputFontColor')
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
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/input');

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
						getSelectedBlock(data, 'inputFontColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputFontColor')
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
						getSelectedBlock(data, 'inputFontColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputFontColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraFontColor
					);
				});
			});
		});
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

	describe('Input BG Color', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"customInputBackgroundColor":"#7790ff"} -->
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
						getSelectedBlock(data, 'inputBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputBackgroundColor')
					);

					expect('#7790ff').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/input');

				cy.setColorControlValue('BG Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'inputBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputBackgroundColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Background', 'BG Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'inputBackgroundColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBackgroundColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"inputBackgroundColor":"palette-color-1"} -->
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
						getSelectedBlock(data, 'inputBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputBackgroundColor')
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
						]?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/input');

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
						getSelectedBlock(data, 'inputBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputBackgroundColor')
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
						getSelectedBlock(data, 'inputBackgroundColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/input'
						]?.attributes?.blockeraBackgroundColor
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

	describe('Button Text Color', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"customInputIconColor":"#ff9e9e"} -->
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
						getSelectedBlock(data, 'inputIconColor')
					);

					expect('#ff9e9e').to.be.equal(
						getSelectedBlock(data, 'customInputIconColor')
					);

					expect('#ff9e9e').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/button');

				cy.setColorControlValue('Text Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'inputIconColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customInputIconColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Typography', 'Text Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'inputIconColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputIconColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"inputIconColor":"palette-color-1"} -->
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
						getSelectedBlock(data, 'inputIconColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customInputIconColor')
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
							'elements/button'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/button');

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
						getSelectedBlock(data, 'inputIconColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputIconColor')
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
							'elements/button'
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
						getSelectedBlock(data, 'inputIconColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputIconColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraFontColor
					);
				});
			});
		});
	});

	describe('Button Hover Text Color', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"customInputIconColorFocus":"#ff1c1c"} -->
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
						getSelectedBlock(data, 'inputIconColorFocus')
					);

					expect('#ff1c1c').to.be.equal(
						getSelectedBlock(data, 'customInputIconColorFocus')
					);

					expect('#ff1c1c').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/button');
				setBlockState('Hover');

				cy.setColorControlValue('Text Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'inputIconColorFocus')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customInputIconColorFocus')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
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
						getSelectedBlock(data, 'inputIconColorFocus')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputIconColorFocus')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"inputIconColorFocus":"palette-color-1"} -->
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
						getSelectedBlock(data, 'inputIconColorFocus')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customInputIconColorFocus')
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
							'elements/button'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/button');
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
						getSelectedBlock(data, 'inputIconColorFocus')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputIconColorFocus')
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
							'elements/button'
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
						getSelectedBlock(data, 'inputIconColorFocus')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customInputIconColorFocus')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});
			});
		});
	});

	describe('Button BG Color', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"buttonPosition":"outside","customButtonBackgroundColor":"#7790ff"} -->
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
						getSelectedBlock(data, 'buttonBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customButtonBackgroundColor')
					);

					expect('#7790ff').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/button');

				cy.setColorControlValue('BG Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'buttonBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customButtonBackgroundColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Background', 'BG Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'buttonBackgroundColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customButtonBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraBackgroundColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"buttonPosition":"outside","buttonBackgroundColor":"palette-color-1"} -->
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
						getSelectedBlock(data, 'buttonBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customButtonBackgroundColor')
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
							'elements/button'
						]?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/button');

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
						getSelectedBlock(data, 'buttonBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customButtonBackgroundColor')
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
							'elements/button'
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
						getSelectedBlock(data, 'buttonBackgroundColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customButtonBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraBackgroundColor
					);
				});
			});
		});
	});

	describe('Button BG Hover Color', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"customButtonBackgroundColorHover":"#ff0000"} -->
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
						getSelectedBlock(data, 'buttonBackgroundColorHover')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(
							data,
							'customButtonBackgroundColorHover'
						)
					);

					expect('#ff0000').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/button');
				setBlockState('Hover');

				cy.setColorControlValue('BG Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'buttonBackgroundColorHover')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(
							data,
							'customButtonBackgroundColorHover'
						)
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
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
						getSelectedBlock(data, 'buttonBackgroundColorHover')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(
							data,
							'customButtonBackgroundColorHover'
						)
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"buttonPosition":"outside","buttonBackgroundColorHover":"palette-color-1"} -->
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
						getSelectedBlock(data, 'buttonBackgroundColorHover')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(
							data,
							'customButtonBackgroundColorHover'
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
							'elements/button'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/button');
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
						getSelectedBlock(data, 'buttonBackgroundColorHover')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(
							data,
							'customButtonBackgroundColorHover'
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
							'elements/button'
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
						getSelectedBlock(data, 'buttonBackgroundColorHover')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(
							data,
							'customButtonBackgroundColorHover'
						)
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/button'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraBackgroundColor
					);
				});
			});
		});
	});

	describe('Dropdown BG Color', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"buttonPosition":"outside","enable_live_results":"yes","live_results_images":"no","customDropdownBackgroundColor":"#7790ff"} -->
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
						getSelectedBlock(data, 'dropdownBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customDropdownBackgroundColor')
					);

					expect('#7790ff').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/result-dropdown'
						]?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/result-dropdown');

				cy.setColorControlValue('BG Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'dropdownBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customDropdownBackgroundColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/result-dropdown'
						]?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Background', 'BG Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'dropdownBackgroundColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customDropdownBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/result-dropdown'
						]?.attributes?.blockeraBackgroundColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"buttonPosition":"outside","enable_live_results":"yes","live_results_images":"no","dropdownBackgroundColor":"palette-color-1"} -->
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
						getSelectedBlock(data, 'dropdownBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customDropdownBackgroundColor')
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
							'elements/result-dropdown'
						]?.attributes?.blockeraBackgroundColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/result-dropdown');

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
						getSelectedBlock(data, 'dropdownBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customDropdownBackgroundColor')
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
							'elements/result-dropdown'
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
						getSelectedBlock(data, 'dropdownBackgroundColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customDropdownBackgroundColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/result-dropdown'
						]?.attributes?.blockeraBackgroundColor
					);
				});
			});
		});
	});

	describe('Result Link Color', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"enable_live_results":"yes","customDropdownTextInitialColor":"#ff9e9e"} -->
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
						getSelectedBlock(data, 'dropdownTextInitialColor')
					);

					expect('#ff9e9e').to.be.equal(
						getSelectedBlock(data, 'customDropdownTextInitialColor')
					);

					expect('#ff9e9e').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/result-link'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/result-link');

				cy.setColorControlValue('Text Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'dropdownTextInitialColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customDropdownTextInitialColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/result-link'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Typography', 'Text Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'dropdownTextInitialColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customDropdownTextInitialColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/result-link'
						]?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"enable_live_results":"yes","dropdownTextInitialColor":"palette-color-1"} -->
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
						getSelectedBlock(data, 'dropdownTextInitialColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customDropdownTextInitialColor')
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
							'elements/result-link'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/result-link');

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
						getSelectedBlock(data, 'dropdownTextInitialColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customDropdownTextInitialColor')
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
							'elements/result-link'
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
						getSelectedBlock(data, 'dropdownTextInitialColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customDropdownTextInitialColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/result-link'
						]?.attributes?.blockeraFontColor
					);
				});
			});
		});
	});

	describe('Result Link Hover Color', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"enable_live_results":"yes","customDropdownTextHoverColor":"#ff1c1c"} -->
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
						getSelectedBlock(data, 'dropdownTextHoverColor')
					);

					expect('#ff1c1c').to.be.equal(
						getSelectedBlock(data, 'customDropdownTextHoverColor')
					);

					expect('#ff1c1c').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/result-link'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/result-link');
				setBlockState('Hover');

				cy.setColorControlValue('Text Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'dropdownTextHoverColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customDropdownTextHoverColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/result-link'
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
						getSelectedBlock(data, 'dropdownTextHoverColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customDropdownTextHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/result-link'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/search {"enable_live_results":"yes","dropdownTextHoverColor":"palette-color-1"} -->
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
						getSelectedBlock(data, 'dropdownTextHoverColor')
					);

					expect('').to.be.equal(
						getSelectedBlock(data, 'customDropdownTextHoverColor')
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
							'elements/result-link'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/result-link');
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
						getSelectedBlock(data, 'dropdownTextHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customDropdownTextHoverColor')
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
							'elements/result-link'
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
						getSelectedBlock(data, 'dropdownTextHoverColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customDropdownTextHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/result-link'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});
			});
		});
	});

	it('Inner blocks existence + CSS selectors in editor and front-end', () => {
		appendBlocks(`<!-- wp:blocksy/search {"blockeraPropsId":"dfee254f-5b83-4635-a1cb-24d74b99f8eb","blockeraCompatId":"1819181054","blockeraBackgroundColor":{"value":"#c4ceff"},"blockeraBackgroundClip":{"value":"padding-box"},"blockeraInnerBlocks":{"value":{"elements/input":{"attributes":{"blockeraBackgroundColor":"#ffc6c6"}},"elements/button":{"attributes":{"blockeraBackgroundColor":"#ff5757"}}}},"blockeraSpacing":{"value":{"padding":{"top":"27px","bottom":"27px"}}},"className":"blockera-block blockera-block\u002d\u002domykq2","style":{"color":{"background":"#c4ceff"},"spacing":{"padding":{"top":"27px","right":"","bottom":"27px","left":""}}}} -->
<div>Blocksy: Search Block</div>
<!-- /wp:blocksy/search -->`);

		cy.getBlock('blocksy/search').first().click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		//
		//  1. Assert inner blocks selectors in editor
		//
		cy.getBlock('blocksy/search').within(() => {
			cy.get('.ct-search-form').should(
				'have.css',
				'background-clip',
				'padding-box'
			);
		});

		cy.getBlock('blocksy/search')
			.first()
			.within(() => {
				cy.get('.ct-search-form input').should(
					'have.css',
					'background-color',
					'rgb(255, 198, 198)'
				);
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block .ct-search-form').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block').within(() => {
			cy.get('.ct-search-form input').should(
				'have.css',
				'background-color',
				'rgb(255, 198, 198)'
			);
		});
	});
});
