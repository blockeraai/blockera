<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/rss
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'innerBlocks' => [
					'elements/container' => [
						'root' => '.wp-block-rss__item',
					],
					'elements/title'     => [
						'root' => '.wp-block-rss__item-title',
					],
					'elements/date'      => [
						'root' => '.wp-block-rss__item-publish-date',
					],
					'elements/author'    => [
						'root' => '.wp-block-rss__item-author',
					],
					'elements/excerpt'   => [
						'root' => '.wp-block-rss__item-excerpt',
					],
				],
			]
		),
	]
);
