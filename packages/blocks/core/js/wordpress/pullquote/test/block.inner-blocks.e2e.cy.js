/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Pullquote Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selectors in editor and front-end', () => {
		appendBlocks(`<!-- wp:pullquote -->
<figure class="wp-block-pullquote"><blockquote><p>Quote or not quote?</p><cite>The Hero</cite></blockquote></figure>
<!-- /wp:pullquote -->`);

		// Select target block
		cy.getBlock('core/pullquote').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. elements/citation
		//
		setInnerBlock('elements/citation');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/pullquote')
			.first()
			.within(() => {
				cy.get('cite')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').within(() => {
			// elements/citation
			cy.get('cite')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});
