/**
 * Blockera dependencies
 */
import {
	savePage,
	editPost,
	appendBlocks,
	setInnerBlock,
	setParentBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Comments Pagination Numbers Block', () => {
	beforeEach(() => {
		// Generate 100 comments to post to make sure the pagination is visible
		// cy.wpCli('wp comment generate --count=100 --post_id=1');

		// cy.wpCli('wp option update page_comments 1');

		// cy.wpCli('wp option update comments_per_page 10');

		editPost({ postID: 1 });
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/comments-pagination-numbers').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems([
			'normal',
			'hover',
			'elements/numbers',
			'elements/current',
			'elements/dots',
		]);

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/comments-pagination-numbers').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/comments-pagination-numbers').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. elements/numbers inner block
		//
		setInnerBlock('elements/numbers');

		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active'], true);

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		cy.getBlock('core/comments-pagination-numbers')
			.first()
			.within(() => {
				cy.get('.page-numbers:not(.dots)').should(
					'have.css',
					'background-color',
					'rgb(204, 204, 204)'
				);
			});

		//
		// 1.2. elements/current inner block
		//
		setParentBlock();
		setInnerBlock('elements/current');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.2.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff2020');

		cy.getBlock('core/comments-pagination-numbers')
			.first()
			.within(() => {
				cy.get('.page-numbers.current').should(
					'have.css',
					'background-color',
					'rgb(255, 32, 32)'
				);
			});

		//
		// 1.3. elements/dots inner block
		//
		setParentBlock();
		setInnerBlock('elements/dots');

		cy.checkBlockCardItems(['normal', 'hover'], true);

		//
		// 1.4.1. BG color
		//
		cy.setColorControlValue('BG Color', 'ff4040');

		cy.getBlock('core/comments-pagination-numbers')
			.first()
			.within(() => {
				cy.get('.page-numbers.dots').should(
					'have.css',
					'background-color',
					'rgb(255, 64, 64)'
				);
			});

		//
		// 2. Assert front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-comments-pagination-numbers')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		cy.get('.blockera-block.wp-block-comments-pagination-numbers')
			.first()
			.within(() => {
				cy.get('.page-numbers:not(.dots)').should(
					'have.css',
					'background-color',
					'rgb(204, 204, 204)'
				);

				cy.get('.page-numbers.current').should(
					'have.css',
					'background-color',
					'rgb(255, 32, 32)'
				);

				cy.get('.page-numbers.dots').should(
					'have.css',
					'background-color',
					'rgb(255, 64, 64)'
				);
			});
	});
});
