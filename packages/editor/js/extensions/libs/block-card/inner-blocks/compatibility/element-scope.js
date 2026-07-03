// @flow

/**
 * Blockera dependencies
 */
import { getColorVAFromVarString } from '@blockera/data';
import { mergeObject, normalizeCssLengthValue } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { runInsideBlockInspector } from '../../../utils';
import { getBaseBreakpoint } from '../../../../../editor/header-ui';
import { getBlockeraInnerBlockItem } from '../utils';
import type { InnerBlockCompatEntry } from './registry';
import {
	WP_ELEMENT_PSEUDO_STATES,
	WP_ELEMENT_STYLE_PROPERTY_KEYS,
} from './element-schema';

export type ElementCompatState =
	'normal' | 'hover' | 'focus' | 'active' | 'visited';

/**
 * Read WordPress element styles for a theme.json element key (`dataCompatibilityElement`).
 */
export function getElementSlice({
	attributes,
	dataCompatibilityElement,
	state = 'normal',
	insideBlockInspector,
	editorSelectedBlockEvent,
}: {
	attributes: Object,
	dataCompatibilityElement: string,
	state?: ElementCompatState,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style',
}): Object {
	const useStyle = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	);

	const elementsRoot = useStyle
		? attributes?.style?.elements
		: attributes?.elements;
	let elementData = elementsRoot?.[dataCompatibilityElement] || {};

	if (state !== 'normal') {
		elementData = elementData?.[`:${state}`] || elementData?.[state] || {};
	}

	const slice: Object = {};

	WP_ELEMENT_STYLE_PROPERTY_KEYS.forEach((propertyKey) => {
		if (elementData?.[propertyKey] !== undefined) {
			slice[propertyKey] = elementData[propertyKey];
		}
	});

	return slice;
}

/**
 * Map element slice onto block-level attribute shape expected by extension compat functions.
 */
export function elementSliceToScopedAttributes({
	elementSlice,
	innerBlockAttributes,
	insideBlockInspector,
}: {
	elementSlice: Object,
	innerBlockAttributes: Object,
	insideBlockInspector: boolean,
}): Object {
	const typography = elementSlice?.typography || {};

	if (insideBlockInspector) {
		return {
			...innerBlockAttributes,
			fontFamily: typography?.fontFamily,
			fontSize: typography?.fontSize,
			textAlign: typography?.textAlign,
			backgroundColor: elementSlice?.color?.background,
			gradient: elementSlice?.color?.gradient,
			style: {
				color: elementSlice?.color,
				typography,
				border: elementSlice?.border,
				spacing: elementSlice?.spacing,
				shadow: elementSlice?.shadow,
				background: elementSlice?.background,
				css: elementSlice?.css,
				dimensions: elementSlice?.dimensions,
				outline: elementSlice?.outline,
				filter: elementSlice?.filter,
			},
		};
	}

	return {
		...innerBlockAttributes,
		color: elementSlice?.color,
		typography,
		border: elementSlice?.border,
		spacing: elementSlice?.spacing,
		shadow: elementSlice?.shadow,
		background: elementSlice?.background,
		css: elementSlice?.css,
		dimensions: elementSlice?.dimensions,
		outline: elementSlice?.outline,
		filter: elementSlice?.filter,
	};
}

/**
 * Resolve inner block attributes for a block state (normal vs pseudo).
 */
export function getInnerBlockAttributesForState(
	innerBlockAttributes: Object,
	state: ElementCompatState = 'normal'
): Object {
	if (state === 'normal') {
		return innerBlockAttributes;
	}

	return (
		innerBlockAttributes?.blockeraBlockStates?.[state]?.breakpoints?.[
			getBaseBreakpoint()
		]?.attributes || {}
	);
}

function hasNonEmptyStyleValue(value: any): boolean {
	if (value === undefined || value === null || value === '') {
		return false;
	}

	if (typeof value === 'object') {
		return Object.keys(value).length > 0;
	}

	return true;
}

/**
 * Whether the element slice includes any theme.json style property data.
 */
export function elementSliceHasStyleData(elementSlice: Object): boolean {
	return WP_ELEMENT_STYLE_PROPERTY_KEYS.some((propertyKey) =>
		hasNonEmptyStyleValue(elementSlice?.[propertyKey])
	);
}

/**
 * Whether a theme.json element node (including pseudo-state children) has style data.
 */
export function elementDataHasStyleData(elementData: Object): boolean {
	if (!elementData || typeof elementData !== 'object') {
		return false;
	}

	if (elementSliceHasStyleData(elementData)) {
		return true;
	}

	return WP_ELEMENT_PSEUDO_STATES.some((pseudoKey) => {
		const pseudoData = elementData?.[pseudoKey];

		return pseudoData && elementSliceHasStyleData(pseudoData);
	});
}

