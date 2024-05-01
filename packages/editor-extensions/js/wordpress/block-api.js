// @flow
/**
 * Blockera dependencies
 */
import { useBlocksStore } from '../hooks';
import { isFunction } from '@blockera/utils';

/**
 * Check is support border feature with WordPress?
 *
 * @param {string} blockName the selected block name
 * @param {boolean} radiusFlag the boolean flag for check border radius is supported by WordPress or not!
 * @return {boolean} true on success, false on otherwise.
 */
export const isSupportBorder = (
	blockName: string,
	radiusFlag: boolean = false
): boolean => {
	const { hasBlockSupport, getBlockSupport } = useBlocksStore();

	if (!isFunction(hasBlockSupport)) {
		return false;
	}

	if (!radiusFlag) {
		return hasBlockSupport(blockName, '__experimentalBorder');
	}

	const support = getBlockSupport(blockName, '__experimentalBorder');

	return support?.radius || false;
};
