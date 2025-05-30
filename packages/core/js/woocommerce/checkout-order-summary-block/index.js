// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceCheckoutOrderSummaryBlock: BlockType = {
	name: 'blockeraWooCommerceCheckoutOrderSummaryBlock',
	targetBlock: 'woocommerce/checkout-order-summary-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
