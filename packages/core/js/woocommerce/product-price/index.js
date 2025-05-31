// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceProductPrice: BlockType = {
	name: 'blockeraWooCommerceProductPrice',
	targetBlock: 'woocommerce/product-price',
	blockeraInnerBlocks: {
		'elements/currency-symbol': {
			name: 'elements/currency-symbol',
			label: __('Currency Symbol', 'blockera'),
			description: __('The currency symbol of prices.', 'blockera'),
			icon: (
				<Icon
					icon="block-product-price-currency-symbol"
					library="ui"
					iconSize="20"
				/>
			),
			settings: {
				force: true,
			},
		},
		'elements/sale-discount-price': {
			name: 'elements/sale-discount-price',
			label: __('Sale: Discount Price', 'blockera'),
			description: __('The discounted price element.', 'blockera'),
			icon: <Icon icon="block-product-price-discount" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/sale-normal-price': {
			name: 'elements/sale-normal-price',
			label: __('Sale: Normal Price', 'blockera'),
			description: __(
				'The normal price while product have discount.',
				'blockera'
			),
			icon: <Icon icon="block-product-price-normal" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
