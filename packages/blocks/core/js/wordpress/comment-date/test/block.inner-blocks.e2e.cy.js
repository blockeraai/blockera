/**
 * Blockera dependencies
 */
import {
	editPost,
	appendBlocks,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Comment Date Block → Inner Blocks', () => {
	beforeEach(() => {
		editPost({ postID: 1 });
	});

	it('Inner blocks existence', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/comment-date').first().click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByDataTest('elements/link').should('exist');

				// no other item
				cy.getByDataTest('core/paragraph').should('not.exist');
			}
		);
	});
});
