<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/woocommerce/product-image
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'innerBlocks' => [
					'elements/sale-badge' => [
						'root' => '.wc-block-components-product-sale-badge',
					],
				],
			]
		),
	]
);
