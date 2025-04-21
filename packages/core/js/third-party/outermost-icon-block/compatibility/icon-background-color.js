// @flow

/**
 * Blockera dependencies
 */
import { isValid } from '@blockera/controls';
import { isEmpty, isUndefined } from '@blockera/utils';
import { getColorVAFromIdString } from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

export function iconBackgroundColorFromWPCompatibility({
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
		attributes.blockeraBackgroundColor = {
			value: color,
		};
	}

	return attributes;
}

export function iconBackgroundColorToWPCompatibility({
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
