// @flow

/**
 * External dependencies
 */
import { registerBlockType, registerBlockVariation } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import { default as blockTypes } from '../libs';
import type { TBlockeraBlockType } from '../types';
import { default as blockVariations } from '../variations';

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

export const registerBlockeraBlockTypes = (): Array<TBlockeraBlockType> => {
	return blockTypes.map(({ blockType, blockConfig }) => {
		return registerBlockeraBlockType(blockType, blockConfig);
	});
};

export const registerBlockeraBlockVariation = (
	originBlockType: string,
	variationConfig: TBlockeraVariationType
) => {
	return registerBlockVariation(originBlockType, variationConfig);
};

export const registerBlockeraBlockVariations =
	(): Array<TBlockeraBlockVariation> => {
		return blockVariations.map(({ originBlockType, variationConfig }) => {
			return registerBlockeraBlockVariation(
				originBlockType,
				variationConfig
			);
		});
	};
