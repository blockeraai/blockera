// @flow

export function fontStyleFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
	runSelectedBlockEvent,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
	runSelectedBlockEvent: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const fontStyle =
		insideBlockInspector && runSelectedBlockEvent
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
	runSelectedBlockEvent,
}: {
	newValue: Object,
	ref?: Object,
	insideBlockInspector?: boolean,
	runSelectedBlockEvent: boolean,
}): Object {
	if (
		newValue === '' ||
		'reset' === ref?.current?.action ||
		['normal', 'italic'].indexOf(newValue) === -1
	) {
		return insideBlockInspector && runSelectedBlockEvent
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

	return insideBlockInspector && runSelectedBlockEvent
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
