// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommercePriceFilter: BlockType = {
	name: 'blockeraWooCommercePriceFilter',
	targetBlock: 'woocommerce/price-filter',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
