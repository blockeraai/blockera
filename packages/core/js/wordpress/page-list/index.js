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

export const PageList: BlockType = {
	name: 'blockeraPageList',
	targetBlock: 'core/page-list',
	blockeraInnerBlocks: {
		'elements/item': {
			name: 'elements/item',
			label: __('Items', 'blockera'),
			description: __('Item inside archives list.', 'blockera'),
			icon: <Icon icon="block-list-item" library="ui" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/item-marker': {
			name: 'elements/item-marker',
			label: __('Items Marker', 'blockera'),
			description: __('Marker of list items.', 'blockera'),
			icon: (
				<Icon
					icon="block-list-item-marker"
					library="ui"
					iconSize="20"
				/>
			),
			settings: {
				force: true,
			},
		},
		'elements/item-container': {
			name: 'elements/item-container',
			label: __('Item Container', 'blockera'),
			description: __('Container element of each item.', 'blockera'),
			icon: (
				<Icon
					icon="block-list-item-container"
					library="ui"
					iconSize="20"
				/>
			),
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
