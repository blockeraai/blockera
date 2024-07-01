// @flow

import { applyFilters } from '@wordpress/hooks';

/**
 * Blockera dependencies
 */
import { omitWithPattern, hasSameProps } from '@blockera/utils';

/**
 * Internal dependencies
 */
import type { TStates, TBreakpoint } from '../libs/block-states/types';
import type { InnerBlockType } from '../libs/inner-blocks/types';
import { ignoreDefaultBlockAttributeKeysRegExp } from '../libs/utils';
// import { detailedDiff } from 'deep-object-diff';

export const propsAreEqual = (
	prev: { attributes: Object, name: string },
	next: { attributes: Object }
): boolean => {
	const normalizedBlockName = prev.name.replace('/', '.');

	const excludedAttributeKeys = applyFilters(
		`blockeraCore.blockEdit.${normalizedBlockName}.memoization.excludedAttributeKeys`,
		['content']
	).map((attributeId: string): string => `\b${attributeId}\b`);

	//FIXME: we needs to declaration excludedAttributeKeys for WP Compatibilities and prevent of redundant re-rendering process,
	// please double check all extensions bootstrap files to define these!
	if (!excludedAttributeKeys.length) {
		// Debug Code:
		// console.log('No Excluded Keys of Props:',detailedDiff(prev.attributes, next.attributes));

		return hasSameProps(prev.attributes, next.attributes);
	}

	const regexp = new RegExp(excludedAttributeKeys.join('|'));

	// Debug Code:
	// console.log(
	//	'With Excluded Keys of Props:'
	// 	detailedDiff(
	// 		omitWithPattern(prev.attributes, regexp),
	// 		omitWithPattern(next.attributes, regexp)
	// 	)
	// );

	return hasSameProps(
		omitWithPattern(prev.attributes, regexp),
		omitWithPattern(next.attributes, regexp)
	);
};

/**
 * is current block is inner block?
 *
 * @param {'master' | InnerBlockType | string} currentBlock The current block type.
 * @return {boolean} true on success, false on otherwise.
 */
export const isInnerBlock = (
	currentBlock: 'master' | InnerBlockType | string
): boolean => 'master' !== currentBlock;

/**
 * is current block on normal state?
 *
 * @param {TStates} selectedState The current selected state.
 * @return {boolean} true on success, false on otherwise.
 */
export const isNormalState = (selectedState: TStates): boolean =>
	'normal' === selectedState;

/**
 * is current breakpoint is base breakpoint?
 *
 * @param {TBreakpoint} currentBreakPoint The current breakpoint.
 * @return {boolean} true on success, false on otherwise.
 */
export const isBaseBreakpoint = (currentBreakPoint: TBreakpoint): boolean =>
	'laptop' === currentBreakPoint;

/**
 * Preparing attributes default values.
 *
 * @param {Object} rootAttributes the root attributes of registration time.
 * @return {Object} the attributes cleaned.
 */
export const prepareAttributesDefaultValues = (
	rootAttributes: Object
): Object => {
	// Extracting default prop of items and assigning to a new object
	const attributes: { [key: string]: any } = {};

	for (const key in rootAttributes) {
		if (ignoreDefaultBlockAttributeKeysRegExp().test(key)) {
			continue;
		}

		if (rootAttributes[key].default !== undefined) {
			attributes[key] = rootAttributes[key].default;

			continue;
		}

		switch (rootAttributes[key]?.type) {
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
};
