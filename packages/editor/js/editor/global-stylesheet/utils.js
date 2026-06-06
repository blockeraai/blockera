// @flow

/**
 * External dependencies
 */
import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';

/**
 * Blockera dependencies
 */
import { omit, isEquals } from '@blockera/utils';

const EMPTY_OBJECT: Object = {};

/**
 * Returns the previous snapshot when deep-equal, keeping referential stability for memo children.
 *
 * @param {{ current: any }} cacheRef Mutable ref holding the last retained value.
 * @param {any} next Candidate next value.
 * @return {any} Stable snapshot reference.
 */
export function retainStableSnapshot<T>(cacheRef: { current: T }, next: T): T {
	if (isEquals(cacheRef.current, next)) {
		return cacheRef.current;
	}
	cacheRef.current = next;
	return next;
}

/**
 * Merges base and user slices for one block type with per-block stable caching.
 *
 * @param {Map<string, Object>} cache Per-block merged styles cache.
 * @param {string} blockName Block type name.
 * @param {Object} baseStyles Theme base `styles.blocks` slice.
 * @param {Object} userStyles User `styles.blocks` slice.
 * @return {Object} Merged block styles (stable reference when unchanged).
 */
type MergedBlockStylesCacheEntry = {
	merged: Object,
	baseSlice: Object,
	userSlice: Object,
};

export function getStableMergedBlockStyles(
	cache: Map<string, MergedBlockStylesCacheEntry>,
	blockName: string,
	baseStyles: Object,
	userStyles: Object
): Object {
	const baseBlock =
		baseStyles && typeof baseStyles === 'object'
			? baseStyles[blockName]
			: undefined;
	const userBlock =
		userStyles && typeof userStyles === 'object'
			? userStyles[blockName]
			: undefined;

	if (!baseBlock && !userBlock) {
		return EMPTY_OBJECT;
	}

	const baseSlice =
		baseBlock && typeof baseBlock === 'object' ? baseBlock : EMPTY_OBJECT;
	const userSlice =
		userBlock && typeof userBlock === 'object' ? userBlock : EMPTY_OBJECT;
	const cached = cache.get(blockName);

	if (
		cached &&
		isEquals(cached.baseSlice, baseSlice) &&
		isEquals(cached.userSlice, userSlice)
	) {
		return cached.merged;
	}

	const merged = mergeBlockGlobalStyles(baseSlice, userSlice);
	cache.set(blockName, {
		merged,
		baseSlice,
		userSlice,
	});
	return merged;
}

/**
 * Merges base and user global styles following Gutenberg patterns.
 * Uses deepmerge with custom configuration to handle arrays and special cases.
 *
 * @param {Object} baseStyles Base styles from theme
 * @param {Object} userStyles User styles from blockera/editor store
 * @return {Object} Merged styles object
 */
export const mergeBlockGlobalStyles = (
	baseStyles: Object,
	userStyles: Object
): Object => {
	// Early return if both are empty to avoid unnecessary object creation
	if (
		Object.keys(baseStyles || {}).length === 0 &&
		Object.keys(userStyles || {}).length === 0
	) {
		return {};
	}

	// Use deepmerge with Gutenberg-style configuration
	return deepmerge(baseStyles || {}, userStyles || {}, {
		// Only merge plain objects, not arrays
		isMergeableObject: isPlainObject,
		// Custom merge for backgroundImage (replace, don't merge)
		customMerge: (key) => {
			if (key === 'backgroundImage') {
				return (baseConfig, userConfig) => userConfig;
			}
			return undefined;
		},
	});
};

/**
 * Generates a stable ID for blockera props based on block name.
 * Uses a deterministic approach instead of Math.random() to prevent re-renders.
 *
 * @param {string} blockName The block name
 * @return {string} Stable ID for the block
 */
export const generateStableBlockeraPropsId = (blockName: string): string => {
	// Create a stable hash-like string from block name
	const normalized = blockName.replace(/[^a-zA-Z0-9]/g, '-');
	return `blockera-${normalized}-props`;
};

/**
 * Check if a style variation is disabled (early return like style-item.js).
 *
 * @param {Object} blockeraMetaData The blockera global styles metadata.
 * @param {string} blockName The block name.
 * @param {string} variationName The variation name.
 * @return {boolean} True if the variation is disabled, false otherwise.
 */
export const isVariationDisabled = (
	blockeraMetaData: Object,
	blockName: string,
	variationName: string
): boolean => {
	const variations = blockeraMetaData?.blocks?.[blockName]?.variations || {};

	// Check by direct key match
	let variationMetadata = variations[variationName];

	// Check by refId (for renamed styles)
	if (!variationMetadata) {
		variationMetadata = Object.values(variations).find(
			(v) => v?.refId === variationName
		);
	}

	return 'undefined' !== typeof variationMetadata
		? variationMetadata.hasOwnProperty('status') &&
				!variationMetadata?.status
		: false;
};

/**
 * Checks if the styles settings are default.
 * Validates:
 * - Only one state is defined
 * - The state is normal
 * - The state has no breakpoints
 *
 * @param {Object} sanitizedBlockGlobalStyles The sanitized block global styles
 * @return {boolean} True if the styles settings are default, false otherwise
 */
export const isDefaultStylesSettings = (
	sanitizedBlockGlobalStyles: Object
): boolean => {
	const staticKeys = ['blockeraPropsId', 'blockeraCompatId'];
	const omittedStaticKeys = omit(sanitizedBlockGlobalStyles, staticKeys);
	const states = omittedStaticKeys.blockeraBlockStates;

	if (
		!Object.keys(omit(omittedStaticKeys, 'blockeraBlockStates')).length &&
		1 === Object.keys(states).length &&
		states?.normal &&
		!Object.keys(states?.normal?.breakpoints || {}).length
	) {
		return true;
	}

	return false;
};
