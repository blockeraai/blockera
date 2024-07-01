// @flow

export function fontStyleFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.blockeraFontStyle === '' &&
		attributes?.style?.typography?.fontStyle !== undefined
	) {
		return { blockeraFontStyle: attributes?.style?.typography?.fontStyle };
	}

	return false;
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
