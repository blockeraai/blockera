<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/woocommerce/checkout-payment-block
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'blockera/core/heading'     => [
					'root' => '.wc-block-components-checkout-step__heading .wc-block-components-title',
				],
				'blockera/core/description' => [
					'root' => '.wc-block-components-checkout-step__description',
				],
			]
		),
	]
);
