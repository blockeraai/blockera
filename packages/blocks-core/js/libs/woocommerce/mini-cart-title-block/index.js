// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceMiniCartTitleBlock: BlockType = {
	name: 'blockeraWooCommerceMiniCartTitleBlock',
	targetBlock: 'woocommerce/mini-cart-title-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
