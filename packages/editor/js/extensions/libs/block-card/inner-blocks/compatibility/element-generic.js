// @flow

/**
 * Blockera dependencies
 */
import { isUndefined } from '@blockera/utils';

/**
 * Internal dependencies
 */
import {
	getNestedValue,
	isWpBorderFeaturePopulated,
	isWpElementFeaturePopulated,
	type InnerBlockCompatEntry,
} from './registry';
import { resolveDimensionValueFromWP } from '../../../size/compatibility/dimension-variable-from-wp';
import { detectWPAspectRatioValue } from '../../../size/compatibility/aspect-ratio';
import {
	buildInnerBlockAttributesMerge,
	elementSliceToScopedAttributes,
	getElementSlice,
	mapCompatResultToElementPatch,
	wrapElementAttributes,
} from './element-scope';

export function elementGenericFromWPCompatibility({
	innerBlock,
	attributes,
	dataCompatibilityElement,
	insideBlockInspector,
	editorSelectedBlockEvent,
	entry,
	blockId,
}: {
	innerBlock: string,
	attributes: Object,
	dataCompatibilityElement: string,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	entry: InnerBlockCompatEntry,
	blockId?: string,
}): false | Object {
	const stateAttributes = attributes?.[dataCompatibilityElement];

	const elementSlice = getElementSlice({
		attributes,
		dataCompatibilityElement,
		state: entry.state,
		insideBlockInspector,
		editorSelectedBlockEvent,
	});

	const isWpPopulated =
		entry.featureId === 'blockeraBorder'
			? isWpBorderFeaturePopulated(elementSlice, entry.wpFeatureId)
			: isWpElementFeaturePopulated(elementSlice, entry.wpFeatureId);

	if (!isWpPopulated) {
		return false;
	}

	const dimensionsFeature = tryElementDimensionsFromWP(elementSlice, entry);

	if (dimensionsFeature) {
		return buildInnerBlockAttributesMerge(
			innerBlock,
			dimensionsFeature,
			entry.state,
			{ entry, blockAttributes: attributes, innerBlock }
		);
	}

	const scopedAttributes = elementSliceToScopedAttributes({
		elementSlice,
		innerBlockAttributes: stateAttributes,
		insideBlockInspector,
	});

	const fromWpArgs: Object = {
		attributes: scopedAttributes,
		insideBlockInspector,
		editorSelectedBlockEvent,
	};

	if (entry.needsBlockId && blockId) {
		fromWpArgs.blockId = blockId;
	}

	const result = entry.fromWP(fromWpArgs);
	const featureValue = getNestedValue(result, entry.wpFeatureId);

	if (!featureValue) {
		return false;
	}

	const newAttributes = buildInnerBlockAttributesMerge(
		innerBlock,
		{
			[entry.featureId]: featureValue,
		},
		entry.state,
		{ entry, blockAttributes: attributes, innerBlock }
	);

	return newAttributes;
}

export function elementGenericToWPCompatibility({
	dataCompatibilityElement,
	newValue,
	ref,
	insideBlockInspector,
	editorSelectedBlockEvent,
	entry,
	blockId,
}: {
	dataCompatibilityElement: string,
	newValue: any,
	ref?: Object,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
	entry: InnerBlockCompatEntry,
	blockId?: string,
}): Object {
	const dimensionsPatch = tryElementDimensionsToWP({
		entry,
		newValue,
		ref,
	});

	if (dimensionsPatch) {
		const elementPatch =
			entry.state !== 'normal'
				? {
						[`:${entry.state}`]: dimensionsPatch,
					}
				: dimensionsPatch;

		return wrapElementAttributes(
			dataCompatibilityElement,
			elementPatch,
			insideBlockInspector,
			editorSelectedBlockEvent
		);
	}

	const toWpArgs: Object = {
		newValue,
		ref,
		insideBlockInspector,
		editorSelectedBlockEvent,
	};

	if (entry.needsBlockId && blockId) {
		toWpArgs.blockId = blockId;
	}

	const wpResult = entry.toWP(toWpArgs);

	const elementPatch = mapCompatResultToElementPatch(wpResult, entry.state);

	return wrapElementAttributes(
		dataCompatibilityElement,
		elementPatch,
		insideBlockInspector,
		editorSelectedBlockEvent
	);
}

function tryElementDimensionsFromWP(
	elementSlice: Object,
	entry: InnerBlockCompatEntry
): ?Object {
	if (!entry.styleSources.includes('dimensions')) {
		return null;
	}

	const dimensions = elementSlice?.dimensions;

	if (!dimensions) {
		return null;
	}

	if (entry.key === 'min-height' && !isUndefined(dimensions?.minHeight)) {
		return {
			blockeraMinHeight: {
				value: resolveDimensionValueFromWP(dimensions.minHeight),
			},
		};
	}

	if (entry.key === 'aspect-ratio' && !isUndefined(dimensions?.aspectRatio)) {
		const ratio = detectWPAspectRatioValue(dimensions.aspectRatio);

		if (ratio?.val) {
			return {
				blockeraRatio: {
					value: ratio,
				},
			};
		}
	}

	return null;
}

function tryElementDimensionsToWP({
	entry,
	newValue,
	ref,
}: {
	entry: InnerBlockCompatEntry,
	newValue: any,
	ref?: Object,
}): ?Object {
	if (!entry.styleSources.includes('dimensions')) {
		return null;
	}

	const isReset =
		'reset' === ref?.current?.action ||
		newValue === '' ||
		newValue === undefined;

	if (entry.key === 'min-height') {
		return {
			dimensions: {
				minHeight: isReset ? undefined : newValue,
			},
		};
	}

	if (entry.key === 'aspect-ratio') {
		const aspectRatio = isReset
			? undefined
			: newValue?.val || newValue?.value || newValue;

		return {
			dimensions: {
				aspectRatio,
			},
		};
	}

	return null;
}
