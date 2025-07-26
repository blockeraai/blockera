/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	openInserter,
	setInnerBlock,
} from '@blockera/dev-cypress/js/helpers';

describe('Group Block → Inner Blocks', () => {
	beforeEach(() => {
		createPost();
	});

	it('Inner blocks existence', () => {
		appendBlocks(`<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:paragraph -->
<p>paragraph 1</p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->`);

		// Select target block
		cy.getBlock('core/paragraph').first().click();

		// Switch to parent block
		cy.getByAriaLabel('Select Group').click();

		cy.getByDataTest('core/heading').should('exist');
		cy.getByDataTest('core/paragraph').should('exist');
		cy.getByDataTest('core/button').should('exist');

		cy.getByDataTest('elements/link').should('not.exist');
		openInserter();
		cy.getByDataTest('elements/link').should('exist');

		// no other item
		cy.getByDataTest('core/heading-1').should('not.exist');
	});
});
