/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks';

/**
 * Internal dependencies
 */
import Opacity from './opacity';
import BoxShadow from './box-shadow';
import Transition from './transition';

export function getFields() {
	return applyFilters('publisher.core.fields.extensions.list', [
		BoxShadow,
		Opacity,
		Transition,
	]);
}
