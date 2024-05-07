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

describe('Social Link Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/social-link').first().click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Button Icon Customize').should('exist');
				cy.getByAriaLabel('Button Name Customize').should('exist');

				// no other item
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});
