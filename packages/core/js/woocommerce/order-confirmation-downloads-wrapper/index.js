// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceOrderConfirmationDownloadsWrapper: BlockType = {
	name: 'blockeraWooCommerceOrderConfirmationDownloadsWrapper',
	targetBlock: 'woocommerce/order-confirmation-downloads-wrapper',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
