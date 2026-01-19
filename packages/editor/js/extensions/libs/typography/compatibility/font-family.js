// @flow

export function fontFamilyFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
}): Object | false {
	// Check block-level style (insideBlockInspector) or global style context
	const fontFamily = insideBlockInspector
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
}: {
	newValue: Object,
	ref?: Object,
	insideBlockInspector?: boolean,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		return insideBlockInspector
			? {
					fontFamily: undefined,
			  }
			: {
					typography: {
						fontFamily: undefined,
					},
			  };
	}

	return insideBlockInspector
		? {
				fontFamily: newValue,
		  }
		: {
				typography: {
					fontFamily: newValue,
				},
		  };
}
