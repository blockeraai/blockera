// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceStockFilter: BlockType = {
	name: 'blockeraWooCommerceStockFilter',
	targetBlock: 'woocommerce/stock-filter',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
