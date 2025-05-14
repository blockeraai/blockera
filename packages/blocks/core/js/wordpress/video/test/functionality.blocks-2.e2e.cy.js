/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Video Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(`
<!-- wp:video {"id":364} -->
<figure class="wp-block-video"><video controls src="https://blockera.ai/video.mp4"></video></figure>
<!-- /wp:video -->`);

		cy.getBlock('core/video').click();

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// No inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 1. Edit Block
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/video').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/video').should(
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
				.should('be.visible');
		});

		//
		// 3. Assert inner blocks selectors in front end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-video').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
