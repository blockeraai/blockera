/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
} from '../../../../../../cypress/helpers';

describe('Background Extension → WP Data Compatibility', () => {
	describe('Background Color', () => {
		it('Simple color', () => {
			appendBlocks(
				'\n' +
					'<!-- wp:paragraph {"style":{"color":{"background":"#ffdfdf"}}} -->\n' +
					'<p class="has-background" style="background-color:#ffdfdf">Test Paragraph</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.get('[data-type="core/paragraph"]').click();

			// add alias to the feature container
			cy.get('[aria-label="BG Color"]')
				.parents('[data-cy="base-control"]')
				.as('bgColorContainer');

			//
			// Test 1: WP data to Blockera check
			//

			// WP data should come to Blockera field
			getWPDataObject().then((data) => {
				expect('#ffdfdf').to.be.equal(
					getSelectedBlock(data, 'publisherBackgroundColor')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			// open color popover
			cy.get('@bgColorContainer').within(() => {
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
					getSelectedBlock(data, 'style')?.color?.background
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear bg color
			cy.get('.components-popover').within(() => {
				cy.get('button[aria-label="Reset Color (Clear)"]').click();
			});

			// WP data should be removed too
			getWPDataObject().then((data) => {
				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.color?.background
				);
			});
		});
	});
});
