// @flow
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

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

export const ReadMore: BlockType = {
	name: 'blockeraReadMore',
	targetBlock: 'core/read-more',
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
