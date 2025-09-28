// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../../wordpress/inners/shared';
import type { BlockType } from '../../../type';

export const WooCommerceProductCategories: BlockType = {
	name: 'blockeraWooCommerceProductCategories',
	targetBlock: 'woocommerce/product-categories',
	blockeraInnerBlocks: {
		'elements/link': sharedInnerBlocks['elements/link'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
