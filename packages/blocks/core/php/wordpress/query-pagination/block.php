<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/query-pagination
 */

return array_merge(
	$args,
	[
		'attributes' => array_merge(
			$args['attributes'] ?? [],
			[
				'blockeraDisplay' => [
					'type'    => 'string',
					'default' => 'flex',
				],
			]
		),
		'selectors'  => array_merge(
			$args['selectors'] ?? [],
			[
				'innerBlocks' => [
					'link' => [
						'root' => 'a:not(.wp-element-button)',
					],
				],
			]
		),
	]
);
