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

describe('Font Weight → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('Paragraph Block', () => {
		it('Simple value', () => {
			appendBlocks(
				`<!-- wp:paragraph {"style":{"typography":{"fontWeight":"800"}}} -->
<p style="font-weight:800">Test paragraph</p>
<!-- /wp:paragraph -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('800').to.be.equal(
					getSelectedBlock(data, 'blockeraFontWeight')
				);

				expect('800').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontWeight
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.getParentContainer('Font Weight').within(() => {
				cy.get('select').select('200');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('200').to.be.equal(
					getSelectedBlock(data, 'blockeraFontWeight')
				);

				expect('200').to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontWeight
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear value
			cy.getParentContainer('Font Weight').within(() => {
				cy.get('select').select('');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraFontWeight')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'style')?.typography?.fontWeight
				);
			});
		});
	});
});
