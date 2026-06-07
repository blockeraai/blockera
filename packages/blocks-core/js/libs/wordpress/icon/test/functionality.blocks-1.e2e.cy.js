/**
 * Blockera dependencies
 */
import {
	appendBlocks,
	createPost,
	savePage,
	redirectToFrontPage,
} from '@blockera/dev-cypress/js/helpers';

describe('core/icon Block', () => {
	before(function () {
		cy.window().then((win) => {
			const blockTypes = win.wp?.blocks?.getBlockTypes?.() || [];
			const hasCoreIcon = blockTypes.some(
				(block) => block.name === 'core/icon'
			);

			if (!hasCoreIcon) {
				this.skip();
			}
		});
	});

	beforeEach(() => {
		createPost();
	});

	it('Blockera extension, icon panel, and frontend SVG output', () => {
		appendBlocks(`<!-- wp:icon {"icon":"wordpress"} -->
<div class="wp-block-icon"></div>
<!-- /wp:icon -->`);

		cy.getBlock('core/icon').first().click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.get('.blockera-extension-icon').should('be.visible');

		cy.get('.blockera-extension-icon').click();

		cy.get('.blockera-control-icon').should('be.visible');

		savePage();
		redirectToFrontPage();

		cy.get('.wp-block-icon svg').should('exist');
	});

	it('block toolbar opens Blockera icon picker and updates canvas', () => {
		appendBlocks(`<!-- wp:icon -->
<div class="wp-block-icon"></div>
<!-- /wp:icon -->`);

		cy.getBlock('core/icon').first().click();

		cy.get('.block-editor-block-toolbar')
			.contains('button', 'Choose icon')
			.click();

		cy.get('.blockera-control-icon-picker-modal').should('be.visible');

		cy.get('.blockera-control-icon-control-icon')
			.not('.blockera-is-pro-icon')
			.first()
			.click();

		cy.get('.blockera-control-icon-picker-modal').should('not.exist');

		cy.get('.wp-block-icon svg').should('exist');
	});
});
