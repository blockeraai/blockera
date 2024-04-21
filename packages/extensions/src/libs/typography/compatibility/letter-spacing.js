// @flow

export function letterSpacingFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.blockeraLetterSpacing === '' &&
		attributes?.style?.typography?.letterSpacing !== undefined
	) {
		return {
			blockeraLetterSpacing: attributes?.style?.typography?.letterSpacing,
		};
	}

	return false;
}

export function letterSpacingToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
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
