// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCartOrderSummaryBlock: BlockType = {
	name: 'blockeraWooCommerceCartOrderSummaryBlock',
	targetBlock: 'woocommerce/cart-order-summary-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