/**
 * Whether the slice includes data for registry entry style sources.
 */
export function elementSliceHasEntrySource(
	elementSlice: Object,
	styleSources: Array<string>
): boolean {
	return styleSources.some((propertyKey) =>
		hasNonEmptyStyleValue(elementSlice?.[propertyKey])
	);
}

/**
 * Convert block-level compatibility output into theme.json elements patch.
 */
export function mapCompatResultToElementPatch(
	wpResult: Object,
	state: ElementCompatState = 'normal'
): Object {
	let patch: Object = {};

	if (wpResult?.fontFamily !== undefined) {
		patch = mergeObject(patch, {
			typography: {
				fontFamily: wpResult.fontFamily,
			},
		});
	}

	if (wpResult?.fontSize !== undefined) {
		patch = mergeObject(patch, {
			typography: {
				fontSize: wpResult.fontSize,
			},
		});
	}

	if (wpResult?.textAlign !== undefined) {
		patch = mergeObject(patch, {
			typography: {
				textAlign: wpResult.textAlign,
			},
		});
	}

	if (wpResult?.align !== undefined) {
		patch = mergeObject(patch, {
			typography: {
				textAlign: wpResult.align,
			},
		});
	}

	const style = wpResult?.style;

	if (style?.typography) {
		patch = mergeObject(patch, {
			typography: style.typography,
		});
	}

	if (style?.color) {
		patch = mergeObject(patch, {
			color: style.color,
		});
	}

	if (style?.border) {
		patch = mergeObject(patch, {
			border: style.border,
		});
	}

	if (style?.spacing) {
		patch = mergeObject(patch, {
			spacing: style.spacing,
		});
	}

	if (style?.shadow !== undefined) {
		patch = mergeObject(patch, {
			shadow: style.shadow,
		});
	}

	if (style?.background) {
		patch = mergeObject(patch, {
			background: style.background,
		});
	}

	if (style?.dimensions) {
		patch = mergeObject(patch, {
			dimensions: style.dimensions,
		});
	}

	if (style?.outline) {
		patch = mergeObject(patch, {
			outline: style.outline,
		});
	}

	if (style?.filter) {
		patch = mergeObject(patch, {
			filter: style.filter,
		});
	}

	if (style?.css !== undefined) {
		patch = mergeObject(patch, {
			css: style.css,
		});
	}

	if (wpResult?.typography) {
		patch = mergeObject(patch, {
			typography: wpResult.typography,
		});
	}

	if (wpResult?.color) {
		patch = mergeObject(patch, {
			color: wpResult.color,
		});
	}

	if (wpResult?.border) {
		patch = mergeObject(patch, {
			border: wpResult.border,
		});
	}

	if (wpResult?.spacing) {
		patch = mergeObject(patch, {
			spacing: wpResult.spacing,
		});
	}

	if (wpResult?.shadow !== undefined) {
		patch = mergeObject(patch, {
			shadow: wpResult.shadow,
		});
	}

	if (wpResult?.background) {
		patch = mergeObject(patch, {
			background: wpResult.background,
		});
	}

	if (wpResult?.dimensions) {
		patch = mergeObject(patch, {
			dimensions: wpResult.dimensions,
		});
	}

	if (wpResult?.outline) {
		patch = mergeObject(patch, {
			outline: wpResult.outline,
		});
	}

	if (wpResult?.filter) {
		patch = mergeObject(patch, {
			filter: wpResult.filter,
		});
	}

	if (wpResult?.css !== undefined) {
		patch = mergeObject(patch, {
			css: wpResult.css,
		});
	}

	if (state !== 'normal') {
		return {
			[`:${state}`]: patch,
		};
	}

	return patch;
}

/**
 * Wrap element patch for block inspector vs global styles storage.
 *
 * @param {string} dataCompatibilityElement theme.json element key (link, button, h1, …)
 */
export function wrapElementAttributes(
	dataCompatibilityElement: string,
	elementPatch: Object,
	insideBlockInspector: boolean,
	editorSelectedBlockEvent?: 'save-customizations' | 'detach-style'
): Object {
	const useStyle = runInsideBlockInspector(
		insideBlockInspector,
		editorSelectedBlockEvent
	);

	if (useStyle) {
		return {
			style: {
				elements: {
					[dataCompatibilityElement]: elementPatch,
				},
			},
		};
	}

	return {
		elements: {
			[dataCompatibilityElement]: elementPatch,
		},
	};
}

const getDefaultBlockeraBorderValue = (): Object => ({
	type: 'all',
	all: {
		width: '',
		style: '',
		color: '',
	},
});

