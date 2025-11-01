/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	getWPDataObject,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Letter Spacing → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Paragraph Block', () => {
		it('Simple value', () => {
			appendBlocks(
				'<!-- wp:paragraph {"style":{"typography":{"letterSpacing":"2px"}}} -->\n' +
					'<p style="letter-spacing:2px">Test paragraph</p>\n' +
					'<!-- /wp:paragraph -->'
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			// Open more settings
			openMoreFeaturesControl('More typography settings');

			cy.getParentContainer('Letters').as('container');

			cy.addNewTransition();

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('2px').to.be.equal(
					getSelectedBlock(data, 'blockeraLetterSpacing')
				);

				expect('2px').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.letterSpacing
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
				cy.get('input').type(3, { force: true });
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('3px').to.be.equal(
					getSelectedBlock(data, 'blockeraLetterSpacing')
				);

				expect('3px').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.letterSpacing
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear
			cy.get('@container').within(() => {
				cy.get('input').clear({ force: true });
			});

			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraLetterSpacing')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.letterSpacing
				);
			});
		});
	});
});
