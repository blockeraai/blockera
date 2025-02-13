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

describe('Blocksy → Breadcrumbs Block → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Text Color Inner Block', () => {
		describe('Data Compatibility', () => {
			it('Simple Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/breadcrumbs {"customTextColor":"#ff0000"} /-->`
				);

				// Select target block
				cy.getBlock('blocksy/breadcrumbs').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'textColor')
					);

					expect('#ff0000').to.be.equal(
						getSelectedBlock(data, 'customTextColor')
					);

					expect('#ff0000').to.be.equal(
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
					`<!-- wp:blocksy/breadcrumbs {"textColor":"palette-color-1"} /-->`
				);

				// Select target block
				cy.getBlock('blocksy/breadcrumbs').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('palette-color-1').to.be.equal(
						getSelectedBlock(data, 'textColor')
					);

					expect(undefined).to.be.equal(
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
					`<!-- wp:blocksy/breadcrumbs {"customLinkColor":"#ff0000"} /-->`
				);

				// Select target block
				cy.getBlock('blocksy/breadcrumbs').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'linkColor')
					);

					expect('#ff0000').to.be.equal(
						getSelectedBlock(data, 'customLinkColor')
					);

					expect('#ff0000').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/links'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/links');

				cy.setColorControlValue('Text Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'linkColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customLinkColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/links'
						]?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.resetBlockeraAttribute('Typography', 'Text Color', 'reset');

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'linkColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customLinkColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/links'
						]?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/breadcrumbs {"linkColor":"palette-color-1"} /-->`
				);

				// Select target block
				cy.getBlock('blocksy/breadcrumbs').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('palette-color-1').to.be.equal(
						getSelectedBlock(data, 'linkColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customLinkColor')
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
							'elements/links'
						]?.attributes.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/links');

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
						getSelectedBlock(data, 'linkColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customLinkColor')
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
							'elements/links'
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
						getSelectedBlock(data, 'linkColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customLinkColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/links'
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
					`<!-- wp:blocksy/breadcrumbs {"customLinkHoverColor":"#ff0000"} /-->`
				);

				// Select target block
				cy.getBlock('blocksy/breadcrumbs').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'linkHoverColor')
					);

					expect('#ff0000').to.be.equal(
						getSelectedBlock(data, 'customLinkHoverColor')
					);

					expect('#ff0000').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/links'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/links');
				setBlockState('Hover');

				cy.setColorControlValue('Text Color', '666666');

				//
				// Check
				//
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'linkHoverColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'customLinkHoverColor')
					);

					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/links'
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
						getSelectedBlock(data, 'linkHoverColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customLinkHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/links'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});
			});

			it('Variable Value', () => {
				appendBlocks(
					`<!-- wp:blocksy/breadcrumbs {"linkHoverColor":"palette-color-1"} /-->`
				);

				// Select target block
				cy.getBlock('blocksy/breadcrumbs').first().click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('palette-color-1').to.be.equal(
						getSelectedBlock(data, 'linkHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customLinkHoverColor')
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
							'elements/links'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});

				//
				// Test 2: Blockera value to WP data
				//
				setInnerBlock('elements/links');
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
						getSelectedBlock(data, 'linkHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customLinkHoverColor')
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
							'elements/links'
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
						getSelectedBlock(data, 'linkHoverColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'customLinkHoverColor')
					);

					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'elements/links'
						]?.attributes?.blockeraBlockStates?.hover?.breakpoints
							.desktop?.attributes?.blockeraFontColor
					);
				});
			});
		});
	});

	it('Inner blocks existence + CSS selectors in editor and front-end', () => {
		appendBlocks(`<!-- wp:blocksy/breadcrumbs /-->`);

		cy.getBlock('blocksy/breadcrumbs').first().click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.0. Block Style
		//
		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('blocksy/breadcrumbs')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		//
		// 1.1. Text inner block
		//
		setInnerBlock('elements/text');

		//
		// 1.1.1. Text color
		//
		cy.setColorControlValue('Text Color', '#FFA500');

		cy.getBlock('blocksy/breadcrumbs')
			.first()
			.within(() => {
				cy.get('> span:last-child').should(
					'have.css',
					'color',
					'rgb(255, 165, 0)'
				);

				// the block adds the text color to root so the svg inherits it too!
				cy.get('svg')
					.first()
					.should('have.css', 'color', 'rgb(255, 165, 0)');

				// this is link element
				cy.get('> span:first-child > span').should(
					'not.have.css',
					'color',
					'rgb(255, 165, 0)'
				);
			});

		//
		// 1.2. Link inner block
		//
		setParentBlock();
		setInnerBlock('elements/links');

		//
		// 1.2.1. Text color
		//
		cy.setColorControlValue('Text Color', '#f11a1a');

		cy.getBlock('blocksy/breadcrumbs')
			.first()
			.within(() => {
				cy.get('> span:last-child').should(
					'have.css',
					'color',
					'rgb(255, 165, 0)'
				);

				// the block adds the text color to root so the svg inherits it too!
				cy.get('svg')
					.first()
					.should('have.css', 'color', 'rgb(255, 165, 0)');

				// this is link element
				cy.get('> span:first-child > span').should(
					'have.css',
					'color',
					'rgb(241, 26, 26)'
				);
			});

		//
		// 1.3. Separator inner block
		//
		setParentBlock();
		setInnerBlock('elements/separator');

		//
		// 1.3.1. Text color
		//
		cy.setColorControlValue('Text Color', '#008000');

		cy.getBlock('blocksy/breadcrumbs')
			.first()
			.within(() => {
				cy.get('> span:last-child').should(
					'have.css',
					'color',
					'rgb(255, 165, 0)'
				);

				// the block adds the text color to root so the svg inherits it too!
				cy.get('svg')
					.first()
					.should('have.css', 'color', 'rgb(0, 128, 0)');

				// this is link element
				cy.get('> span:first-child > span').should(
					'have.css',
					'color',
					'rgb(241, 26, 26)'
				);
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		cy.get('.blockera-block').within(() => {
			cy.get('> span:last-child').should(
				'have.css',
				'color',
				'rgb(255, 165, 0)'
			);

			// the block adds the text color to root so the svg inherits it too!
			cy.get('svg').first().should('have.css', 'color', 'rgb(0, 128, 0)');

			// this is link element
			cy.get('a').first().should('have.css', 'color', 'rgb(241, 26, 26)');
		});
	});
});
