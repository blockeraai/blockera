/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import controlsExtensions from './controls';
import { STORE_NAME } from '../store/constants';
import { useExtendedProps } from './hooks';

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
	const registeredBlockExtension = select(STORE_NAME).getBlockExtension(
		blockType?.name
	);

	if (!registeredBlockExtension) {
		return extraProps;
	}

	const { publisherSaveProps, publisherSupports } = registeredBlockExtension;

	if (publisherSaveProps) {
		extraProps = useExtendedProps(extraProps, publisherSaveProps);
	}

	//Register controls attributes and supports into WordPress Block Type!
	Object.keys(controlsExtensions).forEach((support) => {
		if (publisherSupports[support]) {
			const { publisherSaveProps: saveProps } =
				controlsExtensions[support];

			extraProps = useExtendedProps(extraProps, saveProps);
		}
	});

	if (attributes?.publisherAttributes?.id) {
		extraProps = useExtendedProps(extraProps, {
			className: `publisher-attrs-id-${attributes.publisherAttributes.id}`,
		});
	}

	return extraProps;
}

export default withSaveProps;
