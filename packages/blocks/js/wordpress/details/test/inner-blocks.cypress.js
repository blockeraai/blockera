/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
	openMoreFeaturesControl,
} from '../../../../../../cypress/helpers';

describe('Details Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(
			'<!-- wp:details -->\n' +
				'<details class="wp-block-details"><summary>test title</summary><!-- wp:paragraph {"placeholder":"Type / to add a hidden block"} -->\n' +
				'<p>Paragraph text...</p>\n' +
				'<!-- /wp:paragraph --></details>\n' +
				'<!-- /wp:details -->'
		);

		// Select target block
		cy.getBlock('core/details').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Links Customize').should('exist');
				cy.getByAriaLabel('Paragraphs Customize').should('exist');

				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});
