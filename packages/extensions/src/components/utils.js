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
import type { InnerBlockType } from '../libs/inner-blocks/types';

export const propsAreEqual = (
	prev: { attributes: Object, name: string },
	next: { attributes: Object }
): boolean => {
	const normalizedBlockName = prev.name.replace('/', '.');

	const excludedAttributeKeys = applyFilters(
		`publisherCore.blockEdit.${normalizedBlockName}.memoization.excludedAttributeKeys`,
		[]
	).map((attributeId: string): string => `\b${attributeId}\b`);

	//FIXME: we needs to declaration excludedAttributeKeys for WP Compatibilities and prevent of redundant re-rendering process,
	// please double check all extensions bootstrap files to define these!
	if (!excludedAttributeKeys.length) {
		return hasSameProps(prev.attributes, next.attributes);
	}

	const regexp = new RegExp(excludedAttributeKeys.join('|'));

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
