/**
 * Cypress dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '../../../../../../cypress/helpers';

describe('Footnotes Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Should add all inner blocks to block settings', () => {
		appendBlocks(
			'<!-- wp:paragraph -->\n' +
				'<p>This is the text<sup data-fn="d21c4f31-a9b3-4db5-9da0-465a43dca852" class="fn"><a href="#d21c4f31-a9b3-4db5-9da0-465a43dca852" id="d21c4f31-a9b3-4db5-9da0-465a43dca852-link">1</a></sup></p>\n' +
				'<!-- /wp:paragraph -->\n' +
				'\n' +
				'<!-- wp:footnotes /-->'
		);

		// Select target block
		cy.getBlock('core/footnotes').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.publisher-extension.publisher-extension-inner-blocks').within(
			() => {
				cy.getByAriaLabel('Links Customize').should('exist');

				// no other item
				cy.getByAriaLabel('Headings Customize').should('not.exist');
			}
		);
	});
});
