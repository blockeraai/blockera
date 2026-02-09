// @flow

export function lineHeightFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
	runSelectedBlockEvent,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
	runSelectedBlockEvent: boolean,
}): Object | false {
	// Check block-level style (insideBlockInspector) or global style context
	const lineHeight =
		insideBlockInspector && runSelectedBlockEvent
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

	return insideBlockInspector && runSelectedBlockEvent
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
