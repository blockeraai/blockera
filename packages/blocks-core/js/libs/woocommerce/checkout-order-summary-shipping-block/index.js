// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCheckoutOrderSummaryShippingBlock: BlockType = {
	name: 'blockeraWooCommerceCheckoutOrderSummaryShippingBlock',
	targetBlock: 'woocommerce/checkout-order-summary-shipping-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
