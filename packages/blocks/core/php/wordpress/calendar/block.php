<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/calendar
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/caption' => [
					'root' => 'caption',
				],
				'blockera/elements/header' => [
					'root' => 'thead',
				],
				'blockera/elements/thead-cells' => [
					'root' => 'thead th',
				],
				'blockera/elements/tbody' => [
					'root' => 'tbody',
				],
				'blockera/elements/tbody-cells' => [
					'root' => 'tbody td',
				],
				'blockera/elements/tbody-empty-cells' => [
					'root' => 'tbody td.pad, tbody td[colspan]',
				],
				'blockera/elements/navigation-item' => [
					'root' => '.wp-calendar-nav a',
				],
			],
		),
	]
);
