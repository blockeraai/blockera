<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/post-terms
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'link'      => [
					'root' => 'a:not(.wp-element-button)',
				],
				'separator' => [
					'root' => '.wp-block-post-terms__separator',
				],
				'prefix'    => [
					'root' => '.wp-block-post-terms__prefix',
				],
				'suffix'    => [
					'root' => '.wp-block-post-terms__suffix',
				],
			],
		],
	]
);
