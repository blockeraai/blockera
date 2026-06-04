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
});
