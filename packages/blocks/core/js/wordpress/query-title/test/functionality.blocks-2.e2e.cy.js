/**
 * Blockera dependencies
 */
import { createPost, appendBlocks } from '@blockera/dev-cypress/js/helpers';

describe('Query Title Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks('<!-- wp:query-title {"type":"search"} /--> ');

		// Select target block
		cy.getBlock('core/query-title').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		//
		// 1. Edit Block
		//

		//
		// 1.0. Block styles
		//

		cy.getBlock('core/query-title').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/query-title').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Assert inner blocks selectors in front end
		//

		// it's very complicated to test this, because the block is not rendered in the front end
	});
});
