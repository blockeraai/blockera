<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/math
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/mi' => [
					'root' => 'mi',
				],
				'blockera/elements/mn' => [
					'root' => 'mn',
				],
				'blockera/elements/mo' => [
					'root' => 'mo',
				],
				'blockera/elements/mfrac' => [
					'root' => 'mfrac',
				],
				'blockera/elements/msup' => [
					'root' => 'msup',
				],
				'blockera/elements/msub' => [
					'root' => 'msub',
				],
			]
		),
	]
);
