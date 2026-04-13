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
	sharedBlockStates,
	generalBlockStates,
} from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../../type';

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
