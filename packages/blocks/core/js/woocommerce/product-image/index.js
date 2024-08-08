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

export const WooCommerceProductImage: BlockType = {
	name: 'WooCommerceProductImage',
	targetBlock: 'woocommerce/product-image',
	blockeraInnerBlocks: {
		'elements/sale-badge': {
			name: 'elements/sale-badge',
			label: __('Sale Badge', 'blockera'),
			icon: <Icon icon="block-product-image-sale" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
