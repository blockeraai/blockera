/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	editPost,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Comment Reply Link Block → Inner Blocks', () => {
	beforeEach(() => {
		editPost({ postID: 1 });
	});

	it('Inner blocks existence', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/comment-reply-link').first().click();

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
