// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceOrderConfirmationAdditionalInformation: BlockType = {
	name: 'blockeraWooCommerceOrderConfirmationAdditionalInformation',
	targetBlock: 'woocommerce/order-confirmation-additional-information',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
