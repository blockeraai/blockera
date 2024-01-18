// @flow

/**
 * Publisher dependencies
 */
import { isString, isUndefined } from '@publisher/utils';
import { isSpecialUnit } from '@publisher/controls';

export function heightFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	switch (blockId) {
		case 'core/image':
		case 'core/post-featured-image':
			if (
				attributes?.publisherHeight === undefined &&
				attributes.publisherHeight !== attributes?.height
			) {
				attributes.publisherHeight = attributes?.height;
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
				// 👉 auto is valid
				(newValue !== 'auto' && isSpecialUnit(newValue)) ||
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
				!isString(newValue)
			) {
				return {
					height: undefined,
				};
			}

			return {
				height: newValue,
			};
	}
}
