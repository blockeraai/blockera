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
	const { getBlockExtensions, getBlockExtension, hasBlockExtensionSupport } =
		select(STORE_NAME);
	const currentExtension = getBlockExtension(blockType?.name);

	if (!currentExtension) {
		return extraProps;
	}

	const { publisherSaveProps } = currentExtension;
	const extensions = getBlockExtensions();

	if (publisherSaveProps) {
		extraProps = getExtendedProps(extraProps, publisherSaveProps);
	}

	//Register controls attributes and supports into WordPress Block Type!
	extensions.forEach((extension) => {
		if (!hasBlockExtensionSupport(currentExtension, extension.name)) {
			return;
		}

		const { publisherSaveProps: saveProps } = extension;

		extraProps = getExtendedProps(extraProps, saveProps);
	});

	if (attributes?.publisherPropsId) {
		// extraProps = useExtendedProps(extraProps, {
		// 	className: `publisher-attrs-id-${attributes?.publisherPropsId}`,
		// });
	}

	return extraProps;
}

export default withSaveProps;
