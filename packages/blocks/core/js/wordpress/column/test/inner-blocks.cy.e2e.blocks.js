/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
	createPost,
} from '@blockera/dev-cypress/js/helpers';

describe('Column Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(
			'<!-- wp:columns -->\n' +
				'<div class="wp-block-columns"><!-- wp:column -->\n' +
				'<div class="wp-block-column"><!-- wp:paragraph -->\n' +
				'<p>Paragraph 1</p>\n' +
				'<!-- /wp:paragraph --></div>\n' +
				'<!-- /wp:column -->\n' +
				'\n' +
				'<!-- wp:column -->\n' +
				'<div class="wp-block-column"><!-- wp:paragraph -->\n' +
				'<p>Paragraph 2</p>\n' +
				'<!-- /wp:paragraph --></div>\n' +
				'<!-- /wp:column --></div>\n' +
				'<!-- /wp:columns -->'
		);

		// Select target block
		cy.getBlock('core/paragraph').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select Column').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Links Customize').should('exist');
				cy.getByAriaLabel('Paragraphs Customize').should('exist');
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
