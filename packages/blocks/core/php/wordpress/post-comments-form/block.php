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
			[
				'innerBlocks' => array_merge(
					[
						'elements/title'          => [
							'root' => '.comment-reply-title',
						],
						'elements/form'           => [
							'root' => '.comment-form',
						],
						'elements/notes'          => [
							'root' => '.comment-notes',
						],
						'elements/input-label'    => [
							'root' => 'label',
						],
						'elements/input'          => [
							'root' => 'input[type="text"],input[type="url"],input[type="email"]',
						],
						'elements/textarea'       => [
							'root' => 'textarea',
						],
						'elements/cookie-consent' => [
							'root' => '.comment-form-cookies-consent',
						],
					],
					blockera_load( 'inners.link', dirname( __DIR__ ) ),
					blockera_load( 'inners.button', dirname( __DIR__ ) ),
					blockera_load( 'inners.headings', dirname( __DIR__ ) ),
				),
			]
		),
	]
);
