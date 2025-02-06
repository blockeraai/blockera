// @flow

/**
 * Blockera dependencies
 */
import { getBaseBreakpoint } from '@blockera/editor';
import { mergeObject, isEmpty, isUndefined } from '@blockera/utils';
import { isValid } from '@blockera/controls';
import { getColorVAFromIdString } from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

export function linkColorHoverFromWPCompatibility({
	attributes,
}: {
	attributes: Object,
}): Object {
	let color: ValueAddon | string | false = false;

	if (attributes?.textHoverColor !== undefined) {
		color = getColorVAFromIdString(attributes?.textHoverColor);
	}

	if (!color) {
		color = attributes?.customTextHoverColor;
	}

	if (color) {
		return mergeObject(attributes, {
			blockeraInnerBlocks: {
				value: {
					'elements/link': {
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

export function linkColorHoverToWPCompatibility({
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
			textHoverColor: undefined,
			customTextHoverColor: undefined,
		};
	}

	if (isValid(newValue)) {
		return {
			textHoverColor: newValue?.settings?.id,
			customTextHoverColor: undefined,
		};
	}

	return {
		textHoverColor: undefined,
		customTextHoverColor: newValue,
	};
}
