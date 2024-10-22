// @flow

export function fontStyleFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.blockeraFontStyle?.value === '' &&
		attributes?.style?.typography?.fontStyle !== undefined
	) {
		attributes.blockeraFontStyle = {
			value: attributes?.style?.typography?.fontStyle,
		};
	}

	return attributes;
}

export function fontStyleToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if (
		newValue === '' ||
		'reset' === ref?.current?.action ||
		['normal', 'italic'].indexOf(newValue) === -1
	) {
		return {
			style: {
				typography: {
					fontStyle: undefined,
				},
			},
		};
	}

	return {
		style: {
			typography: {
				fontStyle: newValue,
			},
		},
	};
}
