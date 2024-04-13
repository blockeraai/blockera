/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
} from '../../../../../../cypress/helpers';

describe('Font Color → WP Compatibility', () => {
	describe('Paragraph Block', () => {
		describe('Simple Value', () => {
			it('Same font color and link color', () => {
				appendBlocks(
					'<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"#98cc08"}}},"color":{"text":"#98cc08"}}} -->\n' +
						'<p class="has-text-color has-link-color" style="color:#98cc08">Test paragraph</p>' +
						'<!-- /wp:paragraph -->'
				);

				// Select target block
				cy.getBlock('core/paragraph').click();

				// add alias to the feature container
				cy.getParentContainer('Text Color').as('container');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('#98cc08').to.be.equal(
						getSelectedBlock(data, 'publisherFontColor')
					);
					expect('#98cc08').to.be.equal(
						getSelectedBlock(data, 'style')?.color?.text
					);
					expect('#98cc08').to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.link?.color
							?.text
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				// open color popover
				cy.get('@container').within(() => {
					cy.get('button').as('colorBtn');
					cy.get('@colorBtn').click();
				});

				// change color to #666 (#666666)
				cy.get('.components-popover').within(() => {
					cy.get('input').as('hexColorInput');
					cy.get('@hexColorInput').clear();
					cy.get('@hexColorInput').type('666');
				});

				// Blockera value should be moved to WP data
				getWPDataObject().then((data) => {
					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'style')?.color?.text
					);

					// link element color should be same
					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.link?.color
							?.text
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// clear value
				cy.get('.components-popover').within(() => {
					cy.getByAriaLabel('Reset Color (Clear)').click();
				});

				// Blockera value should be moved to WP data
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.color?.text
					);

					// link element color should be same
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.link?.color
							?.text
					);
				});
			});

			it('Different font color and link color', () => {
				appendBlocks(
					'<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"#10d55c"}}},"color":{"text":"#df4414"}}} -->\n' +
						'<p class="has-text-color has-link-color" style="color:#df4414">Test paragraph</p>\n' +
						'<!-- /wp:paragraph -->'
				);

				// Select target block
				cy.getBlock('core/paragraph').click();

				// add alias to the feature container
				cy.getParentContainer('Text Color').as('container');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect('#df4414').to.be.equal(
						getSelectedBlock(data, 'publisherFontColor')
					);
					expect('#df4414').to.be.equal(
						getSelectedBlock(data, 'style')?.color?.text
					);
					expect('#10d55c').to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.link?.color
							?.text
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				// open color popover
				cy.get('@container').within(() => {
					cy.get('button').as('colorBtn');
					cy.get('@colorBtn').click();
				});

				// change color to #666 (#666666)
				cy.get('.components-popover').within(() => {
					cy.get('input').as('hexColorInput');
					cy.get('@hexColorInput').clear();
					cy.get('@hexColorInput').type('666');
				});

				// Blockera value should be moved to WP data
				getWPDataObject().then((data) => {
					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'style')?.color?.text
					);

					// link element color should not be same
					expect('#10d55c').to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.link?.color
							?.text
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//
				// clear value
				cy.get('.components-popover').within(() => {
					cy.getByAriaLabel('Reset Color (Clear)').click();
				});

				// Blockera value should be moved to WP data
				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.color?.text
					);

					// link element color should be same
					expect('#10d55c').to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.link?.color
							?.text
					);
				});
			});
		});

		describe('Variable Value', () => {
			it('Same font color and link color', () => {
				appendBlocks(
					'<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"var:preset|color|accent-3"}}}},"textColor":"accent-3"} -->\n' +
						'<p class="has-accent-3-color has-text-color has-link-color">Test paragraph</p>\n' +
						'<!-- /wp:paragraph -->'
				);

				// Select target block
				cy.getBlock('core/paragraph').click();

				// add alias to the feature container
				cy.getParentContainer('Text Color').as('container');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						settings: {
							name: 'Accent / Three',
							id: 'accent-3',
							value: '#d8613c',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Four',
							},
							type: 'color',
							var: '--wp--preset--color--accent-3',
						},
						name: 'Accent / Three',
						isValueAddon: true,
						valueType: 'variable',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherFontColor')
					);
					expect('accent-3').to.be.equal(
						getSelectedBlock(data, 'textColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.color?.text
					);
					expect('var:preset|color|accent-3').to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.link?.color
							?.text
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				// open color popover
				cy.get('@container').within(() => {
					cy.clickValueAddonButton();
				});

				// change variable
				cy.selectValueAddonItem('contrast');

				// Check WP data
				getWPDataObject().then((data) => {
					expect({
						settings: {
							name: 'Contrast',
							id: 'contrast',
							value: '#111111',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Four',
							},
							type: 'color',
							var: '--wp--preset--color--contrast',
						},
						name: 'Contrast',
						isValueAddon: true,
						valueType: 'variable',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherFontColor')
					);
					expect('contrast').to.be.equal(
						getSelectedBlock(data, 'textColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.color?.text
					);
					expect('var:preset|color|contrast').to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.link?.color
							?.text
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// open color popover
				cy.get('@container').within(() => {
					cy.removeValueAddon();
				});

				// Check WP data
				getWPDataObject().then((data) => {
					// default value is empty
					expect('').to.be.equal(
						getSelectedBlock(data, 'publisherFontColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'textColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.color?.text
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.link?.color
							?.text
					);
				});
			});

			it('Different font color and link color', () => {
				appendBlocks(
					'<!-- wp:paragraph {"style":{"elements":{"link":{"color":{"text":"var:preset|color|accent-4"}}}},"textColor":"accent-3"} -->\n' +
						'<p class="has-accent-3-color has-text-color has-link-color">Test paragraph with <a href="#a">link</a></p>\n' +
						'<!-- /wp:paragraph -->'
				);

				// Select target block
				cy.getBlock('core/paragraph').click();

				// add alias to the feature container
				cy.getParentContainer('Text Color').as('container');

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						settings: {
							name: 'Accent / Three',
							id: 'accent-3',
							value: '#d8613c',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Four',
							},
							type: 'color',
							var: '--wp--preset--color--accent-3',
						},
						name: 'Accent / Three',
						isValueAddon: true,
						valueType: 'variable',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherFontColor')
					);
					expect('accent-3').to.be.equal(
						getSelectedBlock(data, 'textColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.color?.text
					);
					expect('var:preset|color|accent-4').to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.link?.color
							?.text
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				// open color popover
				cy.get('@container').within(() => {
					cy.clickValueAddonButton();
				});

				// change variable
				cy.get('.components-popover').within(() => {
					cy.selectValueAddonItem('contrast');
				});

				// Check WP data
				getWPDataObject().then((data) => {
					expect({
						settings: {
							name: 'Contrast',
							id: 'contrast',
							value: '#111111',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Four',
							},
							type: 'color',
							var: '--wp--preset--color--contrast',
						},
						name: 'Contrast',
						isValueAddon: true,
						valueType: 'variable',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'publisherFontColor')
					);
					expect('contrast').to.be.equal(
						getSelectedBlock(data, 'textColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.color?.text
					);
					expect('var:preset|color|accent-4').to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.link?.color
							?.text
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				// open color popover
				cy.get('@container').within(() => {
					cy.removeValueAddon();
				});

				// Check WP data
				getWPDataObject().then((data) => {
					// default value is empty
					expect('').to.be.equal(
						getSelectedBlock(data, 'publisherFontColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'textColor')
					);
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.color?.text
					);

					// link color should be still there
					expect('var:preset|color|accent-4').to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.link?.color
							?.text
					);
				});
			});
		});
	});
});
