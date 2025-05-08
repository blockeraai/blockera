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
					'root' => '&& caption',
				],
				'blockera/elements/thead' => [
					'root' => '&& table thead',
				],
				'blockera/elements/thead-cells' => [
					'root' => '&& table thead th',
				],
				'blockera/elements/tbody' => [
					'root' => '&& table tbody',
				],
				'blockera/elements/tbody-cells' => [
					'root' => '&& table tbody td',
				],
				'blockera/elements/tbody-empty-cells' => [
					'root' => '&& table tbody td:is(.pad,[colspan])',
				],
				'blockera/elements/navigation-item' => [
					'root' => '&& .wp-calendar-nav a',
				],
			],
		),
	]
);
