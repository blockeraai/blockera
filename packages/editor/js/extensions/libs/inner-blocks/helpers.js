// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Internal dependencies
 */
import { prepareAttributesDefaultValues } from '../../components';
import type { InnerBlocks, InnerBlockModel, InnerBlockType } from './types';

/**
 * Preparing inner blocks.
 *
 * @param {Object} registeredInnerBlocks The register inner blocks on outside of core.
 * @param {Object} rootAttributes The block root attributes.
 * @return {InnerBlocks} The inner blocks each item includes prepared attributes of master blocks as default value.
 */
export function prepareInnerBlockTypes(
	registeredInnerBlocks: InnerBlocks,
	rootAttributes: Object
): InnerBlocks {
	const keys: Array<InnerBlockType | string> = Object.keys(
		registeredInnerBlocks
	);

	if (!keys.length) {
		return {};
	}

	const getMemoizedInnerBlockAttributes = memoize(
		prepareAttributesDefaultValues
	);

	const innerBlockAttributes =
		getMemoizedInnerBlockAttributes(rootAttributes);
	const getMemoizedInnerBlocks = memoize(
		(innerBlockTypes: Array<InnerBlockType>): InnerBlocks => {
			const innerBlocks: InnerBlocks = {};

			innerBlockTypes.forEach((innerBlockType: InnerBlockType): void => {
				if (innerBlocks[innerBlockType]) {
					return;
				}

				innerBlocks[innerBlockType] = {
					...registeredInnerBlocks[innerBlockType],
					attributes: innerBlockAttributes,
				};
			});

			return innerBlocks;
		}
	);

	return getMemoizedInnerBlocks(keys);
}

/**
 * Is element instance.
 *
 * @param {InnerBlockModel} entity the inner block model.
 * @return {boolean} true on success, false on failure.
 */
export const isElement = (entity: InnerBlockModel): boolean => {
	return new RegExp('^elements/', 'ig').test(entity.name);
};

/**
 * Is block instance.
 *
 * @param {InnerBlockModel} entity the inner block model.
 * @return {boolean} true on success, false on failure.
 */
export const isBlock = (entity: InnerBlockModel): boolean => {
	return new RegExp('^core/', 'ig').test(entity.name);
};
