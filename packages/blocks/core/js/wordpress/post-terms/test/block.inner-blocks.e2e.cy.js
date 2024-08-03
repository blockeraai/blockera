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

describe('Post Terms → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selectors in editor and front-end', () => {
		appendBlocks(
			'<!-- wp:post-terms {"term":"category","prefix":"prefix text","suffix":"suffix text"} /-->'
		);

		// Select target block
		cy.getBlock('core/post-terms').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. core/separator
		//
		setInnerBlock('core/separator');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		// cy.getBlock('core/post-terms')
		// 	.first()
		// 	.within(() => {
		// 		cy.get('.wp-block-post-terms__separator')
		// 			.first()
		// 			.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		// 	});

		//
		// 1.2. elements/prefix
		//
		setParentBlock();
		setInnerBlock('elements/prefix');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-terms')
			.first()
			.within(() => {
				cy.get('.wp-block-post-terms__prefix')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.3. elements/suffix
		//
		setParentBlock();
		setInnerBlock('elements/suffix');

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');

		cy.getBlock('core/post-terms')
			.first()
			.within(() => {
				cy.get('.wp-block-post-terms__suffix')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').within(() => {
			// // core/separator
			// cy.get('.wp-block-post-terms__separator')
			// 	.first()
			// 	.should(
			// 		'have.css',
			// 		'background-color',
			// 		'rgb(255, 0, 0)'
			// 	);

			// elements/prefix
			cy.get('.wp-block-post-terms__prefix')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/suffix
			cy.get('.wp-block-post-terms__suffix')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');
		});
	});
});
