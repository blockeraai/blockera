// @flow

/**
 * External dependencies
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
import type { BlockType } from '../../type';

export const Button: BlockType = {
	name: 'blockeraButton',
	targetBlock: 'core/button',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
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
	blockFeatures: {
		icon: {
			status: true,
			inspector: {
				status: true,
				extensions: {
					icon: {
						tabPosition: 'blockera-inspector-settings-start',
					},
				},
			},
			htmlEditable: {
				status: true,
				selector:
					'{{ BLOCK_SELECTOR }} div[role="textbox"][contenteditable="true"]',
			},
			contextualToolbar: {
				status: true,
				type: 'dropdown',
			},
		},
	},
};
