/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import { getBlockEditorProp } from './utils';

/**
 * Filters registered block settings, extending attributes with settings and block name.
 *
 * @param {Object} settings Original block settings.
 * @param {string} name block id or name.
 * @return {Object} Filtered block settings.
 */
export default function withBlockAttributes(settings, name) {
	/**
	 * Allowed Block Types in Publisher Extensions Setup
	 */
	const allowedBlockTypes = applyFilters(
		'publisher.core.extensions.allowedBlockTypes',
		[]
	);

	if (!allowedBlockTypes.includes(name)) {
		return settings;
	}

	const callbacks = getBlockEditorProp(name);
	const { blockAttributes } = callbacks;

	if ('function' !== typeof blockAttributes) {
		return settings;
	}

	return blockAttributes(settings, name);
}
