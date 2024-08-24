// @flow

import { isString, isUndefined } from '@blockera/utils';
import { extractNumberAndUnit, isSpecialUnit } from '@blockera/controls';

export function widthFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	switch (blockId) {
		// extra attr for unit
		case 'core/search':
			if (
				attributes?.width !== undefined &&
				attributes?.widthUnit !== undefined
			) {
				attributes.blockeraWidth =
					attributes?.width + attributes?.widthUnit;
			}

			return attributes;

		// no unit in value
		// unit is %
		case 'core/button':
			if (attributes?.width !== undefined) {
				attributes.blockeraWidth = attributes?.width + '%';
			}

			return attributes;

		// not unit in value
		// unit is px always
		case 'core/site-logo':
			if (
				attributes?.width !== undefined &&
				attributes?.blockeraWidth !== attributes?.width + 'px'
			) {
				attributes.blockeraWidth = attributes?.width + 'px';
			}

			return attributes;

		// not unit in value
		// unit is px always
		case 'core/avatar':
			if (
				attributes?.size !== undefined &&
				attributes?.blockeraWidth !== attributes?.size + 'px'
			) {
				attributes.blockeraWidth = attributes?.size + 'px';
			}

			return attributes;

		// the Icon Block by Nick Diego
		case 'outermost/icon-block':
		case 'core/post-featured-image':
		case 'core/column':
		case 'core/image':
			if (attributes?.width !== undefined) {
				attributes.blockeraWidth = attributes?.width;
			}

			return attributes;
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
				!isString(newValue) ||
				newValue.endsWith('func')
			) {
				return {
					width: undefined,
					widthUnit: undefined,
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
				!newValue.endsWith('px') // only px values
			) {
				return {
					width: undefined,
				};
			}

			return {
				width: +newValue.replace('px', ''), // remove px and convert to number
			};

		// A number attribute for width without unit (px is unit)
		case 'core/avatar':
			if ('reset' === ref?.current?.action) {
				return {
					size: undefined,
				};
			}

			if (
				newValue === '' ||
				isUndefined(newValue) ||
				isSpecialUnit(newValue) ||
				!isString(newValue) ||
				!newValue.endsWith('px') // only px values
			) {
				return {
					size: undefined,
				};
			}

			return {
				size: +newValue.replace('px', ''), // remove px and convert to number
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
				isSpecialUnit(newValue) ||
				!isString(newValue) ||
				!newValue.endsWith('px') // only px units
			) {
				return {
					width: undefined,
				};
			}

			return {
				width: newValue,
			};

		/**
		 * all unit types are valid except special ones
		 * A string attribute for width with unit
		 */
		// the Icon Block by Nick Diego
		case 'outermost/icon-block':
		case 'core/post-featured-image':
		case 'core/column':
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
				newValue.endsWith('func')
			) {
				return {
					width: undefined,
				};
			}

			return {
				width: newValue,
			};
	}

	return null;
}
