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

	const headingInnerBlocks = {
		'core/heading': 'heading',
		'core/heading-1': 'h1',
		'core/heading-2': 'h2',
		'core/heading-3': 'h3',
		'core/heading-4': 'h4',
		'core/heading-5': 'h5',
		'core/heading-6': 'h6',
	};

	Object.keys(headingInnerBlocks).forEach((index) => {
		const innerBlock = index;
		const element = headingInnerBlocks[index];

		describe(innerBlock, () => {
			describe('Text Color', () => {
				it('Simple value text color', () => {
					appendBlocks(`<!-- wp:group {"style":{"elements":{"${element}":{"color":{"text":"#ff6868"}}}},"layout":{"type":"constrained"}} -->
		<div class="wp-block-group"><!-- wp:heading -->
		<h2 class="wp-block-heading">Heading text</h2>
		<!-- /wp:heading -->

		<!-- wp:paragraph -->
		<p>paragraph text</p>
		<!-- /wp:paragraph --></div>
		<!-- /wp:group -->`);

					// Select target block
					cy.getBlock('core/heading').first().click();

					// Switch to parent block
					cy.getByAriaLabel('Select Group').click();

					// Assert WP element value
					getWPDataObject().then((data) => {
						expect('#ff6868').to.be.equal(
							getSelectedBlock(data, 'style')?.elements[element]
								?.color?.text
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
							getSelectedBlock(data, 'blockeraInnerBlocks')[
								innerBlock
							]?.attributes
						);
					});

					//
					// Test 2: Blockera value to WP data
					//

					setInnerBlock(innerBlock);

					//
					// Normal → Text Color
					//

					cy.setColorControlValue('Text Color', '666666');

					getWPDataObject().then((data) => {
						expect({
							blockeraFontColor: '#666666',
						}).to.be.deep.equal(
							getSelectedBlock(data, 'blockeraInnerBlocks')[
								innerBlock
							]?.attributes
						);
					});

					getWPDataObject().then((data) => {
						expect('#666666').to.be.equal(
							getSelectedBlock(data, 'style')?.elements[element]
								?.color?.text
						);
					});

					//
					// Test 3: Clear Blockera value and check WP data
					//

					cy.clearColorControlValue('Text Color');

					getWPDataObject().then((data) => {
						expect({}).to.be.deep.equal(
							getSelectedBlock(data, 'blockeraInnerBlocks')[
								innerBlock
							]?.attributes
						);
					});

					getWPDataObject().then((data) => {
						expect(undefined).to.be.equal(
							getSelectedBlock(data, 'style')?.elements[element]
								?.color?.text
						);
					});
				});

				//
				// The variable value test check is only needed for heading and not for others because it's already tested in main.
				// All are the same.
				//
				if (innerBlock === 'core/heading') {
					it('Variable value text color', () => {
						appendBlocks(`<!-- wp:group {"style":{"elements":{"${element}":{"color":{"text":"var:preset|color|accent-3"}}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading -->
<h2 class="wp-block-heading">Heading text</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>paragraph text</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`);

						// Select target block
						cy.getBlock('core/paragraph').first().click();

						// Switch to parent block
						cy.getByAriaLabel('Select Group').click();

						// Assert WP data
						getWPDataObject().then((data) => {
							expect('var:preset|color|accent-3').to.be.equal(
								getSelectedBlock(data, 'style')?.elements[
									element
								]?.color?.text
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
								getSelectedBlock(data, 'blockeraInnerBlocks')[
									innerBlock
								]?.attributes
							);
						});

						//
						// Test 2: Blockera value to WP data
						//

						setInnerBlock(innerBlock);

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
								getSelectedBlock(data, 'blockeraInnerBlocks')[
									innerBlock
								]?.attributes
							);
						});

						getWPDataObject().then((data) => {
							expect('var:preset|color|contrast-2').to.be.equal(
								getSelectedBlock(data, 'style')?.elements[
									element
								]?.color?.text
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
								getSelectedBlock(data, 'blockeraInnerBlocks')[
									innerBlock
								]?.attributes
							);
						});

						getWPDataObject().then((data) => {
							expect(undefined).to.be.equal(
								getSelectedBlock(data, 'style')?.elements[
									element
								]?.color?.text
							);
						});
					});
				}
			});

			describe('Background', () => {
				describe('Background Color', () => {
					it('Simple value BG color', () => {
						appendBlocks(`<!-- wp:group {"style":{"elements":{"${element}":{"color":{"background":"#ffcaca"}}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading -->
<h2 class="wp-block-heading">Heading text</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>paragraph text</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`);

						// Select target block
						cy.getBlock('core/heading').first().click();

						// Switch to parent block
						cy.getByAriaLabel('Select Group').click();

						// Assert WP element value
						getWPDataObject().then((data) => {
							expect('#ffcaca').to.be.equal(
								getSelectedBlock(data, 'style')?.elements[
									element
								]?.color?.background
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
									innerBlock
								]?.attributes
							);
						});

						//
						// Test 2: Blockera value to WP data
						//

						setInnerBlock(innerBlock);

						//
						// Normal → Text Color
						//

						cy.setColorControlValue('BG Color', '666666');

						getWPDataObject().then((data) => {
							expect({
								blockeraBackgroundColor: '#666666',
							}).to.be.deep.equal(
								getSelectedBlock(data, 'blockeraInnerBlocks')[
									innerBlock
								]?.attributes
							);
						});

						getWPDataObject().then((data) => {
							expect('#666666').to.be.equal(
								getSelectedBlock(data, 'style')?.elements[
									element
								]?.color?.background
							);
						});

						//
						// Test 3: Clear Blockera value and check WP data
						//

						cy.clearColorControlValue('BG Color');

						getWPDataObject().then((data) => {
							expect({}).to.be.deep.equal(
								getSelectedBlock(data, 'blockeraInnerBlocks')[
									innerBlock
								]?.attributes
							);
						});

						getWPDataObject().then((data) => {
							expect(undefined).to.be.equal(
								getSelectedBlock(data, 'style')?.elements[
									element
								]?.color?.background
							);
						});
					});

					//
					// The variable value test check is only needed for heading and not for others because it's already tested in main.
					// All are the same.
					//
					if (innerBlock === 'core/heading') {
						it('Variable value BG color', () => {
							appendBlocks(`<!-- wp:group {"style":{"elements":{"${element}":{"color":{"background":"var:preset|color|accent-3"}}}},"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading -->
<h2 class="wp-block-heading">Heading text</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>paragraph text</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`);

							// Select target block
							cy.getBlock('core/paragraph').first().click();

							// Switch to parent block
							cy.getByAriaLabel('Select Group').click();

							// Assert WP element value
							getWPDataObject().then((data) => {
								expect('var:preset|color|accent-3').to.be.equal(
									getSelectedBlock(data, 'style')?.elements[
										element
									]?.color?.background
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
									getSelectedBlock(
										data,
										'blockeraInnerBlocks'
									)[innerBlock]?.attributes
								);
							});

							//
							// Test 2: Blockera value to WP data
							//

							setInnerBlock(innerBlock);

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
									getSelectedBlock(
										data,
										'blockeraInnerBlocks'
									)[innerBlock]?.attributes
								);
							});

							getWPDataObject().then((data) => {
								expect(
									'var:preset|color|contrast-2'
								).to.be.equal(
									getSelectedBlock(data, 'style')?.elements[
										element
									]?.color?.background
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
									getSelectedBlock(
										data,
										'blockeraInnerBlocks'
									)[innerBlock]?.attributes
								);
							});

							getWPDataObject().then((data) => {
								expect(undefined).to.be.equal(
									getSelectedBlock(data, 'style')?.elements[
										element
									]?.color?.background
								);
							});
						});
					}
				});
			});
		});
	});
});
