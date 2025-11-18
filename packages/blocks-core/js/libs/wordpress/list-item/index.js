// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Icon } from '@blockera/icons';

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

export const ListItem: BlockType = {
	name: 'blockeraListItem',
	targetBlock: 'core/list-item',
	blockeraInnerBlocks: {
		'elements/item': {
			name: 'elements/item',
			label: __('List Items', 'blockera'),
			description: __('Items inside list.', 'blockera'),
			icon: <Icon icon="block-list-item" library="ui" iconSize="20" />,
			availableBlockStates: {
				...generalBlockStates,
				marker: {
					...sharedBlockStates.marker,
					force: true,
				},
			},
		},
		'elements/link': sharedInnerBlocks['elements/link'],
		'elements/bold': sharedInnerBlocks['elements/bold'],
		'elements/italic': sharedInnerBlocks['elements/italic'],
		'elements/kbd': sharedInnerBlocks['elements/kbd'],
		'elements/code': sharedInnerBlocks['elements/code'],
		'elements/span': sharedInnerBlocks['elements/span'],
		'elements/mark': sharedInnerBlocks['elements/mark'],
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
			inspector: {
				innerBlocks: {
					items: {
						'elements/icon': {
							availableBlockStates: {},
						},
					},
				},
			},
		},
	},
};
