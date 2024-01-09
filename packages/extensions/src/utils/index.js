// @flow

/**
 * Publisher Dependencies
 */
import { isObject, isString, isUndefined } from '@publisher/utils';
import { isValid } from '@publisher/hooks';
import { isSpecialUnit } from '@publisher/controls';

export function toSimpleStyleWPCompatible({
	wpAttribute,
	newValue,
	isNormalState,
	ref,
	getAttributes = null,
}: {
	/**
	 * WP Attribute id to sync data to that
	 */
	wpAttribute: string,
	newValue: string | Object,
	isNormalState: () => boolean,
	ref: Object,
	getAttributes?: null | (() => Object),
}): string | Object {
	if ('reset' === ref?.current?.action) {
		if (typeof getAttributes === 'function') {
			const blockAttributes = getAttributes();

			return {
				style: {
					...(blockAttributes.attributes?.style ?? {}),
					[wpAttribute]: undefined,
				},
			};
		}

		return {
			[wpAttribute]: undefined,
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

	if (typeof getAttributes === 'function') {
		const blockAttributes = getAttributes();

		return {
			style: {
				...(blockAttributes.attributes?.style ?? {}),
				[wpAttribute]: newValue,
			},
		};
	}

	return {
		[wpAttribute]: newValue,
	};
}

export function toSimpleStyleTypographyWPCompatible({
	wpAttribute,
	newValue,
	isNormalState,
	ref,
	getAttributes = null,
}: {
	/**
	 * WP Attribute id to sync data to that
	 */
	wpAttribute: string,
	newValue: string | Object,
	isNormalState: () => boolean,
	ref: Object,
	getAttributes?: null | (() => Object),
}): string | Object {
	if ('reset' === ref?.current?.action) {
		if (typeof getAttributes === 'function') {
			const blockAttributes = getAttributes();

			return {
				style: {
					...(blockAttributes?.style ?? {}),
					typography: {
						...(blockAttributes?.style?.typography ?? {}),
						[wpAttribute]: undefined,
					},
				},
			};
		}

		return {
			style: {
				typography: {
					[wpAttribute]: undefined,
				},
			},
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

	if (typeof getAttributes === 'function') {
		const blockAttributes = getAttributes();

		return {
			style: {
				...(blockAttributes.attributes?.style ?? {}),
				typography: {
					...(blockAttributes?.style?.typography ?? {}),
					[wpAttribute]: newValue,
				},
			},
		};
	}

	return {
		[wpAttribute]: newValue,
	};
}
