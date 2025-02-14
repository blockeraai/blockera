/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Embed Block → Functionality + Inner blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:embed {"url":"https://www.youtube.com/watch?v=H_oJZ2Cv7a0","type":"video","providerNameSlug":"youtube","responsive":true,"className":"wp-embed-aspect-16-9 wp-has-aspect-ratio"} -->
<figure class="wp-block-embed is-type-video is-provider-youtube wp-block-embed-youtube wp-embed-aspect-16-9 wp-has-aspect-ratio"><div class="wp-block-embed__wrapper">
https://www.youtube.com/watch?v=H_oJZ2Cv7a0
</div></figure>
<!-- /wp:embed -->`);

		cy.getBlock('core/embed').first().click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// No inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 1.0. Block Styles
		//

		cy.getBlock('core/embed').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/embed').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Assert front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-embed').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
