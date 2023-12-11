// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Publisher dependencies
 */
import { isUndefined } from '@publisher/utils';

export function getCurrentTheme(): Object {
	const currentTheme = select('core')?.getCurrentTheme();

	if (isUndefined(currentTheme)) {
		return {};
	}

	return currentTheme;
}
