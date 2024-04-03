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
			return { publisherTextOrientation: 'initial' };
		} else if (
			attributes?.style?.typography?.writingMode === 'vertical-rl'
		) {
			return { publisherTextOrientation: 'style-1' };
		}
	}

	return false;
}

export function textOrientationToWPCompatibility({
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

	return {
		style: {
			typography: {
				writingMode: undefined,
			},
		},
	};
}
