// @flow

/**
 * Blockera dependencies
 */
import { SharedBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const MediaText: BlockType = {
	name: 'blockeraMediaText',
	targetBlock: 'core/media-text',
	maxInnerBlocks: 3,
	blockeraInnerBlocks: {
		'core/heading': {
			...sharedInnerBlocks['core/heading'],
			settings: {
				...sharedInnerBlocks['core/heading'].settings,
				force: true,
			},
		},
		'core/paragraph': {
			...sharedInnerBlocks['core/paragraph'],
			settings: {
				...sharedInnerBlocks['core/paragraph'].settings,
				force: true,
			},
		},
		'elements/link': sharedInnerBlocks['elements/link'],
		'core/image': {
			...sharedInnerBlocks['core/image'],
			settings: {
				...sharedInnerBlocks['core/image'].settings,
				force: true,
			},
		},
		'core/heading-1': sharedInnerBlocks['core/heading-1'],
		'core/heading-2': sharedInnerBlocks['core/heading-2'],
		'core/heading-3': sharedInnerBlocks['core/heading-3'],
		'core/heading-4': sharedInnerBlocks['core/heading-4'],
		'core/heading-5': sharedInnerBlocks['core/heading-5'],
		'core/heading-6': sharedInnerBlocks['core/heading-6'],
	},
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
};
