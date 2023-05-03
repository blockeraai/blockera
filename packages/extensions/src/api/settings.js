/**
 * Merge registered block settings, extending attributes to include
 * `publisherAttributes` with all properties if needed
 *
 * @param {Object} blockSettings The WordPress default block settings
 * @param {Object} properties The additional publisher attributes properties
 * @returns {Object} The block attributes includes publisher extensions attributes.
 */
function addAttributes(blockSettings: Object, properties: Object): Object {
	const attributes = blockSettings.attributes;

	return {
		...blockSettings,
		attributes: {
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
		},
	};
}

/**
 * Merge registered block settings, extending attributes to include
 * `publisherAttributes` with all properties if needed
 *
 * @param {Object} blockSettings The WordPress default block settings
 * @param {Object} properties The additional publisher supports properties
 * @returns {Object} The block support includes publisher extensions supports.
 */
function addSupports(blockSettings: Object, properties: Object): Object {
	const supports = blockSettings.supports;

	return {
		...blockSettings,
		supports: {
			...supports,
			__experimentalPublisherDefaultControls: {
				...supports.__experimentalPublisherDefaultControls,
				...properties,
			},
		},
	};
}

export default {
	addSupports,
	addAttributes,
};
