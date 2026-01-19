// @flow

export function textOrientationFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const writingMode = insideBlockInspector
		? attributes?.style?.typography?.writingMode
		: attributes?.typography?.writingMode;

	if (
		attributes?.blockeraTextOrientation?.value === '' &&
		writingMode !== undefined
	) {
		if (writingMode === 'horizontal-tb') {
			attributes.blockeraTextOrientation = {
				value: 'initial',
			};
		} else if (writingMode === 'vertical-rl') {
			attributes.blockeraTextOrientation = {
				value: 'style-1',
			};
		}
	}

	return attributes;
}

export function textOrientationToWPCompatibility({
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
							writingMode: undefined,
						},
					},
			  }
			: {
					typography: {
						writingMode: undefined,
					},
			  };
	}

	let writingModeValue;
	if (newValue === 'style-1') {
		writingModeValue = 'vertical-rl';
	} else if (newValue === 'initial') {
		writingModeValue = 'horizontal-tb';
	} else {
		writingModeValue = undefined;
	}

	if (writingModeValue === undefined) {
		return insideBlockInspector
			? {
					style: {
						typography: {
							writingMode: undefined,
						},
					},
			  }
			: {
					typography: {
						writingMode: undefined,
					},
			  };
	}

	return insideBlockInspector
		? {
				style: {
					typography: {
						writingMode: writingModeValue,
					},
				},
		  }
		: {
				typography: {
					writingMode: writingModeValue,
				},
		  };
}
