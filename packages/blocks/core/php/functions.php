<?php

if ( ! function_exists( 'blockera_get_available_blocks' ) ) {
	/**
	 * Retrieve available blocks in blockera editor.
	 *
	 * @return array the available blocks stack.
	 */
	function blockera_get_available_blocks(): array {

		return [
			// Core Block Editor Blocks.
			'core/audio',
			'core/avatar',
			'core/button',
			'core/buttons',
			'core/categories',
			'core/code',
			'core/column',
			'core/columns',
			'core/comment-author-name',
			'core/comment-content',
			'core/comment-date',
			'core/comment-edit-link',
			'core/comment-reply-link',
			'core/comment-template',
			'core/comments',
			'core/comments-pagination',
			'core/comments-pagination-next',
			'core/comments-pagination-numbers',
			'core/comments-pagination-previous',
			'core/comments-title',
			'core/cover',
			'core/details',
			'core/embed',
			'core/file',
			'core/footnotes',
			'core/gallery',
			'core/group',
			'core/heading',
			'core/image',
			'core/latest-posts',
			'core/list',
			'core/list-item',
			'core/loginout',
			'core/media-text',
			'core/page-list',
			'core/paragraph',
			'core/post-author',
			'core/post-author-biography',
			'core/post-author-name',
			'core/post-comments-form',
			'core/post-content',
			'core/post-date',
			'core/post-excerpt',
			'core/post-featured-image',
			'core/post-navigation-link',
			'core/post-template',
			'core/post-terms',
			'core/post-title',
			'core/preformatted',
			'core/pullquote',
			'core/query-no-results',
			'core/query-pagination',
			'core/query-pagination-next',
			'core/query-pagination-numbers',
			'core/query-pagination-previous',
			'core/query-title',
			'core/quote',
			'core/read-more',
			'core/search',
			'core/separator',
			'core/site-logo',
			'core/site-tagline',
			'core/site-title',
			'core/social-link',
			'core/social-links',
			'core/table',
			'core/term-description',
			'core/verse',
			'core/video',

			// WooCommerce Blocks.
			'woocommerce/product-price',
		];
	}
}

if ( ! function_exists( 'blockera_get_shared_block_attributes' ) ) {
	/**
	 * Get blockera shared block attributes.
	 *
	 * @return array the shared block attributes.
	 */
	function blockera_get_shared_block_attributes(): array {

		return blockera_load( 'shared.attributes', __DIR__ );
	}
}
