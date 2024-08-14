<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/post-comments-form
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			(array) array_merge(
				[
					'blockera/elements/title'          => [
						'root' => '.comment-reply-title',
					],
					'blockera/elements/form'           => [
						'root' => '.comment-form',
					],
					'blockera/elements/notes'          => [
						'root' => '.comment-notes',
					],
					'blockera/elements/input-label'    => [
						'root' => 'label',
					],
					'blockera/elements/input'          => [
						'root' => 'input[type="text"],input[type="url"],input[type="email"]',
					],
					'blockera/elements/textarea'       => [
						'root' => 'textarea',
					],
					'blockera/elements/cookie-consent' => [
						'root' => '.comment-form-cookies-consent',
					],
				],
				blockera_load( 'inners.link', dirname( __DIR__ ) ),
				blockera_load( 'inners.button', dirname( __DIR__ ) ),
				blockera_load( 'inners.headings', dirname( __DIR__ ) ),
			)
		),
	]
);
