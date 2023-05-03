/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { blockSettings, hasAllProperties } from '../api';
import { STORE_NAME } from '../store/constants';

/**
 * Filters registered block settings, extending block settings with settings and block name.
 *
 * @param {Object} settings Original block settings.
 * @param {string} name block id or name.
 * @return {Object} Filtered block settings.
 */
export default function withBlockSettings(
	settings: Object,
	name: Object
): Object {
	const registeredBlockExtension = select(STORE_NAME).getBlockExtension(name);

	if (
		!registeredBlockExtension ||
		!hasAllProperties(registeredBlockExtension, ['attributes', 'supports'])
	) {
		return settings;
	}

	const { attributes, supports } = registeredBlockExtension;

	settings = {
		...settings,
		attributes: {
			...settings.attributes,
			publisherAttributes: {
				type: 'object',
				default: {},
				items: {
					type: 'object',
					properties: {},
				},
			},
		},
		supports: {
			...settings.supports,
			__experimentalPublisherDefaultControls: {},
		},
	};

	return {
		...blockSettings.addAttributes(settings, attributes),
		...blockSettings.addSupports(settings, supports),
	};
}
