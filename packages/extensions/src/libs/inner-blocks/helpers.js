// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Internal dependencies
 */
import { ignoreDefaultBlockAttributeKeysRegExp } from '../utils';
import type { InnerBlockModel, InnerBlockType } from './types';

/**
 * Preparing inner blocks.
 *
 * @param {Object} registeredInnerBlocks The register inner blocks on outside of core.
 * @param {Object} rootAttributes The block root attributes.
 * @return {{}|{default}} the merge-able object include "default" key when registered inner blocks has valid blocks, empty object when has not valid items.
 */
export function prepareInnerBlockTypes(
	registeredInnerBlocks: Object,
	rootAttributes: Object
): Object {
	const values = Object.values(registeredInnerBlocks);

	if (!values.length) {
		return [];
	}

	// Extracting default prop of items and assigning to a new object
	const newRootAttributes: { [key: string]: any } = {};

	for (const key in rootAttributes) {
		if (ignoreDefaultBlockAttributeKeysRegExp().test(key)) {
			continue;
		}

		if (rootAttributes[key].default !== undefined) {
			newRootAttributes[key] = rootAttributes[key].default;

			continue;
		}

		switch (rootAttributes[key]?.type) {
			case 'string':
				newRootAttributes[key] = '';
				break;
			case 'object':
				newRootAttributes[key] = {};
				break;
			case 'array':
				newRootAttributes[key] = [];
				break;
			case 'boolean':
				newRootAttributes[key] = false;
				break;
			case 'number':
			case 'integer':
				newRootAttributes[key] = 0;
				break;
			case 'null':
				newRootAttributes[key] = null;
				break;
		}
	}

	return values.map((innerBlock) => ({
		...innerBlock,
		attributes: newRootAttributes,
	}));
}

/**
 * Get inner block model.
 *
 * @param {Array<InnerBlockModel>} blocks The inner blocks of master block.
 * @param {'master' | InnerBlockType} currentBlock The current inner block type or master.
 * @return {InnerBlockModel} the inner block model on success, undefined when occurred otherwise.
 */
const getInnerBlockModel = (
	blocks: Array<InnerBlockModel>,
	currentBlock: 'master' | InnerBlockType
): InnerBlockModel | void =>
	blocks.find(
		(innerBlock: InnerBlockModel): boolean =>
			innerBlock.type === currentBlock
	);

/**
 * Get memoized inner block model.
 *
 * @param {Array<InnerBlockModel>} blocks The inner blocks of master block.
 * @param {'master' | InnerBlockType} currentBlock The current inner block type or master.
 * @return {InnerBlockModel} the inner block model on success, undefined when occurred otherwise.
 */
export const getMemoizedInnerBlockModel: (
	blocks: Array<InnerBlockModel>,
	currentBlock: 'master' | InnerBlockType
) => InnerBlockModel | void = memoize(getInnerBlockModel);

/**
 * Get inner block id.
 *
 * @param {Array<InnerBlockModel>} innerBlocks The inner blocks of master block.
 * @param {'master' | InnerBlockType} currentBlock The current inner block type or master.
 * @return {number} the number of found inner block id on success, -1 when occurred otherwise.
 */
export const getInnerBlockId = (
	innerBlocks: Array<InnerBlockModel>,
	currentBlock: 'master' | InnerBlockType
): number => {
	// Get chosen inner block type but when not selected anything value will be "undefined".
	const innerBlockType: InnerBlockModel | void =
		'master' === currentBlock
			? undefined
			: getMemoizedInnerBlockModel(innerBlocks, currentBlock);

	const getMemoizedInnerBlockTypes = memoize(
		(block: InnerBlockModel) => block.type
	);

	// Get chosen inner block type identifier but when not selected anything value will be "-1".
	return 'undefined' === typeof innerBlockType
		? -1
		: innerBlocks
				.map(getMemoizedInnerBlockTypes)
				.indexOf(innerBlockType.type);
};
