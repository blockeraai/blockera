/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '../../../../../../cypress/helpers';

describe('Post Author Name Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks('<!-- wp:post-author-name /--> ');

		// Select target block
		cy.getBlock('core/post-author-name').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Link Customize').should('exist');

				// no other item
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});
