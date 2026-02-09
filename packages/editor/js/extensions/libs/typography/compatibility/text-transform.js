// @flow

export function textTransformFromWPCompatibility({
	attributes,
	runSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	runSelectedBlockEvent: boolean,
	insideBlockInspector?: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const textTransform =
		insideBlockInspector && runSelectedBlockEvent
			? attributes?.style?.typography?.textTransform
			: attributes?.typography?.textTransform;

	if (
		attributes?.blockeraTextTransform?.value === '' &&
		textTransform !== undefined
	) {
		attributes.blockeraTextTransform = {
			value: textTransform,
		};
	}

	return attributes;
}

export function textTransformToWPCompatibility({
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
							textTransform: undefined,
						},
					},
				}
			: {
					typography: {
						textTransform: undefined,
					},
				};
	}

	return insideBlockInspector && runSelectedBlockEvent
		? {
				style: {
					typography: {
						textTransform: newValue,
					},
				},
			}
		: {
				typography: {
					textTransform: newValue,
				},
			};
}
