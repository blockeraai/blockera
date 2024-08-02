/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('Footnotes Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence', () => {
		appendBlocks(`<!-- wp:paragraph -->
<p>This is the text<sup data-fn="d21c4f31-a9b3-4db5-9da0-465a43dca852" class="fn"><a href="#d21c4f31-a9b3-4db5-9da0-465a43dca852" id="d21c4f31-a9b3-4db5-9da0-465a43dca852-link">1</a></sup></p>
<!-- /wp:paragraph -->

<!-- wp:footnotes /-->`);

		// Select target block
		cy.getBlock('core/footnotes').click();

		// open inner block settings
		openInnerBlocksExtension();

		cy.get('.blockera-extension.blockera-extension-inner-blocks').within(
			() => {
				cy.getByDataTest('elements/link').should('exist');

				// no other item
				cy.getByDataTest('core/heading').should('not.exist');
			}
		);
	});
});
