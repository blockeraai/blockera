<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/accordion-heading
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/icon' => [
					'root' => '.wp-block-accordion-heading__toggle-icon',
				],
				'blockera/elements/bold' => [
					'root' => 'strong, b',
				],
				'blockera/elements/italic' => [
					'root' => 'em, i',
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
			],
		),
	]
);
