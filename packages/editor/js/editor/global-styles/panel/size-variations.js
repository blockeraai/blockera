// @flow

/**
 * Blockera dependencies
 */
import { mergeObject } from '@blockera/utils';

/**
 * Internal dependencies
 */
import { VARIATION_SURFACE_SIZE } from './variation-surfaces';

/** CSS class prefix applied to the block for Blockera **size** variations (`is-size-{slug}`). */
export const BLOCK_SIZE_VARIATION_CLASS_PREFIX = 'is-size-';

/**
 * Deep-merge `styles.blocks[blockName].variations` from base + user theme.json data.
 */
export function mergeBlockVariationsTrees(
	baseConfig: Object,
	userConfig: Object,
	blockName: string
): Object {
	const baseV: Object =
		baseConfig?.styles?.blocks?.[blockName]?.variations ?? {};
	const userV: Object =
		userConfig?.styles?.blocks?.[blockName]?.variations ?? {};
	const slugs: Set<string> = new Set([
		...Object.keys(baseV),
		...Object.keys(userV),
	]);
	const merged: Object = {};

	for (const slug of slugs) {
		merged[slug] = mergeObject(baseV[slug] || {}, userV[slug] || {});
	}

	return merged;
}

export function isSizeVariationEntry(data: mixed): boolean {
	return (
		data !== null &&
		typeof data === 'object' &&
		// $FlowFixMe
		data.blockeraVariationType === VARIATION_SURFACE_SIZE
	);
}

/**
 * Ensures persisted theme.json variation entries for the size surface always carry Blockera metadata.
 */
export function attachSizeVariationPersistenceKeys(
	normalized: Object,
	slug: string,
	mergedVariations: Object
): Object {
	const prev: Object = mergedVariations[slug] || {};

	return {
		...normalized,
		blockeraVariationType: VARIATION_SURFACE_SIZE,
		blockeraIsDefaultVariation:
			typeof prev.blockeraIsDefaultVariation === 'boolean'
				? prev.blockeraIsDefaultVariation
				: false,
	};
}
