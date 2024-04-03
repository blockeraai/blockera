// @flow

export function textAlignFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		attributes?.publisherTextAlign === '' &&
		attributes?.align !== undefined
	) {
		return { publisherTextAlign: attributes?.align };
	}

	return false;
}

export function textAlignToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if (
		newValue === '' ||
		'reset' === ref?.current?.action ||
		['left', 'center', 'right'].indexOf(newValue) === -1
	) {
		return {
			align: undefined,
		};
	}

	return {
		align: newValue,
	};
}
