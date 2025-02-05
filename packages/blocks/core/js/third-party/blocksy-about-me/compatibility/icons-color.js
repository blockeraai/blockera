// @flow

/**
 * Blockera dependencies
 */
import { mergeObject, isEmpty, isUndefined } from '@blockera/utils';
import { isValid } from '@blockera/controls';
import { getColorVAFromIdString } from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

export function iconsColorFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	let color: ValueAddon | string | false = false;

	if (attributes?.iconsColor !== undefined) {
		color = getColorVAFromIdString(attributes?.iconsColor);
	}

	if (!color) {
		color = attributes?.customIconsColor;
	}

	if (color) {
		return mergeObject(attributes, {
			blockeraInnerBlocks: {
				value: {
					'elements/icons': {
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

export function iconsColorToWPCompatibility({
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
			iconsColor: undefined,
			customIconsColor: undefined,
		};
	}

	if (isValid(newValue)) {
		return {
			iconsColor: newValue?.settings?.id,
			customIconsColor: undefined,
		};
	}

	return {
		iconsColor: undefined,
		customIconsColor: newValue,
	};
}
