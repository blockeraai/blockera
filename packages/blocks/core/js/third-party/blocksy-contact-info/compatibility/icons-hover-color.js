// @flow

/**
 * Blockera dependencies
 */
import { getBaseBreakpoint } from '@blockera/editor';
import { mergeObject, isEmpty, isUndefined } from '@blockera/utils';
import { isValid } from '@blockera/controls';
import { getColorVAFromIdString } from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

export function iconsColorHoverFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	let color: ValueAddon | string | false = false;

	if (attributes?.iconsHoverColor !== undefined) {
		color = getColorVAFromIdString(attributes?.iconsHoverColor);
	}

	if (!color) {
		color = attributes?.customIconsHoverColor;
	}

	if (color) {
		return mergeObject(attributes, {
			blockeraInnerBlocks: {
				value: {
					'elements/icons': {
						attributes: {
							blockeraBlockStates: {
								hover: {
									isVisible: true,
									breakpoints: {
										// $FlowFixMe
										[getBaseBreakpoint()]: {
											attributes: {
												blockeraFontColor: color,
											},
										},
									},
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

export function iconsColorHoverToWPCompatibility({
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
			iconsHoverColor: undefined,
			customIconsHoverColor: undefined,
		};
	}

	if (isValid(newValue)) {
		return {
			iconsHoverColor: newValue?.settings?.id,
			customIconsHoverColor: undefined,
		};
	}

	return {
		iconsHoverColor: undefined,
		customIconsHoverColor: newValue,
	};
}
