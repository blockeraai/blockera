// @flow

/**
 * Blockera dependencies
 */
import { isValid } from '@blockera/controls';
import { getColorVAFromVarString } from '@blockera/data';
import { isEmpty, isUndefined, mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { elementNormalBackgroundToWPCompatibility } from './element-bg';

export function elementNormalBackgroundColorFromWPCompatibility({
	innerBlock,
	attributes,
	dataCompatibilityElement,
}: {
	innerBlock: string,
	attributes: Object,
	dataCompatibilityElement: string,
}): Object {
	if (
		attributes.style.elements[dataCompatibilityElement]?.color?.background
	) {
		const color = getColorVAFromVarString(
			attributes.style.elements[dataCompatibilityElement].color.background
		);

		if (color) {
			return {
				blockeraInnerBlocks: {
					value: {
						[innerBlock]: {
							attributes: {
								blockeraBackgroundColor: color,
							},
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
			attributes?.blockeraInnerBlocks[element]?.attributes
				?.blockeraBackground
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
						attributes?.blockeraInnerBlocks[element]?.attributes
							?.blockeraBackground,
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
