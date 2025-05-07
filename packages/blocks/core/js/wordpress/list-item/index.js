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

export const ListItem: BlockType = {
	name: 'blockeraListItem',
	targetBlock: 'core/list-item',
	blockeraInnerBlocks: {
		'elements/item-marker': {
			name: 'elements/item-marker',
			label: __('Marker', 'blockera'),
			description: __('Marker of list item.', 'blockera'),
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
		'elements/link': sharedInnerBlocks['elements/link'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
