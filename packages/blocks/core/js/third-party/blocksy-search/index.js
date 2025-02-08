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
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
