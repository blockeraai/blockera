// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommerceFilledCartBlock: BlockType = {
	name: 'blockeraWooCommerceFilledCartBlock',
	targetBlock: 'woocommerce/filled-cart-block',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
