// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

/**
 * Publisher dependencies
 */
import { mergeObjects } from '@publisher/utils';
import { registerBlockExtension } from '@publisher/extensions';

/**
 * Internal dependencies
 */
import * as wordpress from './wordpress';

const blocks = {
	...wordpress,
};

export const reregistrationBlocks = (): void => {
	for (const key in blocks) {
		if (!Object.hasOwnProperty.call(blocks, key)) {
			continue;
		}

		const currentBlock = blocks[key];

		if (!currentBlock?.name && 'Shared' !== key) {
			console.warn(
				'Publisher Core Block validation: Block must contain name param!'
			);
			continue;
		}

		registerBlockExtension(currentBlock.name || key, currentBlock);
	}
};

export const registerThirdPartyExtensionDefinitions = (): void => {
	addFilter(
		'publisherCore.extensions.innerBlocks.definitionTypes',
		'publisherCore.extensions.innerBlocks.definitionTypes.mergeBlockSettings',
		(definitionTypes: Object): Object => {
			const newDefinitionTypes = {};
			let additionalDefinitionTypes = {};

			const { getExtensions } = select(
				'publisher-core/extensions/config'
			);

			Object.values(blocks).forEach((block: Object): Object => {
				additionalDefinitionTypes = block?.publisherInnerBlocks || {};

				Object.values(additionalDefinitionTypes).forEach(
					(additionalDefinitionType: Object): Object => {
						if (
							!additionalDefinitionType?.settings ||
							!Object.values(additionalDefinitionType?.settings)
								.length
						) {
							return;
						}

						newDefinitionTypes[additionalDefinitionType?.type] =
							mergeObjects(
								{},
								getExtensions(),
								additionalDefinitionType?.settings
							);
					}
				);
			});

			return mergeObjects({}, definitionTypes, newDefinitionTypes);
		}
	);
};

export default blocks;
