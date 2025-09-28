// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceProductButton: BlockType = {
	name: 'WooCommerceProductButton',
	targetBlock: 'woocommerce/product-button',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
