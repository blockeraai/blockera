// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';
import { addFilter } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { mergeObjects } from '@blockera/utils';
import { registerBlockExtension } from '@blockera/editor';

/**
 * Internal dependencies
 */
import * as wpBlocks from './wordpress';
import * as wooBlocks from './woocommerce';
import * as thirdPartyBlocks from './third-party';

export { blockeraBootstrapBlocks } from './bootstrap';

const blocks = {
	...wpBlocks,
	...wooBlocks,
	...thirdPartyBlocks,
};

export const reregistrationBlocks = (): void => {
	for (const key in blocks) {
		const currentBlock = blocks[key];

		if (!currentBlock?.name && 'Shared' !== key) {
			console.warn(
				'Blockera Core Block validation: Block must contain name param!'
			);
			continue;
		}

		registerBlockExtension(currentBlock.name || key, currentBlock);
	}
};

export const registerThirdPartyExtensionDefinitions = (): void => {
	addFilter(
		'blockera.extensions.innerBlocks.definitionTypes',
		'blockera.extensions.innerBlocks.definitionTypes.mergeBlockSettings',
		(definitionTypes: Object): Object => {
			const newDefinitionTypes = {};
			let additionalDefinitionTypes = {};

			const { getExtensions } = select('blockera/extensions/config');

			Object.values(blocks).forEach((block: Object): Object => {
				additionalDefinitionTypes = block?.blockeraInnerBlocks || {};

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
