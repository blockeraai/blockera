<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/php/third-party/blocksy-dynamic-data
 */

return array_merge(
	$args,
	[
		'selectors'  => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/link'   => [
					'root' => 'a',
				],
				'blockera/elements/image'   => [
					'root' => 'img',
				],
			]
		),
	]
);
