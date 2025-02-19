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

describe('Categories Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(`<!-- wp:categories /--> `);

		// Select target block
		cy.getBlock('core/categories').click();

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
		cy.getBlock('core/categories').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/categories').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

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

		cy.get('.blockera-block.wp-block-categories').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		cy.get('.blockera-block.wp-block-categories').within(() => {
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
