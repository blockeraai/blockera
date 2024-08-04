// @flow

export function textAlignFromWPCompatibility({
	attributes,
	blockId,
}: {
	attributes: Object,
	blockId: string,
}): Object {
	if (attributes?.blockeraTextAlign !== '') {
		return attributes;
	}

	switch (blockId) {
		case 'core/paragraph':
			if (attributes?.align !== undefined) {
				attributes.blockeraTextAlign = attributes?.align;
			}
			break;

		default:
			if (attributes?.textAlign !== undefined) {
				attributes.blockeraTextAlign = attributes?.textAlign;
			}
			break;
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
