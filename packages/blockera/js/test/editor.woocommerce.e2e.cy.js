/**
 * Blockera dependencies
 */
import {
	createPost,
	appendBlocks,
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

		cy.get('input[name="post_title"]').type('Product title', { delay: 0 });
		cy.get('input#publish').click();

		createPost();

		appendBlocks(`<!-- wp:woocommerce/product-collection {"queryId":48,"query":{"perPage":9,"pages":0,"offset":0,"postType":"product","order":"asc","orderBy":"title","search":"","exclude":[],"inherit":false,"taxQuery":{},"isProductCollectionBlock":true,"featured":false,"woocommerceOnSale":false,"woocommerceStockStatus":["instock","outofstock","onbackorder"],"woocommerceAttributes":[],"woocommerceHandPickedProducts":[],"filterable":false,"relatedBy":{"categories":true,"tags":true}},"tagName":"div","displayLayout":{"type":"flex","columns":3,"shrinkColumns":true},"dimensions":{"widthType":"fill"},"queryContextIncludes":["collection"],"__privatePreviewState":{"isPreview":false,"previewMessage":"Actual products will vary depending on the page being viewed."}} -->
<div class="wp-block-woocommerce-product-collection"><!-- wp:woocommerce/product-template -->
<!-- wp:woocommerce/product-image {"imageSizing":"thumbnail","isDescendentOfQueryLoop":true} /-->

<!-- wp:post-title {"textAlign":"center","level":3,"isLink":true,"style":{"spacing":{"margin":{"bottom":"0.75rem","top":"0"}}},"fontSize":"medium","__woocommerceNamespace":"woocommerce/product-collection/product-title"} /-->

<!-- wp:woocommerce/product-price {"isDescendentOfQueryLoop":true,"textAlign":"center","fontSize":"small"} /-->

<!-- wp:woocommerce/product-button {"textAlign":"center","isDescendentOfQueryLoop":true,"fontSize":"small"} /-->
<!-- /wp:woocommerce/product-template -->

<!-- wp:query-pagination {"blockeraCompatId":"111921216455","blockeraFlexLayout":{"value":{"direction":"row","alignItems":"","justifyContent":"center"}},"layout":{"type":"flex","justifyContent":"center"}} -->
<!-- wp:query-pagination-previous /-->

<!-- wp:query-pagination-numbers /-->

<!-- wp:query-pagination-next /-->
<!-- /wp:query-pagination -->

<!-- wp:woocommerce/product-collection-no-results -->
<!-- wp:group {"layout":{"type":"flex","orientation":"vertical","justifyContent":"center","flexWrap":"wrap"}} -->
<div class="wp-block-group"><!-- wp:paragraph {"fontSize":"medium"} -->
<p class="has-medium-font-size"><strong>No results found</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>You can try <a class="wc-link-clear-any-filters" href="#">clearing any filters</a> or head to our <a class="wc-link-stores-home" href="#">store's home</a></p>
<!-- /wp:paragraph --></div>
<!-- /wp:group -->
<!-- /wp:woocommerce/product-collection-no-results --></div>
<!-- /wp:woocommerce/product-collection -->`);

		cy.getBlock('woocommerce/product-price')
			.first()
			.should('be.visible')
			.click();

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
