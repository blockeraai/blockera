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

describe('Query Pagination Previous Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence + CSS selector in editor', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/query-pagination-previous').click();

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

		cy.getBlock('core/query-pagination-previous')
			.first()
			.within(() => {
				cy.get('.wp-block-query-pagination-previous-arrow').should(
					'have.css',
					'background-color',
					'rgb(204, 204, 204)'
				);
			});
	});
});
