// @flow
/**
 * Publisher dependencies
 */
import { getCurrentTheme } from '@publisher/core-data';

/**
 * Internal dependencies
 */
import { isUndefined } from '../index';

export function isBlockTheme(): boolean {
	const { is_block_Theme: isBlockTheme } = getCurrentTheme();

	if (!isUndefined(isBlockTheme)) {
		return false;
	}

	return isBlockTheme;
}
