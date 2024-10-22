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

/**
 * Internal dependencies
 */
import sharedInnerBlocks from '../inners/shared';
import type { BlockType } from '../../type';

const blockeraInnerBlocks = {
	'elements/link': sharedInnerBlocks['elements/link'],
};

export const Paragraph: BlockType = {
	name: 'blockeraParagraph',
	targetBlock: 'core/paragraph',
	blockeraInnerBlocks,
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	registerExtensions: (blockName: string): void => {
		const config = {
			...extensionConfig,
			sizeConfig: {
				...extensionConfig.sizeConfig,
				blockeraMinWidth: {
					...extensionConfig.sizeConfig.blockeraMinWidth,
					show: true,
				},
			},
		};

		registerBlockExtensionsSupports(blockName, config);
		registerInnerBlockExtensionsSupports(
			blockName,
			blockeraInnerBlocks,
			config
		);
	},
};
