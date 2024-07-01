// @flow

/**
 * Blockera dependencies
 */
import { isEmpty, isUndefined } from '@blockera/utils';
import { isValid } from '@blockera/controls';
import { getColorVAFromIdString } from '@blockera/data';
// import { getColor, generateVariableString } from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

export function normalIconColorFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	let color: ValueAddon | string | false = false;

	if (attributes?.iconColor !== undefined) {
		color = getColorVAFromIdString(attributes?.iconColor);
	}

	if (!color) {
		color = attributes?.iconColorValue;
	}

	if (color) {
		return {
			blockeraInnerBlocks: {
				item_icons: {
					attributes: {
						blockeraFontColor: color,
					},
				},
				item_names: {
					attributes: {
						blockeraFontColor: color,
					},
				},
			},
		};
	}

	return false;
}

export function normalIconColorToWPCompatibility({
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
			iconColor: undefined,
			customIconColor: undefined,
			iconColorValue: undefined,
		};
	}

	if (isValid(newValue)) {
		return {
			iconColor: newValue?.settings?.id,
			iconColorValue: newValue?.settings?.value,
			customIconColor: undefined,
		};
	}

	return {
		iconColor: undefined,
		customIconColor: newValue,
		iconColorValue: newValue,
	};
}
