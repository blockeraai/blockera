// @flow

export function textDecorationFromWPCompatibility({
	attributes,
	runSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	runSelectedBlockEvent: boolean,
	insideBlockInspector?: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const textDecoration =
		insideBlockInspector && runSelectedBlockEvent
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
		['underline', 'line-through', 'overline'].indexOf(newValue) === -1
	) {
		return insideBlockInspector && runSelectedBlockEvent
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

	return insideBlockInspector && runSelectedBlockEvent
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
