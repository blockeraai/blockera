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
import { generalInnerBlockStates, sharedBlockStates } from '@blockera/editor';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../../type';

export const Footnotes: BlockType = {
	name: 'blockeraFootnotes',
	targetBlock: 'core/footnotes',
	blockeraInnerBlocks: {
		'elements/jump-to-link': {
			name: 'elements/jump-to-link',
			icon: <Icon icon="block-footnote-return" iconSize="20" />,
			label: __('Jump to Links', 'blockera'),
			description: __(
				'The links to jump to the footnote reference.',
				'blockera'
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
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			settings: {
				...sharedInnerBlocks['elements/link'].settings,
				dataCompatibilityElement: undefined,
				dataCompatibility: undefined,
			},
		},
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
};
