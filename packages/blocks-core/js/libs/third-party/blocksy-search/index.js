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

export const BlocksySearch: BlockType = {
	name: 'blockeraBlocksySearch',
	targetBlock: 'blocksy/search',
	blockeraInnerBlocks: {
		'elements/input': {
			name: 'elements/input',
			label: __('Input', 'blockera'),
			description: __(
				'The input field inside the search block.',
				'blockera'
			),
			icon: <Icon icon="block-blocksy-search-input" iconSize="20" />,
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
			description: __(
				'The search button inside the search block.',
				'blockera'
			),
			icon: <Icon icon="block-blocksy-search-button" iconSize="20" />,
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
		'elements/filter': {
			name: 'elements/filter',
			label: __('Taxonomy Filter', 'blockera'),
			description: __(
				'The taxonomy filter inside the search block.',
				'blockera'
			),
			icon: <Icon icon="block-blocksy-search-filter" iconSize="20" />,
			settings: {
				force: true,
			},
		},
		'elements/result-dropdown': {
			name: 'elements/result-dropdown',
			label: __('Result Dropdown', 'blockera'),
			description: __(
				'The result dropdown inside the search block.',
				'blockera'
			),
			icon: (
				<Icon
					icon="block-blocksy-search-result-dropdown"
					iconSize="20"
				/>
			),
			settings: {
				force: true,
			},
		},
		'elements/result-link': {
			name: 'elements/result-link',
			label: __('Result Links', 'blockera'),
			description: __(
				'The links inside result dropdown of the search block.',
				'blockera'
			),
			icon: (
				<Icon icon="block-blocksy-search-result-link" iconSize="20" />
			),
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
	supports: {
		blockeraStyleEngineConfig: {
			blockeraBorderRadius: {
				all: '--theme-form-field-border-radius',
				topLeft: '--border-top-left-radius',
				topRight: '--border-top-right-radius',
				bottomLeft: '--border-bottom-left-radius',
				bottomRight: '--border-bottom-right-radius',
				for: 'master',
			},
		},
	},
};
