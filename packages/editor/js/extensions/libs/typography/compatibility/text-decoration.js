// @flow

export function textDecorationFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.blockeraTextDecoration === '' &&
		attributes?.style?.typography?.textDecoration !== undefined
	) {
		attributes.blockeraTextDecoration =
			attributes?.style?.typography?.textDecoration;
	}

	return attributes;
}

export function textDecorationToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if (
		newValue === '' ||
		'reset' === ref?.current?.action ||
		['underline', 'line-through', 'overline'].indexOf(newValue) === -1
	) {
		return {
			style: {
				typography: {
					textDecoration: undefined,
				},
			},
		};
	}

	return {
		style: {
			typography: {
				textDecoration: newValue,
			},
		},
	};
}
