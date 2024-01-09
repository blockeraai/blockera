// @flow

/**
 * Publisher Dependencies
 */
import { isObject, isString, isUndefined } from '@publisher/utils';
import { extractNumberAndUnit, isSpecialUnit } from '@publisher/controls';
import { isValid } from '@publisher/hooks';

export function minHeightToWPCompatible({
	newValue,
	ref,
	isNormalState,
}: {
	newValue: string | Object,
	ref: Object,
	isNormalState: () => boolean,
}): {
	minHeight?: number,
	minHeightUnit?: string,
} {
	if ('reset' === ref?.current?.action) {
		return {
			minHeight: undefined,
			minHeightUnit: undefined,
		};
	}

	if (
		!isNormalState() ||
		newValue === '' ||
		isUndefined(newValue) ||
		isSpecialUnit(newValue) ||
		(isObject(newValue) && !isValid(newValue)) ||
		(isString(newValue) && newValue.endsWith('func'))
	) {
		return {};
	}

	const extractedValue = extractNumberAndUnit(newValue);

	return {
		minHeight: +extractedValue.value,
		minHeightUnit:
			extractedValue.unit === 'px' ? undefined : extractedValue.unit,
	};
}

export const coreWPAspectRatioValues = [
	'1',
	'4/3',
	'3/4',
	'3/2',
	'2/3',
	'16/9',
	'9/16',
];

export function aspectRatioToWPCompatible({
	newValue,
	ref,
	isNormalState,
}: {
	newValue: string | Object,
	ref: Object,
	isNormalState: () => boolean,
}): {
	aspectRatio?: string,
} {
	if ('reset' === ref?.current?.action) {
		return {
			aspectRatio: undefined,
		};
	}

	if (
		!isNormalState() ||
		newValue === '' ||
		isUndefined(newValue) ||
		// Only valid items
		coreWPAspectRatioValues.indexOf(newValue) === -1
	) {
		return {
			aspectRatio: undefined,
		};
	}

	return {
		aspectRatio: newValue,
	};
}

export const coreWPFitValues = ['cover', 'contain'];

export function fitToWPCompatible({
	newValue,
	ref,
	isNormalState,
}: {
	newValue: string | Object,
	ref: Object,
	isNormalState: () => boolean,
}): {
	scale?: string,
} {
	if ('reset' === ref?.current?.action) {
		return {
			scale: undefined,
		};
	}

	if (
		!isNormalState() ||
		newValue === '' ||
		isUndefined(newValue) ||
		// Only valid items
		coreWPFitValues.indexOf(newValue) === -1
	) {
		return {
			scale: undefined,
		};
	}

	return {
		scale: newValue,
	};
}
