<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/third-party/blocksy-breadcrumbs
 */

return array_merge(
	$args,
	[
		'selectors'  => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/links' => [
					'root' => 'span > span, a',
				],
				'blockera/elements/separator' => [
					'root' => 'svg',
				],
				'blockera/elements/text'   => [
					'root' => '> span, span[itemprop="name"]',
				],
			]
		),
	]
);
