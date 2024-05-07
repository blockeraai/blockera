/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '../../../../../../cypress/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Query No Results Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/query').click();
		cy.getBlock('core/query-no-results').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Link Customize').should('exist');

				// no other item
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});
