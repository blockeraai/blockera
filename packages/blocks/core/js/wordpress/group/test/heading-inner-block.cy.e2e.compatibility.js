/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	setInnerBlock,
	setBlockState,
	addBlockState,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Group Block → Heading Inner Block → WP Data Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Text Color', () => {
		it('Simple value text color', () => {
			appendBlocks(
				'<!-- wp:group {"style":{"elements":{"heading":{"color":{"text":"#ff6868"}}}},"layout":{"type":"constrained"}} -->\n' +
					'<div class="wp-block-group"><!-- wp:heading -->\n' +
					'<h2 class="wp-block-heading">Heading text</h2>\n' +
					'<!-- /wp:heading -->\n' +
					'\n' +
					'<!-- wp:paragraph -->\n' +
					'<p>paragraph text</p>\n' +
					'<!-- /wp:paragraph --></div>\n' +
					'<!-- /wp:group -->'
			);

			// Select target block
			cy.getBlock('core/heading').first().click();

			// Switch to parent block
			cy.getByAriaLabel('Select Group').click();

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect({
					blockeraFontColor: '#ff6868',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')?.heading
						?.attributes
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			setInnerBlock('Headings');

			//
			// Normal → Text Color
			//

			cy.getParentContainer('Text Color').within(() => {
				cy.get('button').click();
			});

			cy.get('.components-popover')
				.last()
				.within(() => {
					cy.get('input').as('hexColorInput');
					cy.get('@hexColorInput').clear();
					cy.get('@hexColorInput').type('666');
				});

			getWPDataObject().then((data) => {
				expect({
					blockeraFontColor: '#666666',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')?.heading
						?.attributes
				);
			});

			getWPDataObject().then((data) => {
				expect('#666666').to.be.equal(
					getSelectedBlock(data, 'style')?.elements?.heading?.color
						?.text
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			cy.get('.components-popover').within(() => {
				cy.get('button[aria-label="Reset Color (Clear)"]').click();
			});

			getWPDataObject().then((data) => {
				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')?.heading
						?.attributes
				);
			});

			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.elements?.heading?.color
						?.text
				);
			});
		});

		it('Variable value text color', () => {
			appendBlocks(
				'<!-- wp:group {"style":{"elements":{"heading":{"color":{"text":"var:preset|color|accent-3"}}}},"layout":{"type":"constrained"}} -->\n' +
					'<div class="wp-block-group"><!-- wp:heading -->\n' +
					'<h2 class="wp-block-heading">Heading text</h2>\n' +
					'<!-- /wp:heading -->\n' +
					'\n' +
					'<!-- wp:paragraph -->\n' +
					'<p>paragraph text</p>\n' +
					'<!-- /wp:paragraph --></div>\n' +
					'<!-- /wp:group -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').first().click();

			// Switch to parent block
			cy.getByAriaLabel('Select Group').click();

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect({
					blockeraFontColor: {
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
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')?.heading
						?.attributes
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			setInnerBlock('Headings');

			cy.getParentContainer('Text Color').within(() => {
				cy.clickValueAddonButton();
			});

			cy.selectValueAddonItem('contrast-2');

			getWPDataObject().then((data) => {
				expect({
					blockeraFontColor: {
						settings: {
							name: 'Contrast / Two',
							id: 'contrast-2',
							value: '#636363',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Four',
							},
							type: 'color',
							var: '--wp--preset--color--contrast-2',
						},
						name: 'Contrast / Two',
						isValueAddon: true,
						valueType: 'variable',
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')?.heading
						?.attributes
				);
			});

			getWPDataObject().then((data) => {
				expect('var:preset|color|contrast-2').to.be.equal(
					getSelectedBlock(data, 'style')?.elements?.heading?.color
						?.text
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			cy.getParentContainer('Text Color').within(() => {
				cy.removeValueAddon();
			});

			getWPDataObject().then((data) => {
				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')?.heading
						?.attributes
				);
			});

			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.elements?.heading?.color
						?.text
				);
			});
		});
	});

	describe('Background', () => {
		describe('Background Color', () => {
			it('Simple value BG color', () => {
				appendBlocks(
					'<!-- wp:group {"style":{"elements":{"heading":{"color":{"background":"#ffcaca"}}}},"layout":{"type":"constrained"}} -->\n' +
						'<div class="wp-block-group"><!-- wp:heading -->\n' +
						'<h2 class="wp-block-heading">Heading text</h2>\n' +
						'<!-- /wp:heading -->\n' +
						'\n' +
						'<!-- wp:paragraph -->\n' +
						'<p>paragraph text</p>\n' +
						'<!-- /wp:paragraph --></div>\n' +
						'<!-- /wp:group -->'
				);

				// Select target block
				cy.getBlock('core/heading').first().click();

				// Switch to parent block
				cy.getByAriaLabel('Select Group').click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						blockeraBackgroundColor: '#ffcaca',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')?.heading
							?.attributes
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				setInnerBlock('Headings');

				//
				// Normal → Text Color
				//

				cy.getParentContainer('BG Color').within(() => {
					cy.get('button').click();
				});

				cy.get('.components-popover').within(() => {
					cy.get('input').as('hexColorInput');
					cy.get('@hexColorInput').clear();
					cy.get('@hexColorInput').type('666');
				});

				getWPDataObject().then((data) => {
					expect({
						blockeraBackgroundColor: '#666666',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')?.heading
							?.attributes
					);
				});

				getWPDataObject().then((data) => {
					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.heading
							?.color?.background
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.get('.components-popover').within(() => {
					cy.get('button[aria-label="Reset Color (Clear)"]').click();
				});

				getWPDataObject().then((data) => {
					expect({}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')?.heading
							?.attributes
					);
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.heading
							?.color?.background
					);
				});
			});

			it('Variable value BG color', () => {
				appendBlocks(
					'<!-- wp:group {"style":{"elements":{"heading":{"color":{"background":"var:preset|color|accent-3"}}}},"layout":{"type":"constrained"}} -->\n' +
						'<div class="wp-block-group"><!-- wp:heading -->\n' +
						'<h2 class="wp-block-heading">Heading text</h2>\n' +
						'<!-- /wp:heading -->\n' +
						'\n' +
						'<!-- wp:paragraph -->\n' +
						'<p>paragraph text</p>\n' +
						'<!-- /wp:paragraph --></div>\n' +
						'<!-- /wp:group -->'
				);

				// Select target block
				cy.getBlock('core/paragraph').first().click();

				// Switch to parent block
				cy.getByAriaLabel('Select Group').click();

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						blockeraBackgroundColor: {
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
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')?.heading
							?.attributes
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				setInnerBlock('Headings');

				cy.getParentContainer('BG Color').within(() => {
					cy.clickValueAddonButton();
				});

				cy.selectValueAddonItem('contrast-2');

				getWPDataObject().then((data) => {
					expect({
						blockeraBackgroundColor: {
							settings: {
								name: 'Contrast / Two',
								id: 'contrast-2',
								value: '#636363',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Four',
								},
								type: 'color',
								var: '--wp--preset--color--contrast-2',
							},
							name: 'Contrast / Two',
							isValueAddon: true,
							valueType: 'variable',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')?.heading
							?.attributes
					);
				});

				getWPDataObject().then((data) => {
					expect('var:preset|color|contrast-2').to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.heading
							?.color?.background
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.getParentContainer('BG Color').within(() => {
					cy.removeValueAddon();
				});

				getWPDataObject().then((data) => {
					expect({}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')?.heading
							?.attributes
					);
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.elements?.heading
							?.color?.background
					);
				});
			});
		});
	});
});
