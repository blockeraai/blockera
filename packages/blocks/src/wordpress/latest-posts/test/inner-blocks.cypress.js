/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

describe('Latest Posts Block → Inner Blocks', () => {
	it('Should add all inner blocks to block settings', () => {
		appendBlocks('<!-- wp:latest-posts /--> \n');

		// Select target block
		cy.getBlock('core/latest-posts').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.publisher-extension.publisher-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Links Customize').should('exist');

				cy.getByAriaLabel('Paragraphs Customize').should('not.exist');
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});
