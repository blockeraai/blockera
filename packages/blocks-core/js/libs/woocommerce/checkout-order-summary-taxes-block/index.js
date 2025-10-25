// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCheckoutOrderSummaryTaxesBlock: BlockType = {
	name: 'blockeraWooCommerceCheckoutOrderSummaryTaxesBlock',
	targetBlock: 'woocommerce/checkout-order-summary-taxes-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
