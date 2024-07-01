<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/buttons
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'button' => [
					'root' => '.wp-block-button > .wp-element-button',
				],
			],
		],
	]
);
