/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('Post Content Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence', () => {
		appendBlocks('<!-- wp:post-content /-->  ');

		// Select target block
		cy.getBlock('core/post-content').click();

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
