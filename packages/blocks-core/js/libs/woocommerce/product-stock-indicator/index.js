// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceProductStockIndicator: BlockType = {
	name: 'blockeraWooCommerceProductStockIndicator',
	targetBlock: 'woocommerce/product-stock-indicator',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
