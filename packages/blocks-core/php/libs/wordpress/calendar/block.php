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
				// States selectors.
				'blockera/states/before' => [
					'root' => '.wp-block-calendar::before',
				],
				'blockera/states/after' => [
					'root' => '.wp-block-calendar::after',
				],
				// Inner blocks selectors.
				'blockera/elements/link' => [
					'root' => '&& a',
				],
				'blockera/elements/caption' => [
					'root' => '&& caption',
				],
				'blockera/elements/thead' => [
					'root' => '&& table.wp-calendar-table thead',
				],
				'blockera/elements/thead-cells' => [
					'root' => '&& table.wp-calendar-table thead th',
				],
				'blockera/elements/tbody' => [
					'root' => '&& table.wp-calendar-table tbody',
				],
				'blockera/elements/tbody-link-cells' => [
					'root' => '&& table.wp-calendar-table tbody td:has(a)',
				],
				'blockera/elements/tbody-cells' => [
					'root' => '&& table.wp-calendar-table tbody td',
				],
				'blockera/elements/tbody-empty-cells' => [
					'root' => '&& table.wp-calendar-table tbody td:is(.pad,[colspan])',
				],
				'blockera/elements/navigation-item' => [
					'root' => '&& .wp-calendar-nav a',
				],
			],
		),
	]
);
