// @flow

/**
 * Blockera dependencies
 */
import { isString, isUndefined } from '@blockera/utils';
import { extractNumberAndUnit, isSpecialUnit } from '@blockera/controls';

export function minHeightFromWPCompatibility({
	attributes,
	blockId,
	runSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	attributes: Object,
	blockId?: string,
	runSelectedBlockEvent: boolean,
	insideBlockInspector?: boolean,
}): Object {
	if (attributes?.blockeraMinHeight?.value !== '') {
		return attributes;
	}

	if (blockId === 'core/cover') {
		// Check block-level style (insideBlockInspector) or global style context
		// Block inspector: separated minHeight and minHeightUnit
		if (
			insideBlockInspector &&
			runSelectedBlockEvent &&
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
				value: attributes?.dimensions?.minHeight,
			};
		}
	}

	return attributes;
}

export function minHeightToWPCompatibility({
	newValue,
	ref,
	blockId,
	runSelectedBlockEvent,
	insideBlockInspector = true,
}: {
	newValue: string,
	ref?: Object,
	blockId: string,
	runSelectedBlockEvent: boolean,
	insideBlockInspector?: boolean,
}): Object {
	switch (blockId) {
		// input and unit are separated
		case 'core/cover':
			if ('reset' === ref?.current?.action) {
				return insideBlockInspector && runSelectedBlockEvent
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
				return insideBlockInspector && runSelectedBlockEvent
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

			if (insideBlockInspector && runSelectedBlockEvent) {
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
	}

	return null;
}
