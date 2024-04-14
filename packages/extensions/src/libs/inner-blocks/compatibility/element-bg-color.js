// @flow

/**
 * Publisher dependencies
 */
import { isEmpty, isUndefined, mergeObject } from '@publisher/utils';
import { isValid } from '@publisher/hooks/src/use-value-addon/helpers';
import { getColorVAFromVarString } from '@publisher/core-data';

/**
 * Internal dependencies
 */
import { elementNormalBackgroundToWPCompatibility } from './element-bg';

export function elementNormalBackgroundColorFromWPCompatibility({
	element,
	attributes,
}: {
	element: string,
	attributes: Object,
}): Object {
	if (attributes.style.elements[element]?.color?.background) {
		const color = getColorVAFromVarString(
			attributes.style.elements[element].color.background
		);

		if (color) {
			return {
				publisherInnerBlocks: {
					[element]: {
						attributes: {
							publisherBackgroundColor: color,
						},
					},
				},
			};
		}
	}

	return false;
}

export function elementNormalBackgroundColorToWPCompatibility({
	element,
	newValue,
	ref,
	getAttributes,
}: {
	element: string,
	newValue: Object,
	ref?: Object,
	getAttributes: () => Object,
}): Object {
	if (
		'reset' === ref?.current?.action ||
		isEmpty(newValue) ||
		isUndefined(newValue)
	) {
		const attributes = getAttributes();

		// after removing bg color, the gradient should moved to WP data
		if (
			attributes?.publisherInnerBlocks[element]?.attributes
				?.publisherBackground
		) {
			return mergeObject(
				{
					style: {
						elements: {
							[element]: {
								color: {
									background: undefined,
								},
							},
						},
					},
				},
				elementNormalBackgroundToWPCompatibility({
					element,
					newValue:
						attributes?.publisherInnerBlocks[element]?.attributes
							?.publisherBackground,
					ref: {},
				})
			);
		}

		return {
			style: {
				elements: {
					[element]: {
						color: {
							background: undefined,
						},
					},
				},
			},
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		return {
			style: {
				elements: {
					[element]: {
						color: {
							background:
								'var:preset|color|' + newValue?.settings?.id,
						},
					},
				},
			},
		};
	}

	return {
		style: {
			elements: {
				[element]: {
					color: {
						background: newValue,
					},
				},
			},
		},
	};
}
