// @flow

export function fontStyleFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.publisherFontStyle === '' &&
		attributes?.style?.typography?.fontStyle !== undefined
	) {
		attributes.publisherFontStyle =
			attributes?.style?.typography?.fontStyle;
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
