/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '@blockera/dev-cypress/js/helpers';

import { testContent } from './test-content';

describe('Post Comments Form Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(testContent);

		// Select target block
		cy.getBlock('core/post-comments-form').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Title Customize').should('exist');
				cy.getByAriaLabel('Form Container Customize').should('exist');
				cy.getByAriaLabel('Notes Customize').should('exist');
				cy.getByAriaLabel('Input Labels Customize').should('exist');
				cy.getByAriaLabel('Input Fields Customize').should('exist');
				cy.getByAriaLabel('Textarea Field Customize').should('exist');
				cy.getByAriaLabel('Cookie Consent Customize').should('exist');
				cy.getByAriaLabel('Submit Button Customize').should('exist');

				cy.getByAriaLabel('Links Customize').should('not.exist');
				cy.getByAriaLabel('Headings Customize').should('not.exist');
				cy.getByAriaLabel('H1s Customize').should('not.exist');
				cy.getByAriaLabel('H2s Customize').should('not.exist');
				cy.getByAriaLabel('H3s Customize').should('not.exist');
				cy.getByAriaLabel('H4s Customize').should('not.exist');
				cy.getByAriaLabel('H5s Customize').should('not.exist');
				cy.getByAriaLabel('H6s Customize').should('not.exist');

				openMoreFeaturesControl('More Inner Blocks');

				cy.getByAriaLabel('Links Customize').should('exist');
				cy.getByAriaLabel('Headings Customize').should('exist');
				cy.getByAriaLabel('H1s Customize').should('exist');
				cy.getByAriaLabel('H2s Customize').should('exist');
				cy.getByAriaLabel('H3s Customize').should('exist');
				cy.getByAriaLabel('H4s Customize').should('exist');
				cy.getByAriaLabel('H5s Customize').should('exist');
				cy.getByAriaLabel('H6s Customize').should('exist');
			}
		);
	});
});
