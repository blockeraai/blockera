<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera-core/packages/blocks/js/wordpress/file
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'link'   => [
					'root' => 'a:not(.wp-element-button)',
				],
				'button' => [
					'root' => '.wp-block-button > .wp-element-button',
				],
			],
		],
	]
);
