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
import sharedInnerBlocks from '../inners/shared';

export const ListItem: BlockType = {
	name: 'blockeraListItem',
	targetBlock: 'core/list-item',
	blockeraInnerBlocks: {
		'elements/link': sharedInnerBlocks['elements/link'],
	},
	availableBlockStates: {
		...generalBlockStates,
		marker: {
			...sharedBlockStates.marker,
			force: true,
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	blockFeatures: {
		icon: {
			status: true,
			htmlEditable: {
				status: false,
			},
		},
	},
};
