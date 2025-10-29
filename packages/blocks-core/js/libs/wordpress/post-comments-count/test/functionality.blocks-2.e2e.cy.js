/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Post Comments Count Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality', () => {
		appendBlocks(`<!-- wp:post-comments-count /-->
			`);

		cy.getBlock('core/post-comments-count').first().click();
		cy.get('.blockera-extension-block-card').should('be.visible');

		//
		// 1. Edit Block
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/post-comments-count')
			.first()
			.should('have.css', 'background-clip', 'border-box');

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-comments-count')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-post-comments-count')
			.first()
			.should('have.css', 'background-clip', 'padding-box');
	});
});
