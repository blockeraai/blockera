// @flow

/**
 * External dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Publisher Dependencies
 */
import { isValid } from '@publisher/hooks';
import { isSpecialUnit } from '@publisher/controls';
import { isObject, isString, isUndefined } from '@publisher/utils';

export function toSimpleStyleWPCompatible({
	wpAttribute,
	newValue,
	ref,
	getAttributes = null,
}: {
	/**
	 * WP Attribute id to sync data to that
	 */
	wpAttribute: string,
	newValue: string | Object,
	ref: Object,
	getAttributes?: null | (() => Object),
}): Object {
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
		newValue === '' ||
		isUndefined(newValue) ||
		isSpecialUnit(newValue) ||
		(isObject(newValue) && !isValid(newValue)) ||
		(isString(newValue) && newValue.endsWith('func'))
	) {
		return {
			[wpAttribute]: undefined,
		};
	}

	if (typeof getAttributes === 'function') {
		const blockAttributes = getAttributes();

		return {
			style: {
				...(blockAttributes?.style ?? {}),
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
	ref,
	getAttributes = null,
}: {
	/**
	 * WP Attribute id to sync data to that
	 */
	wpAttribute: string,
	newValue: string | Object,
	ref: Object,
	getAttributes?: null | (() => Object),
}): Object {
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
				...(blockAttributes?.style ?? {}),
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

export const resetExtensionSettings = () => {
	const {
		changeExtensionCurrentBlock: setCurrentBlock,
		changeExtensionCurrentBlockState: setCurrentState,
		changeExtensionInnerBlockState: setInnerBlockState,
		// changeExtensionCurrentBlockStateBreakpoint: setCurrentBreakpoint,
	} = dispatch('publisher-core/extensions') || {};

	setCurrentBlock('master');
	setCurrentState('normal');
	setInnerBlockState('normal');
	// setCurrentBreakpoint('laptop');
};
