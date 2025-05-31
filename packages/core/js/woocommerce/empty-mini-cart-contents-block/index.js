// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceEmptyMiniCartContentsBlock: BlockType = {
	name: 'blockeraWooCommerceEmptyMiniCartContentsBlock',
	targetBlock: 'woocommerce/empty-mini-cart-contents-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
