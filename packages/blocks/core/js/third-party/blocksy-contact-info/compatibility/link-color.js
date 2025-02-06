// @flow

/**
 * Blockera dependencies
 */
import { mergeObject, isEmpty, isUndefined } from '@blockera/utils';
import { isValid } from '@blockera/controls';
import { getColorVAFromIdString } from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

export function linkColorFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	let color: ValueAddon | string | false = false;

	if (attributes?.textInitialColor !== undefined) {
		color = getColorVAFromIdString(attributes?.textInitialColor);
	}

	if (!color) {
		color = attributes?.customTextInitialColor;
	}

	if (color) {
		return mergeObject(attributes, {
			blockeraInnerBlocks: {
				value: {
					'elements/link': {
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

export function linkColorToWPCompatibility({
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
			textInitialColor: undefined,
			customTextInitialColor: undefined,
		};
	}

	if (isValid(newValue)) {
		return {
			textInitialColor: newValue?.settings?.id,
			customTextInitialColor: undefined,
		};
	}

	return {
		textInitialColor: undefined,
		customTextInitialColor: newValue,
	};
}
