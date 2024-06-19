// @flow

export function textTransformFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.blockeraTextTransform === '' &&
		attributes?.style?.typography?.textTransform !== undefined
	) {
		return {
			blockeraTextTransform: attributes?.style?.typography?.textTransform,
		};
	}

	return false;
}

export function textTransformToWPCompatibility({
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
