// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceProductImageGallery: BlockType = {
	name: 'blockeraWooCommerceProductImageGallery',
	targetBlock: 'woocommerce/product-image-gallery',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
