/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import controlsExtensions from './controls';
import { STORE_NAME } from '../store/constants';
import { blockSettings, hasAllProperties } from '../api';

/**
 * Publisher default CssGenerators object.
 *
 * @since 1.0.0
 */
const defaultCssGenerators = {};

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

	const registeredBlockExtension = select(STORE_NAME).getBlockExtension(name);

	if (
		!registeredBlockExtension ||
		!hasAllProperties(registeredBlockExtension, [
			'publisherAttributes',
			'publisherSupports',
		])
	) {
		return settings;
	}

	const { publisherAttributes, publisherSupports, publisherCssGenerators } =
		registeredBlockExtension;
	const { merge } = blockSettings;

	if ('function' !== typeof merge) {
		return settings;
	}

	//Register controls attributes and supports into WordPress Block Type!
	Object.keys(controlsExtensions).forEach((support) => {
		if (publisherSupports[support]) {
			const {
				publisherAttributes: attributes,
				publisherSupports: supports,
				publisherCssGenerators: cssGenerators,
			} = controlsExtensions[support];

			settings = merge(settings, {
				supports,
				attributes,
				publisherCssGenerators: {
					...defaultCssGenerators,
					...(cssGenerators ? cssGenerators : {}),
				},
			});
		}
	});

	return merge(settings, {
		supports: publisherSupports,
		attributes: publisherAttributes,
		publisherCssGenerators: {
			...defaultCssGenerators,
			...(publisherCssGenerators ? publisherCssGenerators : {}),
		},
	});
}
