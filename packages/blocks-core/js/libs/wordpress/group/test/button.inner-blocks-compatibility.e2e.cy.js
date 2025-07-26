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

describe('Group Block → Button Inner Block → WP Data Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Text Color', () => {
		it('Simple value text color', () => {
			appendBlocks(`<!-- wp:group {"style":{"elements":{"button":{"color":{"text":"#ff6868"}}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test paragraph</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">test button</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->`);

			// Select target block
			cy.getBlock('core/paragraph').first().click();

			// Switch to parent block
			cy.getByAriaLabel('Select Group').click();

			// Assert WP element value
			getWPDataObject().then((data) => {
				expect('#ff6868').to.be.equal(
					getSelectedBlock(data, 'style')?.elements['button']?.color
						?.text
				);
			});

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect({
					blockeraFontColor: '#ff6868',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')['core/button']
						?.attributes
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			setInnerBlock('core/button');

			//
			// Normal → Text Color
			//

			cy.setColorControlValue('Text Color', '666666');

			getWPDataObject().then((data) => {
				expect({
					blockeraFontColor: '#666666',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')['core/button']
						?.attributes
				);
			});

			getWPDataObject().then((data) => {
				expect('#666666').to.be.equal(
					getSelectedBlock(data, 'style')?.elements['button']?.color
						?.text
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			cy.clearColorControlValue('Text Color');

			getWPDataObject().then((data) => {
				expect({}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')['core/button']
						?.attributes
				);
			});

			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.elements['button']?.color
						?.text
				);
			});
		});

		it('Variable value text color', () => {
			appendBlocks(`<!-- wp:group {"style":{"elements":{"button":{"color":{"text":"var:preset|color|accent-3"}}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test paragraph</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">test button</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->`);

			// Select target block
			cy.getBlock('core/paragraph').first().click();

			// Switch to parent block
			cy.getByAriaLabel('Select Group').click();

			// Assert WP data
			getWPDataObject().then((data) => {
				expect('var:preset|color|accent-3').to.be.equal(
					getSelectedBlock(data, 'style')?.elements['button']?.color
						?.text
				);
			});

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect({
					blockeraFontColor: {
						settings: {
							name: 'Accent 3',
							id: 'accent-3',
							value: '#503AA8',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'color',
							var: '--wp--preset--color--accent-3',
						},
						name: 'Accent 3',
						isValueAddon: true,
						valueType: 'variable',
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')['core/button']
						?.attributes
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			setInnerBlock('core/button');

			cy.getParentContainer('Text Color').within(() => {
				cy.clickValueAddonButton();
			});

			cy.selectValueAddonItem('contrast');

			getWPDataObject().then((data) => {
				expect({
					blockeraFontColor: {
						settings: {
							name: 'Contrast',
							id: 'contrast',
							value: '#111111',
							reference: {
								type: 'theme',
								theme: 'Twenty Twenty-Five',
							},
							type: 'color',
							var: '--wp--preset--color--contrast',
						},
						name: 'Contrast',
						isValueAddon: true,
						valueType: 'variable',
					},
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraInnerBlocks')['core/button']
						?.attributes
				);
			});

			getWPDataObject().then((data) => {
				expect('var:preset|color|contrast').to.be.equal(
					getSelectedBlock(data, 'style')?.elements['button']?.color
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
					getSelectedBlock(data, 'blockeraInnerBlocks')['core/button']
						?.attributes
				);
			});

			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.elements['button']?.color
						?.text
				);
			});
		});
	});

	describe('Background', () => {
		describe('Background Color', () => {
			it('Simple value BG color', () => {
				appendBlocks(`<!-- wp:group {"style":{"elements":{"button":{"color":{"background":"#ffcaca"}}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test paragraph</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">test button</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->`);

				// Select target block
				cy.getBlock('core/paragraph').first().click();

				// Switch to parent block
				cy.getByAriaLabel('Select Group').click();

				// Assert WP element value
				getWPDataObject().then((data) => {
					expect('#ffcaca').to.be.equal(
						getSelectedBlock(data, 'style')?.elements['button']
							?.color?.background
					);
				});

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						blockeraBackgroundColor: '#ffcaca',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'core/button'
						]?.attributes
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				setInnerBlock('core/button');

				//
				// Normal → Text Color
				//

				cy.setColorControlValue('BG Color', '666666');

				getWPDataObject().then((data) => {
					expect({
						blockeraBackgroundColor: '#666666',
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'core/button'
						]?.attributes
					);
				});

				getWPDataObject().then((data) => {
					expect('#666666').to.be.equal(
						getSelectedBlock(data, 'style')?.elements['button']
							?.color?.background
					);
				});

				//
				// Test 3: Clear Blockera value and check WP data
				//

				cy.clearColorControlValue('BG Color');

				getWPDataObject().then((data) => {
					expect({}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'core/button'
						]?.attributes
					);
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.elements['button']
							?.color?.background
					);
				});
			});

			it('Variable value BG color', () => {
				appendBlocks(`<!-- wp:group {"style":{"elements":{"button":{"color":{"background":"var:preset|color|accent-3"}}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>test paragraph</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button">test button</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->`);

				// Select target block
				cy.getBlock('core/paragraph').first().click();

				// Switch to parent block
				cy.getByAriaLabel('Select Group').click();

				// Assert WP element value
				getWPDataObject().then((data) => {
					expect('var:preset|color|accent-3').to.be.equal(
						getSelectedBlock(data, 'style')?.elements['button']
							?.color?.background
					);
				});

				//
				// Test 1: WP data to Blockera
				//

				// WP data should come to Blockera
				getWPDataObject().then((data) => {
					expect({
						blockeraBackgroundColor: {
							settings: {
								name: 'Accent 3',
								id: 'accent-3',
								value: '#503AA8',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--accent-3',
							},
							name: 'Accent 3',
							isValueAddon: true,
							valueType: 'variable',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'core/button'
						]?.attributes
					);
				});

				//
				// Test 2: Blockera value to WP data
				//

				setInnerBlock('core/button');

				cy.getParentContainer('BG Color').within(() => {
					cy.clickValueAddonButton();
				});

				cy.selectValueAddonItem('contrast');

				getWPDataObject().then((data) => {
					expect({
						blockeraBackgroundColor: {
							settings: {
								name: 'Contrast',
								id: 'contrast',
								value: '#111111',
								reference: {
									type: 'theme',
									theme: 'Twenty Twenty-Five',
								},
								type: 'color',
								var: '--wp--preset--color--contrast',
							},
							name: 'Contrast',
							isValueAddon: true,
							valueType: 'variable',
						},
					}).to.be.deep.equal(
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'core/button'
						]?.attributes
					);
				});

				getWPDataObject().then((data) => {
					expect('var:preset|color|contrast').to.be.equal(
						getSelectedBlock(data, 'style')?.elements['button']
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
						getSelectedBlock(data, 'blockeraInnerBlocks')[
							'core/button'
						]?.attributes
					);
				});

				getWPDataObject().then((data) => {
					expect(undefined).to.be.equal(
						getSelectedBlock(data, 'style')?.elements['button']
							?.color?.background
					);
				});
			});
		});
	});
});
