/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('List Item Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>item 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>item 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>item 3</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->`);

		// Select target block
		cy.getBlock('core/list').click();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);
	});
});
