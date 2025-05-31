// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceCartOrderSummaryTaxesBlock: BlockType = {
	name: 'blockeraWooCommerceCartOrderSummaryTaxesBlock',
	targetBlock: 'woocommerce/cart-order-summary-taxes-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
