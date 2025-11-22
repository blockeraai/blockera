// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCartOrderSummaryCouponFormBlock: BlockType = {
	name: 'blockeraWooCommerceCartOrderSummaryCouponFormBlock',
	targetBlock: 'woocommerce/cart-order-summary-coupon-form-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
