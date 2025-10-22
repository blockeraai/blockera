// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceCartOrderSummaryShippingBlock: BlockType = {
	name: 'blockeraWooCommerceCartOrderSummaryShippingBlock',
	targetBlock: 'woocommerce/cart-order-summary-shipping-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
