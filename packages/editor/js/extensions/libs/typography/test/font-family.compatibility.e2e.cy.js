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

describe('Font Family → WP Compatibility', () => {
	beforeEach(() => {
		createPost();
	});

	describe('All Blocks', () => {
		it('the WP attribute is fontFamily in all blocks', () => {
			appendBlocks(
				`<!-- wp:paragraph {"fontFamily":"cardo"} -->
<p class="has-cardo-font-family">Test paragraph...</p>
<!-- /wp:paragraph -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			cy.getParentContainer('Family').as('container');

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			getWPDataObject().then((data) => {
				expect('cardo').to.be.equal(
					getSelectedBlock(data, 'blockeraFontFamily')
				);

				expect('cardo').to.be.equal(
					getSelectedBlock(data, 'fontFamily')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.get('@container').within(() => {
				cy.get('select').select('system-sans-serif');
			});

			// Blockera value should be moved to WP data
			getWPDataObject().then((data) => {
				expect('system-sans-serif').to.be.equal(
					getSelectedBlock(data, 'blockeraFontFamily')
				);

				expect('system-sans-serif').to.be.equal(
					getSelectedBlock(data, 'fontFamily')
				);
			});

			//
			// Test 3: Clear Blockera value and check WP data
			//

			// clear value
			cy.get('@container').within(() => {
				cy.get('select').select('');
			});

			getWPDataObject().then((data) => {
				expect('').to.be.equal(
					getSelectedBlock(data, 'blockeraFontFamily')
				);

				expect(undefined).to.be.equal(
					getSelectedBlock(data, 'fontFamily')
				);
			});
		});
	});
});
