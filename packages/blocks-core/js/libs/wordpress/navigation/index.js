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
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const Navigation: BlockType = {
	name: 'blockeraNavigation',
	targetBlock: 'core/navigation',
	blockeraInnerBlocks: {
		'elements/link-items': {
			name: 'elements/link-items',
			label: __('Link Items', 'blockera'),
			description: __(
				'Top-level navigation items (links, home link, submenus). Does not affect nested submenu children.',
				'blockera'
			),
			icon: (
				<Icon
					icon="block-navigation-items"
					library="ui"
					iconSize="20"
				/>
			),
			settings: {
				force: true,
			},
			availableBlockStates: {
				...generalBlockStates,
				focus: {
					...generalBlockStates.focus,
					force: true,
				},
				'current-menu-item': {
					...sharedBlockStates['current-menu-item'],
					force: true,
				},
				'current-menu-parent': sharedBlockStates['current-menu-parent'],
				'current-menu-ancestor':
					sharedBlockStates['current-menu-ancestor'],
				active: sharedBlockStates.active,
				visited: sharedBlockStates.visited,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
