// @flow

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

export function flexWrapFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	// Backward Compatibility to support blockeraFlexWrap value structure.
	if (
		(attributes?.blockeraFlexWrap?.hasOwnProperty('value') &&
			attributes?.blockeraFlexWrap?.value?.value !== '') ||
		attributes?.blockeraFlexWrap?.value?.val !== '' ||
		attributes?.layout?.flexWrap === '' ||
		isUndefined(attributes?.layout?.flexWrap)
	) {
		return attributes;
	}

	attributes.blockeraFlexWrap = {
		value: {
			val: attributes?.layout?.flexWrap,
			reverse: false,
		},
	};

	return attributes;
}

export function flexWrapToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if (
		'reset' === ref?.current?.action ||
		newValue === '' ||
		// Backward Compatibility to support blockeraFlexWrap value structure.
		(newValue?.hasOwnProperty('value') && newValue?.value === '') ||
		newValue?.val === ''
	) {
		return {
			layout: {
				flexWrap: undefined,
			},
		};
	}

	return {
		layout: {
			// Backward Compatibility to support blockeraFlexWrap value structure.
			flexWrap: newValue?.hasOwnProperty('value')
				? newValue?.value
				: newValue?.val,
		},
	};
}
