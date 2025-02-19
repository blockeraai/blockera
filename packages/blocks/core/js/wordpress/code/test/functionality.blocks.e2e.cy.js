/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Code Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:code -->
<pre class="wp-block-code"><code>Hello world</code></pre>
<!-- /wp:code -->
		`);

		// Select target block
		cy.getBlock('core/code').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// No inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/code').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/code').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Assert front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-code').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
