// @flow

/**
 * Blockera dependencies
 */
import { isString, isUndefined } from '@blockera/utils';
import { isSpecialUnit } from '@blockera/controls';

export function heightFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	if (attributes?.blockeraHeight !== '') {
		return attributes;
	}

	switch (blockId) {
		case 'core/image':
		case 'core/post-featured-image':
			if (attributes?.height !== undefined) {
				attributes.blockeraHeight = attributes?.height;
			}
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
		// A number attribute for width without unit (px is unit)
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
