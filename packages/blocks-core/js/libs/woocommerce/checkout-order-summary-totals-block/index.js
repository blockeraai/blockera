// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceCheckoutOrderSummaryTotalsBlock: BlockType = {
	name: 'blockeraWooCommerceCheckoutOrderSummaryTotalsBlock',
	targetBlock: 'woocommerce/checkout-order-summary-totals-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
