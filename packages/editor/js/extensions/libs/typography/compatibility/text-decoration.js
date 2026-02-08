// @flow

export function textDecorationFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const textDecoration = insideBlockInspector
		? attributes?.style?.typography?.textDecoration
		: attributes?.typography?.textDecoration;

	if (
		attributes?.blockeraTextDecoration?.value === '' &&
		textDecoration !== undefined
	) {
		attributes.blockeraTextDecoration = {
			value: textDecoration,
		};
	}

	return attributes;
}

export function textDecorationToWPCompatibility({
	newValue,
	ref,
	insideBlockInspector = true,
}: {
	newValue: Object,
	ref?: Object,
	insideBlockInspector?: boolean,
}): Object {
	if (
		newValue === '' ||
		'reset' === ref?.current?.action ||
		['underline', 'line-through', 'overline'].indexOf(newValue) === -1
	) {
		return insideBlockInspector
			? {
					style: {
						typography: {
							textDecoration: undefined,
						},
					},
				}
			: {
					typography: {
						textDecoration: undefined,
					},
				};
	}

	return insideBlockInspector
		? {
				style: {
					typography: {
						textDecoration: newValue,
					},
				},
			}
		: {
				typography: {
					textDecoration: newValue,
				},
			};
}
