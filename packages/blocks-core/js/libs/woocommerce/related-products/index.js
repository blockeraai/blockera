// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceRelatedProducts: BlockType = {
	name: 'blockeraWooCommerceRelatedProducts',
	targetBlock: 'woocommerce/related-products',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
