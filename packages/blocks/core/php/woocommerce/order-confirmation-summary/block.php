<?php
/**
 * Configure block all arguments.
 *
 * @var array $args the block arguments!
 *
 * @package blockera/packages/blocks/js/woocommerce/order-confirmation-summary
 */

return array_merge(
	$args,
	[
		'selectors' => array_merge(
			$args['selectors'] ?? [],
			[
				'innerBlocks' => [
					'elements/item-container' => [
						'root' => '.wc-block-order-confirmation-summary-list-item',
					],
					'elements/item-title'     => [
						'root' => '.wc-block-order-confirmation-summary-list-item__key',
					],
					'elements/item-value'     => [
						'root' => 'wc-block-order-confirmation-summary-list-item__value',
					],
				],
			]
		),
	]
);
