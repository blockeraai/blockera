/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Navigation Overlay Close Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(
			'<!-- wp:navigation-overlay-close {"displayMode":"both","text":"Close menu"} /-->'
		);

		cy.getBlock('core/navigation-overlay-close').click();

		//
		// 1. Block supported is active
		//
		cy.get('.blockera-extension-block-card').should('be.visible');

		//
		// 2. Block active items
		//
		cy.checkBlockCardItems(['normal', 'hover', 'focus', 'active']);

		cy.checkBlockStatesPickerItems(['elements/bold', 'elements/italic']);

		//
		// 3. Edit Block
		//

		//
		// 3.1. Block styles
		//
		cy.getBlock('core/navigation-overlay-close').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/navigation-overlay-close').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 4. Check settings tab
		//
		cy.getBlock('core/navigation-overlay-close').click();
		cy.get('[role="tab"][aria-label="Settings"]').click();

		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-tools-panel:not(.block-editor-bindings__panel)')
				.should('exist')
				.should('be.visible');
		});

		//
		// 5. Assert block styles in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-navigation-overlay-close').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
