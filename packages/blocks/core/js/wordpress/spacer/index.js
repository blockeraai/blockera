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
					isActiveOnBreakpoints: ['base'],
				},
				blockeraMinWidth: {
					isActiveOnBreakpoints: ['base'],
				},
				blockeraMaxWidth: {
					isActiveOnBreakpoints: ['base'],
				},
				blockeraHeight: {
					isActiveOnBreakpoints: ['base'],
				},
				blockeraMinHeight: {
					isActiveOnBreakpoints: ['base'],
				},
				blockeraMaxHeight: {
					isActiveOnBreakpoints: ['base'],
				},
			},
		});

		registerBlockExtensionsSupports(blockName, config);
	},
};
