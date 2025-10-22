/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Separator Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(`<!-- wp:separator -->
<hr class="wp-block-separator has-alpha-channel-opacity"/>
<!-- /wp:separator -->`);

		cy.getBlock('core/separator').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

		// 1.1. Block styles
		//
		cy.getBlock('core/separator').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/separator').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Assert CSS selectors in front-end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-separator').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
