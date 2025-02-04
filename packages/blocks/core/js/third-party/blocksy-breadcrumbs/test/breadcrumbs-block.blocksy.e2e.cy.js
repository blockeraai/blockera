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

		it('Inner blocks existence + CSS selectors in editor and front-end', () => {
			appendBlocks(`<!-- wp:blocksy/breadcrumbs /-->`);

			cy.getBlock('blocksy/breadcrumbs').first().click();

			//
			// 1. Edit Inner Blocks
			//

			//
			// 1.1. Text inner block
			//
			setInnerBlock('elements/text');

			//
			// 1.1.1. BG color
			//
			cy.setColorControlValue('Text Color', 'cccccc');

			cy.getBlock('blocksy/breadcrumbs')
				.first()
				.within(() => {
					cy.get('> span:last-child').should(
						'have.css',
						'color',
						'rgb(204, 204, 204)'
					);

					// the block adds the text color to root so the svg inherits it too!
					cy.get('svg')
						.first()
						.should('have.css', 'color', 'rgb(204, 204, 204)');

					// this is link element
					cy.get('> span:first-child > span').should(
						'not.have.css',
						'color',
						'rgb(204, 204, 204)'
					);
				});

			//
			// 2. Assert inner blocks selectors in front end
			//
			savePage();
			redirectToFrontPage();

			cy.get('.blockera-block').within(() => {
				cy.get('> span:last-child').should(
					'have.css',
					'color',
					'rgb(204, 204, 204)'
				);

				// the block adds the text color to root so the svg inherits it too!
				cy.get('svg')
					.first()
					.should('have.css', 'color', 'rgb(204, 204, 204)');

				// this is link element
				cy.get('a')
					.first()
					.should('not.have.css', 'color', 'rgb(204, 204, 204)');
			});
		});
	});
});
