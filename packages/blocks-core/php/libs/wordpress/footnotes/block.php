<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/footnotes
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/link'        => [
					'root' => 'a:not(.wp-element-button):not(:last-child)',
				],
				'blockera/elements/jump-to-link'        => [
					'root' => 'a:not(.wp-element-button):last-child',
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
					'root' => 'span:not([data-rich-text-placeholder],[role="textbox"])',
				],
				'blockera/elements/mark' => [
					'root' => ':is(mark,mark[class])',
				],
			],
		),
	]
);
