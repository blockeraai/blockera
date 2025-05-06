<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/table
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/caption' => [
					'root' => '&& .wp-element-caption',
				],
				'blockera/elements/header-cells' => [
					'root' => 'thead th',
				],
				'blockera/elements/body-cells' => [
					'root' => 'tbody td',
				],
				'blockera/elements/footer-cells' => [
					'root' => 'tfoot td',
				],
			]
		),
	]
);
