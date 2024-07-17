<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/post-comments-form
 */

$inputs = blockera_load( 'inners.inputs', dirname( __DIR__ ) );

// We not needs to "elements/remember" selectors inside post-comment-form block!
unset( $inputs['elements/remember'] );

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				...$inputs,
				'elements/title'          => [
					'root' => '.comment-reply-title',
				],
				'elements/form'           => [
					'root' => '.comment-form',
				],
				'elements/notes'          => [
					'root' => '.comment-notes',
				],
				'elements/textarea'       => [
					'root' => 'textarea',
				],
				'elements/cookie-consent' => [
					'root' => '.comment-form-cookies-consent',
				],
				...blockera_load( 'inners.link', dirname( __DIR__ ) ),
				...blockera_load( 'inners.button', dirname( __DIR__ ) ),
				...blockera_load( 'inners.headings', dirname( __DIR__ ) ),
			],
		],
	]
);
