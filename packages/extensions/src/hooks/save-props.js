/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getExtendedProps } from './hooks';
import { STORE_NAME } from '../store/constants';

/**
 * Override props assigned to save component to inject attributes
 *
 *
 * @param {Object} extraProps Additional props applied to save element.
 * @param {Object} blockType  Block type.
 * @param {Object} attributes Current block attributes.
 * @return {Object} Filtered props applied to save element.
 */
function withSaveProps(extraProps, blockType, attributes) {
	const { getBlockExtensionBy } = select(STORE_NAME);
	const currentExtension = getBlockExtensionBy(
		'targetBlock',
		blockType?.name
	);

	if (!currentExtension) {
		return extraProps;
	}

	const { publisherSaveProps } = select('core/blocks').getBlockType(
		blockType?.name
	);

	if (attributes?.publisherPropsId) {
		// extraProps = useExtendedProps(extraProps, {
		// 	className: `publisher-attrs-id-${attributes?.publisherPropsId}`,
		// });
	}

	return getExtendedProps(extraProps, publisherSaveProps);
}

export default withSaveProps;
