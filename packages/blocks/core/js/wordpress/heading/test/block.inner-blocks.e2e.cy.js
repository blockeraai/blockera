/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('Heading Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence', () => {
		appendBlocks(`<!-- wp:heading -->
<h2 class="wp-block-heading">Heading text</h2>
<!-- /wp:heading -->`);

		// Select target block
		cy.getBlock('core/heading').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByDataTest('elements/link').should('exist');

				// no other item
				cy.getByDataTest('core/heading').should('not.exist');
			}
		);
	});
});
