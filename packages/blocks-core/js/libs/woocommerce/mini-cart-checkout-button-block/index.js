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
import type { BlockType } from '../../../type';

export const WooCommerceMiniCartCheckoutButtonBlock: BlockType = {
	name: 'blockeraWooCommerceMiniCartCheckoutButtonBlock',
	targetBlock: 'woocommerce/mini-cart-checkout-button-block',
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
