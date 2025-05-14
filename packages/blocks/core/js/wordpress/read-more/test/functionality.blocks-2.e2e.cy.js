/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Read More Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(`<!-- wp:read-more {"content":"Read more..."} /-->`);

		cy.getBlock('core/read-more').click();

		//
		// 1. Block supported is active
		//
		cy.get('.blockera-extension-block-card').should('be.visible');

		//
		// 2. No inner blocks
		//
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 3. Edit Block
		//

		//
		// 3.1. Block styles
		//
		cy.getBlock('core/read-more').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/read-more').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 4. Check settings tab
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
		// 5. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-read-more').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
