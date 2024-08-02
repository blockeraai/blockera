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

describe('Categories Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(`<!-- wp:categories /--> `);

		// Select target block
		cy.getBlock('core/categories').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. Term item inner block
		//
		setInnerBlock('elements/term-item');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc ');

		cy.getBlock('core/categories')
			.first()
			.within(() => {
				cy.get('a')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(204, 204, 204)'
					);
			});

		//
		// 1.2. Term parent inner block
		//
		setParentBlock();
		setInnerBlock('elements/list-item');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'eeeeee ');

		cy.getBlock('core/categories')
			.first()
			.within(() => {
				cy.get('li.cat-item')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(238, 238, 238)'
					);
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').within(() => {
			// term inner block
			cy.get('a')
				.first()
				.should('have.css', 'background-color', 'rgb(204, 204, 204)');

			// term parent inner block
			cy.get('li.cat-item')
				.first()
				.should('have.css', 'background-color', 'rgb(238, 238, 238)');
		});
	});
});
