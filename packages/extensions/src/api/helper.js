/**
 * WordPress dependencies
 */
import { Platform } from '@wordpress/element';
import { getBlockSupport } from '@wordpress/blocks';

/**
 * Determine whether there is block support for boxShadow properties.
 *
 * @param {string} blockName Block name.
 * @param {string} feature   BoxShadow feature to check support for.
 *
 * @return {boolean} Whether there is support.
 */
export function hasBoxShadowSupport(blockName, feature = 'any') {
	if (Platform.OS !== 'web') {
		return false;
	}

	const support = getBlockSupport(
		blockName,
		'__experimentalPublisherDefaultControls'
	);

	if (support === true) {
		return true;
	}

	if (feature === 'any') {
		return !!(
			support?.color ||
			support?.radius ||
			support?.width ||
			support?.style
		);
	}

	return !!support?.[feature];
}
