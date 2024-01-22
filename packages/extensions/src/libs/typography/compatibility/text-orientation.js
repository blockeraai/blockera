// @flow

export function textOrientationFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.publisherTextOrientation === '' &&
		attributes?.style?.typography?.writingMode !== undefined
	) {
		if (attributes?.style?.typography?.writingMode === 'horizontal-tb') {
			attributes.publisherTextOrientation = 'initial';
		} else if (
			attributes?.style?.typography?.writingMode === 'vertical-rl'
		) {
			attributes.publisherTextOrientation = 'style-1';
		}
	}

	return attributes;
}

export function textOrientationToWPCompatibility({
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
					writingMode: undefined,
				},
			},
		};
	}

	if (newValue === 'style-1') {
		return {
			style: {
				typography: {
					writingMode: 'vertical-rl',
				},
			},
		};
	}

	if (newValue === 'initial') {
		return {
			style: {
				typography: {
					writingMode: 'horizontal-tb',
				},
			},
		};
	}

	return {};
}
