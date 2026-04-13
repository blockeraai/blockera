// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceOrderConfirmationTotalsWrapper: BlockType = {
	name: 'blockeraWooCommerceOrderConfirmationTotalsWrapper',
	targetBlock: 'woocommerce/order-confirmation-totals-wrapper',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
