// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const WooCommercePageContentWrapper: BlockType = {
	name: 'blockeraWooCommercePageContentWrapper',
	targetBlock: 'woocommerce/page-content-wrapper',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
