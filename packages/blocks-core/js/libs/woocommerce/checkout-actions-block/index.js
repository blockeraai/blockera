// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCheckoutActionsBlock: BlockType = {
	name: 'blockeraWooCommerceCheckoutActionsBlock',
	targetBlock: 'woocommerce/checkout-actions-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
