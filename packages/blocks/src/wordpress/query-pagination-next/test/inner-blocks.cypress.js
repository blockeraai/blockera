/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

/**
 * Internal dependencies
 */
import { testContent } from './test-content';

describe('Query Pagination Next Block → Inner Blocks', () => {
	it('Should add all inner blocks to block settings', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/query-pagination-next').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.publisher-extension.publisher-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Arrow Customize').should('exist');

				// no other item
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});
