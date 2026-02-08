// @flow

export function fontStyleFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const fontStyle = insideBlockInspector
		? attributes?.style?.typography?.fontStyle
		: attributes?.typography?.fontStyle;

	if (
		attributes?.blockeraFontStyle?.value === '' &&
		fontStyle !== undefined
	) {
		attributes.blockeraFontStyle = {
			value: fontStyle,
		};
	}

	return attributes;
}

export function fontStyleToWPCompatibility({
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
		['normal', 'italic'].indexOf(newValue) === -1
	) {
		return insideBlockInspector
			? {
					style: {
						typography: {
							fontStyle: undefined,
						},
					},
				}
			: {
					typography: {
						fontStyle: undefined,
					},
				};
	}

	return insideBlockInspector
		? {
				style: {
					typography: {
						fontStyle: newValue,
					},
				},
			}
		: {
				typography: {
					fontStyle: newValue,
				},
			};
}
