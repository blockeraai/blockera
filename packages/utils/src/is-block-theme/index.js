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
	const theme = getCurrentTheme();

	if (isUndefined(theme?.is_block_theme)) {
		return false;
	}

	return theme?.is_block_theme;
}
