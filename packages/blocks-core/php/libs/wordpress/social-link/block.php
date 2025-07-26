<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/wordpress/social-link
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/item-icon' => [
					'root' => 'svg',
				],
				'blockera/elements/item-name' => [
					'root' => '.wp-block-social-link-label',
				],
			]
		),
	]
);
