/**
 * Blockera dependencies
 */
import {
	savePage,
	editPost,
	appendBlocks,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Comments Pagination Next Block', () => {
	beforeEach(() => {
		// Generate 100 comments to post to make sure the pagination is visible
		cy.wpCli('wp comment generate --count=100 --post_id=1');

		// Enable comments pagination
		cy.wpCli('wp option update page_comments 1');

		// Set comments per page to 10
		cy.wpCli('wp option update comments_per_page 10');

		editPost({ postID: 1 });
	});

	it('Functionality + Inner blocks', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/comments-pagination-next').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');
		//
		// 1. Edit Block
		//

		//
		// 1.0. Block Styles
		//
		cy.getBlock('core/comments-pagination-next').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/comments-pagination-next').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 1.1. Arrow inner block
		//
		setInnerBlock('elements/arrow');

		//
		// 1.1.1. BG color
		//
		cy.setColorControlValue('BG Color', 'cccccc');

		cy.getBlock('core/comments-pagination-next')
			.first()
			.within(() => {
				cy.get('.wp-block-comments-pagination-next-arrow').should(
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

		// click on prev to visit pre page to see the next page button (not a blockera block)
		cy.get('.wp-block-comments-pagination-previous').first().click();

		cy.get('.blockera-block.wp-block-comments-pagination-next')
			.should('be.visible')
			.should('have.css', 'background-clip', 'padding-box');

		cy.get('.blockera-block.wp-block-comments-pagination-next').within(
			() => {
				cy.get('.wp-block-comments-pagination-next-arrow').should(
					'have.css',
					'background-color',
					'rgb(204, 204, 204)'
				);
			}
		);
	});
});
