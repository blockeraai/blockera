// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceOrderConfirmationDownloads: BlockType = {
	name: 'blockeraWooCommerceOrderConfirmationDownloads',
	targetBlock: 'woocommerce/order-confirmation-downloads',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
