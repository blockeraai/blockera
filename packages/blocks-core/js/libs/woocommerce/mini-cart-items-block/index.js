// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceMiniCartItemsBlock: BlockType = {
	name: 'blockeraWooCommerceMiniCartItemsBlock',
	targetBlock: 'woocommerce/mini-cart-items-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
