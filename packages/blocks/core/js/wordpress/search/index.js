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
import type { BlockType } from '../../type';

export const Search: BlockType = {
	name: 'blockeraSearch',
	targetBlock: 'core/search',
	blockeraInnerBlocks: {
		'elements/label': {
			name: 'elements/label',
			type: 'title',
			label: __('Label', 'blockera'),
			description: __('The search form label element.', 'blockera'),
			icon: <Icon icon="block-search-label" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/input': {
			name: 'elements/input',
			label: __('Input', 'blockera'),
			description: __('The search form text input element.', 'blockera'),
			icon: <Icon icon="block-search-input" iconSize="20" />,
			settings: {
				force: true,
			},
			availableBlockStates: {
				...generalInnerBlockStates,
				focus: {
					...generalInnerBlockStates.focus,
					force: true,
				},
				placeholder: {
					...sharedBlockStates.placeholder,
					force: true,
				},
			},
		},
		'elements/button': {
			name: 'elements/button',
			label: __('Button', 'blockera'),
			description: __('The search form button element.', 'blockera'),
			icon: <Icon icon="block-search-button" iconSize="20" />,
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
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
