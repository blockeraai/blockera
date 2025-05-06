// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const PostDate: BlockType = {
	name: 'blockeraPostDate',
	targetBlock: 'core/post-date',
	blockeraInnerBlocks: {
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			settings: {
				...sharedInnerBlocks['elements/link'].settings,
				force: false,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
