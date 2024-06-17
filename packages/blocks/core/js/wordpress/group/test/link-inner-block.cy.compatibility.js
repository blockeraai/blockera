/**
 * Cypress dependencies
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
					normal: {
						breakpoints: {
							laptop: {},
						},
						isVisible: true,
					},
					hover: {
						isVisible: true,
						breakpoints: {
							laptop: {
								attributes: {
									blockeraFontColor: '#ff1d1d',
								},
							},
						},
					},
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.link?.attributes
			);
		});

		//
		// Test 2: Blockera value to WP data
		//

		setInnerBlock('Links');

		//
		// Normal → Text Color
		//

		setBlockState('Normal');

		cy.getParentContainer('Text Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover').within(() => {
			cy.get('input').as('hexColorInput');
			cy.get('@hexColorInput').clear();
			cy.get('@hexColorInput').type('666');
		});

		//
		// Hover → Text Color
		//
		setBlockState('Hover');

		cy.getParentContainer('Text Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover').within(() => {
			cy.get('input').as('hexColorInput');
			cy.get('@hexColorInput').clear();
			cy.get('@hexColorInput').type('888');
		});

		getWPDataObject().then((data) => {
			expect({
				blockeraFontColor: '#666666',
				blockeraBlockStates: {
					normal: {
						isVisible: true,
						breakpoints: {
							laptop: {
								attributes: {},
							},
						},
					},
					hover: {
						isVisible: true,
						breakpoints: {
							laptop: {
								attributes: {
									blockeraFontColor: '#888888',
								},
							},
						},
					},
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.link?.attributes
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

		cy.getParentContainer('Text Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover').within(() => {
			cy.get('button[aria-label="Reset Color (Clear)"]').click();
		});

		//
		// Hover → Text Color
		//

		setBlockState('Hover');

		cy.getParentContainer('Text Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover').within(() => {
			cy.get('button[aria-label="Reset Color (Clear)"]').click();
		});

		getWPDataObject().then((data) => {
			expect({
				blockeraBlockStates: {
					normal: {
						isVisible: true,
						breakpoints: {
							laptop: {
								attributes: {},
							},
						},
					},
					hover: {
						isVisible: true,
						breakpoints: {
							laptop: {
								attributes: {},
							},
						},
					},
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.link?.attributes
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
				blockeraBlockStates: {
					normal: {
						breakpoints: {
							laptop: {},
						},
						isVisible: true,
					},
					hover: {
						isVisible: true,
						breakpoints: {
							laptop: {
								attributes: {
									blockeraFontColor: {
										settings: {
											name: 'Accent / Four',
											id: 'accent-4',
											value: '#b1c5a4',
											reference: {
												type: 'theme',
												theme: 'Twenty Twenty-Four',
											},
											type: 'color',
											var: '--wp--preset--color--accent-4',
										},
										name: 'Accent / Four',
										isValueAddon: true,
										valueType: 'variable',
									},
								},
							},
						},
					},
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.link?.attributes
			);
		});

		//
		// Test 2: Blockera value to WP data
		//

		setInnerBlock('Links');

		//
		// Normal → Text Color
		//

		setBlockState('Normal');

		cy.getParentContainer('Text Color').within(() => {
			cy.clickValueAddonButton();
		});

		cy.selectValueAddonItem('contrast-2');

		//
		// Hover → Text Color
		//
		setBlockState('Hover');

		cy.getParentContainer('Text Color').within(() => {
			cy.clickValueAddonButton();
		});

		cy.selectValueAddonItem('accent');

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
				blockeraBlockStates: {
					normal: {
						breakpoints: {
							laptop: {
								attributes: {},
							},
						},
						isVisible: true,
					},
					hover: {
						isVisible: true,
						breakpoints: {
							laptop: {
								attributes: {
									blockeraFontColor: {
										settings: {
											name: 'Accent',
											id: 'accent',
											value: '#cfcabe',
											reference: {
												type: 'theme',
												theme: 'Twenty Twenty-Four',
											},
											type: 'color',
											var: '--wp--preset--color--accent',
										},
										name: 'Accent',
										isValueAddon: true,
										valueType: 'variable',
									},
								},
							},
						},
					},
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.link?.attributes
			);
		});

		getWPDataObject().then((data) => {
			expect('var:preset|color|contrast-2').to.be.equal(
				getSelectedBlock(data, 'style')?.elements?.link?.color?.text
			);
		});

		getWPDataObject().then((data) => {
			expect('var:preset|color|accent').to.be.equal(
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
					normal: {
						isVisible: true,
						breakpoints: {
							laptop: {
								attributes: {},
							},
						},
					},
					hover: {
						isVisible: true,
						breakpoints: {
							laptop: {
								attributes: {},
							},
						},
					},
				},
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.link?.attributes
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
