// @flow

export function letterSpacingFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.publisherLetterSpacing === '' &&
		attributes?.style?.typography?.letterSpacing !== undefined
	) {
		attributes.publisherLetterSpacing =
			attributes?.style?.typography?.letterSpacing;
	}

	return attributes;
}

export function letterSpacingToWPCompatibility({
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
					letterSpacing: undefined,
				},
			},
		};
	}

	return {
		style: {
			typography: {
				letterSpacing: newValue,
			},
		},
	};
}
