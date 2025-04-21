// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceMiniCartTitleLabelBlock: BlockType = {
	name: 'blockeraWooCommerceMiniCartTitleLabelBlock',
	targetBlock: 'woocommerce/mini-cart-title-label-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
