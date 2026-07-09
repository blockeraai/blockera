// @flow

export function fontFamilyFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object | false {
	if (
		attributes?.blockeraFontFamily?.value === '' &&
		attributes?.fontFamily !== undefined
	) {
		attributes.blockeraFontFamily = {
			value: attributes?.fontFamily,
		};
	}

	return attributes;
}

export function fontFamilyToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if ('reset' === ref?.current?.action || newValue === '') {
		return {
			fontFamily: undefined,
		};
	}

	return {
		fontFamily: newValue,
	};
}
