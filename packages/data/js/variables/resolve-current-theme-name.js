// @flow
/**
 * External dependencies
 */
import { select } from '@wordpress/data';

/**
 * Active theme display name for variable references (matches Site Editor / global styles).
 */
export function resolveCurrentThemeDisplayName(): string {
	try {
		const dataSelect = select('blockera/data');
		if (dataSelect && typeof dataSelect.getCurrentTheme === 'function') {
			const theme = dataSelect.getCurrentTheme();
			const n = theme?.name;
			if (typeof n === 'string') {
				return n;
			}
			if (n && typeof n === 'object' && typeof n.rendered === 'string') {
				return n.rendered;
			}
		}
	} catch (e) {
		// Store may be unavailable during early bootstrap.
	}

	return '';
}
