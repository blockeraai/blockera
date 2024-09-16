/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('Home Link Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Block should be supported + switch to parent should work', () => {
		appendBlocks('<!-- wp:navigation /-->');

		cy.getBlock('core/navigation').click();

		// Open blocks menu
		cy.get('[aria-label="Add block"]').first().click();

		// search for custom link
		cy.get('input[type="search"]:focus').last().type('Home Link');

		// insert
		cy.get('button.editor-block-list-item-home-link').last().click();

		// switch to target block
		cy.getBlock('core/home-link').first().click();

		// assert block card
		cy.get('.blockera-extension-block-card.master-block-card').should(
			'exist'
		);

		// switch to parent navigation block
		cy.get('.blockera-extension-block-card.master-block-card').within(
			() => {
				cy.get('button[data-test="back-to-parent-navigation"]').should(
					'exist'
				);
				cy.get('button[data-test="back-to-parent-navigation"]').click();
			}
		);

		//
		// Assert block switched to parent navigation block
		//
		cy.get('.blockera-extension-block-card.master-block-card').should(
			'not.exist'
		);
		cy.get('.block-editor-block-card').should('exist');
		cy.get('.block-editor-block-card').within(() => {
			cy.get('.block-editor-block-card__title').contains('Navigation');
		});
	});
});
