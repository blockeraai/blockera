// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceCheckoutOrderSummaryFeeBlock: BlockType = {
	name: 'blockeraWooCommerceCheckoutOrderSummaryFeeBlock',
	targetBlock: 'woocommerce/checkout-order-summary-fee-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
