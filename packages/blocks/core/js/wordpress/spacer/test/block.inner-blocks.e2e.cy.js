/**
 * Blockera dependencies
 */
import { createPost, appendBlocks } from '@blockera/dev-cypress/js/helpers';

describe('Spacer Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Block support + Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:spacer {"height":"200px"} -->
<div style="height:200px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
		`);

		// Select target block
		cy.getBlock('core/spacer').click();

		cy.get('.blockera-extension-block-card.master-block-card').should(
			'exist'
		);

		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);
	});
});
