/**
 * Blockera dependencies
 */
import { appendBlocks, createPost } from '@blockera/dev-cypress/js/helpers';

describe('core/icon → size variations support', () => {
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

	it('exposes Blockera size variation surface for core/icon', () => {
		appendBlocks(`<!-- wp:icon {"icon":"wordpress"} -->
<div class="wp-block-icon"></div>
<!-- /wp:icon -->`);

		cy.getBlock('core/icon').first().click();

		cy.get('.blockera-extension-block-card').should('be.visible');

		cy.window().then((win) => {
			const extension = win.wp.data
				.select('blockera/extensions')
				.getBlockExtensionBy('targetBlock', 'core/icon');

			expect(extension?.hasSizeVariations).to.equal(true);
		});
	});
});
