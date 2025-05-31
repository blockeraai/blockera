// @flow

/**
 * Blockera dependencies
 */
import {
	SharedBlockExtension,
	generalBlockStates,
	sharedBlockStates,
} from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const WooCommerceAddToCartForm: BlockType = {
	name: 'blockeraWooCommerceAddToCartForm',
	targetBlock: 'woocommerce/add-to-cart-form',
	availableBlockStates: {
		...generalBlockStates,
		focus: {
			...generalBlockStates.focus,
			force: true,
		},
		active: {
			...sharedBlockStates.active,
			force: true,
		},
		visited: sharedBlockStates.visited,
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
