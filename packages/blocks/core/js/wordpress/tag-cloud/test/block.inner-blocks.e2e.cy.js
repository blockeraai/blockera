/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Tag Cloud Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selectors in editor and front-end', () => {
		appendBlocks('<!-- wp:tag-cloud {"taxonomy":"category"} /-->\n ');

		// Select target block
		cy.getBlock('core/tag-cloud').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. elements/tag-link
		//
		setInnerBlock('elements/tag-link');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/tag-cloud')
			.first()
			.within(() => {
				cy.get('a.tag-cloud-link')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-tag-cloud').within(() => {
			// elements/tag-link
			cy.get('a.tag-cloud-link')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});
