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

export const registerBlockeraBlocks = (): void => {
	for (const key in blocks) {
		const currentBlock = blocks[key];

		if (!currentBlock?.name && 'Shared' !== key) {
			console.warn(
				'Blockera Block validation: Block must contain name param!'
			);
			continue;
		}

		registerBlockExtension(currentBlock.name || key, currentBlock);
	}
};

/**
 * Registration config extensions of each inner blocks.
 *
 * @return {void}
 */
export const registerConfigExtensionsOfInnerBlocks = (): void => {
	addFilter(
		'blockera.extensions.innerBlocks.config',
		'blockera.extensions.innerBlocks.config.mergeBlockSettings',
		(config: Object): Object => {
			const newConfig = {};
			let blockInnerBlocks = {};

			const { getExtensions } = select('blockera/extensions/config');

			Object.values(blocks).forEach((block: Object): Object => {
				blockInnerBlocks = block?.blockeraInnerBlocks || {};

				Object.values(blockInnerBlocks).forEach(
					(blockInnerBlock: Object): Object => {
						if (
							!blockInnerBlock?.settings ||
							!Object.values(blockInnerBlock?.settings).length
						) {
							return;
						}

						newConfig[blockInnerBlock?.name] = mergeObjects(
							{},
							getExtensions(),
							blockInnerBlock?.settings
						);
					}
				);
			});

			return mergeObjects({}, config, newConfig);
		}
	);
};

export default blocks;
