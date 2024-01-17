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
