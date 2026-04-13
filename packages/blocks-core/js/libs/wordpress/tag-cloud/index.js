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

export const TagCloud: BlockType = {
	name: 'blockeraTagCloud',
	targetBlock: 'core/tag-cloud',
	blockeraInnerBlocks: {
		'elements/tag-link': {
			name: 'elements/tag-link',
			label: __('Tag Items', 'blockera'),
			description: __('All tag items inside tag cloud.', 'blockera'),
			icon: <Icon icon="tag" library="wp" iconSize="20" />,
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
		'elements/tag-link-count': {
			name: 'elements/tag-link-count',
			label: __('Tag Counts', 'blockera'),
			description: __('All tag counts inside tag items.', 'blockera'),
			icon: <Icon icon="term-count" library="wp" iconSize="20" />,
			settings: {
				force: true,
			},
		},
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	selectors: {
		// in editor the main tag is inside following selector as block is rendering dynamically.
		layout: ' .wp-block-tag-cloud',
		// States selectors.
		'blockera/states/before': {
			root: ' .wp-block-tag-cloud::before',
		},
		'blockera/states/after': {
			root: ' .wp-block-tag-cloud::after',
		},
	},
};
