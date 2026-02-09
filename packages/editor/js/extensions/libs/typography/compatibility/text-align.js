// @flow

export function textAlignFromWPCompatibility({
	attributes,
	blockId,
	runSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	blockId: string,
	runSelectedBlockEvent: boolean,
	insideBlockInspector?: boolean,
}): Object {
	let wpAlignAttrId = 'textAlign';
	if (blockId === 'core/paragraph') {
		wpAlignAttrId = 'align';
	}

	// Check block-level style (insideBlockInspector) or global style context
	const textAlign =
		insideBlockInspector && runSelectedBlockEvent
			? attributes[wpAlignAttrId]
			: attributes?.typography?.textAlign;

	// For detecting the text align changer from block editor controls
	// we have to validate and make sure the value is correct and should be updated
	if (
		textAlign !== undefined &&
		attributes?.blockeraTextAlign?.value !== textAlign
	) {
		if (textAlign !== undefined) {
			attributes.blockeraTextAlign = {
				value: textAlign,
			};
		}
	}

	return attributes;
}

export function textAlignToWPCompatibility({
	newValue,
	ref,
	blockId,
	runSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	newValue: Object,
	ref?: Object,
	blockId: string,
	insideBlockInspector?: boolean,
	runSelectedBlockEvent: boolean,
}): Object {
	// use correct id for WP data attribute
	let wpAlignAttrId = 'textAlign';
	if (blockId === 'core/paragraph') {
		wpAlignAttrId = 'align';
	}

	if (
		newValue === '' ||
		'reset' === ref?.current?.action ||
		['left', 'center', 'right'].indexOf(newValue) === -1
	) {
		return insideBlockInspector && runSelectedBlockEvent
			? {
					[wpAlignAttrId]: undefined,
				}
			: {
					typography: {
						textAlign: undefined,
					},
				};
	}

	return insideBlockInspector && runSelectedBlockEvent
		? {
				[wpAlignAttrId]: newValue,
			}
		: {
				typography: {
					textAlign: newValue,
				},
			};
}
