// @flow

/**
 * Blockera dependencies
 */
import { isEmpty, isUndefined } from '@blockera/utils';
import { isValid } from '@blockera/controls';
import {
	getColorVAFromIdString,
	getColorVAFromVarString,
} from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

export function coreIconColorFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	if (!isEmpty(attributes?.blockeraIconColor?.value)) {
		return attributes;
	}

	let color: ValueAddon | string | false = false;

	if (attributes?.textColor !== undefined) {
		color = getColorVAFromIdString(attributes.textColor);
	}

	if (!color && attributes?.style?.color?.text) {
		color =
			getColorVAFromVarString(attributes.style.color.text) ||
			attributes.style.color.text;
	}

	if (color) {
		attributes.blockeraIconColor = {
			value: color,
		};
	}

	return attributes;
}

export function coreIconColorToWPCompatibility({
	newValue,
	ref,
	attributes,
}: {
	newValue: Object,
	ref?: Object,
	attributes?: Object,
}): Object {
	const baseStyle = attributes?.style || {};

	if (
		'reset' === ref?.current?.action ||
		isEmpty(newValue) ||
		isUndefined(newValue)
	) {
		return {
			textColor: undefined,
			style: {
				...baseStyle,
				color: {
					...(baseStyle?.color || {}),
					text: undefined,
				},
			},
		};
	}

	if (isValid(newValue)) {
		return {
			textColor: newValue?.settings?.id,
			style: {
				...baseStyle,
				color: {
					...(baseStyle?.color || {}),
					text: undefined,
				},
			},
		};
	}

	return {
		textColor: undefined,
		style: {
			...baseStyle,
			color: {
				...(baseStyle?.color || {}),
				text: newValue,
			},
		},
	};
}
