// @flow

/**
 * Blockera dependencies
 */
import {
	extensionConfig,
	SharedBlockExtension,
	registerBlockExtensionsSupports,
	registerInnerBlockExtensionsSupports,
} from '@blockera/editor';
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

export const Cover: BlockType = {
	name: 'blockeraCover',
	targetBlock: 'core/cover',
	blockeraInnerBlocks: {
		'core/heading': sharedInnerBlocks['core/heading'],
		'core/paragraph': sharedInnerBlocks['core/paragraph'],
		'core/button': sharedInnerBlocks['core/button'],
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
	registerExtensions: (blockName: string): void => {
		const config = mergeObject(extensionConfig, {
			backgroundConfig: {
				blockeraOverlay: {
					status: true,
				},
			},
		});

		registerBlockExtensionsSupports(blockName, config);
	},
};
