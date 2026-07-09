// @flow

export function textAlignFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId: string,
}): Object {
	let wpAlignAttrId = 'textAlign';
	if (blockId === 'core/paragraph') {
		wpAlignAttrId = 'align';
	}

	// For detecting the text align changer from block editor controls
	// we have to validate and make sure the value is correct and should be updated
	if (
		attributes[wpAlignAttrId] !== undefined &&
		attributes?.blockeraTextAlign?.value !== attributes[wpAlignAttrId]
	) {
		switch (blockId) {
			case 'core/paragraph':
				if (attributes[wpAlignAttrId] !== undefined) {
					attributes.blockeraTextAlign = {
						value: attributes[wpAlignAttrId],
					};
				}
				break;

			default:
				if (attributes[wpAlignAttrId] !== undefined) {
					attributes.blockeraTextAlign = {
						value: attributes?.textAlign,
					};
				}
				break;
		}
	}

	return attributes;
}

export function textAlignToWPCompatibility({
	newValue,
	ref,
	blockId,
}: {
	newValue: Object,
	ref?: Object,
	blockId: string,
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
		return {
			[wpAlignAttrId]: undefined,
		};
	}

	return {
		[wpAlignAttrId]: newValue,
	};
}
