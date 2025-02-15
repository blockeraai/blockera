/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Site Logo Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(`<!-- wp:site-logo /-->`);

		cy.getBlock('core/site-logo').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// No inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 1. Edit block
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/site-logo').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/site-logo').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		// 2. Assert CSS selectors in front-end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-site-logo').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
