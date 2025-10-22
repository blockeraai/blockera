// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceCartOrderSummarySubtotalsBlock: BlockType = {
	name: 'blockeraWooCommerceCartOrderSummarySubtotalsBlock',
	targetBlock: 'woocommerce/cart-order-summary-subtotal-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
