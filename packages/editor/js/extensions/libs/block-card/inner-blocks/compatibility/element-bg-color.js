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
import { runInsideBlockInspector } from '../../../utils';
import { elementNormalBackgroundToWPCompatibility } from './element-bg';

export function elementNormalBackgroundColorFromWPCompatibility({
	innerBlock,
	attributes,
	dataCompatibilityElement,
	insideBlockInspector,
	editorSelectedBlockEvent,
}: {
	innerBlock: string,
	attributes: Object,
	dataCompatibilityElement: string,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	if (
		attributes?.style?.elements?.[dataCompatibilityElement]?.color
			?.background ||
		attributes?.elements?.[dataCompatibilityElement]?.color?.background
	) {
		const color = getColorVAFromVarString(
			runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			)
				? attributes.style.elements[dataCompatibilityElement].color
						.background
				: attributes.elements[dataCompatibilityElement].color.background
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
	insideBlockInspector,
	editorSelectedBlockEvent,
}: {
	element: string,
	newValue: Object,
	ref?: Object,
	getAttributes: () => Object,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	const useStyle = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	);

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
			const elements = {
				elements: {
					[element]: {
						color: {
							background: undefined,
						},
					},
				},
			};

			return mergeObject(
				{
					...(useStyle
						? {
								style: {
									elements: elements.elements,
								},
							}
						: elements),
				},
				elementNormalBackgroundToWPCompatibility({
					element,
					newValue:
						attributes?.blockeraInnerBlocks[element]?.attributes
							?.blockeraBackground,
					ref: {},
					insideBlockInspector,
					editorSelectedBlockEvent,
				})
			);
		}

		const elements = {
			elements: {
				[element]: {
					color: {
						background: undefined,
					},
				},
			},
		};

		return {
			...(useStyle
				? {
						style: {
							elements: elements.elements,
						},
					}
				: elements),
		};
	}

	// is valid font-size variable
	if (isValid(newValue)) {
		const elements = {
			elements: {
				[element]: {
					color: {
						background:
							'var:preset|color|' + newValue?.settings?.id,
					},
				},
			},
		};

		return {
			...(useStyle
				? {
						style: {
							elements: elements.elements,
						},
					}
				: elements),
		};
	}

	const elements = {
		elements: {
			[element]: {
				color: {
					background: newValue,
				},
			},
		},
	};

	return {
		...(useStyle
			? {
					style: {
						elements: elements.elements,
					},
				}
			: elements),
	};
}
