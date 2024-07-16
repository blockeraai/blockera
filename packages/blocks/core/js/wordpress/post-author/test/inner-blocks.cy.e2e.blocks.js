/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('Post Author Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks('<!-- wp:post-author {"byline":"Author"} /--> ');

		// Select target block
		cy.getBlock('core/post-author').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Avatar Customize').should('exist');
				cy.getByAriaLabel('Byline Customize').should('exist');
				cy.getByAriaLabel('Name Customize').should('exist');
				cy.getByAriaLabel('Link Customize').should('exist');

				// no other item
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});
