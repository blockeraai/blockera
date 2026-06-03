// @flow

/**
 * Blockera dependencies
 */
import { isString, isUndefined } from '@blockera/utils';
import { extractNumberAndUnit, isSpecialUnit } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { resolveDimensionValueFromWP } from './dimension-variable-from-wp';
import { runInsideBlockInspector } from '../../utils';

const DIMENSIONS_MIN_HEIGHT_BLOCKS = [
	'core/group',
	'core/post-content',
	'core/pullquote',
	'core/quote',
	'core/verse',
];

function getDimensionsMinHeightFromWPAttributes(
	attributes: Object,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style'
): mixed {
	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? attributes?.style?.dimensions?.minHeight
		: attributes?.dimensions?.minHeight;
}

function getDimensionsMinHeightClearPatch(
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style'
): Object {
	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? {
				style: {
					dimensions: {
						minHeight: undefined,
					},
				},
			}
		: {
				dimensions: {
					minHeight: undefined,
				},
			};
}

function getDimensionsMinHeightWritePatch(
	newValue: string,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style'
): Object {
	return runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	)
		? {
				style: {
					dimensions: {
						minHeight: newValue,
					},
				},
			}
		: {
				dimensions: {
					minHeight: newValue,
				},
			};
}

export function minHeightFromWPCompatibility({
	attributes,
	blockId,
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	blockId?: string,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector?: boolean,
}): Object {
	if (attributes?.blockeraMinHeight?.value !== '') {
		return attributes;
	}

	if (blockId === 'core/cover') {
		// Check block-level style (insideBlockInspector) or global style context
		// Block inspector: separated minHeight and minHeightUnit
		if (
			runInsideBlockInspector(
				insideBlockInspector,
				editorSelectedBlockEvent
			) &&
			attributes?.minHeight !== undefined &&
			attributes?.minHeightUnit !== undefined
		) {
			attributes.blockeraMinHeight = {
				value: attributes?.minHeight + attributes.minHeightUnit,
			};
		}

		// Global styles: single string value in dimensions.minHeight
		if (
			!insideBlockInspector &&
			attributes?.dimensions?.minHeight !== undefined
		) {
			attributes.blockeraMinHeight = {
				value: resolveDimensionValueFromWP(
					attributes.dimensions.minHeight
				),
			};
		}
	}

	if (blockId && DIMENSIONS_MIN_HEIGHT_BLOCKS.includes(blockId)) {
		const dimensionsMinHeight = getDimensionsMinHeightFromWPAttributes(
			attributes,
			insideBlockInspector,
			editorSelectedBlockEvent
		);

		if (dimensionsMinHeight !== undefined) {
			attributes.blockeraMinHeight = {
				value: resolveDimensionValueFromWP(dimensionsMinHeight),
			};
		}
	}

	return attributes;
}

export function minHeightToWPCompatibility({
	newValue,
	ref,
	blockId,
	editorSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	newValue: string,
	ref?: Object,
	blockId: string,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	insideBlockInspector?: boolean,
}): Object {
	switch (blockId) {
		// input and unit are separated
		case 'core/cover':
			if ('reset' === ref?.current?.action) {
				return runInsideBlockInspector(
					insideBlockInspector,
					editorSelectedBlockEvent
				)
					? {
							minHeight: undefined,
							minHeightUnit: undefined,
						}
					: {
							dimensions: {
								minHeight: undefined,
							},
						};
			}

			if (
				newValue === '' ||
				isUndefined(newValue) ||
				isSpecialUnit(newValue) ||
				!isString(newValue)
			) {
				return runInsideBlockInspector(
					insideBlockInspector,
					editorSelectedBlockEvent
				)
					? {
							minHeight: undefined,
							minHeightUnit: undefined,
						}
					: {
							dimensions: {
								minHeight: undefined,
							},
						};
			}

			if (
				runInsideBlockInspector(
					insideBlockInspector,
					editorSelectedBlockEvent
				)
			) {
				// Block inspector: separated minHeight and minHeightUnit
				const extractedValue = extractNumberAndUnit(newValue);

				return {
					minHeight: +extractedValue.value,
					minHeightUnit: extractedValue.unit,
				};
			}

			// Global styles: single string value in dimensions.minHeight
			return {
				dimensions: {
					minHeight: newValue,
				},
			};

		case 'core/group':
		case 'core/post-content':
		case 'core/pullquote':
		case 'core/quote':
		case 'core/verse':
			if ('reset' === ref?.current?.action) {
				return getDimensionsMinHeightClearPatch(
					insideBlockInspector,
					editorSelectedBlockEvent
				);
			}

			if (
				newValue === '' ||
				isUndefined(newValue) ||
				isSpecialUnit(newValue) ||
				!isString(newValue)
			) {
				return getDimensionsMinHeightClearPatch(
					insideBlockInspector,
					editorSelectedBlockEvent
				);
			}

			return getDimensionsMinHeightWritePatch(
				newValue,
				insideBlockInspector,
				editorSelectedBlockEvent
			);
	}

	return null;
}
