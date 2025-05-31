// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceCartOrderSummaryFeeBlock: BlockType = {
	name: 'blockeraWooCommerceCartOrderSummaryFeeBlock',
	targetBlock: 'woocommerce/cart-order-summary-fee-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
