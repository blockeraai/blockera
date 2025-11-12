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
				'blockeraSpacing' => [
					'root' => ' .wp-block-accordion-heading__toggle',
				],
				'blockera/elements/icon' => [
					'root' => '.wp-block-accordion-heading__toggle-icon',
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
					'root' => 'span:not([data-rich-text-placeholder])',
				],
				'blockera/elements/mark' => [
					'root' => ':is(mark,mark[class])',
				],
			],
		),
	]
);
