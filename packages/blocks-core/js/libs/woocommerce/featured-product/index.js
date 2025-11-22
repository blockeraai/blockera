// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceFeaturedProduct: BlockType = {
	name: 'blockeraWooCommerceFeaturedProduct',
	targetBlock: 'woocommerce/featured-product',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
