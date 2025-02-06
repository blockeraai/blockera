// @flow

/**
 * Blockera dependencies
 */
import { getBaseBreakpoint } from '@blockera/editor';
import { mergeObject, isEmpty, isUndefined } from '@blockera/utils';
import { getColorVAFromIdString } from '@blockera/data';
import type { ValueAddon } from '@blockera/controls/js/value-addons/types';
import { isValid } from '@blockera/controls';

export function borderHoverColorFromWPCompatibility({
	attributes,
	element = 'elements/icons',
}: {
	attributes: Object,
	element: string,
}): Object {
	let color: ValueAddon | string | false = false;

	if (attributes?.customBorderHoverColor !== undefined) {
		color = attributes?.customBorderHoverColor;
	}

	if (!color && attributes?.borderHoverColor !== undefined) {
		color = getColorVAFromIdString(attributes?.borderHoverColor);
	}

	if (color) {
		return mergeObject(attributes, {
			blockeraInnerBlocks: {
				value: {
					[element]: {
						attributes: {
							blockeraBlockStates: {
								hover: {
									isVisible: true,
									breakpoints: {
										// $FlowFixMe
										[getBaseBreakpoint()]: {
											attributes: {
												blockeraBorder: {
													type: 'all',
													all: {
														width: '1px',
														style: 'solid',
														color,
													},
												},
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

export function borderHoverColorToWPCompatibility({
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
			borderHoverColor: undefined,
			customBorderHoverColor: undefined,
		};
	}

	if (newValue?.type === 'all') {
		if (isValid(newValue?.all)) {
			return {
				borderHoverColor: newValue?.all?.color?.settings?.id,
				customBorderHoverColor: undefined,
			};
		}

		return {
			borderHoverColor: undefined,
			customBorderHoverColor: newValue?.all?.color,
		};
	}

	return {};
}
