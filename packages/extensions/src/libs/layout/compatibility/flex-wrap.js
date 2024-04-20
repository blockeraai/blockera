// @flow

export function flexWrapFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.publisherFlexWrap?.value !== '' ||
		attributes?.layout?.flexWrap === ''
	) {
		return attributes;
	}

	attributes.publisherFlexWrap = {
		value: attributes?.layout?.flexWrap,
		reverse: false,
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
