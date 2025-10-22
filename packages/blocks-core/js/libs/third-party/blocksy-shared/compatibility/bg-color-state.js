// @flow

/**
 * Blockera dependencies
 */
import { getBaseBreakpoint } from '@blockera/editor';
import { mergeObject } from '@blockera/utils';
import { getColorVAFromIdString } from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';

export function bgColorStateFromWPCompatibility({
	attributes,
	element,
	property,
	propertyCustom,
	blockeraProperty,
	defaultValue,
	state,
}: {
	attributes: Object,
	element: string,
	property: string,
	propertyCustom: string,
	blockeraProperty: string,
	defaultValue?: string,
	state: string,
}): Object {
	let color: ValueAddon | string | false = false;

	if (attributes?.[propertyCustom] !== defaultValue) {
		color = attributes?.[propertyCustom];
	}

	if (!color && attributes?.[property] !== defaultValue) {
		color = getColorVAFromIdString(attributes?.[property]);
	}

	if (color) {
		return mergeObject(attributes, {
			// remove base props to prevent conflicts of styles
			[property]: undefined,
			[propertyCustom]: undefined,
			blockeraInnerBlocks: {
				value: {
					[element]: {
						attributes: {
							blockeraBlockStates: {
								[state]: {
									isVisible: true,
									breakpoints: {
										// $FlowFixMe
										[getBaseBreakpoint()]: {
											attributes: {
												[blockeraProperty]: color,
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
