/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	openInserter,
	setInnerBlock,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Post Time to Read Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality', () => {
		appendBlocks(`<!-- wp:post-time-to-read /-->
			<!-- wp:post-time-to-read {"displayMode":"words"} /-->
			`);

		// Time to read variation
		cy.getBlock('core/post-time-to-read').first().click();
		cy.get('.blockera-extension-block-card').should('be.visible');

		// Word count variation
		cy.getBlock('core/post-time-to-read').last().click();
		cy.get('.blockera-extension-block-card').should('be.visible');

		//
		// 1. Edit Block
		//

		cy.getBlock('core/post-time-to-read').first().click();

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/post-time-to-read')
			.first()
			.should('have.css', 'background-clip', 'border-box');

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-time-to-read')
			.first()
			.should('have.css', 'background-clip', 'padding-box');

		//
		// 2. Check settings tab
		//
		cy.getByDataTest('settings-tab').click();

		// layout settings should be hidden
		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-tools-panel-header')
				.contains('Settings')
				.scrollIntoView()
				.should('be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-post-time-to-read')
			.first()
			.should('have.css', 'background-clip', 'padding-box');
	});
});
