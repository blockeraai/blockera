// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceCheckoutOrderSummarySubtotalBlock: BlockType = {
	name: 'blockeraWooCommerceCheckoutOrderSummarySubtotalBlock',
	targetBlock: 'woocommerce/checkout-order-summary-subtotal-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
