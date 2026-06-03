<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/breadcrumbs
 */

return array_merge(
	$args,
	[
		'attributes' => array_merge(
			$args['attributes'] ?? [],
			[
				'blockeraDisplay' => [
					'type'    => 'string',
					'default' => [
						'value' => 'flex',
					],
				],
			]
		),
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				// Layout selectors.
				'layout' => '.wp-block-breadcrumbs ol',
				// Inner blocks selectors.
				'blockera/elements/trail-item' => [
					'root' => 'ol li :is(a, span[aria-current="page"])',
				],
				'blockera/elements/separator' => [
					'root' => 'ol li:not(:last-child)::after',
				],
				'blockera/elements/current-trail-item' => [
					'root' => 'ol li:last-child span[aria-current="page"]',
				],
			]
		),
	]
);
