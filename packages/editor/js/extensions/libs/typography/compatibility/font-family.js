// @flow

export function fontFamilyFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
	runSelectedBlockEvent,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
	runSelectedBlockEvent: boolean,
}): Object | false {
	// Check block-level style (insideBlockInspector) or global style context
	const fontFamily =
		insideBlockInspector && runSelectedBlockEvent
			? attributes?.fontFamily
			: attributes?.typography?.fontFamily;

	if (
		attributes?.blockeraFontFamily?.value === '' &&
		fontFamily !== undefined
	) {
		attributes.blockeraFontFamily = {
			value: fontFamily,
		};
	}

	return attributes;
}

export function fontFamilyToWPCompatibility({
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
	if ('reset' === ref?.current?.action || newValue === '') {
		return insideBlockInspector && runSelectedBlockEvent
			? {
					fontFamily: undefined,
				}
			: {
					typography: {
						fontFamily: undefined,
					},
				};
	}

	return insideBlockInspector && runSelectedBlockEvent
		? {
				fontFamily: newValue,
			}
		: {
				typography: {
					fontFamily: newValue,
				},
			};
}
