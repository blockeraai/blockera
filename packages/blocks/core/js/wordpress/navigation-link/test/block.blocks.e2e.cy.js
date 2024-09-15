/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	openInnerBlocksExtension,
} from '@blockera/dev-cypress/js/helpers';

describe('Navigation Link Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Block should be supported + switch to parent should work', () => {
		appendBlocks('<!-- wp:navigation /-->');

		// Select target block
		cy.getBlock('core/navigation-link').last().click({ force: true });

		cy.get('.blockera-extension-block-card.master-block-card').should(
			'exist'
		);

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
