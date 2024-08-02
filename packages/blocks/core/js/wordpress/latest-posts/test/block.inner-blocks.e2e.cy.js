/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('Latest Posts Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence', () => {
		appendBlocks('<!-- wp:latest-posts /--> \n');

		// Select target block
		cy.getBlock('core/latest-posts').click();

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
