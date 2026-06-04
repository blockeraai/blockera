// @flow

/**
 * Blockera dependencies
 */
import { isEmpty, isString, isUndefined } from '@blockera/utils';
import { isSpecialUnit } from '@blockera/controls';
import { resolveDimensionValueFromWP } from '@blockera/editor/js/extensions/libs/size/compatibility/dimension-variable-from-wp';

export function coreIconWidthFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	const wpWidth = attributes?.style?.dimensions?.width;

	if (wpWidth === undefined || !isEmpty(attributes?.blockeraWidth?.value)) {
		return attributes;
	}

	attributes.blockeraWidth = {
		value: resolveDimensionValueFromWP(wpWidth),
	};

	return attributes;
}

export function coreIconWidthToWPCompatibility({
	newValue,
	ref,
	attributes,
}: {
	newValue: string,
	ref?: Object,
	attributes: Object,
}): Object {
	if ('reset' === ref?.current?.action) {
		return {
			style: {
				...(attributes?.style || {}),
				dimensions: {
					...(attributes?.style?.dimensions || {}),
					width: undefined,
				},
			},
		};
	}

	if (
		newValue === '' ||
		isUndefined(newValue) ||
		isSpecialUnit(newValue) ||
		!isString(newValue)
	) {
		return {
			style: {
				...(attributes?.style || {}),
				dimensions: {
					...(attributes?.style?.dimensions || {}),
					width: undefined,
				},
			},
		};
	}

	return {
		style: {
			...(attributes?.style || {}),
			dimensions: {
				...(attributes?.style?.dimensions || {}),
				width: newValue,
			},
		},
	};
}
