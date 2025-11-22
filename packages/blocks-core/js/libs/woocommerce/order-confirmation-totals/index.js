// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceOrderConfirmationTotals: BlockType = {
	name: 'blockeraWooCommerceOrderConfirmationTotals',
	targetBlock: 'woocommerce/order-confirmation-totals',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
