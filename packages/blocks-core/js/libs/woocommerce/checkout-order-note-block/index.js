// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceCheckoutOrderNoteBlock: BlockType = {
	name: 'blockeraWooCommerceCheckoutOrderNoteBlock',
	targetBlock: 'woocommerce/checkout-order-note-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
