// @flow

/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { registerBlockType, registerBlockVariation } from '@wordpress/blocks';

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { TBlockeraBlockType } from './types';

/**
 * Register a new block type.
 *
 * @param {string} blockType - The block type name.
 * @param {Object} blockConfig - The block configuration.
 *
 * @return {TBlockeraBlockType | void} The block, if it has been successfully registered.
 *                    otherwise `undefined`.
 */
export const registerBlockeraBlockType = (
	blockType: string,
	blockConfig: Object
): TBlockeraBlockType | void => {
	return registerBlockType(blockType, blockConfig);
};

export const registerBlockeraBlockTypes = (
	blockTypes: Array<Object>
): Array<TBlockeraBlockType> => {
	return blockTypes.map(({ blockType, blockConfig }) => {
		return registerBlockeraBlockType(blockType, blockConfig);
	});
};

export const registerBlockeraBlockVariation = (
	originBlockType: string,
	variationConfig: TBlockeraVariationType
) => {
	for (const key in variationConfig?.supports || {}) {
		addFilter(
			`blockera.block.${originBlockType.replace(
				/\//g,
				'.'
			)}.extension.${key}`,
			'blockera.blocksCore.extensionsSupports.filter',
			(extensionConfig, extensionName) => {
				if (!variationConfig.supports[extensionName]) {
					return extensionConfig;
				}

				return mergeObject(
					extensionConfig,
					variationConfig.supports[extensionName]
				);
			}
		);
	}

	return registerBlockVariation(originBlockType, variationConfig);
};

export const registerBlockeraBlockVariations = (
	blockVariations: Array<Object>
): Array<TBlockeraBlockVariation> => {
	return blockVariations.map(({ originBlockType, variationConfig }) => {
		return registerBlockeraBlockVariation(originBlockType, variationConfig);
	});
};
