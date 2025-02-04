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

describe('Blocksy → Breadcrumbs Block → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Text Color Inner Block', () => {
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
