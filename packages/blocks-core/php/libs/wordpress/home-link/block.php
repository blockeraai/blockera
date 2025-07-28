<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/home-link
 */

return array_merge(
	$args,
	[
		'attributes' => array_merge(
			$args['attributes'] ?? [],
			[
				'blockeraIconGap' => [
					'type'    => 'string',
					'default' => [
						'value' => '5px',
					],
				],
			]
		),
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/states/current-menu-item' => [
					'root' => '&.current-menu-item',
				], 
				'blockera/elements/link' => [
					'root' => '.wp-block-navigation-item__content',
				],
				'blockera/elements/icon' => [
					'root' => ' .wp-block-home-link__content .blockera-icon',
				],
				'htmlEditable' => [
					'root' => ' .wp-block-home-link__content',
				],
			]
		),
	]
);
