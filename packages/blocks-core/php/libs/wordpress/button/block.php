<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/button
 */

return array_merge(
	$args,
	[
		'selectors'  => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/icon' => [
					'root' => ' .wp-block-button__link:before',
				],
				'htmlEditable' => [
					'root' => '.wp-block-button .wp-block-button__link',
				],
			]
		),
		'supports' => array_merge(
			$args['supports'] ?? [],
			[
				'blockFeatures' => [
					'icon' => [
						'status' => true,
						'htmlEditable' => [
							'status' => true,
						],
					],
				],
			],
		),
	]
);
