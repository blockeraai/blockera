/**
 * Blockera dependencies
 */
import { appendBlocks, createPost } from '@blockera/dev-cypress/js/helpers';

describe('core/icon → size variations support', () => {
	beforeEach(() => {
		createPost();
	});

	it('exposes Blockera size variation surface for core/icon', () => {
		appendBlocks(`<!-- wp:icon {"icon":"wordpress"} /-->`);

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
