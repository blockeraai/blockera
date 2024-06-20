<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera-core/packages/blocks/js/wordpress/pullquote
 */

return array_merge(
	$args,
	[
		'selectors' => [
			'innerBlocks' => [
				'citation'  => [
					'root' => 'cite',
				],
				'paragraph' => [
					'root' => 'p',
				],
				'link'      => [
					'root' => 'a:not(.wp-element-button)',
				],
			],
		],
	]
);
