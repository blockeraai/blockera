// @flow

/**
 * Blockera dependencies
 */
import { mergeObject, isEmpty, isUndefined } from '@blockera/utils';
import { isValid } from '@blockera/controls';
import { getColorVAFromIdString } from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

export function textColorFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	let color: ValueAddon | string | false = false;

	if (attributes?.textColor !== undefined) {
		color = getColorVAFromIdString(attributes?.textColor);
	}

	if (!color) {
		color = attributes?.customTextColor;
	}

	if (color) {
		return mergeObject(attributes, {
			blockeraInnerBlocks: {
				value: {
					'elements/text': {
						attributes: {
							blockeraFontColor: color,
						},
					},
				},
			},
		});
	}

	return attributes;
}

export function textColorToWPCompatibility({
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
			textColor: undefined,
			customTextColor: undefined,
		};
	}

	if (isValid(newValue)) {
		return {
			textColor: newValue?.settings?.id,
			customTextColor: undefined,
		};
	}

	return {
		textColor: undefined,
		customTextColor: newValue,
	};
}
