/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	setInnerBlock,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Comments Pagination Next Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/comments-pagination-next').click();

		//
		// 1. Edit Inner Blocks
		//

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
	});
});
