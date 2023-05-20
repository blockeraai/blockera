/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { STORE_NAME } from '../store/constants';

const withCustomizeSaveElement = (element, blockType, attributes) => {
	const { getBlockExtensions, getBlockExtension, hasBlockExtensionSupport } =
		select(STORE_NAME);
	const currentExtension = getBlockExtension(blockType?.name);

	if (!currentExtension) {
		return element;
	}

	let SaveElement = {};
	const { Save } = currentExtension;
	const extensions = getBlockExtensions();

	if ('function' === typeof Save) {
		SaveElement = {
			...SaveElement,
			...Save(element, blockType, attributes),
		};
	}

	extensions.forEach((extension) => {
		if (hasBlockExtensionSupport(currentExtension, extension.name)) {
			const { Save: controlSave } = extension;

			if ('function' !== typeof controlSave) {
				return;
			}

			SaveElement = {
				...SaveElement,
				...controlSave(element, blockType, attributes),
			};
		}
	});

	return SaveElement;
};

export default withCustomizeSaveElement;
