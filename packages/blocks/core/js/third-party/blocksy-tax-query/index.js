// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const BlocksyTaxQuery: BlockType = {
	name: 'blockeraBlocksyTaxQuery',
	targetBlock: 'blocksy/tax-query',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
