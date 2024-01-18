// @flow

/**
 * Publisher dependencies
 */
import { isString, isUndefined } from '@publisher/utils';
import { extractNumberAndUnit, isSpecialUnit } from '@publisher/controls';

export function minHeightFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	switch (blockId) {
		case 'core/cover':
			if (
				attributes?.publisherMinHeight === undefined ||
				(attributes?.minHeight !== undefined &&
					attributes.publisherMinHeight !==
						attributes?.minHeight + attributes.minHeightUnit)
			) {
				attributes.publisherMinHeight =
					attributes?.minHeight + attributes.minHeightUnit;
			}
			break;
	}

	return attributes;
}

export function minHeightToWPCompatibility({
	newValue,
	ref,
	blockId,
}: {
	newValue: string,
	ref?: Object,
	blockId: string,
}): Object {
	switch (blockId) {
		// input and unit are separated
		case 'core/cover':
			if ('reset' === ref?.current?.action) {
				return {
					minHeight: '',
					minHeightUnit: '',
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
					minHeight: '',
					minHeightUnit: '',
				};
			}

			const extractedValue = extractNumberAndUnit(newValue);

			return {
				minHeight: +extractedValue.value,
				minHeightUnit: extractedValue.unit,
			};
	}
}
