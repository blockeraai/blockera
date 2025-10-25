// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCheckoutOrderSummaryCouponFormBlock: BlockType = {
	name: 'blockeraWooCommerceCheckoutOrderSummaryCouponFormBlock',
	targetBlock: 'woocommerce/checkout-order-summary-coupon-form-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
