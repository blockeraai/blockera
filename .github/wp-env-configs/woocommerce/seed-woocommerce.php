<?php
/**
 * Seed the WooCommerce store data the Blockera E2E suite depends on.
 *
 * Run through `wp eval-file` from the `afterStart` hook of
 * `.github/wp-env-configs/woocommerce.json`. A stock WooCommerce install ships
 * no products, no product attributes and no reviews, which leaves a large part
 * of the WooCommerce block suite unable to render:
 *
 * - product blocks resolve `wc_get_product( $block->context['postId'] )`
 * - `woocommerce/product-sale-badge` needs `$product->is_on_sale()`
 * - `woocommerce/product-sku` needs a SKU
 * - `woocommerce/attribute-filter` renders a placeholder without `blockProps`
 *   unless the store has at least one global product attribute
 * - the reviews and featured blocks need a known product and product category
 *
 * Idempotent: re-running updates the same fixtures instead of duplicating them,
 * so `npm run env:start` can be repeated safely.
 *
 * @package Blockera
 */

if ( ! defined( 'WP_CLI' ) || ! WP_CLI ) {
	return;
}

if ( ! class_exists( 'WooCommerce' ) ) {
	WP_CLI::error( 'WooCommerce is not active; cannot seed E2E store data.' );
}

const BLOCKERA_E2E_PRODUCT_SKU      = 'blockera-e2e-product';
const BLOCKERA_E2E_PRODUCT_NAME     = 'Blockera E2E Product';
const BLOCKERA_E2E_CATEGORY_SLUG    = 'blockera-e2e-category';
const BLOCKERA_E2E_CATEGORY_NAME    = 'Blockera E2E Category';
const BLOCKERA_E2E_ATTRIBUTE_SLUG   = 'blockera-size';
const BLOCKERA_E2E_ATTRIBUTE_NAME   = 'Blockera Size';

/**
 * Resolve (or create) the E2E product category.
 *
 * @return int Term id.
 */
function blockera_e2e_seed_category(): int {
	$existing = get_term_by( 'slug', BLOCKERA_E2E_CATEGORY_SLUG, 'product_cat' );

	if ( $existing instanceof WP_Term ) {
		return (int) $existing->term_id;
	}

	$created = wp_insert_term(
		BLOCKERA_E2E_CATEGORY_NAME,
		'product_cat',
		array( 'slug' => BLOCKERA_E2E_CATEGORY_SLUG )
	);

	if ( is_wp_error( $created ) ) {
		WP_CLI::error( 'Failed to create product category: ' . $created->get_error_message() );
	}

	return (int) $created['term_id'];
}

/**
 * Resolve (or create) one global product attribute plus two terms.
 *
 * `woocommerce/attribute-filter` reads the store's global attributes through
 * `getSetting( 'attributes' )`; with an empty list its edit component returns a
 * placeholder that never spreads `useBlockProps`, so the block has no
 * `data-type` node for Cypress to select.
 *
 * @return array{id:int,taxonomy:string,term_ids:int[]} Attribute descriptor.
 */
function blockera_e2e_seed_attribute(): array {
	$taxonomy     = wc_attribute_taxonomy_name( BLOCKERA_E2E_ATTRIBUTE_SLUG );
	$attribute_id = wc_attribute_taxonomy_id_by_name( $taxonomy );

	if ( ! $attribute_id ) {
		$attribute_id = wc_create_attribute(
			array(
				'name'         => BLOCKERA_E2E_ATTRIBUTE_NAME,
				'slug'         => BLOCKERA_E2E_ATTRIBUTE_SLUG,
				'type'         => 'select',
				'order_by'     => 'menu_order',
				'has_archives' => true,
			)
		);

		if ( is_wp_error( $attribute_id ) ) {
			WP_CLI::error( 'Failed to create product attribute: ' . $attribute_id->get_error_message() );
		}
	}

	// The taxonomy is registered on `init` from the attribute table, so a
	// freshly created attribute is not registered yet in this request.
	if ( ! taxonomy_exists( $taxonomy ) ) {
		register_taxonomy(
			$taxonomy,
			array( 'product' ),
			array(
				'hierarchical' => false,
				'show_ui'      => false,
				'query_var'    => true,
				'rewrite'      => false,
			)
		);
	}

	$term_ids = array();

	foreach ( array( 'Small', 'Large' ) as $term_name ) {
		$term = get_term_by( 'name', $term_name, $taxonomy );

		if ( ! $term instanceof WP_Term ) {
			$term = wp_insert_term( $term_name, $taxonomy );

			if ( is_wp_error( $term ) ) {
				WP_CLI::error( 'Failed to create attribute term: ' . $term->get_error_message() );
			}

			$term_ids[] = (int) $term['term_id'];
			continue;
		}

		$term_ids[] = (int) $term->term_id;
	}

	return array(
		'id'       => (int) $attribute_id,
		'taxonomy' => $taxonomy,
		'term_ids' => $term_ids,
	);
}

