// @flow

/**
 * Blockera dependencies
 */
import { isString, isUndefined } from '@blockera/utils';
import { extractNumberAndUnit, isSpecialUnit } from '@blockera/controls';

export function minHeightFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId?: string,
}): Object {
	if (
		attributes?.blockeraMinHeight !== '' ||
		attributes?.minHeight === undefined ||
		attributes?.minHeightUnit === undefined
	) {
		return attributes;
	}

	if (blockId === 'core/cover') {
		attributes.blockeraMinHeight =
			attributes?.minHeight + attributes.minHeightUnit;
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
					minHeight: undefined,
					minHeightUnit: undefined,
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
					minHeight: undefined,
					minHeightUnit: undefined,
				};
			}

			const extractedValue = extractNumberAndUnit(newValue);

			return {
				minHeight: +extractedValue.value,
				minHeightUnit: extractedValue.unit,
			};
	}

	return null;
}
