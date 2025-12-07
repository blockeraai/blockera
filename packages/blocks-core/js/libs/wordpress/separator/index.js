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
import type { BlockType } from '../../../type';

export const Separator: BlockType = {
	name: 'blockeraSeparator',
	targetBlock: 'core/separator',
	edit: (props) => {
		return <SharedBlockExtension {...props} />;
	},
	registerExtensions: (blockName: string): void => {
		const config = mergeObjects(extensionConfig, {
			typographyConfig: {
				status: false,
			},
			positionConfig: {
				status: false,
			},
			flexChildConfig: {
				status: false,
			},
			effectsConfig: {
				status: false,
			},
		});

		registerBlockExtensionsSupports(blockName, config);
	},
};
