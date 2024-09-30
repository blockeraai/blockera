// @flow

export function fontWeightFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.blockeraFontWeight === '' &&
		attributes?.style?.typography?.fontWeight !== undefined
	) {
		attributes.blockeraFontWeight =
			attributes?.style?.typography?.fontWeight;
	}

	return attributes;
}

export function fontWeightToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if (newValue === '' || 'reset' === ref?.current?.action) {
		return {
			style: {
				typography: {
					fontWeight: undefined,
				},
			},
		};
	}

	return {
		style: {
			typography: {
				fontWeight: newValue,
			},
		},
	};
}
