// @flow

export function lineHeightFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
}): Object | false {
	// Check block-level style (insideBlockInspector) or global style context
	const lineHeight = insideBlockInspector
		? attributes?.style?.typography?.lineHeight
		: attributes?.typography?.lineHeight;

	if (
		attributes?.blockeraLineHeight?.value === '' &&
		lineHeight !== undefined
	) {
		attributes.blockeraLineHeight = {
			value: lineHeight,
		};
	}

	return attributes;
}

export function lineHeightToWPCompatibility({
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
					style: {
						typography: {
							lineHeight: undefined,
						},
					},
			  }
			: {
					typography: {
						lineHeight: undefined,
					},
			  };
	}

	// Advanced css functions and units not supported by core.
	if (newValue.endsWith('func')) {
		newValue = undefined;
	}

	return insideBlockInspector
		? {
				style: {
					typography: {
						lineHeight: newValue,
					},
				},
		  }
		: {
				typography: {
					lineHeight: newValue,
				},
		  };
}
