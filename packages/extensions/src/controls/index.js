/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import BoxShadow from './box-shadow';
import { registerBlockExtension } from '../api';

export function getControls() {
	return {
		...applyFilters('publisher.core.extensions.controls.list', {
			'publisher-core/box-shadow': BoxShadow,
		}),
	};
}

export function InitControls() {
	for (const extensionName in getControls()) {
		if (!Object.hasOwnProperty.call(getControls(), extensionName)) {
			continue;
		}

		const extension = getControls()[extensionName];

		if ('function' !== typeof extension) {
			registerBlockExtension(extensionName, extension);

			continue;
		}

		registerBlockExtension(extensionName, extension());
	}
}
