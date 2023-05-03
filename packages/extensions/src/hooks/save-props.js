/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
// import { getBlockEditorProp } from './utils';

/**
 * Override props assigned to save component to inject attributes
 *
 * @param {Object} extraProps Additional props applied to save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Current block attributes.
 * @return {Object} Filtered props applied to save element.
 */
function withSaveProps(extraProps, blockType, attributes) {
	return extraProps;
	/**
	 * Allowed Block Types in Publisher Extensions Setup
	 */
	const allowedBlockTypes = applyFilters(
		'publisher.core.extensions.allowedBlockTypes',
		[]
	);

	if (!allowedBlockTypes.includes(blockType?.name)) {
		return extraProps;
	}

	const callbacks = getBlockEditorProp(blockType?.name);
	const { extraProps: _extraProps } = callbacks;

	if ('function' !== typeof _extraProps) {
		return extraProps;
	}

	return _extraProps({ extraProps, blockType, attributes });
}

export default withSaveProps;
