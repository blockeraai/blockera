// @flow

/**
 * External dependencies
 */
import deepmerge from 'deepmerge';
import { isPlainObject } from 'is-plain-object';

/**
 * Blockera dependencies
 */
import { omit } from '@blockera/utils';

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
