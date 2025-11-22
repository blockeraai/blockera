<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/embed
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'root' => ' .wp-block-embed__wrapper',
				'spacing' => '.wp-block-embed',
				'layout' => '.wp-block-embed',
				'effects' => '.wp-block-embed',
				'position' => '.wp-block-embed',
				'blockera/elements/caption' => [
					'root' => '&& figcaption',
				],
			]
		),
	]
);
