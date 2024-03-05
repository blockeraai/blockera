// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

export function isBlockTheme(): boolean {
	const { getCurrentTheme } = select('publisher-core/data');
	const { isBlockTheme = false } = getCurrentTheme() || {};

	return isBlockTheme;
}
