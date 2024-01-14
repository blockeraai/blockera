// @flow

/**
 * Publisher dependencies
 */
import { omitWithPattern } from '@publisher/utils';

/**
 * Internal dependencies
 */
import { hasSameProps } from '../libs';

export const propsAreEqual = (
	prev: { attributes: Object },
	next: { attributes: Object }
): boolean => {
	const regexp = /\b(?!publisher)\w+\b/i;

	return hasSameProps(
		omitWithPattern(prev.attributes, regexp),
		omitWithPattern(next.attributes, regexp)
	);
};
