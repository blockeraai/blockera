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
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const List: BlockType = {
	name: 'blockeraList',
	targetBlock: 'core/list',
	blockeraInnerBlocks: {
		'elements/item': {
			name: 'elements/item',
			label: __('List Items', 'blockera'),
			description: __('Items inside list.', 'blockera'),
			icon: <Icon icon="block-list-item" library="ui" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/item-marker': {
			name: 'elements/item-marker',
			label: __('Markers', 'blockera'),
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
