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

describe('Post Author Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks('<!-- wp:post-author {"byline":"Author"} /--> ');

		// Select target block
		cy.getBlock('core/post-author').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. core/avatar inner block
		//
		setInnerBlock('core/avatar');

		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-author')
			.first()
			.within(() => {
				cy.get('.wp-block-post-author__avatar > img')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/byline inner block
		//
		setParentBlock();
		setInnerBlock('elements/byline');

		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-author')
			.first()
			.within(() => {
				cy.get('.wp-block-post-author__byline')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.3. elements/author inner block
		//
		setParentBlock();
		setInnerBlock('elements/author');

		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-author')
			.first()
			.within(() => {
				cy.get('.wp-block-post-author__name')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').within(() => {
			// core/avatar inner block
			cy.get('.wp-block-post-author__avatar > img')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/byline inner block
			cy.get('.wp-block-post-author__byline')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/byline inner block
			cy.get('.wp-block-post-author__name')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});
