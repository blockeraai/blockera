// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceEmptyCartBlock: BlockType = {
	name: 'blockeraWooCommerceEmptyCartBlock',
	targetBlock: 'woocommerce/empty-cart-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
