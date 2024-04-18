// @flow

/**
 * Publisher dependencies
 */
import { isEmpty, isUndefined } from '@publisher/utils';
import { getColor, generateVariableString } from '@publisher/core-data';
import { isValid } from '@publisher/hooks/src/use-value-addon/helpers';
import { getColorVAFromIdString } from '@publisher/core-data';
import type { ValueAddon } from '@publisher/hooks/src/use-value-addon/types';

export function normalIconBackgroundColorFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	let color: ValueAddon | string | false = false;

	if (attributes?.iconBackgroundColor !== undefined) {
		color = getColorVAFromIdString(attributes?.iconBackgroundColor);
	}

	if (!color) {
		color = attributes?.iconBackgroundColorValue;
	}

	if (color) {
		return {
			publisherInnerBlocks: {
				item_containers: {
					attributes: {
						publisherBackgroundColor: color,
					},
				},
			},
		};
	}

	return false;
}

export function normalIconBackgroundColorToWPCompatibility({
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
			iconBackgroundColor: undefined,
			customIconBackgroundColor: undefined,
			iconBackgroundColorValue: undefined,
		};
	}

	if (isValid(newValue)) {
		return {
			iconBackgroundColor: newValue?.settings?.id,
			customIconBackgroundColor: undefined,
			iconBackgroundColorValue: newValue?.settings?.value,
		};
	}

	return {
		iconBackgroundColor: undefined,
		customIconBackgroundColor: newValue,
		iconBackgroundColorValue: newValue,
	};
}
