/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '../../../../../../cypress/helpers';

describe('Latest Posts Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks('<!-- wp:latest-posts /--> \n');

		// Select target block
		cy.getBlock('core/latest-posts').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Links Customize').should('exist');

				cy.getByAriaLabel('Paragraphs Customize').should('not.exist');
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});
