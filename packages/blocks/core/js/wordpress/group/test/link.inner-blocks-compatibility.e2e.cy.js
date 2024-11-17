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

describe('Group Block → Link Inner Block → WP Data Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('Simple color for inner block (normal + hover)', () => {
		appendBlocks(
			'<!-- wp:group {"style":{"elements":{"link":{"color":{"text":"#ffbaba"},":hover":{"color":{"text":"#ff1d1d"}}}}},"layout":{"type":"constrained"}} -->\n' +
				'<div class="wp-block-group has-link-color"><!-- wp:paragraph -->\n' +
				'<p>Paragraph 1</p>\n' +
				'<!-- /wp:paragraph -->\n' +
				'\n' +
				'<!-- wp:paragraph -->\n' +
				'<p>Paragraph 2 with <a href="#a">link</a></p>\n' +
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
				blockeraFontColor: '#ffbaba',
				blockeraBlockStates: {
					hover: {
						isVisible: true,
						breakpoints: {
							desktop: {
								attributes: {
									blockeraFontColor: '#ff1d1d',
								},
							},
						},
					},
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')['elements/link']
					?.attributes
			);
		});

		//
		// Test 2: Blockera value to WP data
		//

		setInnerBlock('elements/link');

		//
		// Normal → Text Color
		//

		setBlockState('Normal');

		cy.setColorControlValue('Text Color', '666666');

		//
		// Hover → Text Color
		//
		setBlockState('Hover');

		cy.setColorControlValue('Text Color', '888888');

		getWPDataObject().then((data) => {
			expect({
				blockeraFontColor: '#666666',
				blockeraBlockStates: {
					hover: {
						isVisible: true,
						breakpoints: {
							desktop: {
								attributes: {
									blockeraFontColor: '#888888',
								},
							},
						},
					},
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')['elements/link']
					?.attributes
			);
		});

		getWPDataObject().then((data) => {
			expect('#666666').to.be.equal(
				getSelectedBlock(data, 'style')?.elements?.link?.color?.text
			);
		});

		getWPDataObject().then((data) => {
			expect('#888888').to.be.equal(
				getSelectedBlock(data, 'style')?.elements?.link[':hover']?.color
					?.text
			);
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		//
		// Normal → Text Color
		//

		setBlockState('Normal');

		cy.clearColorControlValue('Text Color');

		//
		// Hover → Text Color
		//

		setBlockState('Hover');

		cy.clearColorControlValue('Text Color');

		getWPDataObject().then((data) => {
			expect({
				blockeraBlockStates: {
					hover: {
						isVisible: true,
						breakpoints: {
							desktop: {
								attributes: {},
							},
						},
					},
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')['elements/link']
					?.attributes
			);
		});

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'style')?.elements?.link?.color?.text
			);
		});

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'style')?.elements?.link[':hover']?.color
					?.text
			);
		});
	});

	it('Variable color value for inner block (normal + hover)', () => {
		appendBlocks(
			'<!-- wp:group {"style":{"elements":{"link":{"color":{"text":"var:preset|color|accent-3"},":hover":{"color":{"text":"var:preset|color|accent-4"}}}}},"layout":{"type":"constrained"}} -->\n' +
				'<div class="wp-block-group has-link-color"><!-- wp:paragraph -->\n' +
				'<p>Paragraph 1</p>\n' +
				'<!-- /wp:paragraph -->\n' +
				'\n' +
				'<!-- wp:paragraph -->\n' +
				'<p>Paragraph 2 with <a href="#a">link</a></p>\n' +
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
				blockeraBlockStates: {
					hover: {
						isVisible: true,
						breakpoints: {
							desktop: {
								attributes: {
									blockeraFontColor: {
										settings: {
											name: 'Accent 4',
											id: 'accent-4',
											value: '#686868',
											reference: {
												type: 'theme',
												theme: 'Twenty Twenty-Five',
											},
											type: 'color',
											var: '--wp--preset--color--accent-4',
										},
										name: 'Accent 4',
										isValueAddon: true,
										valueType: 'variable',
									},
								},
							},
						},
					},
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')['elements/link']
					?.attributes
			);
		});

		//
		// Test 2: Blockera value to WP data
		//

		setInnerBlock('elements/link');

		//
		// Normal → Text Color
		//

		setBlockState('Normal');

		cy.getParentContainer('Text Color').within(() => {
			cy.clickValueAddonButton();
		});

		cy.selectValueAddonItem('contrast');

		//
		// Hover → Text Color
		//
		setBlockState('Hover');

		cy.getParentContainer('Text Color').within(() => {
			cy.clickValueAddonButton();
		});

		cy.selectValueAddonItem('accent-1');

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
				blockeraBlockStates: {
					hover: {
						isVisible: true,
						breakpoints: {
							desktop: {
								attributes: {
									blockeraFontColor: {
										settings: {
											name: 'Accent 1',
											id: 'accent-1',
											value: '#FFEE58',
											reference: {
												type: 'theme',
												theme: 'Twenty Twenty-Five',
											},
											type: 'color',
											var: '--wp--preset--color--accent-1',
										},
										name: 'Accent 1',
										isValueAddon: true,
										valueType: 'variable',
									},
								},
							},
						},
					},
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')['elements/link']
					?.attributes
			);
		});

		getWPDataObject().then((data) => {
			expect('var:preset|color|contrast').to.be.equal(
				getSelectedBlock(data, 'style')?.elements?.link?.color?.text
			);
		});

		getWPDataObject().then((data) => {
			expect('var:preset|color|accent-1').to.be.equal(
				getSelectedBlock(data, 'style')?.elements?.link[':hover']?.color
					?.text
			);
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		//
		// Normal → Text Color
		//

		setBlockState('Normal');

		cy.getParentContainer('Text Color').within(() => {
			cy.removeValueAddon();
		});

		//
		// Hover → Text Color
		//

		setBlockState('Hover');

		cy.getParentContainer('Text Color').within(() => {
			cy.removeValueAddon();
		});

		getWPDataObject().then((data) => {
			expect({
				blockeraBlockStates: {
					hover: {
						isVisible: true,
						breakpoints: {
							desktop: {
								attributes: {},
							},
						},
					},
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')['elements/link']
					?.attributes
			);
		});

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'style')?.elements?.link?.color?.text
			);
		});

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'style')?.elements?.link[':hover']?.color
					?.text
			);
		});
	});
});
