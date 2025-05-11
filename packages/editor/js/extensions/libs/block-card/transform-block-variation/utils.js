//@flow

/**
 * WordPress dependencies
 */
import { deprecated, getBlockType } from '@wordpress/blocks';

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
				deprecated('__experimentalRole attribute', {
					since: '6.7',
					version: '6.8',
					alternative: 'role attribute',
					hint: `Check the block.json of the ${blockTypeName} block.`,
				});
				return true;
			}
			return false;
		}
	);
};
