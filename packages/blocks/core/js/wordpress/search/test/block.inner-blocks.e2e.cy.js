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

describe('Search Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selectors in editor and front-end', () => {
		appendBlocks(
			'<!-- wp:search {"label":"Search Title","buttonText":"Search"} /-->\n '
		);

		// Select target block
		cy.getBlock('core/search').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. elements/label
		//
		setInnerBlock('elements/label');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/search')
			.first()
			.within(() => {
				cy.get('.wp-block-search__label')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/input
		//
		setParentBlock();
		setInnerBlock('elements/input');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/search')
			.first()
			.within(() => {
				cy.get('.wp-block-search__input')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.3. elements/button
		//
		setParentBlock();
		setInnerBlock('elements/button');

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/search')
			.first()
			.within(() => {
				cy.get('.wp-block-search__button')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').within(() => {
			// elements/label
			cy.get('.wp-block-search__label')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/input
			cy.get('.wp-block-search__input')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/button
			cy.get('.wp-block-search__button')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});
