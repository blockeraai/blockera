/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Comments Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/comments').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select Comments').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByDataTest('core/heading').should('exist');
				cy.getByDataTest('elements/link').should('exist');

				// no other item
				cy.getByDataTest('core/heading-1').should('not.exist');
			}
		);
	});
});
