/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Video Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(`<!-- wp:video -->
<figure class="wp-block-video"></figure>
<!-- /wp:video -->`);

		cy.getBlock('core/video').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// No inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 1. Edit Block
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/video').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/video').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-video').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
