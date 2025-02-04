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

	if (attributes?.linkHoverColor !== undefined) {
		color = getColorVAFromIdString(attributes?.linkHoverColor);
	}

	if (!color) {
		color = attributes?.customLinkHoverColor;
	}

	if (color) {
		return mergeObject(attributes, {
			blockeraInnerBlocks: {
				value: {
					'elements/links': {
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
			linkHoverColor: undefined,
			customLinkHoverColor: undefined,
		};
	}

	if (isValid(newValue)) {
		return {
			linkHoverColor: newValue?.settings?.id,
			customLinkHoverColor: undefined,
		};
	}

	return {
		linkHoverColor: undefined,
		customLinkHoverColor: newValue,
	};
}
