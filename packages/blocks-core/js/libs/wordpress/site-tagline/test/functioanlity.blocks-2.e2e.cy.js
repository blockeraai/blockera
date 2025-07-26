/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Site Tagline Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(`<!-- wp:site-tagline /-->`);

		cy.getBlock('core/site-tagline').click().type('Test Site Tagline');

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

		//
		// 1. Edit block
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/site-tagline').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/site-tagline').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		// 2. Assert CSS selectors in front-end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-site-tagline').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
