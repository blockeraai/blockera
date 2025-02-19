/**
 * Blockera dependencies
 */
import {
	createPost,
	savePage,
	appendBlocks,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Preformatted Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(`<!-- wp:preformatted -->
<pre class="wp-block-preformatted">test content...</pre>
<!-- /wp:preformatted -->`);

		cy.getBlock('core/preformatted').click();

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
		// 1.0. Block Styles
		//

		cy.getBlock('core/preformatted').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/preformatted').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-preformatted').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
