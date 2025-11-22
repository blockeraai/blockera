// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCheckoutOrderSummaryDiscountBlock: BlockType = {
	name: 'blockeraWooCommerceCheckoutOrderSummaryDiscountBlock',
	targetBlock: 'woocommerce/checkout-order-summary-discount-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
