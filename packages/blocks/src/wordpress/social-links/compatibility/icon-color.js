// @flow

/**
 * Publisher dependencies
 */
import { isEmpty, isUndefined } from '@publisher/utils';
import { getColor, generateVariableString } from '@publisher/core-data';
import { isValid } from '@publisher/hooks/src/use-value-addon/helpers';
import { getColorVAFromIdString } from '@publisher/core-data';
import type { ValueAddon } from '@publisher/hooks/src/use-value-addon/types';

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
			publisherInnerBlocks: {
				item_icons: {
					attributes: {
						publisherFontColor: color,
					},
				},
				item_names: {
					attributes: {
						publisherFontColor: color,
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
