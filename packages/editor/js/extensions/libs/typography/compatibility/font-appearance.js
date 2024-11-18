// @flow
/**
 * Blockera dependencies
 */
import { isEquals } from '@blockera/utils';

export function fontAppearanceFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (
		isEquals(attributes?.blockeraFontAppearance?.value, {
			weight: '',
			style: '',
		}) &&
		(attributes?.style?.typography?.fontWeight !== undefined ||
			attributes?.style?.typography?.fontStyle !== undefined)
	) {
		attributes.blockeraFontAppearance = {
			value: {
				weight: attributes?.style?.typography?.fontWeight ?? '100',
				style: attributes?.style?.typography?.fontStyle ?? 'normal',
			},
		};
	}

	return attributes;
}

export function fontAppearanceToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if (
		isEquals(newValue, {
			weight: '',
			style: '',
		}) ||
		'reset' === ref?.current?.action
	) {
		return {
			style: {
				typography: {
					fontWeight: undefined,
					fontStyle: undefined,
				},
			},
		};
	}

	return {
		style: {
			typography: {
				fontWeight: newValue?.weight ?? '100',
				fontStyle: newValue?.style ?? 'normal',
			},
		},
	};
}
