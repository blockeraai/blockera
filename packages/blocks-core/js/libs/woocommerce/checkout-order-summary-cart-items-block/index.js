// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCheckoutOrderSummaryCartItemsBlock: BlockType = {
	name: 'blockeraWooCommerceCheckoutOrderSummaryCartItemsBlock',
	targetBlock: 'woocommerce/checkout-order-summary-cart-items-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
