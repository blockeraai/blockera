/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
	setInnerBlock,
	setParentBlock,
} from '../../../../../../cypress/helpers';

describe('Social Links Block → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	it('Simple Value', () => {
		appendBlocks(
			`<!-- wp:social-links {"customIconColor":"#f3f3f3","iconColorValue":"#f3f3f3","customIconBackgroundColor":"black","iconBackgroundColorValue":"#000000","showLabels":true,"size":"has-normal-icon-size","className":"is-style-default","layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap"}} -->
<ul class="wp-block-social-links has-normal-icon-size has-visible-labels has-icon-color has-icon-background-color is-style-default"><!-- wp:social-link {"url":"#test","service":"wordpress"} /-->

<!-- wp:social-link {"url":"#test","service":"dribbble"} /-->

<!-- wp:social-link {"url":"#test","service":"behance"} /--></ul>
<!-- /wp:social-links -->
			`
		);

		// Select target block
		cy.getBlock('core/social-links').click();

		// Switch to parent block
		cy.getByAriaLabel('Select parent block: Social Icons').click();

		//
		// Test 1: WP data to Blockera
		//

		// WP data should come to Blockera
		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(getSelectedBlock(data, 'iconColor'));
			expect('#f3f3f3').to.be.equal(
				getSelectedBlock(data, 'customIconColor')
			);
			expect('#f3f3f3').to.be.equal(
				getSelectedBlock(data, 'iconColorValue')
			);

			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'iconBackgroundColor')
			);
			expect('black').to.be.equal(
				getSelectedBlock(data, 'customIconBackgroundColor')
			);
			expect('#000000').to.be.equal(
				getSelectedBlock(data, 'iconBackgroundColorValue')
			);

			expect('#f3f3f3').to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_icons
					?.attributes?.blockeraFontColor
			);
			expect('#f3f3f3').to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_names
					?.attributes?.blockeraFontColor
			);
			expect('#000000').to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_containers
					?.attributes?.blockeraBackgroundColor
			);
		});

		//
		// Test 2: Blockera value to WP data
		//

		//
		// Buttons inner block
		//
		setInnerBlock('Buttons');

		cy.getParentContainer('BG Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover').within(() => {
			cy.get('input').as('hexColorInput');
			cy.get('@hexColorInput').clear();
			cy.get('@hexColorInput').type('666');
		});

		//
		// Buttons Icons inner block
		//
		setParentBlock();
		setInnerBlock('Buttons Icons');

		cy.getParentContainer('Text Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover').within(() => {
			cy.get('input').as('hexColorInput');
			cy.get('@hexColorInput').clear();
			cy.get('@hexColorInput').type('888');
		});

		//
		// Buttons Names inner block
		//
		setParentBlock();
		setInnerBlock('Buttons Names');

		cy.getParentContainer('Text Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover').within(() => {
			cy.get('input').as('hexColorInput');
			cy.get('@hexColorInput').clear();
			cy.get('@hexColorInput').type('999');
		});

		//
		// Check
		//
		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(getSelectedBlock(data, 'iconColor'));
			expect('#888888').to.be.equal(
				getSelectedBlock(data, 'customIconColor')
			);
			expect('#888888').to.be.equal(
				getSelectedBlock(data, 'iconColorValue')
			);

			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'iconBackgroundColor')
			);
			expect('#666666').to.be.equal(
				getSelectedBlock(data, 'customIconBackgroundColor')
			);
			expect('#666666').to.be.equal(
				getSelectedBlock(data, 'iconBackgroundColorValue')
			);

			expect('#888888').to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_icons
					?.attributes?.blockeraFontColor
			);
			expect('#999999').to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_names
					?.attributes?.blockeraFontColor
			);
			expect('#666666').to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_containers
					?.attributes?.blockeraBackgroundColor
			);
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		//
		// Buttons inner block
		//
		setParentBlock();
		setInnerBlock('Buttons');

		cy.getParentContainer('BG Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover').within(() => {
			cy.get('button[aria-label="Reset Color (Clear)"]').click();
		});

		//
		// Buttons Icons inner block
		//
		setParentBlock();
		setInnerBlock('Buttons Icons');

		cy.getParentContainer('Text Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover').within(() => {
			cy.get('button[aria-label="Reset Color (Clear)"]').click();
		});

		//
		// Buttons Names inner block
		//
		setParentBlock();
		setInnerBlock('Buttons Names');

		cy.getParentContainer('Text Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover').within(() => {
			cy.get('button[aria-label="Reset Color (Clear)"]').click();
		});

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(getSelectedBlock(data, 'iconColor'));
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'customIconColor')
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'iconColorValue')
			);

			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'iconBackgroundColor')
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'customIconBackgroundColor')
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'iconBackgroundColorValue')
			);

			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_icons
					?.attributes?.blockeraFontColor
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_names
					?.attributes?.blockeraFontColor
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_containers
					?.attributes?.blockeraBackgroundColor
			);
		});
	});

	it('Variable Value', () => {
		appendBlocks(
			`<!-- wp:social-links {"iconColor":"base","iconColorValue":"#ffffff","iconBackgroundColor":"contrast","iconBackgroundColorValue":"#111111","showLabels":true,"size":"has-normal-icon-size","className":"is-style-default","layout":{"type":"flex","justifyContent":"left","flexWrap":"nowrap"}} -->
<ul class="wp-block-social-links has-normal-icon-size has-visible-labels has-icon-color has-icon-background-color is-style-default"><!-- wp:social-link {"url":"#test","service":"wordpress"} /-->

<!-- wp:social-link {"url":"#test","service":"dribbble"} /-->

<!-- wp:social-link {"url":"#test","service":"behance"} /--></ul>
<!-- /wp:social-links -->
			`
		);

		// Select target block
		cy.getBlock('core/social-links').click();

		// Switch to parent block
		cy.getByAriaLabel('Select parent block: Social Icons').click();

		//
		// Test 1: WP data to Blockera
		//

		// WP data should come to Blockera
		getWPDataObject().then((data) => {
			expect('base').to.be.equal(getSelectedBlock(data, 'iconColor'));
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'customIconColor')
			);
			expect('#ffffff').to.be.equal(
				getSelectedBlock(data, 'iconColorValue')
			);

			expect('contrast').to.be.equal(
				getSelectedBlock(data, 'iconBackgroundColor')
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'customIconBackgroundColor')
			);
			expect('#111111').to.be.equal(
				getSelectedBlock(data, 'iconBackgroundColorValue')
			);

			expect({
				settings: {
					name: 'Base',
					id: 'base',
					value: '#f9f9f9',
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Four',
					},
					type: 'color',
					var: '--wp--preset--color--base',
				},
				name: 'Base',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_icons
					?.attributes?.blockeraFontColor
			);
			expect({
				settings: {
					name: 'Base',
					id: 'base',
					value: '#f9f9f9',
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Four',
					},
					type: 'color',
					var: '--wp--preset--color--base',
				},
				name: 'Base',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_names
					?.attributes?.blockeraFontColor
			);
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
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_containers
					?.attributes?.blockeraBackgroundColor
			);
		});

		//
		// Test 2: Blockera value to WP data
		//

		//
		// Buttons inner block
		//
		setInnerBlock('Buttons');

		cy.getParentContainer('BG Color').within(() => {
			cy.clickValueAddonButton();
		});

		// change variable
		cy.selectValueAddonItem('contrast-2');

		//
		// Buttons Icons inner block
		//
		setParentBlock();
		setInnerBlock('Buttons Icons');

		cy.getParentContainer('Text Color').within(() => {
			cy.clickValueAddonButton();
		});

		// change variable
		cy.selectValueAddonItem('base-2');

		//
		// Buttons Names inner block
		//
		setParentBlock();
		setInnerBlock('Buttons Names');

		cy.getParentContainer('Text Color').within(() => {
			cy.clickValueAddonButton();
		});

		// change variable
		cy.selectValueAddonItem('accent-2');

		//
		// Check
		//
		getWPDataObject().then((data) => {
			expect('base-2').to.be.equal(getSelectedBlock(data, 'iconColor'));
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'customIconColor')
			);
			expect('#ffffff').to.be.equal(
				getSelectedBlock(data, 'iconColorValue')
			);

			expect('contrast-2').to.be.equal(
				getSelectedBlock(data, 'iconBackgroundColor')
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'customIconBackgroundColor')
			);
			expect('#636363').to.be.equal(
				getSelectedBlock(data, 'iconBackgroundColorValue')
			);

			expect({
				settings: {
					name: 'Base / Two',
					id: 'base-2',
					value: '#ffffff',
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Four',
					},
					type: 'color',
					var: '--wp--preset--color--base-2',
				},
				name: 'Base / Two',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_icons
					?.attributes?.blockeraFontColor
			);
			expect({
				settings: {
					name: 'Accent / Two',
					id: 'accent-2',
					value: '#c2a990',
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Four',
					},
					type: 'color',
					var: '--wp--preset--color--accent-2',
				},
				name: 'Accent / Two',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_names
					?.attributes?.blockeraFontColor
			);
			expect({
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
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_containers
					?.attributes?.blockeraBackgroundColor
			);
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		//
		// Buttons inner block
		//
		setParentBlock();
		setInnerBlock('Buttons');

		cy.getParentContainer('BG Color').within(() => {
			cy.removeValueAddon();
		});

		//
		// Buttons Icons inner block
		//
		setParentBlock();
		setInnerBlock('Buttons Icons');

		cy.getParentContainer('Text Color').within(() => {
			cy.removeValueAddon();
		});

		//
		// Buttons Names inner block
		//
		setParentBlock();
		setInnerBlock('Buttons Names');

		cy.getParentContainer('Text Color').within(() => {
			cy.removeValueAddon();
		});

		getWPDataObject().then((data) => {
			expect(undefined).to.be.equal(getSelectedBlock(data, 'iconColor'));
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'customIconColor')
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'iconColorValue')
			);

			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'iconBackgroundColor')
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'customIconBackgroundColor')
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'iconBackgroundColorValue')
			);

			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_icons
					?.attributes?.blockeraFontColor
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_names
					?.attributes?.blockeraFontColor
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')?.item_containers
					?.attributes?.blockeraBackgroundColor
			);
		});
	});
});
