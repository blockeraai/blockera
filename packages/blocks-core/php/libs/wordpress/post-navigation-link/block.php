<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/post-navigation-link
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/link' => [
					'root' => 'a:not(.wp-element-button)',
				],
				'blockera/elements/arrow' => [
					'root' => '.wp-block-post-navigation-link__arrow-previous',
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
			]
		),
	]
);
