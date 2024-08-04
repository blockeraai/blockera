// @flow
/**
 * Blockera dependencies
 */
import { isEmptyObject } from '@blockera/utils';

/**
 * Merge registered block supports, extending attributes to include
 * `__experimentalDefaultControls` with all properties if needed
 *
 * @param {Object} supports The WordPress default block supports
 * @param {Object} properties The additional blockera supports properties
 * @return {Object} The block support includes blockera extensions supports.
 */
function addSupports(supports: Object, properties: Object): Object {
	if (isEmptyObject(supports) || isEmptyObject(properties)) {
		return supports;
	}

	return {
		...supports,
		__experimentalDefaultControls: {
			...(supports.__experimentalDefaultControls || {}),
			...properties,
		},
	};
}

export default {
	addSupports,
};
