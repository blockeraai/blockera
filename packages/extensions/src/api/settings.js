import { hasAllProperties } from './utils';

/**
 * Merge registered block attributes, extending attributes to include
 * `publisherAttributes` with all properties if needed
 *
 * @param {Object} attributes The WordPress default block attributes
 * @param {Object} properties The additional publisher attributes properties
 * @returns {Object} The block attributes includes publisher extensions attributes.
 */
function addAttributes(attributes: Object, properties: Object): Object {
	if (!Object.keys(properties).length) {
		return attributes;
	}

	return {
		...attributes,
		publisherAttributes: {
			...attributes.publisherAttributes,
			items: {
				...attributes.publisherAttributes.items,
				properties: {
					...attributes.publisherAttributes.items.properties,
					...properties,
				},
			},
		},
	};
}

/**
 * Merge registered block supports, extending attributes to include
 * `__experimentalPublisherDefaultControls` with all properties if needed
 *
 * @param {Object} supports The WordPress default block supports
 * @param {Object} properties The additional publisher supports properties
 * @returns {Object} The block support includes publisher extensions supports.
 */
function addSupports(supports: Object, properties: Object): Object {
	if (!Object.keys(properties).length) {
		return supports;
	}

	return {
		...supports,
		__experimentalPublisherDefaultControls: {
			...supports.__experimentalPublisherDefaultControls,
			...properties,
		},
	};
}

/**
 * Merge registered block settings, with properties( `attributes`, `supports` ) passed!
 *
 * @param {Object} defaultSettings The WordPress default block settings
 * @param {Object} properties The additional publisher properties( `attributes`, `supports` )
 * @returns {Object} The block settings includes publisher extensions settings.
 */
function merge(defaultSettings: Object, properties: Object): Object {
	if (!hasAllProperties(properties, ['attributes', 'supports'])) {
		return defaultSettings;
	}

	return {
		...defaultSettings,
		supports: {
			...defaultSettings.supports,
			...addSupports(defaultSettings.supports, properties.supports),
		},
		attributes: {
			...defaultSettings.attributes,
			...addAttributes(defaultSettings.attributes, properties.attributes),
		},
		publisherCssGenerators: {
			...(defaultSettings?.publisherCssGenerators
				? defaultSettings.publisherCssGenerators
				: {}),
			...properties.publisherCssGenerators,
		},
	};
}

export default {
	merge,
	addSupports,
	addAttributes,
};
