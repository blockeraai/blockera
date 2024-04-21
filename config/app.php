<?php

return [
	'root_url'   => BLOCKERA_CORE_URI,
	'root_path'  => BLOCKERA_CORE_PATH,
	'url'       => BLOCKERA_CORE_URI . '/app/',
	'path'      => BLOCKERA_CORE_PATH . '/app/',
	'name'      => 'blockera-core',
	'version'   => BLOCKERA_CORE_VERSION,
	'dist_url'  => BLOCKERA_CORE_URI . '/dist/',
	'dist_path' => BLOCKERA_CORE_PATH . '/dist/',
	'packages_url' => BLOCKERA_CORE_URI . '/packages/',
	'packages_path' => BLOCKERA_CORE_PATH . '/packages/',
	'namespaces'    => [
		'controllers' => '\Blockera\Framework\Http\Controllers\\',
	],
	'debug'     => blockera_core_env( 'APP_MODE' ) && 'development' === blockera_core_env( 'APP_MODE' ) || ( ( defined( 'WP_DEBUG' ) && WP_DEBUG ) ),
	'providers' => [
		\Blockera\Framework\Providers\StyleProviders::class,
		\Blockera\Framework\Providers\AssetsProvider::class,
		\Blockera\Framework\Providers\RestAPIProvider::class,
		\Blockera\Framework\Providers\AppServiceProvider::class,
	],
	'blocks'    => [
		'core/paragraph',
		'core/image',
		'core/heading',
		'core/gallery',
		'core/list',
		'core/list-item',
		'core/quote',
		'core/archives',
		'core/audio',
		'core/button',
		'core/buttons',
		'core/calendar',
		'core/categories',
		'core/code',
		'core/column',
		'core/columns',
		'core/cover',
		'core/details',
		'core/embed',
		'core/file',
		'core/group',
		'core/html',
		'core/latest-comments',
		'core/latest-posts',
		'core/media-text',
		'core/missing',
		'core/more',
		'core/nextpage',
		'core/page-list',
		'core/page-list-item',
		'core/pattern',
		'core/preformatted',
		'core/pullquote',
		'core/block',
		'core/rss',
		'core/search',
		'core/separator',
		'core/shortcode',
		'core/social-link',
		'core/social-links',
		'core/spacer',
		'core/table',
		'core/tag-cloud',
		'core/text-columns',
		'core/verse',
		'core/video',
		'core/footnotes',
		'core/navigation',
		'core/navigation-link',
		'core/navigation-submenu',
		'core/site-logo',
		'core/site-title',
		'core/site-tagline',
		'core/query',
		'core/template-part',
		'core/avatar',
		'core/post-title',
		'core/post-excerpt',
		'core/post-featured-image',
		'core/post-content',
		'core/post-author',
		'core/post-author-name',
		'core/post-date',
		'core/post-terms',
		'core/post-navigation-link',
		'core/post-template',
		'core/query-pagination',
		'core/query-pagination-next',
		'core/query-pagination-numbers',
		'core/query-pagination-previous',
		'core/query-no-results',
		'core/read-more',
		'core/comments',
		'core/comment-author-name',
		'core/comment-content',
		'core/comment-date',
		'core/comment-edit-link',
		'core/comment-reply-link',
		'core/comment-template',
		'core/comments-title',
		'core/comments-pagination',
		'core/comments-pagination-next',
		'core/comments-pagination-numbers',
		'core/comments-pagination-previous',
		'core/post-comments-form',
		'core/home-link',
		'core/loginout',
		'core/term-description',
		'core/query-title',
		'core/post-author-biography',
		'core/legacy-widget',
		'core/widget-group',
	],
];
