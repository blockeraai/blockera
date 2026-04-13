// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceOrderConfirmationBillingAddress: BlockType = {
	name: 'blockeraWooCommerceOrderConfirmationBillingAddress',
	targetBlock: 'woocommerce/order-confirmation-billing-address',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
