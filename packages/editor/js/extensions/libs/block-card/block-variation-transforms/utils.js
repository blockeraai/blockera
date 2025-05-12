//@flow

/**
 * WordPress dependencies
 */
import { getBlockType } from '@wordpress/blocks';

/**
 * Determines if any of the block type's attributes have
 * the content role attribute.
 *
 * @param {Object} state         Data state.
 * @param {string} blockTypeName Block type name.
 * @return {boolean} Whether block type has content role attribute.
 */
export const hasContentRoleAttribute = (
	state: Object,
	blockTypeName: string
): boolean => {
	const blockType = getBlockType(state, blockTypeName);
	if (!blockType) {
		return false;
	}

	return Object.values(blockType.attributes).some(
		({ role, __experimentalRole }) => {
			if (role === 'content') {
				return true;
			}

			if (__experimentalRole === 'content') {
				return true;
			}
			return false;
		}
	);
};
