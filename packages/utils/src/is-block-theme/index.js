// @flow

/**
 * External dependencies
 */
import { select } from '@wordpress/data';

export function isBlockTheme(): boolean {
	const { getCurrentTheme } = select('publisher-core/data');

	const { block_theme: isBlockTheme = false } = getCurrentTheme() || {};

	return isBlockTheme;
}
