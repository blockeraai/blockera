/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '../../../../../../cypress/helpers';

describe('Search Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(
			'<!-- wp:search {"label":"Search Title","buttonText":"Search"} /-->\n '
		);

		// Select target block
		cy.getBlock('core/search').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.publisher-extension.publisher-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Form Label Customize').should('exist');
				cy.getByAriaLabel('Form Input Customize').should('exist');
				cy.getByAriaLabel('Form Button Customize').should('exist');

				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});
