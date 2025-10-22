// @flow

/**
 * Blockera dependencies
 */
import { mergeObject, isEmpty, isUndefined } from '@blockera/utils';
import { isValid } from '@blockera/controls';
import { getColorVAFromIdString } from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

export function colorFromWPCompatibility({
	attributes,
	element,
	property,
	propertyCustom,
	blockeraProperty,
	defaultValue,
}: {
	attributes: Object,
	element: string,
	property: string,
	propertyCustom: string,
	blockeraProperty: string,
	defaultValue?: string,
}): Object {
	let color: ValueAddon | string | false = false;

	if (attributes?.[propertyCustom] !== defaultValue) {
		color = attributes?.[propertyCustom];
	}

	if (!color && attributes?.[property] !== defaultValue) {
		color = getColorVAFromIdString(attributes?.[property]);
	}

	if (color) {
		return mergeObject(attributes, {
			blockeraInnerBlocks: {
				value: {
					[element]: {
						attributes: {
							[blockeraProperty]: color,
						},
					},
				},
			},
		});
	}

	return attributes;
}

export function colorToWPCompatibility({
	newValue,
	ref,
	property,
	propertyCustom,
}: {
	newValue: Object,
	ref?: Object,
	property: string,
	propertyCustom: string,
}): Object {
	if (
		'reset' === ref?.current?.action ||
		isEmpty(newValue) ||
		isUndefined(newValue)
	) {
		return {
			[property]: undefined,
			[propertyCustom]: undefined,
		};
	}

	if (isValid(newValue)) {
		return {
			[property]: newValue?.settings?.id,
			[propertyCustom]: undefined,
		};
	}

	return {
		[property]: undefined,
		[propertyCustom]: newValue,
	};
}
