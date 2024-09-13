/**
 * Blockera dependencies
 */
import {
	createPost,
	getBlockType,
	addBlockToPost,
	getWPDataObject,
	getWindowProperty,
} from '@blockera/dev-cypress/js/helpers';

/**
 * Blockera editor bootstrap scenarios.
 * we should check ensure of added registration shared and specific block type attributes store apis is existing on blockerEditor_VERSION global variable.
 *
 * support 3rd party plugins block types. for example => 'woocommerce/product-price'
 */
describe('Blockera editor bootstrapper', () => {
	it('should added blockera supports on woocommerce/product-price', () => {
		createPost({ postType: 'product' });

		cy.get('input[name="post_title"]').type('Cap', { delay: 0 });
		cy.get('input#publish').click();

		createPost();

		addBlockToPost('woocommerce/all-products');

		cy.getBlock('woocommerce/all-products').click();

		cy.getByAriaLabel(`Edit the layout of each product`).click();

		cy.getBlock('woocommerce/product-price').should('be.visible').click();

		cy.getByAriaLabel('Add New Background').should('exist');

		getWPDataObject().then((data) => {
			expect(true).to.eq(
				getBlockType(
					data,
					'woocommerce/product-price'
				).attributes.hasOwnProperty('blockeraPropsId')
			);
		});
	});
});
