/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '../../../../../../cypress/helpers';

describe('Post Terms → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks('<!-- wp:post-terms {"term":"category"} /--> ');

		// Select target block
		cy.getBlock('core/post-terms').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Term Items Customize').should('exist');
				cy.getByAriaLabel('Separator Customize').should('exist');
				cy.getByAriaLabel('Prefix Text Customize').should('exist');
				cy.getByAriaLabel('Suffix Text Customize').should('exist');

				// no other item
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});

