/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('List Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence', () => {
		appendBlocks(`'<!-- wp:list -->
<ul><!-- wp:list-item -->
<li>item 1</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>item 2</li>
<!-- /wp:list-item -->

<!-- wp:list-item -->
<li>item 3</li>
<!-- /wp:list-item --></ul>
<!-- /wp:list -->'`);

		// Select target block
		cy.getBlock('core/list').click();

		// Switch to parent block
		cy.getByAriaLabel('Select List').click();

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
