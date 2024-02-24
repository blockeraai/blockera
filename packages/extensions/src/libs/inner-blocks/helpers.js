// @flow

/**
 * External dependencies
 */
import memoize from 'fast-memoize';

/**
 * Internal dependencies
 */
import type { InnerBlocks, InnerBlockType } from './types';
import { ignoreDefaultBlockAttributeKeysRegExp } from '../utils';

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
		(_rootAttributes): Object => {
			// Extracting default prop of items and assigning to a new object
			const attributes: { [key: string]: any } = {};

			for (const key in _rootAttributes) {
				if (ignoreDefaultBlockAttributeKeysRegExp().test(key)) {
					continue;
				}

				if (_rootAttributes[key].default !== undefined) {
					attributes[key] = _rootAttributes[key].default;

					continue;
				}

				switch (_rootAttributes[key]?.type) {
					case 'string':
						attributes[key] = '';
						break;
					case 'object':
						attributes[key] = {};
						break;
					case 'array':
						attributes[key] = [];
						break;
					case 'boolean':
						attributes[key] = false;
						break;
					case 'number':
					case 'integer':
						attributes[key] = 0;
						break;
					case 'null':
						attributes[key] = null;
						break;
				}
			}

			return attributes;
		}
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
