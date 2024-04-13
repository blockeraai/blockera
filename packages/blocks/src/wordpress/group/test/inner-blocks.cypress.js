/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

describe('Group Block → Inner Blocks', () => {
	it('Should add all inner blocks to block settings', () => {
		appendBlocks(
			'<!-- wp:group {"layout":{"type":"constrained"}} -->\n' +
				'<div class="wp-block-group"><!-- wp:paragraph -->\n' +
				'<p>paragraph 1</p>\n' +
				'<!-- /wp:paragraph --></div>\n' +
				'<!-- /wp:group -->'
		);

		// Select target block
		cy.getBlock('core/paragraph').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select Group').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.publisher-extension.publisher-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Links Customize').should('exist');
				cy.getByAriaLabel('Buttons Customize').should('exist');
				cy.getByAriaLabel('Headings Customize').should('exist');

				cy.getByAriaLabel('H1s Customize').should('not.exist');
				cy.getByAriaLabel('H2s Customize').should('not.exist');
				cy.getByAriaLabel('H3s Customize').should('not.exist');
				cy.getByAriaLabel('H4s Customize').should('not.exist');
				cy.getByAriaLabel('H5s Customize').should('not.exist');
				cy.getByAriaLabel('H6s Customize').should('not.exist');

				openMoreFeaturesControl('More Inner Blocks');

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
