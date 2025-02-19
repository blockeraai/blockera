/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	savePage,
	redirectToFrontPage,
	setInnerBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Footnotes Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:paragraph -->
<p>This is a test paragraph that includes a footnote<sup data-fn="369f7eaa-8cfd-4df7-8e43-8c2dc7cc4e3e" class="fn"><a href="#369f7eaa-8cfd-4df7-8e43-8c2dc7cc4e3e" id="369f7eaa-8cfd-4df7-8e43-8c2dc7cc4e3e-link">1</a></sup>!</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>weqwewqe</p>
<!-- /wp:paragraph -->

<!-- wp:footnotes /-->

<!-- wp:paragraph -->
<p></p>
<!-- /wp:paragraph -->`);

		// Select target block
		cy.getBlock('core/footnotes').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Has inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'exist'
		);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/footnotes').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/footnotes').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/link
		//
		setInnerBlock('elements/link');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		cy.getBlock('core/footnotes').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});

		//
		// 2. Assert front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-footnotes').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-footnotes').within(() => {
			cy.get('a').should(
				'have.css',
				'background-color',
				'rgb(204, 204, 204)'
			);
		});
	});
});
