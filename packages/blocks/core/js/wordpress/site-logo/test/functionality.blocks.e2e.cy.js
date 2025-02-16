/**
 * Blockera dependencies
 */
import {
	savePage,
	createPost,
	appendBlocks,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('Site Logo Block', () => {
	beforeEach(() => {
		createPost();
	});

	it('Functionality + inner blocks', () => {
		appendBlocks(`<!-- wp:site-logo /-->`);

		cy.getBlock('core/site-logo').click();

		//
		// Set logo
		//
		// cy.getIframeBody().within(() => {
		cy.wait(5000);

		cy.getBlock('core/site-logo').then(($body) => {
			if ($body.find('button[aria-label="Choose logo"]').length) {
				$body.find('button[aria-label="Choose logo"]').click();
			}
		});

		cy.get('body').then(($body) => {
			if ($body.find('#menu-item-upload').length) {
				$body.find('#menu-item-upload').click();

				cy.get('input[type="file"]').selectFile(
					'packages/dev-cypress/js/fixtures/test.jpg',
					{
						force: true,
					}
				);
				cy.get('.media-toolbar-primary > .button').click();
			}
		});

		// Block supported is active
		cy.get('.blockera-extension-block-card').should('be.visible');

		// No inner blocks
		cy.get('.blockera-extension.blockera-extension-inner-blocks').should(
			'not.exist'
		);

		//
		// 1. Edit block
		//

		//
		// 1.1. Block styles
		//
		cy.getBlock('core/site-logo').should(
			'have.css',
			'background-clip',
			'border-box'
		);

		cy.getParentContainer('Clipping').within(() => {
			cy.customSelect('Clip to Padding');
		});

		cy.getBlock('core/site-logo').should(
			'have.css',
			'background-clip',
			'padding-box'
		);

		// 2. Assert CSS selectors in front-end
		//
		savePage();
		redirectToFrontPage();

		cy.get('.blockera-block.wp-block-site-logo').should(
			'have.css',
			'background-clip',
			'padding-box'
		);
	});
});
