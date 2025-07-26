// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceOrderConfirmationBillingWrapper: BlockType = {
	name: 'blockeraWooCommerceOrderConfirmationBillingWrapper',
	targetBlock: 'woocommerce/order-confirmation-billing-wrapper',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
