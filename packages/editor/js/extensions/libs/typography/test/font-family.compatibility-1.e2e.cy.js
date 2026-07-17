/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	getSelectedBlock,
	assertBlockData,
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
				`<!-- wp:paragraph {"fontFamily":"manrope"} -->
<p class="has-manrope-font-family">Test paragraph...</p>
<!-- /wp:paragraph -->`
			);

			// Select target block
			cy.getBlock('core/paragraph').click();

			cy.getParentContainer('Font Family').as('container');

			cy.addNewTransition();

			//
			// Test 1: WP data to Blockera
			//

			// WP data should come to Blockera
			assertBlockData((data) => {
				expect('manrope').to.be.equal(
					getSelectedBlock(data, 'blockeraFontFamily')
				);

				expect('manrope').to.be.equal(
					getSelectedBlock(data, 'fontFamily')
				);
			});

			//
			// Test 2: Blockera value to WP data
			//

			cy.get('@container').within(() => {
				cy.get('select').select('fira-code');
			});

			// Blockera value should be moved to WP data
			assertBlockData((data) => {
				expect('fira-code').to.be.equal(
					getSelectedBlock(data, 'blockeraFontFamily')
				);

				expect('fira-code').to.be.equal(
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

			assertBlockData((data) => {
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
