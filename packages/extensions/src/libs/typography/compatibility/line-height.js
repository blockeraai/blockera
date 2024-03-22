// @flow

export function lineHeightFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.publisherLineHeight === '' &&
		attributes?.style?.typography?.lineHeight !== undefined
	) {
		attributes.publisherLineHeight =
			attributes?.style?.typography?.lineHeight;
	}

	return attributes;
}

export function lineHeightToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action) {
		return {
			style: {
				typography: {
					lineHeight: undefined,
				},
			},
		};
	}

	return {
		style: {
			typography: {
				lineHeight: newValue,
			},
		},
	};
}
