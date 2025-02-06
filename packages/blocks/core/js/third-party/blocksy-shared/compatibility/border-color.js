// @flow

/**
 * Blockera dependencies
 */
import { mergeObject, isEmpty, isUndefined } from '@blockera/utils';
import { getColorVAFromIdString } from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';
import { isValid } from '@blockera/controls';

export function borderColorFromWPCompatibility({
	attributes,
	element = 'elements/icons',
}: {
	attributes: Object,
	element: string,
}): Object {
	let color: ValueAddon | string | false = false;

	if (attributes?.customBorderColor !== undefined) {
		color = attributes?.customBorderColor;
	}

	if (!color && attributes?.borderColor !== undefined) {
		color = getColorVAFromIdString(attributes?.borderColor);
	}

	if (color) {
		return mergeObject(attributes, {
			blockeraInnerBlocks: {
				value: {
					[element]: {
						attributes: {
							blockeraBorder: {
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

export function borderColorToWPCompatibility({
	newValue,
	ref,
}: {
	newValue: Object,
	ref?: Object,
}): Object {
	if (
		'reset' === ref?.current?.action ||
		isEmpty(newValue) ||
		isUndefined(newValue)
	) {
		return {
			borderColor: undefined,
			customBorderColor: undefined,
		};
	}

	if (newValue?.type === 'all') {
		if (isValid(newValue?.all)) {
			return {
				borderColor: newValue?.all?.color?.settings?.id,
				customBorderColor: undefined,
			};
		}

		return {
			borderColor: undefined,
			customBorderColor: newValue?.all?.color,
		};
	}

	return {};
}
