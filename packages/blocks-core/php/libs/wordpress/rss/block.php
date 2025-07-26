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
				'blockera/elements/container' => [
					'root' => '.wp-block-rss__item',
				],
				'blockera/elements/title'     => [
					'root' => '.wp-block-rss__item-title',
				],
				'blockera/elements/date'      => [
					'root' => '.wp-block-rss__item-publish-date',
				],
				'blockera/elements/author'    => [
					'root' => '.wp-block-rss__item-author',
				],
				'blockera/elements/excerpt'   => [
					'root' => '.wp-block-rss__item-excerpt',
				],
			]
		),
	]
);
