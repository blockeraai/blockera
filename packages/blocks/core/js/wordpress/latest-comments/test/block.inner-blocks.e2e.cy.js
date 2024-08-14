/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	setBoxSpacingSide,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Latest Comments Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selectors in block editor and front-end', () => {
		appendBlocks(`<!-- wp:latest-comments /-->`);

		// Select target block
		cy.getBlock('core/latest-comments').click();

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. elements/container
		//
		setInnerBlock('elements/container');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff0000');
		setBoxSpacingSide('margin-bottom', 10);

		cy.getBlock('core/latest-comments')
			.first()
			.within(() => {
				cy.get('.wp-block-latest-comments__comment')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 0, 0)');
			});

		//
		// 1.2. elements/avatar
		//
		setParentBlock();
		setInnerBlock('elements/avatar');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/latest-comments')
			.first()
			.within(() => {
				cy.get('.wp-block-latest-comments__comment-avatar')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 32, 32)');
			});

		//
		// 1.2. elements/author
		//
		setParentBlock();
		setInnerBlock('elements/author');

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff4040');

		cy.getBlock('core/latest-comments')
			.first()
			.within(() => {
				cy.get('.wp-block-latest-comments__comment-author')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 64, 64)');
			});

		//
		// 1.3. elements/post-title
		//
		setParentBlock();
		setInnerBlock('elements/post-title');

		//
		// 1.3.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff6060');

		cy.getBlock('core/latest-comments')
			.first()
			.within(() => {
				cy.get('.wp-block-latest-comments__comment-link')
					.first()
					.should('have.css', 'background-color', 'rgb(255, 96, 96)');
			});

		//
		// 1.4. elements/date
		//
		setParentBlock();
		setInnerBlock('elements/date');

		//
		// 1.4.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff8080');

		cy.getBlock('core/latest-comments')
			.first()
			.within(() => {
				cy.get('.wp-block-latest-comments__comment-date')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(255, 128, 128)'
					);
			});

		//
		// 1.4. elements/comment-text
		//
		setParentBlock();
		setInnerBlock('elements/comment-text');

		//
		// 1.4.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff8080');

		cy.getBlock('core/latest-comments')
			.first()
			.within(() => {
				cy.get('.wp-block-latest-comments__comment-excerpt')
					.first()
					.should(
						'have.css',
						'background-color',
						'rgb(255, 128, 128)'
					);
			});

		//
		// 2. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block').within(() => {
			// elements/container
			cy.get('.wp-block-latest-comments__comment')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 0, 0)');

			// elements/avatar
			cy.get('.wp-block-latest-comments__comment-avatar')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 32, 32)');

			// elements/author
			cy.get('.wp-block-latest-comments__comment-author')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 64, 64)');

			// elements/post-title
			cy.get('.wp-block-latest-comments__comment-link')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 96, 96)');

			// elements/date
			cy.get('.wp-block-latest-comments__comment-date')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 128, 128)');

			// elements/date
			cy.get('.wp-block-latest-comments__comment-excerpt')
				.first()
				.should('have.css', 'background-color', 'rgb(255, 128, 128)');
		});
	});
});
