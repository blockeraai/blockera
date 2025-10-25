// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCartOrderSummaryTotalsBlock: BlockType = {
	name: 'blockeraWooCommerceCartOrderSummaryTotalsBlock',
	targetBlock: 'woocommerce/cart-order-summary-totals-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
