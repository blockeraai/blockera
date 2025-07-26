<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/woocommerce/product-price
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/elements/currency-symbol'     => [
					'root' => '.woocommerce-Price-currencySymbol',
				],
				'blockera/elements/sale-discount-price' => [
					'root' => 'del .woocommerce-Price-amount',
				],
				'blockera/elements/sale-normal-price'   => [
					'root' => 'ins .woocommerce-Price-amount',
				],
			]
		),
	]
);
