/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import Effects from './effects';
import BorderAndShadow from './border-and-shadow';

export function getExtensions() {
	return applyFilters('publisher.core.extensions.extensions.list', [
		Effects,
		BorderAndShadow,
	]);
}
