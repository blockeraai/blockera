// @flow

export function lineHeightFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object | false {
	if (
		attributes?.blockeraLineHeight === '' &&
		attributes?.style?.typography?.lineHeight !== undefined
	) {
		return {
			blockeraLineHeight: attributes?.style?.typography?.lineHeight,
		};
	}

	return false;
}

export function lineHeightToWPCompatibility({
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
