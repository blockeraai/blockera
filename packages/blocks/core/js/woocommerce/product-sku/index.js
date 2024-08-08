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

export const WooCommerceProductSKU: BlockType = {
	name: 'blockeraWooCommerceProductSKU',
	targetBlock: 'woocommerce/product-sku',
	blockeraInnerBlocks: {
		'elements/sku': {
			name: 'elements/sku',
			label: __('SKU Value', 'blockera'),
			icon: <Icon icon="sku" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
