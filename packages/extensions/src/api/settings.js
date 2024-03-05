// @flow
/**
 * Publisher dependencies
 */
import { isEmptyObject } from '@publisher/utils';

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
