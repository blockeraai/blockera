<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/woocommerce/checkout-shipping-methods-block
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'innerBlocks' => [
					'core/heading'     => [
						'root' => '.wc-block-components-checkout-step__heading .wc-block-components-title',
					],
					'core/description' => [
						'root' => '.wc-block-components-checkout-step__description',
					],
				],
			]
		),
	]
);