type BorderWpFacet = 'color' | 'style' | 'width';

const getBorderFacetFromWpFeatureId = (
	wpFeatureId: string
): BorderWpFacet | null => {
	if (!wpFeatureId.startsWith('border.')) {
		return null;
	}

	const facet = wpFeatureId.slice('border.'.length);

	if (facet === 'color' || facet === 'style' || facet === 'width') {
		return facet;
	}

	return null;
};

/**
 * Merge a theme.json border facet into an existing `blockeraBorder` attribute.
 */
export const mergeBlockeraBorderFromWpFacet = (
	wpFeatureId: string,
	facetValue: any,
	existingBlockeraBorder: Object | void
): Object => {
	const facet = getBorderFacetFromWpFeatureId(wpFeatureId);

	if (!facet) {
		return existingBlockeraBorder || getDefaultBlockeraBorderValue();
	}

	let processedValue = facetValue;

	if (facet === 'color') {
		processedValue = getColorVAFromVarString(facetValue) ?? facetValue;
	} else if (facet === 'width') {
		processedValue = normalizeCssLengthValue(String(facetValue));
	}

	const existingValue =
		existingBlockeraBorder || getDefaultBlockeraBorderValue();
	const nextValue = { ...existingValue };

	if (nextValue.type === 'custom') {
		['top', 'right', 'bottom', 'left'].forEach((side) => {
			if (nextValue[side]) {
				const sideValue = nextValue[side];

				if (facet === 'color') {
					nextValue[side] = { ...sideValue, color: processedValue };
				} else if (facet === 'style') {
					nextValue[side] = { ...sideValue, style: processedValue };
				} else {
					nextValue[side] = { ...sideValue, width: processedValue };
				}
			}
		});
	} else {
		nextValue.type = 'all';
		const allValue = nextValue.all || getDefaultBlockeraBorderValue().all;

		if (facet === 'color') {
			nextValue.all = { ...allValue, color: processedValue };
		} else if (facet === 'style') {
			nextValue.all = { ...allValue, style: processedValue };
		} else {
			nextValue.all = { ...allValue, width: processedValue };
		}
	}

	return nextValue;
};

export type BuildInnerBlockAttributesMergeOptions = {
	entry?: InnerBlockCompatEntry,
	blockAttributes?: Object,
	innerBlock?: string,
};

const resolveMergedFeatureAttributes = (
	featureAttributes: Object,
	state: ElementCompatState,
	options?: BuildInnerBlockAttributesMergeOptions
): Object => {
	const entry = options?.entry;
	const innerBlock = options?.innerBlock;
	const blockAttributes = options?.blockAttributes;

	if (!entry?.mergesIntoBlockeraFeature || !innerBlock || !blockAttributes) {
		return featureAttributes;
	}

	const featureId = entry.featureId;
	const incomingValue = featureAttributes[featureId];

	if (incomingValue === undefined || incomingValue === null) {
		return featureAttributes;
	}

	const innerBlockItem = getBlockeraInnerBlockItem(
		blockAttributes,
		innerBlock
	);
	const existingStateAttributes = getInnerBlockAttributesForState(
		innerBlockItem?.attributes || {},
		state
	);

	if (featureId === 'blockeraBorder') {
		return {
			[featureId]: mergeBlockeraBorderFromWpFacet(
				entry.wpFeatureId,
				incomingValue,
				existingStateAttributes?.[featureId]
			),
		};
	}

	return mergeObject(existingStateAttributes || {}, featureAttributes);
};

/**
 * Build blockeraInnerBlocks merge payload for a feature value.
 */
export function buildInnerBlockAttributesMerge(
	innerBlock: string,
	featureAttributes: Object,
	state: ElementCompatState = 'normal',
	options?: BuildInnerBlockAttributesMergeOptions
): Object {
	const resolvedFeatureAttributes = resolveMergedFeatureAttributes(
		featureAttributes,
		state,
		{
			...options,
			innerBlock,
		}
	);

	if (state === 'normal') {
		return {
			blockeraInnerBlocks: {
				value: {
					[innerBlock]: {
						attributes: resolvedFeatureAttributes,
					},
				},
			},
		};
	}

	const blockState = {
		isVisible: true,
		breakpoints: {},
	};

	//$FlowFixMe
	blockState.breakpoints[getBaseBreakpoint()] = {
		attributes: resolvedFeatureAttributes,
	};

	return {
		blockeraInnerBlocks: {
			value: {
				[innerBlock]: {
					attributes: {
						blockeraBlockStates: {
							//$FlowFixMe
							[state]: blockState,
						},
					},
				},
			},
		},
	};
}
