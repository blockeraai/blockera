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
	},
	availableBlockStates: {
		...generalBlockStates,
		'current-menu-item': {
			type: 'current-menu-item',
			label: __('Current Page', 'blockera'),
			category: 'special',
			tooltip: (
				<>
					<h5>{__('Is Current Page?', 'blockera')}</h5>
					<p>
						{__(
							'Activates if the block URL is the same as the current page.',
							'blockera'
						)}
					</p>
					<code style={{ margin: '5px 0' }}>
						<span style={{ opacity: '0.7' }}>.block</span>
						.current-menu-item
					</code>
				</>
			),
			breakpoints: {},
			priority: 10,
			force: true,
			settings: {
				color: 'var(--blockera-controls-states-color)',
			},
		},
		'current-menu-parent': {
			type: 'current-menu-parent',
			label: __('Current Page Parent', 'blockera'),
			category: 'special',
			tooltip: (
				<>
					<h5>{__('Is Current Page Parent?', 'blockera')}</h5>
					<p>
						{__(
							'Indicates that one of this item’s direct descendants is the current page.',
							'blockera'
						)}
					</p>
					<code style={{ margin: '5px 0' }}>
						<span style={{ opacity: '0.7' }}>.block</span>
						.current-menu-parent
					</code>
				</>
			),
			breakpoints: {},
			priority: 10,
			force: false,
			settings: {
				color: 'var(--blockera-controls-states-color)',
			},
		},
		'current-menu-ancestor': {
			type: 'current-menu-ancestor',
			label: __('Current Page Ancestor', 'blockera'),
			category: 'special',
			tooltip: (
				<>
					<h5>{__('Is Current Page Ancestor?', 'blockera')}</h5>
					<p>
						{__(
							'Indicates that one of this item’s descendants is the current page.',
							'blockera'
						)}
					</p>
					<code style={{ margin: '5px 0' }}>
						<span style={{ opacity: '0.7' }}>.block</span>
						.current-menu-ancestor
					</code>
				</>
			),
			breakpoints: {},
			priority: 10,
			force: false,
			settings: {
				color: 'var(--blockera-controls-states-color)',
			},
		},
		active: sharedBlockStates.active,
		visited: sharedBlockStates.visited,
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
