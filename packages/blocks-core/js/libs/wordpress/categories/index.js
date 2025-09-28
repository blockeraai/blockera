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
	generalInnerBlockStates,
	sharedBlockStates,
} from '@blockera/editor';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../../type';

export const Categories: BlockType = {
	name: 'blockeraCategories',
	targetBlock: 'core/categories',
	blockeraInnerBlocks: {
		'elements/term-item': {
			name: 'elements/term-item',
			label: __('Links', 'blockera'),
			description: __('All term links.', 'blockera'),
			icon: <Icon icon="block-list-item" iconSize="20" />,
			settings: {
				force: true,
			},
			availableBlockStates: {
				...generalInnerBlockStates,
				focus: {
					...generalInnerBlockStates.focus,
					force: true,
				},
				active: {
					...sharedBlockStates.active,
					force: true,
				},
				visited: sharedBlockStates.visited,
			},
		},
		'elements/list-item': {
			name: 'elements/list-item',
			label: __('Links Container', 'blockera'),
			description: __('All term links container elements.', 'blockera'),
			icon: <Icon icon="block-list-item-container" iconSize="20" />,
			settings: {
				force: true,
			},
			availableBlockStates: {
				...generalInnerBlockStates,
				marker: {
					...sharedBlockStates.marker,
					force: true,
				},
			},
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
