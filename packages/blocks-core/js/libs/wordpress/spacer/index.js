// @flow

/**
 * Blockera dependencies
 */
import {
	extensionConfig,
	SharedBlockExtension,
	registerBlockExtensionsSupports,
} from '@blockera/editor';
import { mergeObjects } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { BlockType } from '../../type';

export const Spacer: BlockType = {
	name: 'blockeraSpacer',
	targetBlock: 'core/spacer',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	registerExtensions: (blockName: string): void => {
		const config = mergeObjects(extensionConfig, {
			sizeConfig: {
				blockeraWidth: {
					onBreakpoints: ['base'],
				},
				blockeraMinWidth: {
					onBreakpoints: ['base'],
				},
				blockeraMaxWidth: {
					onBreakpoints: ['base'],
				},
				blockeraHeight: {
					onBreakpoints: ['base'],
				},
				blockeraMinHeight: {
					onBreakpoints: ['base'],
				},
				blockeraMaxHeight: {
					onBreakpoints: ['base'],
				},
			},
		});

		registerBlockExtensionsSupports(blockName, config);
	},
};
