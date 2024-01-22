// @flow

export function textTransformFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.publisherTextTransform === '' &&
		attributes?.style?.typography?.textTransform !== undefined
	) {
		attributes.publisherTextTransform =
			attributes?.style?.typography?.textTransform;
	}

	return attributes;
}

export function textTransformToWPCompatibility({
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
					textTransform: undefined,
				},
			},
		};
	}

	return {
		style: {
			typography: {
				textTransform: newValue,
			},
		},
	};
}
