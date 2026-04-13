// @flow

/**
 * Blockera dependencies
 */
import { isString, isUndefined } from '@blockera/utils';
import { isSpecialUnit } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { resolveDimensionValueFromWP } from './dimension-variable-from-wp';

export function heightFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	if (attributes?.blockeraHeight?.value !== '') {
		return attributes;
	}

	switch (blockId) {
		// Blocks that support global styles dimensions.height
		case 'core/image':
			// Check block-level attribute
			if (attributes?.height !== undefined) {
				attributes.blockeraHeight = {
					value: resolveDimensionValueFromWP(attributes.height),
				};
			}

			return attributes;

		case 'core/spacer':
		case 'core/post-featured-image':
			if (attributes?.height !== undefined) {
				attributes.blockeraHeight = {
					value: resolveDimensionValueFromWP(attributes.height),
				};
			}

			return attributes;
	}

	return attributes;
}

export function heightToWPCompatibility({
	newValue,
	ref,
	blockId,
}: {
	newValue: string,
	ref?: Object,
	blockId: string,
}): Object {
	switch (blockId) {
		// Blocks that support global styles dimensions.height
		case 'core/image':
			if ('reset' === ref?.current?.action) {
				return {
					height: undefined,
				};
			}

			if (
				newValue === '' ||
				isUndefined(newValue) ||
				isSpecialUnit(newValue) ||
				!isString(newValue) ||
				!newValue.endsWith('px') // only px units
			) {
				return {
					height: undefined,
				};
			}

			return {
				height: newValue,
			};

		// A string attribute for width with unit
		case 'core/spacer':
		case 'core/post-featured-image':
			if ('reset' === ref?.current?.action) {
				return {
					height: undefined,
				};
			}

			if (
				newValue === '' ||
				isUndefined(newValue) ||
				isSpecialUnit(newValue) ||
				!isString(newValue) ||
				newValue.endsWith('func')
			) {
				return {
					height: undefined,
				};
			}

			return {
				height: newValue,
			};
	}

	return null;
}
