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
import sharedInnerBlocks from '../inners/shared';

export const NavigationOverlayClose: BlockType = {
	name: 'blockeraNavigationOverlayClose',
	targetBlock: 'core/navigation-overlay-close',
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
	},
	blockeraInnerBlocks: {
		'elements/bold': sharedInnerBlocks['elements/bold'],
		'elements/italic': sharedInnerBlocks['elements/italic'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
