// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceMiniCartTitleItemsCounterBlock: BlockType = {
	name: 'blockeraWooCommerceMiniCartTitleItemsCounterBlock',
	targetBlock: 'woocommerce/mini-cart-title-items-counter-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
