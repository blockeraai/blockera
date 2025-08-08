// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceOrderConfirmationStatus: BlockType = {
	name: 'blockeraWooCommerceOrderConfirmationStatus',
	targetBlock: 'woocommerce/order-confirmation-status',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
