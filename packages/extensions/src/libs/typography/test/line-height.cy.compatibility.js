/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	createPost,
} from '../../../../../../cypress/helpers';

describe('Line Height → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Paragraph Block', () => {
		it('Simple value', () => {
			appendBlocks(
				'<!-- wp:paragraph {"style":{"typography":{"lineHeight":"1.2"}}} -->\n' +
					'<p style="line-height:1.2">Test paragraph</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			cy.getParentContainer('Line Height').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('1.2').to.be.equal(
					getSelectedBlock(data, 'publisherLineHeight')
				);

				expect('1.2').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.lineHeight
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.get('@container').within(() => {
				cy.get('input[type="number"]').focus();
				cy.get('input[type="number"]').type(5, {
					force: true,
				});
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('1.25').to.be.equal(
					getSelectedBlock(data, 'publisherLineHeight')
				);

				expect('1.25').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.lineHeight
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear value
			cy.get('@container').within(() => {
				cy.get('input[type="number"]').clear({ force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'publisherLineHeight')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.lineHeight
				);
			});
		});
	});
});
