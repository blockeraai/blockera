/**
 * Is empty passed object?
 *
 * @param {Object} object any object
 * @return {boolean} true on success, false when otherwise!
 */
function isEmptyObject(object: Object): boolean {
	return !object || !Object.keys(object).length;
}

/**
 * Merge registered block supports, extending attributes to include
 * `__experimentalPublisherDefaultControls` with all properties if needed
 *
 * @param {Object} supports The WordPress default block supports
 * @param {Object} properties The additional publisher supports properties
 * @return {Object} The block support includes publisher extensions supports.
 */
function addSupports(supports: Object, properties: Object): Object {
	if (isEmptyObject(supports) || isEmptyObject(properties)) {
		return supports;
	}

	return {
		...supports,
		__experimentalPublisherDefaultControls: {
			...(supports.__experimentalPublisherDefaultControls || {}),
			...properties,
		},
	};
}

export default {
	addSupports,
};
