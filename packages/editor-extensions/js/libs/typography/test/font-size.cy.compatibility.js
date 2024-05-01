/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Font Size → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Paragraph Block', () => {
		it('Simple value', () => {
			appendBlocks(
				'<!-- wp:paragraph {"style":{"typography":{"fontSize":"20px"}}} -->' +
					'<p style="font-size:20px">Test paragraph</p>' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// add alias to the feature container
			cy.getParentContainer('Font Size').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('20px').to.be.equal(
					getSelectedBlock(data, 'blockeraFontSize')
				);

				expect('20px').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontSize
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// open
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });

				cy.get('input').type('15', { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('15px').to.be.equal(
					getSelectedBlock(data, 'blockeraFontSize')
				);

				expect('15px').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontSize
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear value
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraFontSize')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontSize
				);
			});
		});

		it('Variable value', () => {
			appendBlocks(
				'<!-- wp:paragraph {"fontSize":"small"} -->\n' +
					'<p class="has-small-font-size">Test paragraph</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// add alias to the feature container
			cy.getParentContainer('Font Size').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect({
					settings: {
						name: 'Small',
						id: 'small',
						value: '0.9rem',
						fluid: null,
						reference: {
							type: 'theme',
							theme: 'Twenty Twenty-Four',
						},
						type: 'font-size',
						var: '--wp--preset--font-size--small',
					},
					name: 'Small',
					isValueAddon: true,
					valueType: 'variable',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraFontSize')
				);

				expect('small').to.be.equal(getSelectedBlock(data, 'fontSize'));

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontSize
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
			cy.selectValueAddonItem('large');

			// Check WP data
			getWPDataObject().then((data) => {
				expect({
					settings: {
						name: 'Large',
						id: 'large',
						value: '1.85rem',
						fluid: {
							min: '1.39rem',
							max: '1.85rem',
						},
						reference: {
							type: 'theme',
							theme: 'Twenty Twenty-Four',
						},
						type: 'font-size',
						var: '--wp--preset--font-size--large',
					},
					name: 'Large',
					isValueAddon: true,
					valueType: 'variable',
				}).to.be.deep.equal(
					getSelectedBlock(data, 'blockeraFontSize')
				);

				expect('large').to.be.equal(getSelectedBlock(data, 'fontSize'));

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontSize
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
					getSelectedBlock(data, 'blockeraFontSize')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'fontSize')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontSize
				);
			});
		});
	});
});
