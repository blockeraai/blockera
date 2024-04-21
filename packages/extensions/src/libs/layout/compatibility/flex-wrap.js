// @flow

export function flexWrapFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.blockeraFlexWrap?.value !== '' ||
		attributes?.layout?.flexWrap === ''
	) {
		return false;
	}

	return {
		blockeraFlexWrap: {
			value: attributes?.layout?.flexWrap,
			reverse: false,
		},
	};
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
		newValue?.value === ''
	) {
		return {
			layout: {
				flexWrap: undefined,
			},
		};
	}

	return {
		layout: {
			flexWrap: newValue?.value,
		},
	};
}
