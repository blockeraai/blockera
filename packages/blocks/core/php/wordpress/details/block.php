<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/details
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'paragraph' => [
					'root' => 'p',
				],
				'link'      => [
					'root' => 'a:not(.wp-element-button)',
				],
			],
		],
	]
);
