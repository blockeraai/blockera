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

	if (attributes?.linkColor !== undefined) {
		color = getColorVAFromIdString(attributes?.linkColor);
	}

	if (!color) {
		color = attributes?.customLinkColor;
	}

	if (color) {
		return mergeObject(attributes, {
			blockeraInnerBlocks: {
				value: {
					'elements/links': {
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
			linkColor: undefined,
			customLinkColor: undefined,
		};
	}

	if (isValid(newValue)) {
		return {
			linkColor: newValue?.settings?.id,
			customLinkColor: undefined,
		};
	}

	return {
		linkColor: undefined,
		customLinkColor: newValue,
	};
}
