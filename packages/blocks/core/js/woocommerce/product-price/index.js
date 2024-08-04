// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../../wordpress/inners/shared';
import type { BlockType } from '../../type';

export const WooCommerceProductPrice: BlockType = {
	name: 'blockeraWooCommerceProductPrice',
	targetBlock: 'woocommerce/product-price',
	blockeraInnerBlocks: {
		'elements/link': sharedInnerBlocks['elements/link'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
