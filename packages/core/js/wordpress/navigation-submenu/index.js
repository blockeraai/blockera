// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';
import sharedInnerBlocks from '../inners/shared';

export const NavigationSubmenu: BlockType = {
	name: 'blockeraNavigationSubmenu',
	targetBlock: 'core/navigation-submenu',
	blockeraInnerBlocks: {
		'elements/link': {
			name: 'elements/link',
			label: __('Parent Menu Link', 'blockera'),
			description: __('Parent menu link element.', 'blockera'),
			icon: <Icon icon="link" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/submenu-container': {
			name: 'elements/submenu-container',
			type: 'title',
			label: __('Submenu Container', 'blockera'),
			description: __('Container element of submenu items.', 'blockera'),
			icon: (
				<Icon
					icon="block-navigation-submenu-container"
					library="ui"
					iconSize="20"
				/>
			),
			settings: {
				force: true,
			},
		},
		'elements/submenu-items': {
			name: 'elements/submenu-items',
			type: 'title',
			label: __('Submenu Items', 'blockera'),
			description: __('Link items inside submenu.', 'blockera'),
			icon: (
				<Icon
					icon="block-navigation-submenu-items"
					library="ui"
					iconSize="20"
				/>
			),
			settings: {
				force: true,
			},
		},
		'elements/submenu-icon': {
			name: 'elements/submenu-icon',
			type: 'title',
			label: __('Submenu Icon', 'blockera'),
			description: __('Chevron down icon of submenu.', 'blockera'),
			icon: <Icon icon="chevron-down" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
