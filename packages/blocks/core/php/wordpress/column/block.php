<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/column
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'paragraph' => [
					'root' => 'p',
				],
				'link'      => [
					'root' => 'a:not(.wp-element-button)',
				],
				'button'    => [
					'root' => '.wp-block-button > .wp-element-button',
				],
				'heading'   => [
					'root' => 'h1.wp-block-heading, h2.wp-block-heading, h3.wp-block-heading, h4.wp-block-heading, h5.wp-block-heading, h6.wp-block-heading',
				],
				'heading1'  => [
					'root' => 'h1.wp-block-heading',
				],
				'heading2'  => [
					'root' => 'h2.wp-block-heading',
				],
				'heading3'  => [
					'root' => 'h3.wp-block-heading',
				],
				'heading4'  => [
					'root' => 'h4.wp-block-heading',
				],
				'heading5'  => [
					'root' => 'h5.wp-block-heading',
				],
				'heading6'  => [
					'root' => 'h6.wp-block-heading',
				],
			],
		],
	]
);
