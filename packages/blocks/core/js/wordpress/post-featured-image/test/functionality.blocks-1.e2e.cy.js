/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Post Featured Image Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + Inner blocks', () => {
		//
		// Set a featured image
		//
		cy.openDocumentSettingsSidebar('Page');
		cy.get('button').contains('Set featured image').click();
		cy.get('#menu-item-upload').click();
		cy.get('input[type="file"]').selectFile(
			'packages/dev-cypress/js/fixtures/test.jpg',
			{
				force: true,
			}
		);
		cy.get('.media-toolbar-primary > .button').click();

		//
		// Add block
		//
		appendBlocks(`<!-- wp:post-featured-image /-->`);

		cy.getBlock('core/post-featured-image').click();

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
		// 1.0. Block Styles
		//

		cy.getBlock('core/post-featured-image').should(
			'not.have.css',
			'background-clip',
			'padding-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/post-featured-image').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		//
		// 2. Check settings tab
		//
		cy.getByDataTest('settings-tab').click();

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

		cy.get('.wp-block-post-featured-image.blockera-block').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
