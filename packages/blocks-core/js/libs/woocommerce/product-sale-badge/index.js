// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceProductSaleBadge: BlockType = {
	name: 'WooCommerceProductSaleBadge',
	targetBlock: 'woocommerce/product-sale-badge',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
