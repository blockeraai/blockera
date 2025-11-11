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
				// Features selectors.
				'blockeraBoxSpacing' => '.wp-block-table',
				'blockeraWidth' => '.wp-block-table',
				'blockeraMinWidth' => '.wp-block-table',
				'blockeraMaxWidth' => '.wp-block-table',
				// Inner blocks selectors.
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
				'blockera/elements/bold' => [
					'root' => ':is(strong,b)',
				],
				'blockera/elements/italic' => [
					'root' => ':is(em,i)',
				],
				'blockera/elements/kbd' => [
					'root' => 'kbd',
				],
				'blockera/elements/code' => [
					'root' => 'code',
				],
				'blockera/elements/span' => [
					'root' => 'span',
				],
				'blockera/elements/mark' => [
					'root' => 'mark',
				],
			]
		),
	]
);
