// @flow

import { isString, isUndefined } from '@publisher/utils';
import { extractNumberAndUnit, isSpecialUnit } from '@publisher/controls';

export function widthFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	if (
		// attributes?.publisherWidth === undefined &&
		attributes?.width !== undefined &&
		attributes?.publisherWidth !== attributes?.width
	) {
		switch (blockId) {
			case 'core/search':
				attributes.publisherWidth =
					attributes?.width + attributes?.widthUnit;
				return attributes;

			case 'core/button':
				attributes.publisherWidth = attributes?.width + '%';
				return attributes;

			case 'core/site-logo':
				attributes.publisherWidth = attributes?.width + 'px';
				return attributes;

			case 'core/post-featured-image':
			case 'core/column':
			case 'core/image': // unit is px always
				attributes.publisherWidth = attributes?.width;
		}
	}

	return attributes;
}

export function widthToWPCompatibility({
	newValue,
	ref,
	blockId,
}: {
	newValue: string,
	ref?: Object,
	blockId: string,
}): Object {
	switch (blockId) {
		// A number attribute for width and another for unit!
		case 'core/search':
			if ('reset' === ref?.current?.action) {
				return {
					width: undefined,
					widthUnit: undefined,
				};
			}

			if (
				newValue === '' ||
				isUndefined(newValue) ||
				isSpecialUnit(newValue) ||
				!isString(newValue)
			) {
				return {
					width: undefined,
				};
			}

			const extractedValue = extractNumberAndUnit(newValue);

			return {
				width: +extractedValue.value,
				widthUnit: extractedValue.unit,
			};

		// A number attribute for width without unit (px is unit)
		case 'core/site-logo':
			if ('reset' === ref?.current?.action) {
				return {
					width: undefined,
				};
			}

			if (
				newValue === '' ||
				isUndefined(newValue) ||
				isSpecialUnit(newValue) ||
				!isString(newValue) ||
				!newValue.endsWith('px') // only percent values
			) {
				return {
					width: undefined,
				};
			}

			return {
				width: +newValue.replace('px', ''), // remove % and convert to number
			};

		// A number attribute for width without unit (% is unit)
		case 'core/button':
			if ('reset' === ref?.current?.action) {
				return {
					width: undefined,
				};
			}

			if (
				newValue === '' ||
				isUndefined(newValue) ||
				isSpecialUnit(newValue) ||
				!isString(newValue) ||
				!newValue.endsWith('%') // only percent units
			) {
				return {
					width: undefined,
				};
			}

			return {
				width: +newValue.replace('%', ''), // remove % and convert to number
			};

		// A number attribute for width without unit (px is unit)
		case 'core/image':
			if ('reset' === ref?.current?.action) {
				return {
					width: undefined,
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
					width: undefined,
				};
			}

			console.log('to wp', {
				width: newValue,
			});
			return {
				width: newValue,
			};

		// A string attribute for width with unit
		default:
			if ('reset' === ref?.current?.action) {
				return {
					width: undefined,
				};
			}

			if (
				newValue === '' ||
				isUndefined(newValue) ||
				isSpecialUnit(newValue) ||
				!isString(newValue)
			) {
				return {
					width: undefined,
				};
			}

			return {
				width: newValue,
			};
	}
}
