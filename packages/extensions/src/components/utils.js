// @flow

import { applyFilters } from '@wordpress/hooks';

/**
 * Publisher dependencies
 */
import { omitWithPattern } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { hasSameProps } from '../libs';
import type { TStates, TBreakpoint } from '../libs/block-states/types';
import type { InnerBlockType } from '../libs/inner-blocks/types';
// import { detailedDiff } from 'deep-object-diff';

export const propsAreEqual = (
	prev: { attributes: Object, name: string },
	next: { attributes: Object }
): boolean => {
	const normalizedBlockName = prev.name.replace('/', '.');

	const excludedAttributeKeys = applyFilters(
		`publisherCore.blockEdit.${normalizedBlockName}.memoization.excludedAttributeKeys`,
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
