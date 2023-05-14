/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import controlsExtensions from './controls';
import { STORE_NAME } from '../store/constants';

const withCustomizeSaveElement = (element, blockType, attributes) => {
	const registeredBlockExtension = select(STORE_NAME).getBlockExtension(
		blockType?.name
	);

	if (!registeredBlockExtension) {
		return element;
	}

	let SaveElement = {};
	const { Save, publisherSupports } = registeredBlockExtension;

	if ('function' === typeof Save) {
		SaveElement = {
			...Save(element, blockType, attributes),
		};
	}

	Object.keys(controlsExtensions).forEach((support) => {
		if (publisherSupports[support]) {
			const { Save: controlSave } = controlsExtensions[support];

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
