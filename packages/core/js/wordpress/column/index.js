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

export const Column: BlockType = {
	name: 'blockeraColumn',
	targetBlock: 'core/column',
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
		'elements/link': {
			...sharedInnerBlocks['elements/link'],
			settings: {
				...sharedInnerBlocks['elements/link'].settings,
				force: true,
			},
		},
		'core/button': {
			...sharedInnerBlocks['core/button'],
			settings: {
				...sharedInnerBlocks['core/button'].settings,
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
	supports: {
		blockeraStyleEngineConfig: {
			blockeraWidth: {
				width: 'flex-basis',
				for: 'master',
			},
		},
	},
};
