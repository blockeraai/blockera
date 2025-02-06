// @flow

/**
 * Blockera dependencies
 */
import { mergeObject, isEmpty, isUndefined } from '@blockera/utils';
import { getColorVAFromIdString } from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';
import { isValid } from '@blockera/controls';

export function borderFromWPCompatibility({
	attributes,
	element,
	property,
	propertyCustom,
	blockeraProperty,
}: {
	attributes: Object,
	element: string,
	property: string,
	propertyCustom: string,
	blockeraProperty: string,
}): Object {
	let color: ValueAddon | string | false = false;

	if (attributes?.[propertyCustom] !== undefined) {
		color = attributes?.[propertyCustom];
	}

	if (!color && attributes?.[property] !== undefined) {
		color = getColorVAFromIdString(attributes?.[property]);
	}

	if (color) {
		return mergeObject(attributes, {
			blockeraInnerBlocks: {
				value: {
					[element]: {
						attributes: {
							[blockeraProperty]: {
								type: 'all',
								all: {
									width: '1px',
									style: 'solid',
									color,
								},
							},
						},
					},
				},
			},
		});
	}

	return attributes;
}

export function borderToWPCompatibility({
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

	if (newValue?.type === 'all') {
		if (isValid(newValue?.all)) {
			return {
				[property]: newValue?.all?.color?.settings?.id,
				[propertyCustom]: undefined,
			};
		}

		return {
			[property]: undefined,
			[propertyCustom]: newValue?.all?.color,
		};
	}

	return {};
}
