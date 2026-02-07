// @flow

export function textTransformFromWPCompatibility({
	attributes,
	insideBlockInspector = true,
}: {
	attributes: Object,
	insideBlockInspector?: boolean,
}): Object {
	// Check block-level style (insideBlockInspector) or global style context
	const textTransform = insideBlockInspector
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

	return insideBlockInspector
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
