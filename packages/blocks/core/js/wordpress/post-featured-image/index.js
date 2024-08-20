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
import type { BlockType } from '../../type';

export const PostFeaturedImage: BlockType = {
	name: 'blockeraPostFeaturedImage',
	targetBlock: 'core/post-featured-image',
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
