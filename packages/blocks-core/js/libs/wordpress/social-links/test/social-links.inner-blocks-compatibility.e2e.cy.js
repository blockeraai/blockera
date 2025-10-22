/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
	setInnerBlock,
	setParentBlock,
} from '@blockera/dev-cypress/js/helpers';

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
		cy.getBlock('core/social-link').first().click();

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
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-icons'
				]?.attributes?.blockeraFontColor
			);
			expect('#f3f3f3').to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-names'
				]?.attributes?.blockeraFontColor
			);
			expect('#000000').to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-containers'
				]?.attributes?.blockeraBackgroundColor
			);
		});

		//
		// Test 2: Blockera value to WP data
		//

		//
		// Buttons inner block
		//
		setInnerBlock('elements/item-containers');

		cy.getParentContainer('BG Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.get('input').as('hexColorInput');
				cy.get('@hexColorInput').clear();
				cy.get('@hexColorInput').type('666');
			});

		//
		// Buttons Icons inner block
		//
		setParentBlock();
		setInnerBlock('elements/item-icons');

		cy.getParentContainer('Text Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.get('input').as('hexColorInput');
				cy.get('@hexColorInput').clear();
				cy.get('@hexColorInput').type('888');
			});

		//
		// Buttons Names inner block
		//
		setParentBlock();
		setInnerBlock('elements/item-names');

		cy.getParentContainer('Text Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
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
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-icons'
				]?.attributes?.blockeraFontColor
			);
			expect('#999999').to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-names'
				]?.attributes?.blockeraFontColor
			);
			expect('#666666').to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-containers'
				]?.attributes?.blockeraBackgroundColor
			);
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		//
		// Buttons inner block
		//
		setParentBlock();
		setInnerBlock('elements/item-containers');

		cy.getParentContainer('BG Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.get('button[aria-label="Reset Color (Clear)"]').click();
			});

		//
		// Buttons Icons inner block
		//
		setParentBlock();
		setInnerBlock('elements/item-icons');

		cy.getParentContainer('Text Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
				cy.get('button[aria-label="Reset Color (Clear)"]').click();
			});

		//
		// Buttons Names inner block
		//
		setParentBlock();
		setInnerBlock('elements/item-names');

		cy.getParentContainer('Text Color').within(() => {
			cy.get('button').click();
		});

		cy.get('.components-popover')
			.last()
			.within(() => {
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
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-icons'
				]?.attributes?.blockeraFontColor
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-names'
				]?.attributes?.blockeraFontColor
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-containers'
				]?.attributes?.blockeraBackgroundColor
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
		cy.getBlock('core/social-link').first().click();

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
					value: '#FFFFFF',
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Five',
					},
					type: 'color',
					var: '--wp--preset--color--base',
				},
				name: 'Base',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-icons'
				]?.attributes?.blockeraFontColor
			);
			expect({
				settings: {
					name: 'Base',
					id: 'base',
					value: '#FFFFFF',
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Five',
					},
					type: 'color',
					var: '--wp--preset--color--base',
				},
				name: 'Base',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-names'
				]?.attributes?.blockeraFontColor
			);
			expect({
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
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-containers'
				]?.attributes?.blockeraBackgroundColor
			);
		});

		//
		// Test 2: Blockera value to WP data
		//

		//
		// Buttons inner block
		//
		setInnerBlock('elements/item-containers');

		cy.getParentContainer('BG Color').within(() => {
			cy.clickValueAddonButton();
		});

		// change variable
		cy.selectValueAddonItem('contrast');

		//
		// Buttons Icons inner block
		//
		setParentBlock();
		setInnerBlock('elements/item-icons');

		cy.getParentContainer('Text Color').within(() => {
			cy.clickValueAddonButton();
		});

		// change variable
		cy.selectValueAddonItem('accent-1');

		//
		// Buttons Names inner block
		//
		setParentBlock();
		setInnerBlock('elements/item-names');

		cy.getParentContainer('Text Color').within(() => {
			cy.clickValueAddonButton();
		});

		// change variable
		cy.selectValueAddonItem('accent-2');

		//
		// Check
		//
		getWPDataObject().then((data) => {
			expect('accent-1').to.be.equal(getSelectedBlock(data, 'iconColor'));
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'customIconColor')
			);
			expect('#FFEE58').to.be.equal(
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
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-icons'
				]?.attributes?.blockeraFontColor
			);
			expect({
				settings: {
					name: 'Accent 2',
					id: 'accent-2',
					value: '#F6CFF4',
					reference: {
						type: 'theme',
						theme: 'Twenty Twenty-Five',
					},
					type: 'color',
					var: '--wp--preset--color--accent-2',
				},
				name: 'Accent 2',
				isValueAddon: true,
				valueType: 'variable',
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-names'
				]?.attributes?.blockeraFontColor
			);
			expect({
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
			}).to.be.deep.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-containers'
				]?.attributes?.blockeraBackgroundColor
			);
		});

		//
		// Test 3: Clear Blockera value and check WP data
		//

		//
		// Buttons inner block
		//
		setParentBlock();
		setInnerBlock('elements/item-containers');

		cy.getParentContainer('BG Color').within(() => {
			cy.removeValueAddon();
		});

		//
		// Buttons Icons inner block
		//
		setParentBlock();
		setInnerBlock('elements/item-icons');

		cy.getParentContainer('Text Color').within(() => {
			cy.removeValueAddon();
		});

		//
		// Buttons Names inner block
		//
		setParentBlock();
		setInnerBlock('elements/item-names');

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
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-icons'
				]?.attributes?.blockeraFontColor
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-names'
				]?.attributes?.blockeraFontColor
			);
			expect(undefined).to.be.equal(
				getSelectedBlock(data, 'blockeraInnerBlocks')[
					'elements/item-containers'
				]?.attributes?.blockeraBackgroundColor
			);
		});
	});
});
