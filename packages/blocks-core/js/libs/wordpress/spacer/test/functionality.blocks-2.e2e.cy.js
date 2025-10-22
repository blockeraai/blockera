/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Spacer Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Should not have inner blocks', () => {
		appendBlocks(`<!-- wp:spacer {"height":"200px"} -->
<div style="height:200px" aria-hidden="true" class="wp-block-spacer"></div>
<!-- /wp:spacer -->
		`);

		// Select target block
		cy.getBlock('core/spacer').click({ force: true });

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.checkBlockCardItems(['normal', 'hover']);

		//
		// 1. Edit Inner Blocks
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/spacer').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/spacer').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Check settings tab
		//
		cy.getByDataTest('settings-tab').click();

		// layout settings should be hidden
		cy.get('.block-editor-block-inspector').within(() => {
			cy.get('.components-tools-panel-header')
				.contains('Settings')
				.scrollIntoView()
				.should('not.be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-spacer').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