/**
 * Resolve (or create) the E2E product: published, on sale, with a SKU,
 * a category, and the seeded attribute.
 *
 * @param int   $category_id Product category term id.
 * @param array $attribute   Attribute descriptor from `blockera_e2e_seed_attribute()`.
 *
 * @return int Product id.
 */
function blockera_e2e_seed_product( int $category_id, array $attribute ): int {
	$product_id = wc_get_product_id_by_sku( BLOCKERA_E2E_PRODUCT_SKU );
	$product    = $product_id ? wc_get_product( $product_id ) : new WC_Product_Simple();

	$product->set_name( BLOCKERA_E2E_PRODUCT_NAME );
	$product->set_status( 'publish' );
	$product->set_sku( BLOCKERA_E2E_PRODUCT_SKU );
	$product->set_regular_price( '20' );
	$product->set_sale_price( '10' );
	$product->set_description( 'Product description used by the Blockera WooCommerce E2E suite.' );
	$product->set_short_description( 'Blockera E2E product summary.' );
	$product->set_category_ids( array( $category_id ) );
	$product->set_manage_stock( false );
	$product->set_stock_status( 'instock' );
	$product->set_reviews_allowed( true );

	$product_attribute = new WC_Product_Attribute();
	$product_attribute->set_id( $attribute['id'] );
	$product_attribute->set_name( $attribute['taxonomy'] );
	$product_attribute->set_options( $attribute['term_ids'] );
	$product_attribute->set_visible( true );
	$product_attribute->set_variation( false );

	$product->set_attributes( array( $product_attribute ) );

	$product_id = $product->save();

	if ( ! $product_id ) {
		WP_CLI::error( 'Failed to save the E2E product.' );
	}

	return (int) $product_id;
}

/**
 * Ensure the seeded product carries one approved review.
 *
 * `woocommerce/product-rating-counter` and `product-average-rating` only render
 * when the product review count is greater than zero.
 *
 * @param int $product_id Product id.
 */
function blockera_e2e_seed_review( int $product_id ): void {
	$existing = get_comments(
		array(
			'post_id' => $product_id,
			'number'  => 1,
			'fields'  => 'ids',
		)
	);

	if ( ! empty( $existing ) ) {
		return;
	}

	$comment_id = wp_insert_comment(
		array(
			'comment_post_ID'      => $product_id,
			'comment_author'       => 'Blockera Reviewer',
			'comment_author_email' => 'reviewer@blockera.ai',
			'comment_content'      => 'Seeded review for the Blockera WooCommerce E2E suite.',
			'comment_type'         => 'review',
			'comment_approved'     => 1,
		)
	);

	if ( ! $comment_id ) {
		WP_CLI::error( 'Failed to create the seeded product review.' );
	}

	update_comment_meta( $comment_id, 'rating', 5 );

	if ( class_exists( 'WC_Comments' ) ) {
		WC_Comments::clear_transients( $product_id );
	}
}

$blockera_e2e_category_id = blockera_e2e_seed_category();
$blockera_e2e_attribute   = blockera_e2e_seed_attribute();
$blockera_e2e_product_id  = blockera_e2e_seed_product( $blockera_e2e_category_id, $blockera_e2e_attribute );

blockera_e2e_seed_review( $blockera_e2e_product_id );

// Keep permalinks resolvable for front-end assertions right after seeding.
flush_rewrite_rules( false );

WP_CLI::success(
	sprintf(
		'Seeded WooCommerce E2E data — product #%d (sku %s), category #%d, attribute %s.',
		$blockera_e2e_product_id,
		BLOCKERA_E2E_PRODUCT_SKU,
		$blockera_e2e_category_id,
		$blockera_e2e_attribute['taxonomy']
	)
);
